import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Film,
  Sparkles,
  Check,
  FastForward,
  FolderOpen,
  ShoppingBag,
  Footprints,
  Coffee,
  Sparkle,
  Shirt,
  Flame,
  Play,
  LayoutGrid,
  List,
  X,
  FileText,
  RefreshCw,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { VIDEO_REFERENCES, VideoReference } from './data/shootData';
import { Header } from './components/Header';
import { VideoCard, ShotStatus } from './components/VideoCard';
import { DirectorDrawer } from './components/DirectorDrawer';
import { ChecklistView } from './components/ChecklistView';
import { GoogleDocSyncModal } from './components/GoogleDocSyncModal';
import { initAuth, getAccessToken, googleSignIn, clearAccessToken, auth } from './services/googleAuth';
import {
  fetchGoogleDoc,
  parseDocumentAndSyncVideos,
  extractResourceInfo,
  AuthRequiredError,
} from './services/googleDocsSync';
import {
  subscribeToDeckMeta,
  subscribeToDeckVideos,
  subscribeToChecklist,
  publishDeckToCloud,
  updateVideoStatusInCloud,
  updateVideoNoteInCloud,
  toggleChecklistItemInCloud,
  resetChecklistInCloud,
  isDeckAdmin,
} from './services/firestoreSync';

const CATEGORIES = [
  { id: 'all', name: 'All Videos', icon: Film },
  { id: 'ugc-bags', name: 'Bags & Ankara', icon: ShoppingBag },
  { id: 'ugc-shoes', name: 'Shoes', icon: Footprints },
  { id: 'ugc-slippers', name: 'Slippers', icon: Footprints },
  { id: 'ugc-drinks', name: 'Healthy Drinks', icon: Coffee },
  { id: 'ugc-food', name: 'Food (Parfait)', icon: Coffee },
  { id: 'ugc-asmr', name: 'ASMR Drinks', icon: Sparkle },
  { id: 'ugc-fashion', name: 'Fashion & Outfits', icon: Shirt },
  { id: 'scripted-ads', name: 'Scripted Launch Ads', icon: Flame },
  { id: 'launch', name: 'Launch Announcements', icon: Play },
  { id: 'pre-launch', name: 'Pre-Launch Teasers', icon: Film },
] as const;

export default function App() {
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedSourceTab, setSelectedSourceTab] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'todo' | 'wrapped'>('all');
  const [showOnlyNew, setShowOnlyNew] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'wide'>('grid');

  // Dynamic Videos List
  const [videosList, setVideosList] = useState<VideoReference[]>(() => {
    try {
      const saved = localStorage.getItem('craftsquarre_synced_videos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return VIDEO_REFERENCES;
    } catch {
      return VIDEO_REFERENCES;
    }
  });

  // Persistent States in LocalStorage
  const [statuses, setStatuses] = useState<Record<string, ShotStatus>>(() => {
    try {
      const saved = localStorage.getItem('craftsquarre_shot_statuses');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('craftsquarre_shot_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [checkedList, setCheckedList] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('craftsquarre_checklist_checked');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Google Doc / Sheet Sync State
  const [documentUrl, setDocumentUrl] = useState<string>(() => {
    return localStorage.getItem('craftsquarre_google_doc_url') || '';
  });
  const [docTitle, setDocTitle] = useState<string>(() => {
    return localStorage.getItem('craftsquarre_google_doc_title') || 'Working Shoot Document';
  });
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(() => {
    const saved = localStorage.getItem('craftsquarre_last_synced_at');
    return saved ? new Date(saved) : null;
  });
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('craftsquarre_autosync_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasValidToken, setHasValidToken] = useState<boolean>(false);
  const [hasCloudDeck, setHasCloudDeck] = useState<boolean>(false);
  const [isPublishingCloud, setIsPublishingCloud] = useState<boolean>(false);
  const [isDocSyncModalOpen, setIsDocSyncModalOpen] = useState<boolean>(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToastMessage, setSyncToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Modal / Drawer States
  const [activeDrawerVideo, setActiveDrawerVideo] = useState<VideoReference | null>(null);

  // Initialize Firebase Auth listener (tracks both persisted Firebase user and live in-memory OAuth token)
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
        setHasValidToken(true);
      },
      () => {
        setHasValidToken(false);
      },
      (user) => {
        setCurrentUser(user);
      }
    );
    return () => unsubscribe();
  }, []);

  // Real-time Firestore subscriptions (runs on EVERY device with ZERO sign-in required)
  useEffect(() => {
    const unsubMeta = subscribeToDeckMeta((meta) => {
      if (!meta) {
        setHasCloudDeck(false);
        return;
      }
      setHasCloudDeck(true);
      if (meta.title) setDocTitle(meta.title);
      if (meta.documentUrl) setDocumentUrl(meta.documentUrl);
      if (meta.updatedAt) setLastSyncedAt(meta.updatedAt);
    });

    const unsubVideos = subscribeToDeckVideos((snapshot) => {
      if (snapshot.videos.length > 0) {
        setVideosList(snapshot.videos);
        setStatuses(snapshot.statuses);
        setNotes(snapshot.notes);
      }
    });

    const unsubChecklist = subscribeToChecklist((cloudChecked) => {
      if (Object.keys(cloudChecked).length > 0) {
        setCheckedList(cloudChecked);
      }
    });

    return () => {
      unsubMeta();
      unsubVideos();
      unsubChecklist();
    };
  }, []);

  // Save state to LocalStorage
  useEffect(() => {
    localStorage.setItem('craftsquarre_synced_videos', JSON.stringify(videosList));
  }, [videosList]);

  useEffect(() => {
    localStorage.setItem('craftsquarre_shot_statuses', JSON.stringify(statuses));
  }, [statuses]);

  useEffect(() => {
    localStorage.setItem('craftsquarre_shot_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('craftsquarre_checklist_checked', JSON.stringify(checkedList));
  }, [checkedList]);

  useEffect(() => {
    localStorage.setItem('craftsquarre_google_doc_url', documentUrl);
  }, [documentUrl]);

  useEffect(() => {
    localStorage.setItem('craftsquarre_google_doc_title', docTitle);
  }, [docTitle]);

  useEffect(() => {
    if (lastSyncedAt) {
      localStorage.setItem('craftsquarre_last_synced_at', lastSyncedAt.toISOString());
    }
  }, [lastSyncedAt]);

  useEffect(() => {
    localStorage.setItem('craftsquarre_autosync_enabled', autoSyncEnabled.toString());
  }, [autoSyncEnabled]);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error', durationMs = 6000) => {
    setSyncToastMessage({ text, type });
    setTimeout(() => {
      setSyncToastMessage((prev) => (prev?.text === text ? null : prev));
    }, durationMs);
  }, []);

  // Direct 1-Click Sync (seamlessly signs in with Google if token is missing/expired)
  const handleInstantSync = useCallback(async () => {
    if (!documentUrl.trim()) {
      setIsDocSyncModalOpen(true);
      return;
    }

    setIsSyncing(true);
    try {
      let token = await getAccessToken();
      let docData;

      // For Google Sheets without an active OAuth token, try public multi-tab sync FIRST
      // so team members on other phones can sync shared ("Anyone with the link") sheets with zero sign-in!
      const resInfo = extractResourceInfo(documentUrl);
      if (!token && resInfo?.type === 'spreadsheet') {
        try {
          docData = await fetchGoogleDoc(documentUrl, null, { allowSingleTabFallback: false });
        } catch {
          // Sheet is private or requires OAuth — proceed to Google Sign-In below
        }
      }

      if (!docData) {
        if (!token) {
          try {
            const authResult = await googleSignIn();
            if (authResult) {
              token = authResult.accessToken;
              setCurrentUser(authResult.user);
              setHasValidToken(true);
            }
          } catch (signInErr) {
            console.warn('Google sign-in skipped, trying fallback:', signInErr);
          }
        }

        try {
          docData = await fetchGoogleDoc(documentUrl, token);
        } catch (err: any) {
          if (err instanceof AuthRequiredError || err?.needsAuth) {
            clearAccessToken();
            setHasValidToken(false);
            // Force Google consent screen so both Docs & Sheets scopes are granted
            const refreshed = await googleSignIn(true);
            if (!refreshed) throw err;
            setCurrentUser(refreshed.user);
            setHasValidToken(true);
            docData = await fetchGoogleDoc(documentUrl, refreshed.accessToken);
          } else {
            throw err;
          }
        }
      }

      const { syncedVideos, newCount, totalDetected, duplicateInDocCount, tabSummaries } =
        parseDocumentAndSyncVideos(docData.text, videosList);

      // Always persist syncedVideos so backfilled sourceTab tags appear immediately
      setVideosList(syncedVideos);
      setLastSyncedAt(new Date());
      const resolvedTitle = docData.title || docTitle;
      if (docData.title) setDocTitle(docData.title);

      if (docData.usedPublicFallback) {
        showToast(
          `Only Tab 1 was read in public mode (${totalDetected} links). Sign in with Google inside Connect Sheet to read ALL tabs.`,
          'error',
          9000
        );
        setIsDocSyncModalOpen(true);
        return;
      }

      // If signed in as owner/admin, broadcast the updated deck live to all phones via Firestore
      let publishedCount = 0;
      if (isDeckAdmin(auth.currentUser)) {
        try {
          setIsPublishingCloud(true);
          publishedCount = await publishDeckToCloud({
            videos: syncedVideos,
            statuses,
            notes,
            title: resolvedTitle,
            documentUrl,
          });
        } catch (cloudErr) {
          console.warn('Cloud broadcast failed:', cloudErr);
        } finally {
          setIsPublishingCloud(false);
        }
      }

      const tabLabel = `${docData.tabCount} ${docData.tabCount === 1 ? 'tab' : 'tabs'}`;
      const tabPreview =
        tabSummaries.length > 1
          ? ` [${tabSummaries.map((t) => `${t.title}: ${t.uniqueLinkCount}`).join(' · ')}]`
          : '';
      const dupNote =
        duplicateInDocCount > 0
          ? ` (${duplicateInDocCount} duplicate link${duplicateInDocCount > 1 ? 's' : ''} merged)`
          : '';
      const cloudNote = publishedCount > 0 ? ' · Live on all phones' : '';

      if (newCount > 0) {
        setSelectedSection('all');
        setSelectedSourceTab('all');
        setSelectedStatusFilter('all');
        setShowOnlyNew(false);
        setSearchQuery('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast(
          `Updated from "${docData.title}" (${tabLabel}): Added ${newCount} new video${newCount > 1 ? 's' : ''} (${totalDetected} unique links${dupNote})${tabPreview}${cloudNote}.`,
          'success',
          8000
        );
      } else {
        showToast(
          `Synced "${docData.title}" (${tabLabel}): ${totalDetected} unique videos${dupNote}${tabPreview}${cloudNote} — all up to date.`,
          'info',
          7000
        );
      }
    } catch (err: any) {
      console.warn('Sync failed:', err);
      showToast(
        err?.message || 'Unable to sync. Click Connect Sheet to sign in or paste your links.',
        'error',
        8000
      );
      setIsDocSyncModalOpen(true);
    } finally {
      setIsSyncing(false);
    }
  }, [documentUrl, docTitle, videosList, statuses, notes, showToast]);

  // Background Auto-Sync every 30 seconds (only runs when user has a live Google token)
  useEffect(() => {
    if (!autoSyncEnabled || !documentUrl.trim() || !hasValidToken) return;

    const interval = setInterval(async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const docData = await fetchGoogleDoc(documentUrl, token);
        const { syncedVideos, newCount } = parseDocumentAndSyncVideos(
          docData.text,
          videosList
        );

        if (newCount > 0) {
          setVideosList(syncedVideos);
          if (isDeckAdmin(auth.currentUser)) {
            await publishDeckToCloud({
              videos: syncedVideos,
              statuses,
              notes,
              title: docData.title || docTitle,
              documentUrl,
            }).catch((e) => console.warn('Background cloud publish skipped:', e));
          }
          showToast(
            `Auto-sync: Added ${newCount} new reference video${newCount > 1 ? 's' : ''} live on all phones!`,
            'success'
          );
        }

        setLastSyncedAt(new Date());
        if (docData.title) setDocTitle(docData.title);
      } catch (err: any) {
        if (err instanceof AuthRequiredError || err?.needsAuth) {
          clearAccessToken();
          setHasValidToken(false);
        } else {
          console.warn('Background auto-sync skipped:', err);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [autoSyncEnabled, documentUrl, docTitle, hasValidToken, videosList, statuses, notes, showToast]);

  const handlePublishDeckToCloud = useCallback(
    async (overrideVideos?: VideoReference[], overrideTitle?: string, overrideUrl?: string) => {
      if (!isDeckAdmin(auth.currentUser)) return 0;
      setIsPublishingCloud(true);
      try {
        const count = await publishDeckToCloud({
          videos: overrideVideos ?? videosList,
          statuses,
          notes,
          title: overrideTitle ?? docTitle,
          documentUrl: overrideUrl ?? documentUrl,
        });
        return count;
      } catch (err) {
        console.warn('Failed to publish deck to cloud:', err);
        showToast('Could not publish to shared cloud database. Please try again.', 'error');
        return 0;
      } finally {
        setIsPublishingCloud(false);
      }
    },
    [videosList, statuses, notes, docTitle, documentUrl, showToast]
  );

  const handleVideosUpdated = (
    updated: VideoReference[],
    newCount: number,
    title?: string,
    sourceUrl?: string
  ) => {
    setVideosList(updated);
    setLastSyncedAt(new Date());
    const resolvedTitle = title || docTitle;
    const resolvedUrl = sourceUrl ?? documentUrl;
    if (title) setDocTitle(title);

    // Broadcast live to all crew devices if signed in as owner/admin
    if (isDeckAdmin(auth.currentUser)) {
      handlePublishDeckToCloud(updated, resolvedTitle, resolvedUrl).then((published) => {
        if (published > 0 && newCount === 0) {
          showToast(`Published ${published} videos live to all devices.`, 'success');
        }
      });
    }

    if (newCount > 0) {
      setSelectedSection('all');
      setSelectedSourceTab('all');
      setSelectedStatusFilter('all');
      setShowOnlyNew(false);
      setSearchQuery('');
      showToast(
        isDeckAdmin(auth.currentUser)
          ? `Added ${newCount} new reference video${newCount > 1 ? 's' : ''} — publishing live to all phones!`
          : `Added ${newCount} new reference video${newCount > 1 ? 's' : ''} to the top of your deck!`,
        'success'
      );
    }
  };

  const handleStatusChange = (id: string, status: ShotStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
    if (isDeckAdmin(auth.currentUser)) {
      updateVideoStatusInCloud(id, status).catch((err) => {
        console.warn('Cloud status update failed:', err);
      });
    }
  };

  const handleSaveNote = (id: string, note: string) => {
    setNotes((prev) => ({ ...prev, [id]: note }));
    if (isDeckAdmin(auth.currentUser)) {
      updateVideoNoteInCloud(id, note).catch((err) => {
        console.warn('Cloud note update failed:', err);
      });
    }
  };

  const handleToggleChecklist = (key: string) => {
    const nextValue = !checkedList[key];
    setCheckedList((prev) => ({ ...prev, [key]: nextValue }));
    if (isDeckAdmin(auth.currentUser)) {
      toggleChecklistItemInCloud(key, nextValue).catch((err) => {
        console.warn('Cloud checklist update failed:', err);
      });
    }
  };

  const handleResetChecklist = () => {
    if (window.confirm('Reset all checklist items to unchecked?')) {
      setCheckedList({});
      if (isDeckAdmin(auth.currentUser)) {
        resetChecklistInCloud().catch((err) => {
          console.warn('Cloud checklist reset failed:', err);
        });
      }
    }
  };

  // Dynamic Document / Sheet Tabs derived from synced videos
  const availableSourceTabs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of videosList) {
      if (v.sourceTab) {
        counts.set(v.sourceTab, (counts.get(v.sourceTab) || 0) + 1);
      }
    }
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }, [videosList]);

  const newSyncedCount = useMemo(
    () => videosList.filter((v) => v.isNewlySynced).length,
    [videosList]
  );

  // Filtered Video References
  const filteredVideos = useMemo(() => {
    return videosList.filter((video) => {
      if (selectedSection !== 'all' && video.section !== selectedSection) {
        return false;
      }

      if (selectedSourceTab !== 'all' && video.sourceTab !== selectedSourceTab) {
        return false;
      }

      if (showOnlyNew && !video.isNewlySynced) {
        return false;
      }

      const currentStat = statuses[video.id] || 'todo';
      if (selectedStatusFilter !== 'all' && currentStat !== selectedStatusFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = video.title.toLowerCase().includes(query);
        const inTag = video.categoryTag.toLowerCase().includes(query);
        const inSection = video.sectionName.toLowerCase().includes(query);
        const inTab = (video.sourceTab || '').toLowerCase().includes(query);
        if (!inTitle && !inTag && !inSection && !inTab) {
          return false;
        }
      }

      return true;
    });
  }, [selectedSection, selectedSourceTab, showOnlyNew, selectedStatusFilter, searchQuery, statuses, videosList]);

  const jumpToNextShot = () => {
    const nextUnfilmed = videosList.find(
      (v) => (statuses[v.id] || 'todo') !== 'wrapped'
    );
    if (nextUnfilmed) {
      setSelectedSection('all');
      setSelectedSourceTab('all');
      setSelectedStatusFilter('all');
      setShowOnlyNew(false);
      setTimeout(() => {
        const el = document.getElementById(`video-${nextUnfilmed.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          setActiveDrawerVideo(nextUnfilmed);
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans antialiased">
      {/* Top Navbar with 1-Click Sync and Quick Add */}
      <Header
        allVideos={videosList}
        statuses={statuses}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenDocSync={() => setIsDocSyncModalOpen(true)}
        isDocSynced={hasCloudDeck || (!!documentUrl && hasValidToken)}
        isSyncing={isSyncing || isPublishingCloud}
        onQuickSync={handleInstantSync}
        lastSyncedAt={lastSyncedAt}
        docTitle={docTitle}
        onOpenChecklist={() => setIsChecklistModalOpen(true)}
        onOpenAddVideo={() => setIsDocSyncModalOpen(true)}
      />

      {/* Sync Toast Notification */}
      {syncToastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 border ${
            syncToastMessage.type === 'error'
              ? 'bg-red-950 border-red-500 text-red-200'
              : syncToastMessage.type === 'success'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-100'
              : 'bg-neutral-900 border-neutral-700 text-neutral-200'
          }`}
        >
          {syncToastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{syncToastMessage.text}</span>
          <button
            onClick={() => setSyncToastMessage(null)}
            className="text-neutral-400 hover:text-white ml-2 text-sm cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Landing Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Category Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const count =
                cat.id === 'all'
                  ? videosList.length
                  : videosList.filter((v) => v.section === cat.id).length;
              const isSelected = selectedSection === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSection(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400 shadow-sm'
                      : 'bg-neutral-900/90 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 border-neutral-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{cat.name}</span>
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-neutral-950/20 text-neutral-950' : 'text-neutral-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Google Doc / Sheet Tab Filter Bar */}
          {availableSourceTabs.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 uppercase tracking-wider shrink-0 pr-1">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Doc / Sheet Tabs:</span>
              </span>

              <button
                onClick={() => setSelectedSourceTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border cursor-pointer ${
                  selectedSourceTab === 'all'
                    ? 'bg-neutral-100 text-neutral-950 font-bold border-neutral-100'
                    : 'bg-neutral-900/70 text-neutral-400 hover:text-neutral-200 border-neutral-800'
                }`}
              >
                All Tabs ({videosList.length})
              </button>

              {availableSourceTabs.map((tab) => {
                const isSelected = selectedSourceTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => {
                      setSelectedSourceTab(tab.name);
                      setSelectedSection('all');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                        : 'bg-neutral-900/70 text-neutral-400 hover:text-neutral-200 border-neutral-800'
                    }`}
                  >
                    <span>{tab.name}</span>
                    <span
                      className={`text-[11px] font-mono ${
                        isSelected ? 'text-amber-300' : 'text-neutral-500'
                      }`}
                    >
                      ({tab.count})
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Sub-bar: Filter Status & Next Action & Layout Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800">
                <button
                  onClick={() => setSelectedStatusFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedStatusFilter === 'all'
                      ? 'bg-neutral-800 text-neutral-100 font-medium'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  All ({filteredVideos.length === videosList.length ? videosList.length : `${filteredVideos.length}/${videosList.length}`})
                </button>
                <button
                  onClick={() => setSelectedStatusFilter('todo')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedStatusFilter === 'todo'
                      ? 'bg-neutral-800 text-neutral-100 font-medium'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  To Shoot
                </button>
                <button
                  onClick={() => setSelectedStatusFilter('wrapped')}
                  className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                    selectedStatusFilter === 'wrapped'
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'text-neutral-500 hover:text-emerald-400'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Done</span>
                </button>
              </div>

              {newSyncedCount > 0 && (
                <button
                  onClick={() => setShowOnlyNew(!showOnlyNew)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                    showOnlyNew
                      ? 'bg-emerald-500 text-neutral-950 border-emerald-400'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>New ({newSyncedCount})</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleInstantSync}
                disabled={isSyncing}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Sync reference videos from connected Google Doc or Sheet"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Sheet'}</span>
              </button>

              <div className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800">
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    layoutMode === 'grid'
                      ? 'bg-neutral-800 text-amber-400'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                  title="Grid layout (3 columns)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLayoutMode('wide')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    layoutMode === 'wide'
                      ? 'bg-neutral-800 text-amber-400'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                  title="Wide layout (1 column)"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={jumpToNextShot}
                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FastForward className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Next Unshot Video</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Cards Grid / List */}
        {filteredVideos.length > 0 ? (
          <div
            className={
              layoutMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                : 'space-y-6'
            }
          >
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                status={statuses[video.id] || 'todo'}
                userNote={notes[video.id] || ''}
                onStatusChange={handleStatusChange}
                onSaveNote={handleSaveNote}
                onOpenDrawer={(v) => setActiveDrawerVideo(v)}
                layoutMode={layoutMode}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
            <FolderOpen className="w-8 h-8 text-neutral-600 mx-auto" />
            <h3 className="text-sm font-semibold text-neutral-200">No videos in this section</h3>
            <p className="text-xs text-neutral-500">
              Try selecting "All Videos" or clicking "Sync Sheet" to pull newly added links.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedSection('all');
                  setSelectedSourceTab('all');
                  setSelectedStatusFilter('all');
                  setShowOnlyNew(false);
                  setSearchQuery('');
                }}
                className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                onClick={handleInstantSync}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync Sheet Now</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Slide-Over Theater Cinema Modal */}
      <DirectorDrawer
        video={activeDrawerVideo}
        allVideos={videosList}
        status={activeDrawerVideo ? statuses[activeDrawerVideo.id] || 'todo' : 'todo'}
        userNote={activeDrawerVideo ? notes[activeDrawerVideo.id] || '' : ''}
        onClose={() => setActiveDrawerVideo(null)}
        onSelectVideo={(v) => setActiveDrawerVideo(v)}
        onStatusChange={handleStatusChange}
        onSaveNote={handleSaveNote}
      />

      {/* Google Document & Sheet Live Sync Modal */}
      <GoogleDocSyncModal
        isOpen={isDocSyncModalOpen}
        onClose={() => setIsDocSyncModalOpen(false)}
        currentUser={currentUser}
        hasValidToken={hasValidToken}
        onAuthChange={(user, valid) => {
          setCurrentUser(user);
          setHasValidToken(valid);
        }}
        documentUrl={documentUrl}
        onDocumentUrlChange={setDocumentUrl}
        lastSyncedAt={lastSyncedAt}
        docTitle={docTitle}
        autoSyncEnabled={autoSyncEnabled}
        onAutoSyncToggle={setAutoSyncEnabled}
        currentVideos={videosList}
        onVideosUpdated={handleVideosUpdated}
        hasCloudDeck={hasCloudDeck}
        isPublishingCloud={isPublishingCloud}
        onPublishToCloud={async () => {
          const count = await handlePublishDeckToCloud();
          if (count > 0) {
            showToast(`Published ${count} videos live to all phones!`, 'success');
          }
          return count;
        }}
      />

      {/* Optional Shoot Checklist Modal */}
      {isChecklistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-5">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-neutral-100">Shoot Preparation Checklist</h2>
              </div>
              <button
                onClick={() => setIsChecklistModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ChecklistView
              checkedItems={checkedList}
              onToggleItem={handleToggleChecklist}
              onResetAll={handleResetChecklist}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-800/80 bg-neutral-950 py-5 text-xs text-neutral-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>CRAFTSQUARRE · REFERENCE VIDEO HUB</span>
            <span>·</span>
            <span className="text-neutral-400">{videosList.length} References Active</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-neutral-500">
            <button
              onClick={handleInstantSync}
              className="hover:text-amber-400 underline cursor-pointer"
            >
              Sync Sheet ({lastSyncedAt ? lastSyncedAt.toLocaleTimeString() : 'Not synced yet'})
            </button>
            <button
              onClick={() => setIsChecklistModalOpen(true)}
              className="hover:text-amber-400 underline cursor-pointer"
            >
              Checklist
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
