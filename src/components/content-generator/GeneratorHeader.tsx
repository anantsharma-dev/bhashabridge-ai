import React from 'react';
import { Sparkles, History, Printer } from 'lucide-react';

export interface GeneratorHeaderProps {
  savedCount: number;
  onOpenHistory: () => void;
  onPrint: () => void;
}

export const GeneratorHeader: React.FC<GeneratorHeaderProps> = ({
  savedCount,
  onOpenHistory,
  onPrint,
}) => {
  return (
    <div className="rounded-[28px] bg-gradient-to-r from-[#2563EB] via-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-[0_8px_30px_rgba(37,99,235,0.15)] relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-xs">
            <Sparkles size={14} className="text-amber-300" />
            <span>Gemini 2.5 Flash Curriculum Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-baloo tracking-tight">
            AI Multi-Output Curriculum Studio
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
            Generate NEP 2020 MTB-MLE compliant lesson plans, bilingual stories, flashcards, worksheets, quizzes, vocabulary decks, and teacher notes in one unified package.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenHistory}
            className="min-h-[44px] px-4 py-2 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-all cursor-pointer backdrop-blur-xs"
          >
            <History size={16} />
            <span>Saved Packages ({savedCount})</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="min-h-[44px] px-4 py-2 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
