import React, { useState } from 'react';
import { 
  Check, 
  ExternalLink, 
  Maximize2, 
  StickyNote, 
  Layers
} from 'lucide-react';
import { VideoReference } from '../data/shootData';
import { VideoEmbedPlayer } from './VideoEmbedPlayer';

export type ShotStatus = 'todo' | 'shooting' | 'wrapped';

interface VideoCardProps {
  video: VideoReference;
  status: ShotStatus;
  userNote: string;
  onStatusChange: (id: string, status: ShotStatus) => void;
  onSaveNote: (id: string, note: string) => void;
  onOpenDrawer: (video: VideoReference) => void;
  layoutMode?: 'grid' | 'wide';
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  status,
  userNote,
  onStatusChange,
  onSaveNote,
  onOpenDrawer,
  layoutMode = 'grid'
}) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState(userNote);

  const handleSaveNote = () => {
    onSaveNote(video.id, tempNote);
    setIsEditingNote(false);
  };

  const isWrapped = status === 'wrapped';

  // Render Grid Card (Standard gallery card)
  if (layoutMode === 'grid') {
    return (
      <div
        id={`video-${video.id}`}
        className={`group flex flex-col bg-neutral-900/90 border rounded-2xl overflow-hidden transition-all duration-200 shadow-md hover:shadow-xl ${
          isWrapped
            ? 'border-emerald-500/40 bg-neutral-900/50 opacity-95'
            : 'border-neutral-800 hover:border-amber-500/50'
        }`}
      >
        {/* Card Header */}
        <div className="p-3.5 sm:p-4 bg-neutral-950/90 border-b border-neutral-800/80 flex items-start justify-between gap-2.5">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-semibold uppercase tracking-wider">
                {video.sectionName}
              </span>
              {video.sourceTab && (
                <span
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-neutral-800/90 text-neutral-300 border border-neutral-700/80 text-[10px] font-mono max-w-[140px] truncate"
                  title={`From tab: ${video.sourceTab}`}
                >
                  <Layers className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span className="truncate">{video.sourceTab}</span>
                </span>
              )}
              {video.isNewlySynced && (
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  New
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-neutral-100 group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
              {video.title}
            </h3>
          </div>

          {/* Quick Mark Done Button */}
          <button
            onClick={() => onStatusChange(video.id, isWrapped ? 'todo' : 'wrapped')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
              isWrapped
                ? 'bg-emerald-500 text-neutral-950 shadow-sm hover:bg-emerald-400'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
            title={isWrapped ? 'Mark as to shoot' : 'Mark as done / shot'}
          >
            <Check className={`w-3.5 h-3.5 stroke-[3] ${isWrapped ? 'text-neutral-950' : 'text-neutral-400'}`} />
            <span className="hidden sm:inline">{isWrapped ? 'Done' : 'Mark Done'}</span>
          </button>
        </div>

        {/* Embedded Video Player */}
        <div className="p-3 bg-neutral-950 flex-1 flex flex-col justify-center">
          <VideoEmbedPlayer video={video} onOpenModal={() => onOpenDrawer(video)} />
        </div>

        {/* Card Footer Actions */}
        <div className="p-3 bg-neutral-900/80 border-t border-neutral-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => onOpenDrawer(video)}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 transition-colors"
              title="Expand to theater player"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Theater View</span>
            </button>

            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-neutral-200 flex items-center gap-1 text-[11px] font-mono hover:underline"
              title="Open source link in new tab"
            >
              <span>Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Notes Preview / Edit */}
          {isEditingNote ? (
            <div className="space-y-1.5 pt-1">
              <textarea
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                placeholder="Add note for this reference..."
                className="w-full text-xs p-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none h-14"
              />
              <div className="flex justify-end gap-1.5 text-xs">
                <button
                  onClick={() => {
                    setTempNote(userNote);
                    setIsEditingNote(false);
                  }}
                  className="px-2 py-0.5 text-neutral-400 hover:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-2.5 py-0.5 bg-amber-500 text-neutral-950 font-bold rounded"
                >
                  Save
                </button>
              </div>
            </div>
          ) : userNote ? (
            <div 
              onClick={() => setIsEditingNote(true)}
              className="flex items-start gap-1.5 text-xs text-neutral-300 bg-neutral-950/70 p-2 rounded-lg border border-neutral-800 cursor-pointer hover:border-neutral-700"
              title="Click to edit note"
            >
              <StickyNote className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
              <span className="italic text-[11px] line-clamp-1">{userNote}</span>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingNote(true)}
              className="text-[11px] text-neutral-500 hover:text-neutral-300 font-mono block text-left"
            >
              + Add note
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render Wide Card (Side-by-side)
  return (
    <div
      id={`video-${video.id}`}
      className={`group relative bg-neutral-900/90 border rounded-2xl overflow-hidden transition-all duration-200 shadow-lg ${
        isWrapped
          ? 'border-emerald-500/30 bg-neutral-900/60 opacity-90'
          : 'border-neutral-800 hover:border-neutral-700'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 divide-y md:divide-y-0 md:divide-x divide-neutral-800/80">
        {/* Left Side: Direct In-Page Video Player */}
        <div className="md:col-span-5 p-4 sm:p-5 bg-neutral-950 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 text-xs font-mono text-neutral-400">
              <span className="text-amber-400 font-semibold">{video.sectionName}</span>
              <span className="text-neutral-500">{video.durationEst}</span>
            </div>

            <VideoEmbedPlayer video={video} onOpenModal={() => onOpenDrawer(video)} />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-neutral-800/60">
            <span className="text-neutral-500 font-mono text-[11px] capitalize">
              {video.platform} Reference
            </span>
            <button
              onClick={() => onOpenDrawer(video)}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Theater View</span>
            </button>
          </div>
        </div>

        {/* Right Side: Clean Video Info & Status Controls */}
        <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    {video.categoryTag}
                  </span>
                  {video.sourceTab && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700 text-[10px] font-mono">
                      <Layers className="w-2.5 h-2.5 text-amber-400" />
                      <span>{video.sourceTab}</span>
                    </span>
                  )}
                  {video.isNewlySynced && (
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                      New
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-100 group-hover:text-amber-400 transition-colors leading-snug">
                  {video.title}
                </h3>
              </div>

              {/* Status Done Toggle */}
              <button
                onClick={() => onStatusChange(video.id, isWrapped ? 'todo' : 'wrapped')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
                  isWrapped
                    ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                }`}
              >
                <Check className={`w-3.5 h-3.5 stroke-[3] ${isWrapped ? 'text-neutral-950' : 'text-neutral-400'}`} />
                <span>{isWrapped ? 'Done' : 'Mark Done'}</span>
              </button>
            </div>

            {/* Direct Link Information Card */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 flex items-center justify-between text-xs">
              <div className="space-y-0.5 max-w-[80%]">
                <span className="text-[11px] font-mono text-neutral-500 uppercase block">
                  Original Source:
                </span>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-amber-400 truncate block font-mono text-xs hover:underline"
                >
                  {video.url}
                </a>
              </div>

              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-amber-400 rounded-lg border border-neutral-800 transition-colors"
                title="Open in new window"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Notes Section */}
          <div className="pt-3 border-t border-neutral-800/80 space-y-2">
            {isEditingNote ? (
              <div className="space-y-2">
                <textarea
                  value={tempNote}
                  onChange={(e) => setTempNote(e.target.value)}
                  placeholder="Add a quick note for this video..."
                  className="w-full text-xs p-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none h-16"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setTempNote(userNote);
                      setIsEditingNote(false);
                    }}
                    className="px-2.5 py-1 text-xs text-neutral-400 hover:text-neutral-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs">
                {userNote ? (
                  <div className="flex items-start gap-2 text-neutral-300 bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800 flex-1 mr-2">
                    <StickyNote className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="italic text-xs">{userNote}</span>
                  </div>
                ) : (
                  <span className="text-neutral-500 text-[11px] font-mono">No notes added</span>
                )}
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium shrink-0"
                >
                  {userNote ? 'Edit note' : '+ Add note'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
