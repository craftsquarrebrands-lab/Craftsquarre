import React from 'react';
import { 
  Clapperboard, 
  Search, 
  Check, 
  FileText,
  RefreshCw,
  Plus,
  ExternalLink
} from 'lucide-react';
import { VideoReference } from '../data/shootData';
import { ShotStatus } from './VideoCard';

interface HeaderProps {
  allVideos: VideoReference[];
  statuses: Record<string, ShotStatus>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenDocSync: () => void;
  isDocSynced: boolean;
  isSyncing: boolean;
  onQuickSync: () => void;
  lastSyncedAt: Date | null;
  docTitle: string;
  onOpenChecklist?: () => void;
  onOpenAddVideo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  allVideos,
  statuses,
  searchQuery,
  onSearchChange,
  onOpenDocSync,
  isDocSynced,
  isSyncing,
  onQuickSync,
  lastSyncedAt,
  docTitle,
  onOpenChecklist,
  onOpenAddVideo
}) => {
  const wrappedCount = Object.values(statuses).filter((s) => s === 'wrapped').length;
  const totalVideos = allVideos.length;
  const progressPercent = totalVideos > 0 ? Math.round((wrappedCount / totalVideos) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 shadow-md">
              <Clapperboard className="w-5 h-5 text-neutral-950 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-neutral-100">
                  Craftsquarre
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold hidden sm:inline">
                  Shoot References
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono hidden sm:block">
                In-Page Reference Video Deck
              </p>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search reference videos..."
                className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 text-xs px-1 cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Quick 1-Click Sync Button */}
            <button
              onClick={onQuickSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-amber-500/40 transition-all cursor-pointer shadow-sm"
              title="Sync now with Google Document / Spreadsheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>

            {/* Google Doc / Sheet Settings Button */}
            <button
              onClick={onOpenDocSync}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
                isDocSynced
                  ? 'bg-neutral-900/90 text-emerald-400 border-emerald-500/30 hover:bg-neutral-800 hover:border-emerald-500/50'
                  : 'bg-neutral-900/90 text-amber-400 border-neutral-800 hover:bg-neutral-800 hover:border-amber-500/40'
              }`}
              title="Google Doc & Sheet Link Configuration"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${isDocSynced ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden md:inline font-mono text-[11px]">
                {isDocSynced ? 'Sheet Synced' : 'Connect Sheet'}
              </span>
            </button>

            {/* Quick + Add Video Button */}
            <button
              onClick={onOpenAddVideo}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              title="Add a new video link directly"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Link</span>
            </button>

            {/* Shoot Progress Badge */}
            <div 
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono"
              title={`${wrappedCount} of ${totalVideos} reference videos shot`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">{wrappedCount}</span>
                <span className="text-neutral-600">/</span>
                <span className="text-neutral-300">{totalVideos}</span>
                <span className="text-neutral-500 text-[11px]">Shot</span>
              </div>
              <div className="w-10 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Optional Shoot Checklist Button */}
            {onOpenChecklist && (
              <button
                onClick={onOpenChecklist}
                className="p-2 sm:px-2.5 sm:py-1.5 text-neutral-400 hover:text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs transition-colors cursor-pointer"
                title="Shoot Preparation Checklist"
              >
                <FileText className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline font-medium">Checklist</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
