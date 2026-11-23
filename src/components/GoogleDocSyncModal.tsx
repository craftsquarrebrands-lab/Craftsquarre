import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Clock,
  ClipboardPaste,
  PlusCircle,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Copy,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  clearAccessToken,
} from '../services/googleAuth';
import {
  extractResourceInfo,
  fetchGoogleDoc,
  parseDocumentAndSyncVideos,
  normalizeVideoUrl,
  AuthRequiredError,
  DuplicateLinkInfo,
  TabScanSummary,
} from '../services/googleDocsSync';
import { VideoReference } from '../data/shootData';

interface GoogleDocSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  hasValidToken: boolean;
  onAuthChange: (user: User | null, hasToken: boolean) => void;
  documentUrl: string;
  onDocumentUrlChange: (url: string) => void;
  lastSyncedAt: Date | null;
  docTitle: string;
  autoSyncEnabled: boolean;
  onAutoSyncToggle: (enabled: boolean) => void;
  currentVideos: VideoReference[];
  onVideosUpdated: (updated: VideoReference[], newCount: number, title?: string) => void;
}

export const GoogleDocSyncModal: React.FC<GoogleDocSyncModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  hasValidToken,
  onAuthChange,
  documentUrl,
  onDocumentUrlChange,
  lastSyncedAt,
  docTitle,
  autoSyncEnabled,
  onAutoSyncToggle,
  currentVideos,
  onVideosUpdated,
}) => {
  const [inputUrl, setInputUrl] = useState(documentUrl);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [duplicateDetails, setDuplicateDetails] = useState<DuplicateLinkInfo[]>([]);
  const [tabSummaries, setTabSummaries] = useState<TabScanSummary[]>([]);
  const [usedPublicFallback, setUsedPublicFallback] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [includeDuplicates, setIncludeDuplicates] = useState(false);
  const [activeTab, setActiveTab] = useState<'url' | 'paste' | 'single'>('url');
  const [pastedDocText, setPastedDocText] = useState('');

  // Single video quick add state
  const [singleUrl, setSingleUrl] = useState('');
  const [singleTitle, setSingleTitle] = useState('');
  const [singleSection, setSingleSection] = useState<VideoReference['section']>('ugc-bags');

  useEffect(() => {
    setInputUrl(documentUrl);
  }, [documentUrl]);

  if (!isOpen) return null;

  const resourceInfo = extractResourceInfo(inputUrl);

  const handleGoogleSignIn = async (forceConsent = false) => {
    setIsSigningIn(true);
    setSyncError(null);
    try {
      const result = await googleSignIn(forceConsent);
      if (result) {
        onAuthChange(result.user, true);
        setUsedPublicFallback(false);
        setSyncStatusMsg(`Signed in as ${result.user.email}. Syncing all tabs...`);
        if (inputUrl.trim() && extractResourceInfo(inputUrl)) {
          await executeSync(inputUrl, result.accessToken);
        }
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setSyncError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await logoutGoogle();
    onAuthChange(null, false);
    setSyncStatusMsg('Signed out of Google account');
  };

  const executeSync = async (
    targetUrl?: string,
    explicitToken?: string | null,
    syncOpts?: { includeDuplicates?: boolean; replaceExisting?: boolean }
  ) => {
    const urlToUse = (targetUrl ?? inputUrl).trim();
    if (!urlToUse) {
      setSyncError('Please paste your Google Document or Google Sheet link first.');
      return;
    }

    const info = extractResourceInfo(urlToUse);
    if (!info) {
      setSyncError(
        'Invalid link. Paste a Google Docs (docs.google.com/document/d/...) or Google Sheets (docs.google.com/spreadsheets/d/...) link.'
      );
      return;
    }

    setIsSyncing(true);
    setSyncError(null);
    setSyncStatusMsg(null);
    setDuplicateDetails([]);
    setTabSummaries([]);
    setUsedPublicFallback(false);

    try {
      onDocumentUrlChange(urlToUse);

      let token = explicitToken !== undefined ? explicitToken : await getAccessToken();
      let docData;

      // For Google Sheets without an active token, try public multi-tab sync first
      // so crew members on other phones can sync publicly shared sheets without signing in
      if (!token && info.type === 'spreadsheet') {
        try {
          docData = await fetchGoogleDoc(urlToUse, null, { allowSingleTabFallback: false });
        } catch {
          // Sheet requires authentication — fall through to Google Sign-In
        }
      }

      if (!docData) {
        if (!token) {
          try {
            const authResult = await googleSignIn();
            if (authResult) {
              token = authResult.accessToken;
              onAuthChange(authResult.user, true);
            }
          } catch (signInErr: any) {
            console.warn('Sign-in dismissed or failed, attempting public fallback:', signInErr);
          }
        }

        try {
          docData = await fetchGoogleDoc(urlToUse, token);
        } catch (err: any) {
          if (err instanceof AuthRequiredError || (err as any)?.needsAuth) {
            clearAccessToken();
            onAuthChange(currentUser, false);
            // Force consent prompt so Google grants both Docs & Sheets scopes
            const refreshed = await googleSignIn(true);
            if (!refreshed) {
              throw err;
            }
            onAuthChange(refreshed.user, true);
            docData = await fetchGoogleDoc(urlToUse, refreshed.accessToken);
          } else {
            throw err;
          }
        }
      }

      const useIncludeDuplicates = syncOpts?.includeDuplicates ?? includeDuplicates;
      const useReplaceExisting = syncOpts?.replaceExisting ?? false;

      const parsed = parseDocumentAndSyncVideos(docData.text, currentVideos, {
        includeDuplicates: useIncludeDuplicates,
        replaceExisting: useReplaceExisting,
      });

      onVideosUpdated(parsed.syncedVideos, parsed.newCount, docData.title);
      setDuplicateDetails(parsed.duplicateDetails);
      setTabSummaries(parsed.tabSummaries);
      setUsedPublicFallback(docData.usedPublicFallback);

      const tabLabel = `${docData.tabCount} ${docData.tabCount === 1 ? 'tab' : 'tabs'}`;
      const dupNote =
        parsed.duplicateInDocCount > 0 && !useIncludeDuplicates
          ? ` (${parsed.duplicateInDocCount} duplicate link${parsed.duplicateInDocCount > 1 ? 's' : ''} merged)`
          : '';

      if (useReplaceExisting) {
        setSyncStatusMsg(
          `Fresh sync from "${docData.title}" (${tabLabel}): Loaded ${parsed.syncedVideos.length} videos${dupNote}.`
        );
      } else if (parsed.newCount > 0) {
        setSyncStatusMsg(
          `Synced "${docData.title}" (${tabLabel}): Added ${parsed.newCount} new video${parsed.newCount > 1 ? 's' : ''}. Found ${parsed.totalDetected} unique links (${parsed.rawOccurrences} total rows)${dupNote}.`
        );
      } else {
        setSyncStatusMsg(
          `Synced "${docData.title}" (${tabLabel}): ${parsed.totalDetected} unique video links (${parsed.rawOccurrences} total rows)${dupNote} — all up to date.`
        );
      }
    } catch (err: any) {
      console.error('Sync failed:', err);
      setSyncError(err.message || 'Failed to sync. Please sign in with Google and try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePasteSync = () => {
    if (!pastedDocText.trim()) {
      setSyncError('Please paste your Google Sheet / Document text or links below.');
      return;
    }

    setIsSyncing(true);
    setSyncError(null);
    setDuplicateDetails([]);

    try {
      const parsed = parseDocumentAndSyncVideos(pastedDocText, currentVideos, {
        includeDuplicates,
      });

      onVideosUpdated(parsed.syncedVideos, parsed.newCount);
      setDuplicateDetails(parsed.duplicateDetails);

      const dupNote =
        parsed.duplicateInDocCount > 0 && !includeDuplicates
          ? ` (${parsed.duplicateInDocCount} duplicate link${parsed.duplicateInDocCount > 1 ? 's' : ''} merged)`
          : '';

      if (parsed.newCount > 0) {
        setSyncStatusMsg(
          `Added ${parsed.newCount} new reference video${parsed.newCount > 1 ? 's' : ''} to the top! (${parsed.totalDetected} unique links found${dupNote})`
        );
        setPastedDocText('');
      } else {
        setSyncStatusMsg(
          `Found ${parsed.totalDetected} unique video links${dupNote}. All references are already present.`
        );
      }
    } catch {
      setSyncError('Failed to parse text. Please ensure valid URLs.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddSingleVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleUrl.trim()) return;

    const norm = normalizeVideoUrl(singleUrl);

    const sectionLabels: Record<VideoReference['section'], string> = {
      'ugc-bags': 'Bags & Ankara',
      'ugc-shoes': 'Shoes & Footwear',
      'ugc-slippers': 'Slippers & Slides',
      'ugc-drinks': 'Healthy Drinks',
      'ugc-food': 'Food (Parfait etc)',
      'ugc-asmr': 'ASMR Drinks',
      'ugc-fashion': 'Fashion & Outfits',
      'scripted-ads': 'Scripted Launch Ads',
      launch: 'Launch Announcements',
      'pre-launch': 'Pre-Launch Teasers',
    };

    const newVideo: VideoReference = {
      id: `manual-video-${Date.now()}`,
      title: singleTitle.trim() || `${sectionLabels[singleSection]} Reference`,
      section: singleSection,
      sectionName: sectionLabels[singleSection],
      categoryTag: sectionLabels[singleSection],
      url: singleUrl.trim(),
      platform: norm.platform || 'instagram',
      embedId: norm.embedId || singleUrl.trim(),
      durationEst: '15-30s',
      hook: '',
      isNewlySynced: true,
    };

    onVideosUpdated([newVideo, ...currentVideos], 1);
    setSyncStatusMsg(`Added "${newVideo.title}" to ${sectionLabels[singleSection]}!`);
    setSingleUrl('');
    setSingleTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-100 flex items-center gap-2">
                Sync Google Doc / Sheet Links
              </h3>
              <p className="text-xs text-neutral-400">
                Reads all tabs from your Google Document or Google Sheet automatically
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* User Auth Section */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-neutral-300 uppercase">
                  1. Google Account Connection
                </span>
                <p className="text-[11px] text-neutral-500">
                  Required for private files &amp; Google Docs. Public Google Sheets (&ldquo;Anyone with the link can view&rdquo;) can sync all tabs without signing in.
                </p>
              </div>

              {currentUser && hasValidToken && (
                <button
                  onClick={handleGoogleSignOut}
                  className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              )}
            </div>

            {currentUser && hasValidToken ? (
              <div className="flex items-center gap-2.5 p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  Connected as <strong className="text-emerald-200">{currentUser.email}</strong>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleGoogleSignIn(false)}
                disabled={isSigningIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-neutral-100 text-neutral-900 rounded-xl font-medium text-xs transition-colors shadow-sm cursor-pointer border border-neutral-300"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isSigningIn ? 'Signing in...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>

          {/* Sync Mode Tabs: URL vs Paste vs Single Add */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 text-xs">
              <button
                onClick={() => setActiveTab('url')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'url'
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Google Link (Doc / Sheet)
              </button>
              <button
                onClick={() => setActiveTab('paste')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'paste'
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                Quick Paste Links
              </button>
              <button
                onClick={() => setActiveTab('single')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'single'
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                + Add Single Link
              </button>
            </div>

            {/* TAB 1: Document / Spreadsheet URL */}
            {activeTab === 'url' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                    <label>2. Google Document or Spreadsheet Link:</label>
                    {resourceInfo && (
                      <span className="text-amber-400 font-semibold uppercase text-[10px]">
                        Detected: Google {resourceInfo.type}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://docs.google.com/document/d/... or /spreadsheets/d/..."
                      className="flex-1 text-xs bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <button
                      onClick={() => executeSync()}
                      disabled={isSyncing}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-sm cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                    </button>
                  </div>
                </div>

                {/* Options row: Auto-Sync + Duplicate Handling */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
                    <div className="space-y-0.5 pr-2">
                      <span className="font-medium text-neutral-200 block">
                        Auto-Poll (30s)
                      </span>
                      <p className="text-[11px] text-neutral-500">
                        Pull new links while open
                      </p>
                    </div>
                    <button
                      onClick={() => onAutoSyncToggle(!autoSyncEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                        autoSyncEnabled ? 'bg-amber-500' : 'bg-neutral-800'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoSyncEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
                    <div className="space-y-0.5 pr-2">
                      <span className="font-medium text-neutral-200 block">
                        Keep Repeated Links
                      </span>
                      <p className="text-[11px] text-neutral-500">
                        Show links pasted more than once
                      </p>
                    </div>
                    <button
                      onClick={() => setIncludeDuplicates(!includeDuplicates)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                        includeDuplicates ? 'bg-amber-500' : 'bg-neutral-800'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          includeDuplicates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Fresh rebuild action */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500">
                  <span>Want the deck to mirror only your current doc/sheet rows?</span>
                  <button
                    onClick={() => executeSync(undefined, undefined, { includeDuplicates, replaceExisting: true })}
                    disabled={isSyncing || !inputUrl.trim()}
                    className="text-amber-400 hover:text-amber-300 font-medium underline cursor-pointer disabled:opacity-40"
                  >
                    Fresh Rebuild from Link
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Quick Text Paste */}
            {activeTab === 'paste' && (
              <div className="space-y-3">
                <label className="text-xs font-mono text-neutral-300">
                  Paste updated text, table rows, or video URLs from your sheet:
                </label>
                <textarea
                  value={pastedDocText}
                  onChange={(e) => setPastedDocText(e.target.value)}
                  placeholder="Paste rows, tabs or links here (e.g. https://www.instagram.com/reel/...)..."
                  className="w-full text-xs p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500 resize-none h-32 font-mono"
                />
                <button
                  onClick={handlePasteSync}
                  disabled={isSyncing || !pastedDocText.trim()}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Parse Links & Update Deck</span>
                </button>
              </div>
            )}

            {/* TAB 3: Add Single Video Reference */}
            {activeTab === 'single' && (
              <form onSubmit={handleAddSingleVideo} className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs">
                <div>
                  <label className="block text-neutral-400 font-mono mb-1">Video Reference URL:</label>
                  <input
                    type="url"
                    required
                    value={singleUrl}
                    onChange={(e) => setSingleUrl(e.target.value)}
                    placeholder="https://www.instagram.com/reel/... or TikTok / YouTube link"
                    className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 font-mono mb-1">Title / Shot Description:</label>
                    <input
                      type="text"
                      value={singleTitle}
                      onChange={(e) => setSingleTitle(e.target.value)}
                      placeholder="e.g. Ankara Bag Texture Close-Up"
                      className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-mono mb-1">Target Section:</label>
                    <select
                      value={singleSection}
                      onChange={(e) => setSingleSection(e.target.value as VideoReference['section'])}
                      className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="ugc-bags">Bags & Ankara</option>
                      <option value="ugc-shoes">Shoes & Footwear</option>
                      <option value="ugc-slippers">Slippers & Slides</option>
                      <option value="ugc-drinks">Healthy Drinks</option>
                      <option value="ugc-food">Food (Parfait etc)</option>
                      <option value="ugc-asmr">ASMR Drinks</option>
                      <option value="ugc-fashion">Fashion & Outfits</option>
                      <option value="scripted-ads">Scripted Launch Ads</option>
                      <option value="launch">Launch Announcements</option>
                      <option value="pre-launch">Pre-Launch Teasers</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!singleUrl.trim()}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-2"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Video to Reference Deck</span>
                </button>
              </form>
            )}
          </div>

          {/* Status / Error Alerts */}
          {syncError && (
            <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{syncError}</span>
            </div>
          )}

          {/* Public Fallback Single-Tab Warning */}
          {usedPublicFallback && (
            <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-2.5 text-xs text-amber-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-amber-300">
                    Only Tab 1 was read (Public Link Mode)
                  </p>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    Google&apos;s public export only includes the first tab. Sign in with Google so the app can read <strong>every tab</strong> in your Document or Sheet.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleGoogleSignIn(true)}
                disabled={isSigningIn || isSyncing}
                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                {isSigningIn ? 'Signing in...' : 'Sign in with Google to Read All Tabs'}
              </button>
            </div>
          )}

          {syncStatusMsg && (
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3 text-xs text-emerald-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{syncStatusMsg}</span>
              </div>

              {/* Per-Tab Breakdown */}
              {tabSummaries.length > 0 && (
                <div className="pt-2 border-t border-emerald-500/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-300">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tabs scanned ({tabSummaries.length}):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tabSummaries.map((tab) => (
                      <span
                        key={tab.title}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-neutral-950/90 border border-neutral-800 text-[11px] font-mono text-neutral-200"
                      >
                        <span className="truncate max-w-[160px]">{tab.title}</span>
                        <span className="text-amber-400 font-bold">{tab.uniqueLinkCount}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {duplicateDetails.length > 0 && (
                <div className="pt-2 border-t border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <button
                      onClick={() => setShowDuplicates(!showDuplicates)}
                      className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 hover:text-amber-200 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>
                        {duplicateDetails.length} link{duplicateDetails.length > 1 ? 's' : ''} appeared multiple times
                      </span>
                      {showDuplicates ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {!includeDuplicates && activeTab === 'url' && (
                      <button
                        onClick={() => {
                          setIncludeDuplicates(true);
                          executeSync(undefined, undefined, { includeDuplicates: true, replaceExisting: true });
                        }}
                        disabled={isSyncing}
                        className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                      >
                        Include Repeated Links &amp; Re-Sync
                      </button>
                    )}
                  </div>

                  {showDuplicates && (
                    <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-[11px] font-mono text-neutral-300">
                      {duplicateDetails.map((d) => (
                        <li key={d.canonicalKey} className="bg-neutral-950/80 border border-neutral-800 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-2">
                          <span className="truncate text-neutral-400">{d.url}</span>
                          <span className="shrink-0 text-amber-400">
                            ×{d.occurrences} ({d.tabs.length > 0 ? d.tabs.join(', ') : d.sections.join(', ')})
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sync Stats Footnote */}
          {lastSyncedAt && (
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Last Synced: {lastSyncedAt.toLocaleTimeString()}</span>
              </div>
              <div className="truncate max-w-[50%] text-neutral-300">
                {docTitle || 'Shoot Document'}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-[11px] text-neutral-500">
            Supports Multi-Tab Google Docs & Google Sheets
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl font-medium text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
