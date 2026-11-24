import {
  getFirestore,
  doc,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  getDocFromServer,
  setDoc,
  updateDoc,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { app, auth } from './googleAuth';
import { VideoReference } from '../data/shootData';
import { ShotStatus } from '../components/VideoCard';

// CRITICAL: Initialize Firestore with the provisioned firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const MAIN_DECK_ID = 'main';
export const OWNER_ADMIN_EMAIL = 'craftsquarrebrands@gmail.com';

const VALID_SECTIONS = new Set<VideoReference['section']>([
  'pre-launch',
  'launch',
  'scripted-ads',
  'ugc-bags',
  'ugc-shoes',
  'ugc-slippers',
  'ugc-drinks',
  'ugc-food',
  'ugc-asmr',
  'ugc-fashion',
]);

const VALID_PLATFORMS = new Set<VideoReference['platform']>([
  'instagram',
  'tiktok',
  'twitter',
  'youtube',
  'facebook',
  'pinterest',
  'drive',
  'vimeo',
  'other',
]);

const VALID_STATUSES = new Set<ShotStatus>(['todo', 'shooting', 'wrapped']);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export function isDeckAdmin(user: User | null): boolean {
  if (!user || !user.email || !user.emailVerified) return false;
  return user.email.toLowerCase() === OWNER_ADMIN_EMAIL.toLowerCase();
}

export function sanitizeDocId(rawId: string, fallbackPrefix = 'item'): string {
  const cleaned = (rawId || '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 128);
  return cleaned || `${fallbackPrefix}-${Date.now()}`;
}

function clampString(val: string | undefined | null, maxLen: number, fallback = ''): string {
  const trimmed = (val ?? '').trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLen);
}

export interface CloudDeckMeta {
  title: string;
  documentUrl: string;
  videoCount: number;
  tabNames: string[];
  updatedAt: Date | null;
}

export interface CloudVideosSnapshot {
  videos: VideoReference[];
  statuses: Record<string, ShotStatus>;
  notes: Record<string, string>;
}

/**
 * Real-time listener for shared deck metadata (/decks/main).
 * Works on any device without signing in.
 */
export function subscribeToDeckMeta(
  onData: (meta: CloudDeckMeta | null) => void
): Unsubscribe {
  const path = `decks/${MAIN_DECK_ID}`;
  return onSnapshot(
    doc(db, 'decks', MAIN_DECK_ID),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      const data = snap.data();
      const updatedTs = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null;
      onData({
        title: typeof data.title === 'string' ? data.title : 'Craftsquarre Shoot Deck',
        documentUrl: typeof data.documentUrl === 'string' ? data.documentUrl : '',
        videoCount: typeof data.videoCount === 'number' ? data.videoCount : 0,
        tabNames: Array.isArray(data.tabNames) ? data.tabNames : [],
        updatedAt: updatedTs,
      });
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

/**
 * Real-time listener for all synced reference videos in /decks/main/videos.
 * Query explicitly filters by isPublic == true and deckId == 'main' to satisfy security rules.
 * Works on any device without signing in.
 */
export function subscribeToDeckVideos(
  onData: (result: CloudVideosSnapshot) => void
): Unsubscribe {
  const path = `decks/${MAIN_DECK_ID}/videos`;
  const q = query(
    collection(db, 'decks', MAIN_DECK_ID, 'videos'),
    where('isPublic', '==', true),
    where('deckId', '==', MAIN_DECK_ID)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const rows: Array<{ orderIndex: number; video: VideoReference; status: ShotStatus; note: string }> = [];

      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        const section = VALID_SECTIONS.has(d.section) ? (d.section as VideoReference['section']) : 'ugc-bags';
        const platform = VALID_PLATFORMS.has(d.platform) ? (d.platform as VideoReference['platform']) : 'other';
        const status = VALID_STATUSES.has(d.status) ? (d.status as ShotStatus) : 'todo';

        const video: VideoReference = {
          id: docSnap.id,
          title: typeof d.title === 'string' ? d.title : 'Reference Video',
          section,
          sectionName: typeof d.sectionName === 'string' ? d.sectionName : 'Bags & Ankara',
          categoryTag: typeof d.categoryTag === 'string' ? d.categoryTag : 'Reference',
          url: typeof d.url === 'string' ? d.url : '',
          platform,
          embedId: typeof d.embedId === 'string' ? d.embedId : '',
          durationEst: typeof d.durationEst === 'string' ? d.durationEst : '15-30s',
          hook: typeof d.hook === 'string' ? d.hook : '',
          sourceTab: typeof d.sourceTab === 'string' && d.sourceTab.length > 0 ? d.sourceTab : undefined,
          isNewlySynced: Boolean(d.isNewlySynced),
        };

        rows.push({
          orderIndex: typeof d.orderIndex === 'number' ? d.orderIndex : 9999,
          video,
          status,
          note: typeof d.note === 'string' ? d.note : '',
        });
      });

      rows.sort((a, b) => a.orderIndex - b.orderIndex);

      const videos: VideoReference[] = [];
      const statuses: Record<string, ShotStatus> = {};
      const notes: Record<string, string> = {};

      for (const row of rows) {
        videos.push(row.video);
        if (row.status !== 'todo') {
          statuses[row.video.id] = row.status;
        }
        if (row.note) {
          notes[row.video.id] = row.note;
        }
      }

      onData({ videos, statuses, notes });
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Real-time listener for shared checklist items in /decks/main/checklist.
 */
export function subscribeToChecklist(
  onData: (checkedMap: Record<string, boolean>) => void
): Unsubscribe {
  const path = `decks/${MAIN_DECK_ID}/checklist`;
  const q = query(
    collection(db, 'decks', MAIN_DECK_ID, 'checklist'),
    where('isPublic', '==', true),
    where('deckId', '==', MAIN_DECK_ID)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const checkedMap: Record<string, boolean> = {};
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        if (d.checked === true) {
          checkedMap[docSnap.id] = true;
        }
      });
      onData(checkedMap);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Publishes the complete synced deck (metadata + all videos + statuses + notes) to Firestore.
 * Only executes when the signed-in user is the verified owner/admin.
 */
export async function publishDeckToCloud(params: {
  videos: VideoReference[];
  statuses: Record<string, ShotStatus>;
  notes: Record<string, string>;
  title: string;
  documentUrl: string;
}): Promise<number> {
  const user = auth.currentUser;
  if (!isDeckAdmin(user) || !user) {
    return 0;
  }

  const deckRef = doc(db, 'decks', MAIN_DECK_ID);
  const deckPath = `decks/${MAIN_DECK_ID}`;
  const videosPath = `decks/${MAIN_DECK_ID}/videos`;

  // 1. Check whether parent deck exists and read existing video doc IDs
  let deckExists = false;
  try {
    const deckSnap = await getDoc(deckRef);
    deckExists = deckSnap.exists();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, deckPath);
  }

  const existingVideoIds = new Set<string>();
  if (deckExists) {
    try {
      const existingSnap = await getDocs(
        query(
          collection(db, 'decks', MAIN_DECK_ID, 'videos'),
          where('isPublic', '==', true),
          where('deckId', '==', MAIN_DECK_ID)
        )
      );
      existingSnap.forEach((d) => existingVideoIds.add(d.id));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, videosPath);
    }
  }

  // Extract unique tab names bounded to blueprint max (50 items, <= 150 chars each)
  const tabNameSet = new Set<string>();
  for (const v of params.videos) {
    if (v.sourceTab && v.sourceTab.trim()) {
      tabNameSet.add(clampString(v.sourceTab, 150));
      if (tabNameSet.size >= 50) break;
    }
  }
  const tabNames = Array.from(tabNameSet);

  // Deduplicate sanitized doc IDs so batch never collides
  const usedIds = new Set<string>();
  const preparedVideos = params.videos.slice(0, 5000).map((video, index) => {
    let safeId = sanitizeDocId(video.id, `vid-${index}`);
    if (usedIds.has(safeId)) {
      safeId = sanitizeDocId(`${safeId}-${index}`, `vid-${index}`);
    }
    usedIds.add(safeId);

    const status = VALID_STATUSES.has(params.statuses[video.id])
      ? params.statuses[video.id]
      : VALID_STATUSES.has(params.statuses[safeId])
      ? params.statuses[safeId]
      : 'todo';
    const note = clampString(params.notes[video.id] ?? params.notes[safeId] ?? '', 2000);
    const section = VALID_SECTIONS.has(video.section) ? video.section : 'ugc-bags';
    const platform = VALID_PLATFORMS.has(video.platform) ? video.platform : 'other';

    return {
      safeId,
      isUpdate: existingVideoIds.has(safeId),
      orderIndex: index,
      title: clampString(video.title, 300, 'Reference Video'),
      section,
      sectionName: clampString(video.sectionName, 100, 'Bags & Ankara'),
      categoryTag: clampString(video.categoryTag, 120, 'Reference'),
      url: clampString(video.url, 1000, 'https://instagram.com'),
      platform,
      embedId: clampString(video.embedId, 300, ''),
      durationEst: clampString(video.durationEst, 40, '15-30s'),
      hook: clampString(video.hook, 500, ''),
      sourceTab: clampString(video.sourceTab, 150, ''),
      isNewlySynced: Boolean(video.isNewlySynced),
      status,
      note,
    };
  });

  // Stale IDs to remove (e.g. after Fresh Rebuild)
  const idsToDelete: string[] = [];
  existingVideoIds.forEach((existingId) => {
    if (!usedIds.has(existingId)) {
      idsToDelete.push(existingId);
    }
  });

  // Chunk all operations into batches of <= 400 writes (Firestore limit is 500)
  const MAX_BATCH_OPS = 400;
  let batch = writeBatch(db);
  let opCount = 0;

  // Put parent deck write first in batch 1 so existsAfter() passes atomically for new video creates
  if (!deckExists) {
    batch.set(deckRef, {
      title: clampString(params.title, 200, 'Craftsquarre Shoot Deck'),
      documentUrl: clampString(params.documentUrl, 1000, ''),
      videoCount: preparedVideos.length,
      tabNames,
      isPublic: true,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    batch.update(deckRef, {
      title: clampString(params.title, 200, 'Craftsquarre Shoot Deck'),
      documentUrl: clampString(params.documentUrl, 1000, ''),
      videoCount: preparedVideos.length,
      tabNames,
      isPublic: true,
      updatedAt: serverTimestamp(),
    });
  }
  opCount += 1;

  const commitBatchIfNeeded = async (force = false) => {
    if (opCount >= MAX_BATCH_OPS || (force && opCount > 0)) {
      try {
        await batch.commit();
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, videosPath);
      }
      batch = writeBatch(db);
      opCount = 0;
    }
  };

  for (const item of preparedVideos) {
    const vidRef = doc(db, 'decks', MAIN_DECK_ID, 'videos', item.safeId);
    if (item.isUpdate) {
      batch.update(vidRef, {
        orderIndex: item.orderIndex,
        title: item.title,
        section: item.section,
        sectionName: item.sectionName,
        categoryTag: item.categoryTag,
        url: item.url,
        platform: item.platform,
        embedId: item.embedId,
        durationEst: item.durationEst,
        hook: item.hook,
        sourceTab: item.sourceTab,
        isNewlySynced: item.isNewlySynced,
        status: item.status,
        note: item.note,
        isPublic: true,
        updatedAt: serverTimestamp(),
      });
    } else {
      batch.set(vidRef, {
        deckId: MAIN_DECK_ID,
        ownerId: user.uid,
        orderIndex: item.orderIndex,
        title: item.title,
        section: item.section,
        sectionName: item.sectionName,
        categoryTag: item.categoryTag,
        url: item.url,
        platform: item.platform,
        embedId: item.embedId,
        durationEst: item.durationEst,
        hook: item.hook,
        sourceTab: item.sourceTab,
        isNewlySynced: item.isNewlySynced,
        status: item.status,
        note: item.note,
        isPublic: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    opCount += 1;
    await commitBatchIfNeeded();
  }

  for (const staleId of idsToDelete) {
    const staleRef = doc(db, 'decks', MAIN_DECK_ID, 'videos', staleId);
    batch.delete(staleRef);
    opCount += 1;
    await commitBatchIfNeeded();
  }

  await commitBatchIfNeeded(true);
  return preparedVideos.length;
}

/**
 * Updates a single video's shot status in Firestore (Owner/Admin only).
 */
export async function updateVideoStatusInCloud(
  videoId: string,
  status: ShotStatus
): Promise<boolean> {
  const user = auth.currentUser;
  if (!isDeckAdmin(user)) return false;

  const safeId = sanitizeDocId(videoId);
  const path = `decks/${MAIN_DECK_ID}/videos/${safeId}`;
  const vidRef = doc(db, 'decks', MAIN_DECK_ID, 'videos', safeId);

  try {
    const snap = await getDoc(vidRef);
    if (!snap.exists()) return false;
    await updateDoc(vidRef, {
      status: VALID_STATUSES.has(status) ? status : 'todo',
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Updates a single video's shoot note in Firestore (Owner/Admin only).
 */
export async function updateVideoNoteInCloud(
  videoId: string,
  note: string
): Promise<boolean> {
  const user = auth.currentUser;
  if (!isDeckAdmin(user)) return false;

  const safeId = sanitizeDocId(videoId);
  const path = `decks/${MAIN_DECK_ID}/videos/${safeId}`;
  const vidRef = doc(db, 'decks', MAIN_DECK_ID, 'videos', safeId);

  try {
    const snap = await getDoc(vidRef);
    if (!snap.exists()) return false;
    await updateDoc(vidRef, {
      note: clampString(note, 2000),
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Updates a checklist item's checked state in Firestore (Owner/Admin only).
 */
export async function toggleChecklistItemInCloud(
  itemKey: string,
  checked: boolean
): Promise<boolean> {
  const user = auth.currentUser;
  if (!isDeckAdmin(user) || !user) return false;

  const safeId = sanitizeDocId(itemKey, 'chk');
  const deckRef = doc(db, 'decks', MAIN_DECK_ID);
  const itemRef = doc(db, 'decks', MAIN_DECK_ID, 'checklist', safeId);
  const path = `decks/${MAIN_DECK_ID}/checklist/${safeId}`;

  try {
    const deckSnap = await getDoc(deckRef);
    if (!deckSnap.exists()) return false;

    const snap = await getDoc(itemRef);
    if (snap.exists()) {
      await updateDoc(itemRef, {
        checked: Boolean(checked),
        isPublic: true,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(itemRef, {
        deckId: MAIN_DECK_ID,
        ownerId: user.uid,
        checked: Boolean(checked),
        isPublic: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Resets all shared checklist items in Firestore (Owner/Admin only).
 */
export async function resetChecklistInCloud(): Promise<void> {
  const user = auth.currentUser;
  if (!isDeckAdmin(user)) return;

  const path = `decks/${MAIN_DECK_ID}/checklist`;
  try {
    const snap = await getDocs(
      query(
        collection(db, 'decks', MAIN_DECK_ID, 'checklist'),
        where('isPublic', '==', true),
        where('deckId', '==', MAIN_DECK_ID)
      )
    );
    if (snap.empty) return;

    const batch = writeBatch(db);
    snap.forEach((docSnap) => {
      batch.update(docSnap.ref, {
        checked: false,
        isPublic: true,
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
