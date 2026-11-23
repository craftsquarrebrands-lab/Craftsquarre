import React, { useState } from 'react';
import { CheckCircle2, Circle, ListFilter, RotateCcw, CheckCheck, Printer, Sparkles } from 'lucide-react';
import { SHOOT_CHECKLIST, ChecklistCategory } from '../data/shootData';

interface ChecklistViewProps {
  checkedItems: Record<string, boolean>;
  onToggleItem: (itemKey: string) => void;
  onResetAll: () => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  checkedItems,
  onToggleItem,
  onResetAll
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Compute total items and completed items
  const allItemKeys: string[] = [];
  SHOOT_CHECKLIST.forEach((cat) => {
    cat.items.forEach((item, index) => {
      allItemKeys.push(`${cat.id}-${index}`);
    });
  });

  const totalCount = allItemKeys.length;
  const completedCount = allItemKeys.filter((key) => !!checkedItems[key]).length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const filteredCategories = selectedCategory === 'all' 
    ? SHOOT_CHECKLIST 
    : SHOOT_CHECKLIST.filter((cat) => cat.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Banner & Progress Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CRAFTSQUARRE PRODUCTION READINESS CHECKLIST</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-100">
              Master Shoot Preparation Checklist
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Interactive readiness guide for gear, app tests, talent, location, and wrap protocols.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-extrabold font-mono text-amber-400">
                {percentage}%
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                {completedCount} of {totalCount} items verified
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition-colors text-xs font-medium flex items-center gap-1.5"
              title="Print Checklist for On-Set Clipboards"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onResetAll}
              className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 rounded-xl transition-colors text-xs font-medium flex items-center gap-1.5"
              title="Reset All Checkmarks"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-neutral-950 rounded-full h-2.5 border border-neutral-800 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-emerald-400 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Category Tabs (Segmented Buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-amber-500 text-neutral-950 font-semibold'
              : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
          }`}
        >
          All Categories ({SHOOT_CHECKLIST.length})
        </button>
        {SHOOT_CHECKLIST.map((cat) => {
          const catItems = cat.items.map((_, i) => `${cat.id}-${i}`);
          const catDone = catItems.filter((k) => !!checkedItems[k]).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-neutral-950 font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {cat.title.replace(/^\d+\.\s*/, '')} ({catDone}/{cat.items.length})
            </button>
          );
        })}
      </div>

      {/* Categories Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((category) => {
          const catItemKeys = category.items.map((_, i) => `${category.id}-${i}`);
          const catCompleted = catItemKeys.filter((k) => !!checkedItems[k]).length;
          const isAllDone = catCompleted === category.items.length;

          return (
            <div
              key={category.id}
              className={`bg-neutral-900/90 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                isAllDone
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4">
                  <h3 className="font-bold text-sm text-neutral-100 font-mono">
                    {category.title}
                  </h3>
                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded ${
                      isAllDone
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {catCompleted}/{category.items.length}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2.5">
                  {category.items.map((item, idx) => {
                    const itemKey = `${category.id}-${idx}`;
                    const isChecked = !!checkedItems[itemKey];

                    return (
                      <div
                        key={idx}
                        onClick={() => onToggleItem(itemKey)}
                        className={`group flex items-start gap-2.5 p-2 rounded-xl cursor-pointer select-none transition-colors ${
                          isChecked
                            ? 'bg-neutral-950/50 text-neutral-500 line-through'
                            : 'hover:bg-neutral-800/60 text-neutral-200'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 shrink-0 transition-colors"
                          aria-label={`Toggle ${item}`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-neutral-600 group-hover:text-amber-400" />
                          )}
                        </button>
                        <span className="text-xs leading-relaxed font-normal">
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
