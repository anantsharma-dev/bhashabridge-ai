import React from 'react';
import { motion } from 'framer-motion';
import { History, Star, Trash2, ArrowRight } from 'lucide-react';
import type { TranslationHistoryItem } from '../../types/translation';

interface TranslationHistoryProps {
  history: TranslationHistoryItem[];
  onSelect: (item: TranslationHistoryItem) => void;
  onToggleFavorite: (id: string) => void;
  onClearHistory: () => void;
  className?: string;
}

export const TranslationHistory: React.FC<TranslationHistoryProps> = ({
  history,
  onSelect,
  onToggleFavorite,
  onClearHistory,
  className = '',
}) => {
  return (
    <div className={`rounded-[28px] bg-white border-2 border-slate-100 shadow-sm p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
            <History size={16} />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Recent Translations</h3>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm space-y-1">
          <p className="font-medium">No recent translations</p>
          <p className="text-xs text-slate-400">Classroom phrases you translate will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {history.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.01 }}
              className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/70 hover:border-emerald-200 transition-all flex items-center justify-between gap-3 cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-800 truncate">{item.sourceText}</span>
                  <ArrowRight size={12} className="text-slate-400 shrink-0" />
                  <span className="font-bold text-emerald-800 truncate">{item.translatedText}</span>
                </div>
                {item.romanPronunciation && (
                  <p className="text-[11px] text-amber-800 italic truncate font-medium">
                    🗣️ {item.romanPronunciation}
                  </p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.85 }}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(item.id);
                }}
                className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                  item.isFavorite
                    ? 'text-amber-500 bg-amber-50'
                    : 'text-slate-300 hover:text-amber-500 hover:bg-white'
                }`}
                aria-label="Star phrase"
              >
                <Star size={16} className={item.isFavorite ? 'fill-amber-400' : ''} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
