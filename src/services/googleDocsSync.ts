import { VideoReference, VIDEO_REFERENCES } from '../data/shootData';
import firebaseConfig from '../../firebase-applet-config.json';

export interface ResourceInfo {
  id: string;
  type: 'document' | 'spreadsheet';
  gid?: string;
  originalUrl: string;
}

export interface TabScanSummary {
  title: string;
  linkCount: number;
  uniqueLinkCount: number;
}

export interface FetchDocResponse {
  title: string;
  text: string;
  links: string[];
  type: 'document' | 'spreadsheet';
  tabCount: number;
  tabNames: string[];
  usedPublicFallback: boolean;
}

export interface DuplicateLinkInfo {
  url: string;
  canonicalKey: string;
  sections: string[];
  tabs: string[];
  occurrences: number;
}

export interface ParsedSyncResult {
  syncedVideos: VideoReference[];
  newCount: number;
  sectionsFound: string[];
  /** Number of unique video links detected in the synced document/sheet */
  totalDetected: number;
  /** Raw number of video link mentions before deduplication */
  rawOccurrences: number;
  /** Number of duplicate link occurrences within the document/sheet */
  duplicateInDocCount: number;
  /** Detailed list of links that appeared more than once in the document/sheet */
  duplicateDetails: DuplicateLinkInfo[];
  /** Per-tab link counts discovered during parsing */
  tabSummaries: TabScanSummary[];
}

export class AuthRequiredError extends Error {
  needsAuth = true;
  constructor(message: string) {
    super(message);
    this.name = 'AuthRequiredError';
  }
}

/**
 * Extracts document or spreadsheet ID and type from URL or raw ID string.
 */
export function extractResourceInfo(urlOrId: string): ResourceInfo | null {
  const clean = urlOrId.trim();
  if (!clean) return null;

  // 1. Google Spreadsheet
  const sheetMatch = clean.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (sheetMatch && sheetMatch[1]) {
    const gidMatch = clean.match(/[#&?]gid=([0-9]+)/);
    return {
      id: sheetMatch[1],
      type: 'spreadsheet',
      gid: gidMatch ? gidMatch[1] : undefined,
      originalUrl: clean,
    };
  }

  // 2. Google Document
  const docMatch = clean.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
  if (docMatch && docMatch[1]) {
    return {
      id: docMatch[1],
      type: 'document',
      originalUrl: clean,
    };
  }

  // 3. Fallback: bare alphanumeric ID (20+ chars)
  if (/^[a-zA-Z0-9-_]{20,}$/.test(clean)) {
    return {
      id: clean,
      type: 'document',
      originalUrl: clean,
    };
  }

  return null;
}

export function extractDocumentId(urlOrId: string): string | null {
  const info = extractResourceInfo(urlOrId);
  return info ? info.id : null;
}

/**
 * Unwraps Google / Instagram redirect wrapper URLs so the true target video URL is extracted.
 */
export function unwrapRedirectUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (host.includes('google.com') && parsed.pathname === '/url') {
      const q = parsed.searchParams.get('q') || parsed.searchParams.get('url');
      if (q && /^https?:\/\//i.test(q)) return q.trim();
    }
    if (host === 'l.instagram.com' || host === 'lm.facebook.com' || host === 'l.facebook.com') {
      const u = parsed.searchParams.get('u');
      if (u && /^https?:\/\//i.test(u)) return u.trim();
    }
  } catch {
    // Keep original if URL constructor fails
  }
  return trimmed;
}

/**
 * Fetches content from Google Docs (all tabs + tables + rich links + footnotes)
 * or Google Sheets (all sheet tabs + cell hyperlinks + rich text links + formulas).
 */
export async function fetchGoogleDoc(
  urlOrId: string,
  accessToken?: string | null,
  options?: { allowSingleTabFallback?: boolean }
): Promise<FetchDocResponse> {
  const resource = extractResourceInfo(urlOrId);
  if (!resource) {
    throw new Error('Invalid link. Please paste a Google Docs or Google Sheets URL.');
  }

  const allowSingleTabFallback = options?.allowSingleTabFallback ?? true;

  if (resource.type === 'spreadsheet') {
    return fetchGoogleSpreadsheet(resource, accessToken, allowSingleTabFallback);
  }
  return fetchGoogleDocument(resource.id, accessToken, allowSingleTabFallback);
}

/**
 * Deduplicates a list of URLs within a single cell or paragraph by canonical video key
 * so that display text + hyperlink metadata never double-count the same link.
 */
function deduplicateLocalUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of urls) {
    const unwrapped = unwrapRedirectUrl(raw);
    if (!unwrapped) continue;
    const norm = normalizeVideoUrl(unwrapped);
    const key = norm.platform ? norm.canonicalKey : unwrapped;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(unwrapped);
    }
  }
  return result;
}

/**
 * Fetches Google Document via Docs API v1 with includeTabsContent=true so ALL tabs are read.
 */
async function fetchGoogleDocument(
  docId: string,
  accessToken?: string | null,
  allowSingleTabFallback = true
): Promise<FetchDocResponse> {
  let apiAuthFailed = false;
  let apiErrorMessage = '';

  if (accessToken) {
    try {
      const response = await fetch(
        `https://docs.googleapis.com/v1/documents/${docId}?includeTabsContent=true`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: 'no-store',
        }
      );

      if (response.ok) {
        const data = await response.json();
        const title = data.title || 'Working Shoot Document';
        const extracted = parseGoogleDocsContent(data);
        return {
          title,
          text: extracted.text,
          links: extracted.links,
          type: 'document',
          tabCount: extracted.tabNames.length || 1,
          tabNames: extracted.tabNames,
          usedPublicFallback: false,
        };
      } else if (response.status === 401 || response.status === 403) {
        apiAuthFailed = true;
        const errBody = await response.json().catch(() => ({}));
        apiErrorMessage = errBody?.error?.message || '';
        console.warn('Google Docs API auth/permission error:', response.status, errBody);
      } else {
        const errBody = await response.json().catch(() => ({}));
        apiErrorMessage = errBody?.error?.message || `HTTP ${response.status}`;
        console.warn('Google Docs API returned error:', response.status, errBody);
      }
    } catch (err) {
      console.warn('Docs API v1 fetch failed, trying public export fallback:', err);
    }
  }

  // If authenticated API returned 401/403, force re-authentication instead of silently falling back to single-tab export!
  if (apiAuthFailed) {
    throw new AuthRequiredError(
      apiErrorMessage
        ? `Google Docs permission needed (${apiErrorMessage}). Please sign in with Google so all tabs can be read.`
        : 'Please sign in with Google so all tabs in your Google Document can be read.'
    );
  }

  // Fallback: public text export (NOTE: Google public export only reads Tab 1)
  if (allowSingleTabFallback) {
    try {
      const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
      const exportRes = await fetch(exportUrl, { cache: 'no-store' });
      if (exportRes.ok) {
        const text = await exportRes.text();
        return {
          title: 'Craftsquarre Shoot Working Document',
          text: `=== TAB: Main Document ===\n${text}`,
          links: extractUrlsFromText(text),
          type: 'document',
          tabCount: 1,
          tabNames: ['Main Document (Tab 1 only)'],
          usedPublicFallback: true,
        };
      }
    } catch (err) {
      console.warn('Docs public export fallback failed:', err);
    }
  }

  if (!accessToken) {
    throw new AuthRequiredError(
      'Please sign in with Google to read all tabs from your Google Document.'
    );
  }

  throw new Error(
    apiErrorMessage ||
      'Unable to read Google Document. Verify the link is correct and you have view access.'
  );
}

/**
 * Parses a Google Sheets API v4 spreadsheet response (all sheet tabs, cell hyperlinks, rich text links, formulas).
 */
function parseGoogleSheetsResponse(data: any): FetchDocResponse {
  const title = data.properties?.title || 'Craftsquarre Shoot Sheet';
  const textParts: string[] = [];
  const links: string[] = [];
  const tabNames: string[] = [];
  const sheets = data.sheets || [];

  for (const sheet of sheets) {
    const tabTitle = sheet.properties?.title || `Sheet ${tabNames.length + 1}`;
    tabNames.push(tabTitle);
    textParts.push(`\n=== TAB: ${tabTitle} ===`);

    for (const grid of sheet.data || []) {
      for (const row of grid.rowData || []) {
        const rowLabels: string[] = [];
        const rowUrls: string[] = [];

        for (const cell of row.values || []) {
          const val = (cell.formattedValue || '').trim();
          const hyperlink = (cell.hyperlink || '').trim();
          const formula = (cell.userEnteredValue?.formulaValue || '').trim();

          const cellUrls: string[] = [];
          if (hyperlink) cellUrls.push(hyperlink);

          if (Array.isArray(cell.textFormatRuns)) {
            for (const run of cell.textFormatRuns) {
              const uri = run?.format?.link?.uri;
              if (uri) cellUrls.push(uri.trim());
            }
          }

          if (formula) {
            cellUrls.push(...extractUrlsFromText(formula));
          }

          if (val) {
            cellUrls.push(...extractUrlsFromText(val));
          }

          const uniqueCellUrls = deduplicateLocalUrls(cellUrls);
          rowUrls.push(...uniqueCellUrls);

          const cleanLabel = stripUrlsFromText(val);
          if (cleanLabel) {
            rowLabels.push(cleanLabel);
          }
        }

        const uniqueRowUrls = deduplicateLocalUrls(rowUrls);
        links.push(...uniqueRowUrls);

        const parts: string[] = [];
        if (rowLabels.length > 0) parts.push(rowLabels.join(' | '));
        if (uniqueRowUrls.length > 0) parts.push(uniqueRowUrls.join(' '));

        if (parts.length > 0) {
          textParts.push(parts.join(' | '));
        }
      }
    }
  }

  const fullText = textParts.join('\n');
  return {
    title,
    text: fullText,
    links: Array.from(new Set(links)),
    type: 'spreadsheet',
    tabCount: tabNames.length || 1,
    tabNames,
    usedPublicFallback: false,
  };
}

/**
 * Fetches Google Spreadsheet via Sheets API v4 (all sheet tabs, values, cell hyperlinks, rich text links, HYPERLINK formulas).
 * Supports both authenticated OAuth tokens AND public ("Anyone with the link can view") sheets via API key.
 */
async function fetchGoogleSpreadsheet(
  resource: ResourceInfo,
  accessToken?: string | null,
  allowSingleTabFallback = true
): Promise<FetchDocResponse> {
  const sheetId = resource.id;
  let apiAuthFailed = false;
  let apiErrorMessage = '';

  // 1. Authenticated Sheets API v4 (reads private and public sheets, all tabs)
  if (accessToken) {
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?includeGridData=true`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: 'no-store',
        }
      );

      if (response.ok) {
        const data = await response.json();
        return parseGoogleSheetsResponse(data);
      } else if (response.status === 401 || response.status === 403) {
        apiAuthFailed = true;
        const errBody = await response.json().catch(() => ({}));
        apiErrorMessage = errBody?.error?.message || '';
        console.warn('Google Sheets API auth/permission error:', response.status, errBody);
      } else {
        const errBody = await response.json().catch(() => ({}));
        apiErrorMessage = errBody?.error?.message || `HTTP ${response.status}`;
        console.warn('Google Sheets API returned error:', response.status, errBody);
      }
    } catch (err) {
      console.warn('Sheets API v4 failed, trying public access:', err);
    }
  }

  // 2. Public Multi-Tab Sheets API v4 using project API key (works without sign-in if sheet is shared as "Anyone with the link can view")
  if (!accessToken && firebaseConfig.apiKey) {
    try {
      const publicApiRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?includeGridData=true&key=${encodeURIComponent(firebaseConfig.apiKey)}`,
        { cache: 'no-store' }
      );
      if (publicApiRes.ok) {
        const data = await publicApiRes.json();
        return parseGoogleSheetsResponse(data);
      }
    } catch (err) {
      console.warn('Public multi-tab Sheets API attempt failed:', err);
    }
  }

  // If authenticated API returned 401/403, force re-authentication instead of silently falling back to single-tab CSV!
  if (apiAuthFailed) {
    throw new AuthRequiredError(
      apiErrorMessage
        ? `Google Sheets permission needed (${apiErrorMessage}). Please sign in with Google so all sheet tabs can be read.`
        : 'Please sign in with Google so all tabs in your Google Sheet can be read.'
    );
  }

  // 3. Fallback: public CSV export (NOTE: only exports 1 sheet tab)
  if (allowSingleTabFallback) {
    const exportUrls = [
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv${resource.gid ? `&gid=${resource.gid}` : ''}`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${resource.gid ? `&gid=${resource.gid}` : ''}`,
    ];

    for (const url of exportUrls) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const csvText = await res.text();
          if (csvText.trim().startsWith('<!DOCTYPE html') || csvText.includes('accounts.google.com')) {
            continue;
          }
          const urls = extractUrlsFromText(csvText);
          return {
            title: 'Craftsquarre Shoot Working Sheet',
            text: `=== TAB: Active Sheet ===\n${csvText}`,
            links: urls,
            type: 'spreadsheet',
            tabCount: 1,
            tabNames: ['Active Sheet (Tab 1 only)'],
            usedPublicFallback: true,
          };
        }
      } catch {
        // Ignore CORS error on public fallback
      }
    }
  }

  if (!accessToken) {
    throw new AuthRequiredError(
      'Please sign in with Google (or share the Sheet as "Anyone with the link can view") so all tabs can be read.'
    );
  }

  throw new Error(
    apiErrorMessage ||
      'Unable to read Google Sheet. Verify the link is correct and you have view access.'
  );
}

/**
 * Recursively parses structural elements (paragraphs, tables, richLink smart chips, TOC).
 * Deduplicates URLs per paragraph so split textRuns + link.url metadata never double-count.
 */
function extractStructuralElements(elements: any[], textParts: string[], links: string[]) {
  if (!Array.isArray(elements)) return;

  for (const element of elements) {
    if (element.paragraph?.elements) {
      const paraTextChunks: string[] = [];
      const paraExplicitUrls: string[] = [];

      for (const el of element.paragraph.elements) {
        const runContent = el.textRun?.content || '';
        const runLinkUrl = el.textRun?.textStyle?.link?.url?.trim() || '';

        if (runLinkUrl) {
          paraExplicitUrls.push(runLinkUrl);
          const trimmedContent = runContent.trim();
          const isUrlFragment =
            !trimmedContent ||
            runLinkUrl.includes(trimmedContent) ||
            trimmedContent.startsWith('http://') ||
            trimmedContent.startsWith('https://') ||
            trimmedContent.startsWith('www.');
          if (!isUrlFragment) {
            paraTextChunks.push(runContent);
          }
        } else if (runContent) {
          paraTextChunks.push(runContent);
        }

        // Smart Chips / Rich Links pasted into Google Docs
        if (el.richLink?.richLinkProperties?.uri) {
          const uri = el.richLink.richLinkProperties.uri.trim();
          const chipTitle = (el.richLink.richLinkProperties.title || '').trim();
          paraExplicitUrls.push(uri);
          if (chipTitle && !uri.includes(chipTitle)) {
            paraTextChunks.push(` ${chipTitle} `);
          }
        }
      }

      const rawParaText = paraTextChunks.join('');
      const plainTextUrls = extractUrlsFromText(rawParaText);
      const uniqueParaUrls = deduplicateLocalUrls([...paraExplicitUrls, ...plainTextUrls]);

      links.push(...uniqueParaUrls);

      const cleanLabel = stripUrlsFromText(rawParaText).trim();
      if (uniqueParaUrls.length > 0) {
        const lineStr = cleanLabel
          ? `${cleanLabel} ${uniqueParaUrls.join(' ')}\n`
          : `${uniqueParaUrls.join('\n')}\n`;
        textParts.push(lineStr);
      } else if (cleanLabel) {
        textParts.push(`${cleanLabel}\n`);
      }
    } else if (element.table?.tableRows) {
      for (const row of element.table.tableRows) {
        const rowPieces: string[] = [];
        for (const cell of row.tableCells || []) {
          const cellParts: string[] = [];
          extractStructuralElements(cell.content, cellParts, links);
          const cellStr = cellParts.join(' ').replace(/\s*\n+\s*/g, ' ').trim();
          if (cellStr) rowPieces.push(cellStr);
        }
        if (rowPieces.length > 0) {
          textParts.push(`${rowPieces.join(' | ')}\n`);
        }
      }
    } else if (element.tableOfContents?.content) {
      extractStructuralElements(element.tableOfContents.content, textParts, links);
    }
  }
}

/**
 * Recursively extracts modern Google Docs Document Tabs (including child tabs, footnotes, headers/footers).
 */
function extractTabsContent(tabs: any[], textParts: string[], links: string[], tabNames: string[]) {
  if (!Array.isArray(tabs)) return;

  for (const tab of tabs) {
    const tabTitle = tab.tabProperties?.title?.trim() || `Tab ${tabNames.length + 1}`;
    tabNames.push(tabTitle);
    textParts.push(`\n\n=== TAB: ${tabTitle} ===\n\n`);

    const docTab = tab.documentTab;
    if (docTab?.body?.content) {
      extractStructuralElements(docTab.body.content, textParts, links);
    }
    // Also scan footnotes / headers / footers inside the tab in case links were placed there
    if (docTab?.footnotes && typeof docTab.footnotes === 'object') {
      for (const fn of Object.values<any>(docTab.footnotes)) {
        if (fn?.content) extractStructuralElements(fn.content, textParts, links);
      }
    }
    if (Array.isArray(tab.childTabs) && tab.childTabs.length > 0) {
      extractTabsContent(tab.childTabs, textParts, links, tabNames);
    }
  }
}

/**
 * Comprehensive parser for Google Docs API v1 response (with full multi-tab support).
 */
function parseGoogleDocsContent(docData: any): { text: string; links: string[]; tabNames: string[] } {
  const textParts: string[] = [];
  const links: string[] = [];
  const tabNames: string[] = [];

  if (Array.isArray(docData.tabs) && docData.tabs.length > 0) {
    extractTabsContent(docData.tabs, textParts, links, tabNames);
  } else if (docData.body?.content) {
    tabNames.push(docData.title || 'Main Document');
    textParts.push(`\n\n=== TAB: ${tabNames[0]} ===\n\n`);
    extractStructuralElements(docData.body.content, textParts, links);
  }

  const fullText = textParts.join('');
  const allUrls = Array.from(new Set([...links, ...extractUrlsFromText(fullText)]));

  return {
    text: fullText,
    links: allUrls,
    tabNames,
  };
}

/**
 * Extracts all URLs from text, including concatenated URLs without spaces (https://...https://...)
 * and bare domain links (www.instagram.com/..., vm.tiktok.com/...).
 */
export function extractUrlsFromText(text: string): string[] {
  if (!text) return [];

  const separated = text.replace(/(?!^)(https?:\/\/)/gi, ' $1');

  const urlRegex =
    /(?:https?:\/\/[^\s"'<>()[\]{}|,]+|\b(?:www\.)?(?:instagram\.com|instagr\.am|tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com|x\.com|twitter\.com|youtu\.be|youtube\.com|facebook\.com|fb\.watch|pinterest\.com|pin\.it|threads\.net|threads\.com|vimeo\.com|drive\.google\.com)\/[^\s"'<>()[\]{}|,]+)/gi;

  const matches = separated.match(urlRegex) || [];
  return Array.from(
    new Set(
      matches.map((raw) => {
        const cleaned = raw.replace(/[.,;:)\]'">]+$/, '');
        const withProto = /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
        return unwrapRedirectUrl(withProto);
      })
    )
  );
}

function stripUrlsFromText(text: string): string {
  if (!text) return '';
  const separated = text.replace(/(?!^)(https?:\/\/)/gi, ' $1');
  return separated
    .replace(
      /(?:https?:\/\/[^\s"'<>()[\]{}|,]+|\b(?:www\.)?(?:instagram\.com|instagr\.am|tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com|x\.com|twitter\.com|youtu\.be|youtube\.com|facebook\.com|fb\.watch|pinterest\.com|pin\.it|threads\.net|threads\.com|vimeo\.com|drive\.google\.com)\/[^\s"'<>()[\]{}|,]+)/gi,
      ' '
    )
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes a video/content reference URL for canonical case-sensitive deduplication & embed ID extraction.
 */
export function normalizeVideoUrl(rawUrl: string): {
  normalized: string;
  canonicalKey: string;
  platform: VideoReference['platform'] | null;
  embedId: string;
} {
  const clean = unwrapRedirectUrl(rawUrl.trim());
  const lower = clean.toLowerCase();

  // Ignore links pointing back to Google Docs / Sheets themselves
  if (lower.includes('docs.google.com/document') || lower.includes('docs.google.com/spreadsheets')) {
    return { normalized: clean, canonicalKey: `doc:${clean}`, platform: null, embedId: '' };
  }

  // 1. Instagram (shortcodes are CASE-SENSITIVE Base64!)
  if (lower.includes('instagram.com') || lower.includes('instagr.am')) {
    const shareTypedM = clean.match(/\/share\/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
    const shareDirectM = clean.match(/\/share\/([a-zA-Z0-9_-]{6,})/);
    const stdM = clean.match(/\/(reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/);

    let embedId = '';
    if (stdM && !['audio', 'videos', 'explore', 'accounts', 'share'].includes(stdM[2].toLowerCase())) {
      embedId = stdM[2];
    } else if (shareTypedM) {
      embedId = shareTypedM[1];
    } else if (shareDirectM && !['reel', 'p', '_u'].includes(shareDirectM[1].toLowerCase())) {
      embedId = shareDirectM[1];
    }

    const normalized = embedId ? `https://www.instagram.com/reel/${embedId}/` : clean;
    const canonicalKey = embedId ? `ig:${embedId}` : `ig-url:${clean}`;
    return { normalized, canonicalKey, platform: 'instagram', embedId };
  }

  // 2. TikTok (numeric IDs or case-sensitive short codes)
  if (lower.includes('tiktok.com')) {
    const numM = clean.match(/\/(?:video|photo|v)\/(\d+)/);
    const shortM = clean.match(/(?:vm|vt)\.tiktok\.com\/([a-zA-Z0-9_-]+)/);
    const tM = clean.match(/tiktok\.com\/t\/([a-zA-Z0-9_-]+)/);
    const embedId = numM ? numM[1] : shortM ? shortM[1] : tM ? tM[1] : '';

    const normalized = numM
      ? `https://www.tiktok.com/video/${numM[1]}`
      : embedId
      ? `https://www.tiktok.com/t/${embedId}`
      : clean;
    const canonicalKey = embedId ? `tt:${embedId}` : `tt-url:${clean}`;
    return { normalized, canonicalKey, platform: 'tiktok', embedId };
  }

  // 3. Twitter / X
  if (lower.includes('twitter.com') || lower.includes('x.com')) {
    const m = clean.match(/\/status\/(\d+)/);
    const embedId = m ? m[1] : '';
    const normalized = embedId ? `https://x.com/i/status/${embedId}` : clean;
    const canonicalKey = embedId ? `tw:${embedId}` : `tw-url:${clean}`;
    return { normalized, canonicalKey, platform: 'twitter', embedId };
  }

  // 4. YouTube / Shorts (IDs are CASE-SENSITIVE!)
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    const shortsM = clean.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    const watchM = clean.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    const beM = clean.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    const embedId = shortsM ? shortsM[1] : watchM ? watchM[1] : beM ? beM[1] : '';

    const normalized = embedId ? `https://www.youtube.com/watch?v=${embedId}` : clean;
    const canonicalKey = embedId ? `yt:${embedId}` : `yt-url:${clean}`;
    return { normalized, canonicalKey, platform: 'youtube', embedId };
  }

  // 5. Facebook Reels / Watch
  if (lower.includes('facebook.com') || lower.includes('fb.watch') || lower.includes('fb.com')) {
    const reelM = clean.match(/\/(?:reel|videos)\/(\d+)/);
    const embedId = reelM ? reelM[1] : '';
    const canonicalKey = embedId ? `fb:${embedId}` : `fb-url:${clean}`;
    return { normalized: clean, canonicalKey, platform: 'facebook', embedId };
  }

  // 6. Pinterest
  if (lower.includes('pinterest.com') || lower.includes('pin.it')) {
    const pinM = clean.match(/\/pin\/(\d+)/);
    const shortM = clean.match(/pin\.it\/([a-zA-Z0-9_-]+)/);
    const embedId = pinM ? pinM[1] : shortM ? shortM[1] : '';
    const canonicalKey = embedId ? `pin:${embedId}` : `pin-url:${clean}`;
    return { normalized: clean, canonicalKey, platform: 'pinterest', embedId };
  }

  // 7. Google Drive Video Files
  if (lower.includes('drive.google.com/file/d/')) {
    const m = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const embedId = m ? m[1] : '';
    const canonicalKey = embedId ? `gdrive:${embedId}` : `gdrive-url:${clean}`;
    return { normalized: clean, canonicalKey, platform: 'drive', embedId };
  }

  // 8. Vimeo
  if (lower.includes('vimeo.com')) {
    const m = clean.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    const embedId = m ? m[1] : '';
    const canonicalKey = embedId ? `vimeo:${embedId}` : `vimeo-url:${clean}`;
    return { normalized: clean, canonicalKey, platform: 'vimeo', embedId };
  }

  // 9. Threads / Canva / CapCut / Loom / Dropbox / Snapchat
  if (
    lower.includes('threads.net') ||
    lower.includes('threads.com') ||
    lower.includes('capcut.com') ||
    lower.includes('canva.com') ||
    lower.includes('loom.com') ||
    lower.includes('snapchat.com')
  ) {
    return { normalized: clean, canonicalKey: `other:${clean}`, platform: 'other', embedId: '' };
  }

  return {
    normalized: clean,
    canonicalKey: `other:${clean}`,
    platform: null,
    embedId: '',
  };
}

/**
 * Matches text against known shoot section keywords. Returns null if no keyword matched.
 */
function matchSectionFromText(text: string): {
  section: VideoReference['section'];
  sectionName: string;
  categoryTag: string;
} | null {
  const lower = text.toLowerCase();

  if (lower.includes('asmr')) {
    return { section: 'ugc-asmr', sectionName: 'ASMR Drinks', categoryTag: 'ASMR Drinks' };
  }
  if (
    lower.includes('healthy drinks') ||
    lower.includes('beverage') ||
    lower.includes('juice') ||
    lower.includes('smoothie') ||
    lower.includes('zesty') ||
    lower.includes('drink')
  ) {
    return { section: 'ugc-drinks', sectionName: 'Healthy Drinks', categoryTag: 'Healthy Drinks' };
  }
  if (lower.includes('parfait') || lower.includes('yogurt') || lower.includes('granola') || /\bfood\b/.test(lower)) {
    return { section: 'ugc-food', sectionName: 'Food (Parfait etc)', categoryTag: 'Food / Parfait' };
  }
  if (
    lower.includes('ankara') ||
    lower.includes('lunch bag') ||
    lower.includes('backpack') ||
    lower.includes('bagpack') ||
    lower.includes('tote') ||
    /\bbags?\b/.test(lower)
  ) {
    return { section: 'ugc-bags', sectionName: 'Bags & Ankara', categoryTag: 'Bags & Ankara' };
  }
  if (lower.includes('slipper') || lower.includes('slide') || lower.includes('mule') || lower.includes('flip flop')) {
    return { section: 'ugc-slippers', sectionName: 'Slippers & Slides', categoryTag: 'Slippers' };
  }
  if (
    lower.includes('shoe') ||
    lower.includes('clog') ||
    lower.includes('heel') ||
    lower.includes('sneaker') ||
    lower.includes('footwear')
  ) {
    return { section: 'ugc-shoes', sectionName: 'Shoes & Footwear', categoryTag: 'Shoes & Footwear' };
  }
  if (
    lower.includes('fashion') ||
    lower.includes('kaftan') ||
    lower.includes('outfit') ||
    lower.includes('garment') ||
    lower.includes('dress') ||
    lower.includes('clothing')
  ) {
    return { section: 'ugc-fashion', sectionName: 'Fashion & Outfits', categoryTag: 'Fashion' };
  }
  if (
    lower.includes('phone call ad') ||
    lower.includes('scripted') ||
    lower.includes('founder announcement') ||
    lower.includes('laptop screen')
  ) {
    return { section: 'scripted-ads', sectionName: 'Scripted Launch Ads', categoryTag: 'Scripted AD' };
  }
  if (lower.includes('pre-launch') || lower.includes('pre launch') || lower.includes('teaser')) {
    return { section: 'pre-launch', sectionName: 'Pre-Launch Teasers', categoryTag: 'Pre-Launch' };
  }
  if (lower.includes('launch announcement') || /^launch\b/.test(lower.trim())) {
    return { section: 'launch', sectionName: 'Launch Announcements', categoryTag: 'Launch' };
  }

  return null;
}

/**
 * Parses document/spreadsheet text and synchronizes newly added video links across ALL tabs.
 */
export function parseDocumentAndSyncVideos(
  docText: string,
  existingVideos: VideoReference[] = VIDEO_REFERENCES,
  options?: { includeDuplicates?: boolean; replaceExisting?: boolean }
): ParsedSyncResult {
  const includeDuplicates = options?.includeDuplicates ?? false;
  const replaceExisting = options?.replaceExisting ?? false;

  const lines = docText.split('\n');
  const sectionsFound: Set<string> = new Set();

  let currentTabName = 'Main';
  let currentSection: VideoReference['section'] = 'ugc-bags';
  let currentSectionName = 'Bags & Ankara';
  let currentSubcategory = 'Reference Video';

  // Track per-tab stats
  const tabStatsMap = new Map<string, { raw: number; uniqueKeys: Set<string> }>();
  const ensureTabStat = (tabName: string) => {
    if (!tabStatsMap.has(tabName)) {
      tabStatsMap.set(tabName, { raw: 0, uniqueKeys: new Set<string>() });
    }
    return tabStatsMap.get(tabName)!;
  };

  // Map existing videos by canonical key so we can also backfill their `sourceTab` if missing
  const baseVideos = replaceExisting ? [] : existingVideos.map((v) => ({ ...v }));
  const existingVideoByKey = new Map<string, VideoReference>();
  baseVideos.forEach((v) => {
    const norm = normalizeVideoUrl(v.url);
    if (!existingVideoByKey.has(norm.canonicalKey)) {
      existingVideoByKey.set(norm.canonicalKey, v);
    }
  });

  const existingKeys = new Set<string>(existingVideoByKey.keys());
  const docOccurrences = new Map<string, DuplicateLinkInfo>();
  const newlyAddedVideos: VideoReference[] = [];
  let rawOccurrences = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // 1. Explicit TAB marker emitted by Docs/Sheets fetcher
    const tabHeaderMatch = line.match(/^===\s*(?:TAB|SECTION):\s*(.+?)\s*===$/i);
    if (tabHeaderMatch && tabHeaderMatch[1]) {
      currentTabName = tabHeaderMatch[1].trim();
      ensureTabStat(currentTabName);

      const matched = matchSectionFromText(currentTabName);
      if (matched) {
        currentSection = matched.section;
        currentSectionName = matched.sectionName;
        currentSubcategory = matched.categoryTag;
        sectionsFound.add(currentSectionName);
      } else {
        // Keep the tab title as subcategory label even if it maps to a general section
        currentSubcategory = currentTabName;
      }
      continue;
    }

    // 2. Scan line for video URLs
    const lineUrls = extractUrlsFromText(line);
    const textWithoutUrls = stripUrlsFromText(line)
      .replace(/[|•\-:,"']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const lineSectionMatch = textWithoutUrls ? matchSectionFromText(textWithoutUrls) : null;

    if (lineUrls.length === 0) {
      if (lineSectionMatch) {
        currentSection = lineSectionMatch.section;
        currentSectionName = lineSectionMatch.sectionName;
        currentSubcategory = lineSectionMatch.categoryTag;
        sectionsFound.add(currentSectionName);
      }
      continue;
    }

    const effectiveSection = lineSectionMatch?.section || currentSection;
    const effectiveSectionName = lineSectionMatch?.sectionName || currentSectionName;
    const effectiveCategory = lineSectionMatch?.categoryTag || currentSubcategory;
    sectionsFound.add(effectiveSectionName);

    const tabStat = ensureTabStat(currentTabName);

    for (const rawUrl of lineUrls) {
      const cleanUrl = rawUrl.trim();
      const norm = normalizeVideoUrl(cleanUrl);

      if (!norm.platform) continue;
      rawOccurrences++;
      tabStat.raw++;
      tabStat.uniqueKeys.add(norm.canonicalKey);

      const existingDocRecord = docOccurrences.get(norm.canonicalKey);
      if (existingDocRecord) {
        existingDocRecord.occurrences++;
        if (!existingDocRecord.sections.includes(effectiveSectionName)) {
          existingDocRecord.sections.push(effectiveSectionName);
        }
        if (!existingDocRecord.tabs.includes(currentTabName)) {
          existingDocRecord.tabs.push(currentTabName);
        }
      } else {
        docOccurrences.set(norm.canonicalKey, {
          url: cleanUrl,
          canonicalKey: norm.canonicalKey,
          sections: [effectiveSectionName],
          tabs: [currentTabName],
          occurrences: 1,
        });
      }

      // Backfill sourceTab on existing video if it didn't have one yet
      const existingMatch = existingVideoByKey.get(norm.canonicalKey);
      if (existingMatch && !existingMatch.sourceTab && currentTabName !== 'Main') {
        existingMatch.sourceTab = currentTabName;
      }

      const alreadyInDeck = existingKeys.has(norm.canonicalKey);

      if (!alreadyInDeck || includeDuplicates) {
        existingKeys.add(norm.canonicalKey);

        const newIndex = newlyAddedVideos.length + 1;
        let videoTitle = `${effectiveCategory} Reference #${newIndex}`;
        if (textWithoutUrls.length >= 3 && textWithoutUrls.length <= 75) {
          videoTitle = textWithoutUrls;
        }

        newlyAddedVideos.push({
          id: `synced-video-${Date.now()}-${newIndex}`,
          title: videoTitle,
          section: effectiveSection,
          sectionName: effectiveSectionName,
          categoryTag: effectiveCategory,
          url: cleanUrl,
          platform: norm.platform,
          embedId: norm.embedId || cleanUrl,
          durationEst: '15-30s',
          hook: '',
          isNewlySynced: !replaceExisting,
          sourceTab: currentTabName !== 'Main' ? currentTabName : undefined,
        });
      }
    }
  }

  const duplicateDetails = Array.from(docOccurrences.values()).filter((d) => d.occurrences > 1);
  const totalDetected = docOccurrences.size;
  const duplicateInDocCount = rawOccurrences - totalDetected;

  const tabSummaries: TabScanSummary[] = Array.from(tabStatsMap.entries()).map(([title, stat]) => ({
    title,
    linkCount: stat.raw,
    uniqueLinkCount: stat.uniqueKeys.size,
  }));

  const cleanedExisting =
    !replaceExisting && newlyAddedVideos.length > 0
      ? baseVideos.map((v) => (v.isNewlySynced ? { ...v, isNewlySynced: false } : v))
      : baseVideos;

  return {
    syncedVideos: [...newlyAddedVideos, ...cleanedExisting],
    newCount: newlyAddedVideos.length,
    sectionsFound: Array.from(sectionsFound),
    totalDetected,
    rawOccurrences,
    duplicateInDocCount,
    duplicateDetails,
    tabSummaries,
  };
}
