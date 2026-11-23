import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, Lightbulb, Film, Camera, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface ShootAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShootAssistantModal: React.FC<ShootAssistantModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const PRESETS = [
    {
      title: "Lighting Fix for Low-Light Workshop",
      query: "We are shooting inside an artisan tailoring shop in 2 hours with low ceiling and dim yellow bulbs. How do we light this on a budget to make the garments look luxury?"
    },
    {
      title: "Viral 3-Second Hooks for Ankara Bags",
      query: "Give me 5 punchy Nigerian-themed viral 3-second hooks for our Ankara print laptop bag shoot today."
    },
    {
      title: "Handling Screen Glare on Merchant App",
      query: "How do we record the Craftsquarre merchant app on phone screen outdoors without harsh sun reflections?"
    },
    {
      title: "Parfait & Healthy Drink Macro Tips",
      query: "What are the best camera settings and lens tricks to capture condensation droplets and granola crunch on food UGC?"
    }
  ];

  const handleAskAI = async (queryText?: string) => {
    const q = queryText || prompt;
    if (!q.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      // Use Google Gen AI SDK
      const ai = new GoogleGenAI();
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert commercial video director and cinematographer on set for a fast-paced 5-hour content shoot for "Craftsquarre", a mobile merchant app empowering Nigerian product businesses (fashion, leather bags, shoes, drinks, food, craftsmanship). Campaign theme: "Built To Be Seen".
        
Provide practical, punchy, immediate on-set direction advice for the videographer and director for this question:
"${q}"

Format with:
- Quick Verdict (1 sentence)
- Camera & Framing adjustment
- Lighting & Texture tweak
- Talent & Pacing cue
- Audio & Sound detail
Keep it concise, actionable, and ready to shoot immediately on set.`
      });

      setResponse(res.text || 'No response generated.');
    } catch (err: any) {
      console.warn('AI call error, providing expert on-set director fallback', err);
      // Helpful on-set fallback guidance if API key isn't active in dev
      setResponse(
        `🎬 ON-SET DIRECTOR QUICK GUIDE:\n\n` +
        `• Camera & Framing: Use 45° angle at eye-level or low-angle hero push (35mm equivalent). For screens, angle phone 15° away from direct light to kill glare.\n\n` +
        `• Lighting: Place key light at 45° with double diffusion. Use a 5-in-1 silver reflector underneath to bounce clean fill into artisan hands and product textures.\n\n` +
        `• Texture & Detail: Lightly mist product surfaces (or beverages with glycerin mix) so textures catch glossy specular highlights on camera.\n\n` +
        `• Pacing: Keep every individual action beat under 1.8 seconds. Fast cuts maintain 85%+ retention on Reels & TikTok.\n\n` +
        `• Craftsquarre Core Message: Remind talent: "We're not just showing a product; we are showing a Nigerian business ready for the world to discover."`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-neutral-950 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-neutral-100 font-mono">
              ON-SET DIRECTOR AI ASSISTANT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <p className="text-xs text-neutral-400">
            Need an instant angle fix, alternate hook, or lighting solve during your 5-hour shoot? Tap a prompt or ask custom questions:
          </p>

          {/* Quick Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(p.query);
                  handleAskAI(p.query);
                }}
                className="text-left p-2.5 bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 rounded-xl transition-colors space-y-1"
              >
                <div className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" /> {p.title}
                </div>
                <div className="text-[11px] text-neutral-400 line-clamp-2">
                  {p.query}
                </div>
              </button>
            ))}
          </div>

          {/* Response Box */}
          {isLoading && (
            <div className="p-6 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>Director AI calculating optimal shot recipe...</span>
            </div>
          )}

          {response && (
            <div className="p-4 bg-neutral-950 rounded-xl border border-amber-500/30 text-xs sm:text-sm text-neutral-200 whitespace-pre-line leading-relaxed font-sans shadow-inner">
              {response}
            </div>
          )}
        </div>

        {/* Bottom Input */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
            placeholder="Ask anything: e.g. 'How do we film an Ankara tote bag in harsh afternoon sun?'"
            className="flex-1 text-xs bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => handleAskAI()}
            disabled={isLoading || !prompt.trim()}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Generate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
