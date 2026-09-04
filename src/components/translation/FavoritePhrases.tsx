import React from 'react';
import { motion } from 'framer-motion';
import { Star, Volume2, Sparkles } from 'lucide-react';
import type { LanguageCode, TranslationHistoryItem } from '../../types/translation';

interface FavoritePhrasesProps {
  favorites: TranslationHistoryItem[];
  onSelect: (item: TranslationHistoryItem) => void;
  onPlayAudio?: (text: string, lang: LanguageCode) => void;
  onToggleFavorite: (id: string) => void;
  className?: string;
}

export const FavoritePhrases: React.FC<FavoritePhrasesProps> = ({
  favorites,
  onSelect,
  onPlayAudio,
  onToggleFavorite,
  className = '',
}) => {
  return (
    <div className={`rounded-[28px] bg-[#FFFDF7] border-2 border-amber-100 shadow-sm p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
            <Star size={16} className="fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Favorite Classroom Phrases</h3>
            <p className="text-[11px] text-slate-500">Quick-access phrases for instant instruction</p>
          </div>
        </div>

        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          {favorites.length} Saved
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-6 px-4 rounded-2xl bg-amber-50/50 border border-dashed border-amber-200 text-amber-800/80 text-xs space-y-1">
          <Sparkles size={20} className="mx-auto text-amber-500 mb-1" />
          <p className="font-bold">No starred phrases yet</p>
          <p className="text-[11px] text-slate-500">
            Tap the star icon on any translation output to save frequently used greetings and instructions here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {favorites.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between gap-3 cursor-pointer group"
              onClick={() => onSelect(item)}
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700 font-devanagari">{item.sourceText}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className="text-amber-500 hover:text-amber-700 p-1 cursor-pointer"
                    aria-label="Remove from favorites"
                  >
                    <Star size={15} className="fill-amber-400" />
                  </button>
                </div>

                <p className="text-base font-bold text-emerald-900 leading-snug">{item.translatedText}</p>
                {item.romanPronunciation && (
                  <p className="text-xs text-amber-800 italic font-medium">🗣️ {item.romanPronunciation}</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">
                  {item.sourceLang} → {item.targetLang}
                </span>

                {onPlayAudio && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayAudio(item.translatedText, item.targetLang);
                    }}
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    aria-label="Pronounce phrase"
                  >
                    <Volume2 size={13} />
                    <span>Play</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
