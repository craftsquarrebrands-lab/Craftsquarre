import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Tv, 
  Type, 
  Volume2, 
  Sparkles, 
  Film, 
  Clock, 
  Camera, 
  SlidersHorizontal 
} from 'lucide-react';
import { MIND_OF_A_MERCHANT_SCRIPT, ScriptScene } from '../data/shootData';

export const ScriptTeleprompter: React.FC = () => {
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isPrompterActive, setIsPrompterActive] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');

  const prompterContainerRef = useRef<HTMLDivElement>(null);

  // 60-second script pacing timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => {
          if (prev >= 60) {
            setIsPlaying(false);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Teleprompter smooth auto-scroll
  useEffect(() => {
    let scrollAnim: number;
    const scrollStep = () => {
      if (isPlaying && prompterContainerRef.current) {
        prompterContainerRef.current.scrollTop += scrollSpeed * 0.5;
      }
      scrollAnim = requestAnimationFrame(scrollStep);
    };

    if (isPlaying && isPrompterActive) {
      scrollAnim = requestAnimationFrame(scrollStep);
    }
    return () => cancelAnimationFrame(scrollAnim);
  }, [isPlaying, isPrompterActive, scrollSpeed]);

  const resetTimer = () => {
    setIsPlaying(false);
    setSecondsElapsed(0);
    if (prompterContainerRef.current) {
      prompterContainerRef.current.scrollTop = 0;
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'xlarge':
        return 'text-2xl sm:text-3xl leading-relaxed';
      case 'large':
        return 'text-lg sm:text-xl leading-relaxed';
      default:
        return 'text-sm sm:text-base leading-normal';
    }
  };

  const currentScene = MIND_OF_A_MERCHANT_SCRIPT[activeSceneIndex];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
              <Film className="w-4 h-4" />
              <span>OFFICIAL 60-SECOND VERTICAL LAUNCH FILM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100">
              THE MIND OF A MERCHANT
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-mono">
              <span>Format: Vertical 9:16</span>
              <span>·</span>
              <span>Duration: 60 Seconds</span>
              <span>·</span>
              <span>Lead: Tosin</span>
              <span>·</span>
              <span>Voice: Inner Monologue Narrator</span>
            </div>
          </div>

          {/* 60s Rehearsal Clock */}
          <div className="flex items-center gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <div className="text-center font-mono">
              <div className="text-[11px] text-neutral-500 uppercase">Scene Pacing</div>
              <div className="text-3xl font-extrabold text-amber-400 tracking-tight">
                {String(Math.floor(secondsElapsed / 60)).padStart(2, '0')}:
                {String(secondsElapsed % 60).padStart(2, '0')}
                <span className="text-xs text-neutral-500 ml-1">/ 01:00</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-3 rounded-xl transition-all ${
                  isPlaying
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100'
                }`}
                title={isPlaying ? 'Pause Rehearsal' : 'Start 60s Rehearsal'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <button
                onClick={resetTimer}
                className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 rounded-xl transition-colors"
                title="Reset Rehearsal Clock"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Toggle: Interactive Script Cards vs Big Screen Teleprompter */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPrompterActive(false)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                !isPrompterActive
                  ? 'bg-amber-500 text-neutral-950 font-semibold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              Scene-by-Scene Shot Cards
            </button>
            <button
              onClick={() => setIsPrompterActive(true)}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                isPrompterActive
                  ? 'bg-amber-500 text-neutral-950 font-semibold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              Live Teleprompter Mode
            </button>
          </div>

          {isPrompterActive && (
            <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-400">
              <div className="flex items-center gap-1.5">
                <span>Speed:</span>
                {[1, 2, 3].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setScrollSpeed(spd)}
                    className={`px-2 py-0.5 rounded ${
                      scrollSpeed === spd ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span>Text:</span>
                {(['normal', 'large', 'xlarge'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`px-2 py-0.5 rounded capitalize ${
                      fontSize === sz ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800'
                    }`}
                  >
                    {sz[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Mode Display */}
      {isPrompterActive ? (
        /* BIG SCREEN TELEPROMPTER */
        <div className="relative bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-neutral-900/90 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              TELEPROMPTER PROMPTER STAGE — 60S LAUNCH SCRIPT
            </span>
            <span className="text-neutral-400">
              {isPlaying ? 'Auto-Scrolling...' : 'Click Play above to roll'}
            </span>
          </div>

          <div
            ref={prompterContainerRef}
            className="h-[520px] overflow-y-auto p-6 sm:p-12 space-y-12 scroll-smooth"
          >
            {MIND_OF_A_MERCHANT_SCRIPT.map((scene) => (
              <div
                key={scene.sceneNumber}
                className="border-b border-neutral-800/80 pb-10 space-y-4"
              >
                <div className="flex items-center justify-between font-mono text-xs text-amber-400">
                  <span className="uppercase font-bold tracking-widest">
                    {scene.title}
                  </span>
                  <span>{scene.timecode}</span>
                </div>

                <div className="text-xs text-neutral-400 font-mono italic bg-neutral-900/60 p-3 rounded-lg border border-neutral-800">
                  ACTION: {scene.action}
                </div>

                <div className={`space-y-4 font-sans ${getFontSizeClass()}`}>
                  {scene.lines.map((line, lIdx) => (
                    <div key={lIdx} className="space-y-1">
                      <span className="block text-xs font-mono font-bold tracking-wider text-amber-400">
                        {line.speaker}
                      </span>
                      <p className="text-neutral-100 font-medium">
                        {line.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center py-10 font-mono text-sm text-neutral-500">
              — END OF 60-SECOND LAUNCH SCRIPT —
            </div>
          </div>
        </div>
      ) : (
        /* SCENE-BY-SCENE DIRECTOR CARDS */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Scene Selector Tabs */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-mono text-neutral-400 uppercase mb-2">
              7 Scenes Timeline (0:00 to 1:00)
            </div>
            {MIND_OF_A_MERCHANT_SCRIPT.map((scene, idx) => (
              <button
                key={scene.sceneNumber}
                onClick={() => setActiveSceneIndex(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  activeSceneIndex === idx
                    ? 'bg-neutral-800 text-neutral-100 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                    : 'bg-neutral-900/70 text-neutral-400 hover:text-neutral-200 border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="font-bold text-amber-400">SCENE {scene.sceneNumber}</span>
                  <span className="text-[11px] text-neutral-500">{scene.timecode}</span>
                </div>
                <div className="text-sm font-semibold text-neutral-200 truncate">
                  {scene.title.replace(/^Scene \d+:\s*/, '')}
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: Detailed Scene Card */}
          <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase">
                  {currentScene.timecode} · {currentScene.setting}
                </span>
                <h3 className="text-xl font-bold text-neutral-100 mt-1">
                  {currentScene.title}
                </h3>
              </div>
            </div>

            {/* Action Cues */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-1.5">
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                Physical Action / Staging
              </span>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {currentScene.action}
              </p>
            </div>

            {/* Spoken Dialogue */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                Dialogue & Voiceover Delivery
              </span>

              {currentScene.lines.map((line, lIdx) => (
                <div
                  key={lIdx}
                  className={`p-3.5 rounded-xl border ${
                    line.isVO
                      ? 'bg-amber-950/15 border-amber-900/30'
                      : 'bg-neutral-950 border-neutral-800'
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-amber-400 block mb-1">
                    {line.speaker} {line.isVO ? '(VOICEOVER)' : ''}
                  </span>
                  <p className="text-sm sm:text-base text-neutral-100 font-serif italic">
                    "{line.text}"
                  </p>
                </div>
              ))}
            </div>

            {/* Director Notes */}
            <div className="bg-neutral-950 border-l-4 border-amber-500 p-4 rounded-r-xl space-y-1">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                DIRECTOR'S CAMERA & SOUND NOTES
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {currentScene.directorNotes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
