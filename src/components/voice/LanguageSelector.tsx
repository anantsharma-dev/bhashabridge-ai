import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, WifiOff, Cpu } from 'lucide-react';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  script: string;
}

export interface LanguageSelectorProps {
  sourceLang: string;
  targetLang: string;
  onSelectTarget: (code: string) => void;
  onSelectSource?: (code: string) => void;
  onSwap: () => void;
  isOffline?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLang = 'hindi',
  targetLang = 'santali',
  onSelectTarget,
  onSwap,
  isOffline = true,
  className = '',
}) => {
  const languages: LanguageOption[] = [
    { code: 'hindi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari' },
    { code: 'santali', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki' },
    { code: 'english', name: 'English', nativeName: 'English', script: 'Latin' },
    { code: 'ho', name: 'Ho', nativeName: 'ᱦᱳ', script: 'Warang Citi' },
    { code: 'mundari', name: 'Mundari', nativeName: 'ᱢᱩᱱᱰᱟᱨᱤ', script: 'Ol Chiki' },
    { code: 'kurukh', name: 'Kurukh', nativeName: 'कुड़ुख़', script: 'Devanagari' },
    { code: 'auto', name: 'Auto Detect', nativeName: 'Auto Detect', script: 'AI Multi-Script' },
  ];

  const sourceObj = languages.find((l) => l.code === sourceLang) || {
    code: 'hindi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
  };

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4 ${className}`}
    >
      {/* Top Status Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-500 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <WifiOff size={13} className="text-emerald-600" />
            {isOffline ? '100% Offline Mode Active' : 'Online Cloud Bridge'}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
            <Cpu size={13} className="text-purple-600" />
            Whisper ASR + IndicTrans2 + Piper TTS
          </span>
        </div>
        <span className="text-slate-400 font-medium">Jharkhand MTB-MLE Block</span>
      </div>

      {/* Language Switch Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Source Language (Fixed or selectable) */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            From:
          </span>
          <div className="px-4 py-2 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 font-bold text-sm flex items-center gap-2">
            <span
              className={`${
                sourceObj.code === 'santali' || sourceObj.code === 'mundari'
                  ? 'font-olchiki'
                  : sourceObj.code === 'hindi' || sourceObj.code === 'kurukh'
                  ? 'font-devanagari'
                  : ''
              } text-base`}
            >
              {sourceObj.nativeName}
            </span>
            <span className="text-xs opacity-75 font-normal">({sourceObj.name})</span>
          </div>
        </div>

        {/* Swap Button (Large 48px touch target) */}
        <motion.button
          whileHover={{ rotate: 180, scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={onSwap}
          className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs border border-slate-200/80"
          aria-label="Swap source and target languages"
        >
          <ArrowRightLeft size={18} />
        </motion.button>

        {/* Target Languages Chips */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            To:
          </span>
          <div className="flex flex-wrap gap-2">
            {languages
              .filter((l) => l.code !== sourceLang)
              .map((lang) => {
                const isSelected = targetLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => onSelectTarget(lang.code)}
                    className={`min-h-[44px] px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? 'bg-[#2563EB] text-white shadow-sm ring-2 ring-blue-300'
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
      </div>
    </div>
  );
};
