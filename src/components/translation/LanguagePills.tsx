import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft } from 'lucide-react';
import type { LanguageCode } from '../../types/translation';
import { LANGUAGE_OPTIONS } from '../../types/translation';

export interface LanguagePillsProps {
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  onSelectSource: (lang: LanguageCode) => void;
  onSelectTarget: (lang: LanguageCode) => void;
  onSwap: () => void;
  className?: string;
}

export const LanguagePills: React.FC<LanguagePillsProps> = ({
  sourceLang,
  targetLang,
  onSelectSource,
  onSelectTarget,
  onSwap,
  className = '',
}) => {
  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Source Language Selector */}
      <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
          From:
        </span>
        {LANGUAGE_OPTIONS.filter((l) => l.code !== targetLang).map((lang) => {
          const isSelected = sourceLang === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectSource(lang.code)}
              className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                isSelected
                  ? 'bg-[#2563EB] text-white shadow-sm ring-2 ring-blue-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <span className="text-sm font-devanagari">{lang.nativeName}</span>
              <span className="text-[11px] opacity-80 font-normal">({lang.name})</span>
            </button>
          );
        })}
      </div>

      {/* Swap Button (48px target) */}
      <motion.button
        whileHover={{ rotate: 180, scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onSwap}
        className="w-12 h-12 rounded-2xl bg-[#FFFDF7] hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs border border-slate-200"
        aria-label="Swap source and target languages"
      >
        <ArrowRightLeft size={18} className="text-blue-600" />
      </motion.button>

      {/* Target Language Selector */}
      <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
          To:
        </span>
        {LANGUAGE_OPTIONS.filter((l) => l.code !== sourceLang).map((lang) => {
          const isSelected = targetLang === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectTarget(lang.code)}
              className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                isSelected
                  ? 'bg-[#22C55E] text-white shadow-sm ring-2 ring-emerald-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <span className="text-sm font-olchiki">{lang.nativeName}</span>
              <span className="text-[11px] opacity-80 font-normal">({lang.name})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
