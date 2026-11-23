import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Check, 
  StickyNote, 
  Film,
  Sparkles
} from 'lucide-react';
import { VideoReference } from '../data/shootData';
import { VideoEmbedPlayer } from './VideoEmbedPlayer';
import { ShotStatus } from './VideoCard';

interface DirectorDrawerProps {
  video: VideoReference | null;
  allVideos: VideoReference[];
  status: ShotStatus;
  userNote: string;
  onClose: () => void;
  onSelectVideo: (video: VideoReference) => void;
  onStatusChange: (id: string, status: ShotStatus) => void;
  onSaveNote: (id: string, note: string) => void;
}

export const DirectorDrawer: React.FC<DirectorDrawerProps> = ({
  video,
  allVideos,
  status,
  userNote,
  onClose,
  onSelectVideo,
  onStatusChange,
  onSaveNote,
}) => {
  if (!video) return null;

  const currentIndex = allVideos.findIndex((v) => v.id === video.id);
  const prevVideo = currentIndex > 0 ? allVideos[currentIndex - 1] : null;
  const nextVideo = currentIndex < allVideos.length - 1 ? allVideos[currentIndex + 1] : null;

  const [noteText, setNoteText] = useState(userNote);
  const [hasUnsavedNote, setHasUnsavedNote] = useState(false);

  useEffect(() => {
    setNoteText(userNote);
    setHasUnsavedNote(false);
  }, [video.id, userNote]);

  // Keyboard navigation: ArrowLeft / ArrowRight to switch videos, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && prevVideo) {
        onSelectVideo(prevVideo);
      } else if (e.key === 'ArrowRight' && nextVideo) {
        onSelectVideo(nextVideo);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevVideo, nextVideo, onClose, onSelectVideo]);

  const handleSaveNote = () => {
    onSaveNote(video.id, noteText);
    setHasUnsavedNote(false);
  };

  const isWrapped = status === 'wrapped';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 lg:p-8 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-neutral-950 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg font-mono text-xs font-semibold shrink-0">
              <Film className="w-3.5 h-3.5" />
              {currentIndex + 1} of {allVideos.length}
            </span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-neutral-100 truncate">
                {video.title}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono flex-wrap">
                <span className="text-amber-400">{video.sectionName}</span>
                {video.sourceTab && (
                  <>
                    <span>·</span>
                    <span className="text-neutral-300">Tab: {video.sourceTab}</span>
                  </>
                )}
                <span>·</span>
                <span className="capitalize">{video.platform}</span>
                <span>·</span>
                <span>{video.durationEst}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Prev / Next buttons */}
            <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 text-xs">
              <button
                disabled={!prevVideo}
                onClick={() => prevVideo && onSelectVideo(prevVideo)}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                  prevVideo 
                    ? 'text-neutral-200 hover:bg-neutral-800' 
                    : 'text-neutral-600 cursor-not-allowed'
                }`}
                title="Previous video (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>
              <button
                disabled={!nextVideo}
                onClick={() => nextVideo && onSelectVideo(nextVideo)}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                  nextVideo 
                    ? 'text-neutral-200 hover:bg-neutral-800' 
                    : 'text-neutral-600 cursor-not-allowed'
                }`}
                title="Next video (Right Arrow)"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg transition-colors ml-1"
              title="Close theater view (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Large Video Centerpiece + Quick Info */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6 items-stretch justify-center bg-neutral-950">
          {/* Main Video Embed Player */}
          <div className="flex-1 max-w-md mx-auto w-full flex flex-col">
            <div className="h-[520px] sm:h-[580px] w-full bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 shadow-xl">
              <VideoEmbedPlayer video={video} inModal />
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="w-full md:w-80 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Status Done Toggle */}
              <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-neutral-400">Shoot Status:</span>
                  <span className={`font-semibold ${isWrapped ? 'text-emerald-400' : 'text-neutral-400'}`}>
                    {isWrapped ? 'Filmed / Completed ✓' : 'To Shoot'}
                  </span>
                </div>

                <button
                  onClick={() => onStatusChange(video.id, isWrapped ? 'todo' : 'wrapped')}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    isWrapped
                      ? 'bg-emerald-500 text-neutral-950 shadow-md hover:bg-emerald-400'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isWrapped ? 'Marked as Done ✓' : 'Mark as Shot / Done'}</span>
                </button>
              </div>

              {/* Source Link */}
              <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-2">
                <span className="text-[11px] font-mono uppercase text-neutral-500 block">
                  Original Source Link:
                </span>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 rounded-lg text-xs font-mono flex items-center justify-between border border-neutral-800 transition-colors"
                >
                  <span className="truncate mr-2">{video.url}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>

              {/* Personal Notes */}
              <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-neutral-400 flex items-center gap-1.5">
                    <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                    <span>Shoot Notes:</span>
                  </span>
                  {hasUnsavedNote && (
                    <span className="text-[10px] text-amber-400 font-mono">Unsaved</span>
                  )}
                </div>

                <textarea
                  value={noteText}
                  onChange={(e) => {
                    setNoteText(e.target.value);
                    setHasUnsavedNote(true);
                  }}
                  placeholder="Type any quick note for this reference..."
                  className="w-full text-xs p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500 resize-none h-24"
                />

                <button
                  disabled={!hasUnsavedNote}
                  onClick={handleSaveNote}
                  className={`w-full py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    hasUnsavedNote
                      ? 'bg-amber-500 text-neutral-950 hover:bg-amber-400'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  Save Note
                </button>
              </div>
            </div>

            {/* Quick Navigation Footer */}
            <div className="pt-2 text-center text-[11px] font-mono text-neutral-500">
              Use Left / Right arrow keys to browse references
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
