import React, { useState, useEffect } from 'react';
import { ExternalLink, Play, RefreshCw, Maximize2, AlertTriangle } from 'lucide-react';
import { VideoReference } from '../data/shootData';

interface VideoEmbedPlayerProps {
  video: VideoReference;
  inModal?: boolean;
  onOpenModal?: () => void;
}

export const VideoEmbedPlayer: React.FC<VideoEmbedPlayerProps> = ({
  video,
  inModal = false,
  onOpenModal,
}) => {
  // If inModal, load immediately. Otherwise, lazy-activate on click to prevent TikTok/Instagram rate-limit overload
  const [isActivated, setIsActivated] = useState(inModal);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsActivated(inModal);
    setLoadError(false);
    setIsLoading(true);
  }, [video.id, inModal]);

  const isTikTok = video.platform === 'tiktok';
  const isInstagram = video.platform === 'instagram';
  const isYouTube = video.platform === 'youtube';
  const isDrive = video.platform === 'drive';
  const isVimeo = video.platform === 'vimeo';

  const platformLabel =
    video.platform === 'drive'
      ? 'Google Drive'
      : video.platform === 'twitter'
      ? 'X / Twitter'
      : video.platform === 'youtube'
      ? 'YouTube'
      : video.platform === 'tiktok'
      ? 'TikTok'
      : video.platform === 'instagram'
      ? 'Instagram'
      : video.platform === 'facebook'
      ? 'Facebook'
      : video.platform === 'pinterest'
      ? 'Pinterest'
      : video.platform === 'vimeo'
      ? 'Vimeo'
      : 'Video';

  // TikTok's embed v2 iframe only accepts numeric video IDs (shortened vm/vt/t links cannot be embedded directly)
  const isTikTokShortLink = isTikTok && !/^\d+$/.test(video.embedId || '');
  const canEmbed =
    (isInstagram && !!video.embedId && !video.embedId.startsWith('http')) ||
    (isTikTok && /^\d+$/.test(video.embedId || '')) ||
    (isYouTube && !!video.embedId && !video.embedId.startsWith('http')) ||
    (isDrive && !!video.embedId && !video.embedId.startsWith('http')) ||
    (isVimeo && /^\d+$/.test(video.embedId || '')) ||
    video.platform === 'twitter';

  const getEmbedUrl = () => {
    if (isInstagram) {
      return `https://www.instagram.com/reel/${video.embedId}/embed/`;
    }
    if (isTikTok) {
      return `https://www.tiktok.com/embed/v2/${video.embedId}`;
    }
    if (isYouTube) {
      return `https://www.youtube.com/embed/${video.embedId}`;
    }
    if (isDrive) {
      return `https://drive.google.com/file/d/${video.embedId}/preview`;
    }
    if (isVimeo) {
      return `https://player.vimeo.com/video/${video.embedId}`;
    }
    if (video.platform === 'twitter') {
      return `https://twitframe.com/show?url=${encodeURIComponent(video.url)}`;
    }
    return video.url;
  };

  return (
    <div className={`relative flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-md ${inModal ? 'h-full' : ''}`}>
      {/* Top Player Control Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-neutral-950/90 border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-2">
          <span className={`flex h-2 w-2 rounded-full ${isActivated && canEmbed ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          <span className="font-mono text-neutral-300 text-[11px] font-semibold">
            {platformLabel} Reference
          </span>
          <span className="text-neutral-600 font-mono">·</span>
          <span className="text-neutral-400 font-mono text-[11px]">{video.durationEst}</span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenModal && !inModal && (
            <button
              onClick={onOpenModal}
              className="p-1 text-neutral-400 hover:text-amber-400 rounded transition-colors text-[11px] font-mono flex items-center gap-1 cursor-pointer"
              title="Expand to Cinema View"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Theater</span>
            </button>
          )}

          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-neutral-400 hover:text-amber-400 rounded transition-colors flex items-center gap-1 text-[11px] font-mono cursor-pointer"
            title="Open original video on platform"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Video Display Area */}
      <div className={`relative w-full bg-neutral-950 flex flex-col items-center justify-center ${inModal ? 'min-h-[540px] flex-1' : 'h-[460px]'}`}>
        {!canEmbed ? (
          <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
            <p className="text-sm font-medium text-neutral-200">
              {isTikTokShortLink ? 'Shortened TikTok Link' : `${platformLabel} Reference Link`}
            </p>
            <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
              {isTikTokShortLink
                ? 'Short mobile TikTok share links (vt/vm) cannot be embedded directly. Open it directly or paste the full tiktok.com/@.../video/... URL in your sheet.'
                : `${platformLabel} links open directly in a new tab for playback.`}
            </p>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5 mt-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Watch on {platformLabel}
            </a>
          </div>
        ) : !isActivated ? (
          // Sleek Lazy-Load Poster Card (Prevents TikTok "overload - protect triggered" rate limiting)
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-neutral-900/60 via-neutral-950 to-neutral-950 select-none">
            <div
              className={`absolute inset-0 opacity-15 pointer-events-none ${
                isTikTok
                  ? 'bg-[radial-gradient(circle_at_center,#00f2fe_0%,transparent_70%)]'
                  : isInstagram
                  ? 'bg-[radial-gradient(circle_at_center,#f09433_0%,transparent_70%)]'
                  : isYouTube
                  ? 'bg-[radial-gradient(circle_at_center,#ef4444_0%,transparent_70%)]'
                  : isDrive
                  ? 'bg-[radial-gradient(circle_at_center,#34a853_0%,transparent_70%)]'
                  : 'bg-[radial-gradient(circle_at_center,#f59e0b_0%,transparent_70%)]'
              }`}
            />

            <div className="relative z-10 flex flex-col items-center gap-4 max-w-xs">
              <button
                onClick={() => setIsActivated(true)}
                className="group w-16 h-16 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Play video directly on page"
              >
                <Play className="w-8 h-8 fill-current ml-1 group-hover:scale-110 transition-transform" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-neutral-200 block">
                  Click to Play In-Page
                </span>
                <p className="text-[11px] text-neutral-400 leading-tight">
                  Loads on-demand to prevent platform rate limits
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIsActivated(true)}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Load Player
                </button>
                {onOpenModal && (
                  <button
                    onClick={onOpenModal}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Theater</span>
                  </button>
                )}
              </div>
            </div>

            <div className="absolute bottom-3 text-[10px] font-mono text-neutral-600">
              {video.categoryTag}
            </div>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-950/90 gap-2 text-neutral-400 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
                <span>Loading {video.platform} video...</span>
              </div>
            )}

            {!loadError ? (
              <iframe
                src={getEmbedUrl()}
                className="w-full h-full border-0 rounded-none bg-neutral-950"
                title={video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setLoadError(true);
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
                <p className="text-sm font-medium text-neutral-200">Embed Blocked or Rate-Limited</p>
                <p className="text-xs text-neutral-400 max-w-sm">
                  {isTikTok
                    ? 'TikTok triggered overload protection for multiple requests. Watch directly via the link below.'
                    : 'This video cannot be embedded inside the frame due to browser cookie policies.'}
                </p>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5 mt-2 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Watch Directly on {video.platform}
                </a>
              </div>
            )}

            {isTikTok && !loadError && (
              <div className="absolute bottom-2 right-2 z-20">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-400 text-[10px] font-mono rounded shadow flex items-center gap-1 transition-colors"
                  title="If video says 'overload - protect triggered', click to watch directly on TikTok"
                >
                  <span>Rate limited? Open TikTok</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
