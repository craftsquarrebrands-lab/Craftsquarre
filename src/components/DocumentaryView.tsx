import React, { useState } from 'react';
import { Film, Sparkles, User, Mic, Camera, CheckCircle2, ChevronRight, Volume2, Quote } from 'lucide-react';
import { DOCUMENTARY_STRUCTURE, DocumentaryAct } from '../data/shootData';

export const DocumentaryView: React.FC = () => {
  const [activeAct, setActiveAct] = useState<number>(1);
  const [actStatus, setActStatus] = useState<Record<number, boolean>>({});

  const toggleActStatus = (actNum: number) => {
    setActStatus((prev) => ({ ...prev, [actNum]: !prev[actNum] }));
  };

  const currentAct = DOCUMENTARY_STRUCTURE.find((a) => a.actNumber === activeAct) || DOCUMENTARY_STRUCTURE[0];

  return (
    <div className="space-y-6">
      {/* Hero Overview Card */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
              <Film className="w-4 h-4" />
              <span>OFFICIAL 3–5 MINUTE LAUNCH DOCUMENTARY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
              BUILT TO BE SEEN
            </h2>
            <p className="text-sm text-neutral-300 font-medium leading-relaxed">
              The Story Behind the Craftsquarre Merchant App
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed pt-1">
              "Great products deserve visibility. Craftsquarre exists to help product businesses get discovered, grow, and sell. The Craftsquarre Merchant App is the next step in making that mission easier for merchants."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <div className="bg-neutral-950/80 border border-neutral-800 px-4 py-3 rounded-xl">
              <div className="text-[11px] font-mono text-neutral-500 uppercase">Target Runtime</div>
              <div className="text-lg font-bold font-mono text-neutral-100">3:00 – 5:00 Mins</div>
            </div>
            <div className="bg-neutral-950/80 border border-neutral-800 px-4 py-3 rounded-xl">
              <div className="text-[11px] font-mono text-neutral-500 uppercase">Acts Filmed</div>
              <div className="text-lg font-bold font-mono text-amber-400">
                {Object.values(actStatus).filter(Boolean).length} of {DOCUMENTARY_STRUCTURE.length} Wrapped
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Act Navigator Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DOCUMENTARY_STRUCTURE.map((act) => {
          const isDone = !!actStatus[act.actNumber];
          const isActive = activeAct === act.actNumber;

          return (
            <button
              key={act.actNumber}
              onClick={() => setActiveAct(act.actNumber)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400 shadow-md'
                  : isDone
                  ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border-neutral-800'
              }`}
            >
              <span>ACT {act.actNumber}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </div>

      {/* Active Act Master Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Act Script & Narration & Soundbites */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase">Act Breakdown</div>
              <h3 className="text-lg font-bold text-neutral-100">{currentAct.actTitle}</h3>
            </div>

            <button
              onClick={() => toggleActStatus(currentAct.actNumber)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                actStatus[currentAct.actNumber]
                  ? 'bg-emerald-500 text-neutral-950'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {actStatus[currentAct.actNumber] ? 'Act Filmed ✓' : 'Mark Act Filmed'}
            </button>
          </div>

          {/* Core Dialogue / Narration */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              Script & Spoken Lines
            </h4>

            {currentAct.roles.map((role, idx) => (
              <div
                key={idx}
                className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {role.speaker}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-line font-serif italic">
                  "{role.dialogue}"
                </p>
              </div>
            ))}
          </div>

          {/* Key Message */}
          {currentAct.keyMessage && (
            <div className="bg-amber-950/20 border-l-4 border-amber-500 p-3.5 rounded-r-xl">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase block mb-1">
                KEY MESSAGE OF THIS ACT:
              </span>
              <p className="text-xs text-amber-200/90 font-medium">
                {currentAct.keyMessage}
              </p>
            </div>
          )}
        </div>

        {/* Right: Visual Shot List & Director Shooting Notes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Visuals to capture */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              Required B-Roll & Visuals
            </h4>

            <div className="space-y-2">
              {currentAct.visuals.map((visual, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-neutral-300 bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800/80"
                >
                  <span className="font-mono text-amber-400 font-bold shrink-0">{idx + 1}.</span>
                  <span className="leading-relaxed">{visual}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Director's On-Set Execution Note */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Director's Act Direction</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
              {currentAct.shotDirection}
            </p>
          </div>

          {/* Quick Act Jumper Footer */}
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono px-1">
            <button
              disabled={activeAct === 1}
              onClick={() => setActiveAct((prev) => Math.max(1, prev - 1))}
              className={`hover:text-amber-400 ${activeAct === 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              ← Previous Act
            </button>
            <span>{activeAct} / {DOCUMENTARY_STRUCTURE.length}</span>
            <button
              disabled={activeAct === DOCUMENTARY_STRUCTURE.length}
              onClick={() => setActiveAct((prev) => Math.min(DOCUMENTARY_STRUCTURE.length, prev + 1))}
              className={`hover:text-amber-400 ${activeAct === DOCUMENTARY_STRUCTURE.length ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Next Act →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
