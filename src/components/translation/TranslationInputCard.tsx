import React from 'react';
import { motion } from 'framer-motion';
import { Clipboard, X, Sparkles } from 'lucide-react';
import type { LanguageCode } from '../../types/translation';

export interface TranslationInputCardProps {
  inputText: string;
  onChangeInput: (val: string) => void;
  onTranslate: () => void;
  onClear: () => void;
  sourceLang: LanguageCode;
  isLoading?: boolean;
  className?: string;
}

export const TranslationInputCard: React.FC<TranslationInputCardProps> = ({
  inputText,
  onChangeInput,
  onTranslate,
  onClear,
  sourceLang,
  isLoading = false,
  className = '',
}) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChangeInput(text);
    } catch {
      // Fallback
    }
  };

  const placeholderText =
    sourceLang === 'hindi'
      ? 'यहाँ हिन्दी वाक्य या शब्द लिखें (जैसे: "हाथी", "नमस्ते", "किताब खोलो")...'
      : 'Type or paste classroom text here...';

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Input Text ({sourceLang.toUpperCase()})
        </span>

        <div className="flex items-center gap-2">
          {/* Paste Button */}
          <button
            type="button"
            onClick={handlePaste}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-200/60"
            aria-label="Paste text from clipboard"
          >
            <Clipboard size={14} />
            <span>Paste</span>
          </button>

          {/* Clear Button */}
          {inputText && (
            <button
              type="button"
              onClick={onClear}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
              aria-label="Clear input text"
            >
              <X size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Large Textarea */}
      <div className="relative">
        <textarea
          value={inputText}
          onChange={(e) => onChangeInput(e.target.value)}
          placeholder={placeholderText}
          rows={4}
          maxLength={500}
          className="w-full p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200 text-base sm:text-lg font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-400 font-devanagari resize-none leading-relaxed"
        />
        <div className="absolute bottom-3 right-3 text-[11px] font-bold text-slate-400">
          {inputText.length} / 500
        </div>
      </div>

      {/* Translate Button */}
      <div className="flex justify-end pt-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onTranslate}
          disabled={!inputText.trim() || isLoading}
          className="min-h-[48px] px-8 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
        >
          <Sparkles size={16} className={isLoading ? 'animate-spin' : ''} />
          <span>{isLoading ? 'Translating...' : 'Translate to Santali'}</span>
        </motion.button>
      </div>
    </div>
  );
};
