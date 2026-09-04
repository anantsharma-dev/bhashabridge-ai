import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, Sparkles, BookOpen, X } from 'lucide-react';
import { StoryBook } from '../ui/DashboardIllustrations';
import { JoharHornbill } from '../ui/JoharHornbill';
import { speechSynthesisService } from '../../services/speechSynthesis';
import { languageDetector } from '../../services/languageDetector';

import type { BilingualStory } from '../../services/storiesService';

export interface StoryWord {
  text: string;
  pronunciation?: string;
  meaningHindi?: string;
}

export interface StoryPage {
  pageNumber: number;
  illustration: React.ReactNode;
  hindiParagraph: string[];
  santhaliParagraph: string[];
  santhaliLatin: string;
}

export interface StoryReaderProps {
  story?: BilingualStory;
  storyTitle?: string;
  activeWordIndex?: number;
  isPlaying?: boolean;
  onWordClick?: (word: string) => void;
  onFinishStory?: () => void;
  className?: string;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  story,
  storyTitle = 'The Clever Fox & the Sacred Hornbill • ᱛᱟᱹᱨᱩᱵ ᱟᱨ ᱢᱤᱨᱩ',
  activeWordIndex = 2,
  isPlaying = false,
  onWordClick,
  onFinishStory,
  className = '',
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [langView, setLangView] = useState<'both' | 'hindi' | 'santhali'>('both');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  React.useEffect(() => {
    setCurrentPage(0);
    setIsCompleted(false);
    setSelectedWord(null);
  }, [story?.id]);

  const storyPages = story?.pages || [];
  const activeTitle = story
    ? `${story.titleHindi} • ${story.titleSanthali}`
    : storyTitle;

  const currentPageData = storyPages[currentPage]
    ? {
        pageNumber: storyPages[currentPage].pageNumber,
        illustration: <StoryBook size={140} />,
        hindiParagraph: storyPages[currentPage].paragraphHindi.split(/\s+/),
        santhaliParagraph: storyPages[currentPage].paragraphSanthali.split(/\s+/),
        santhaliLatin: storyPages[currentPage].paragraphRoman,
      }
    : {
        pageNumber: 1,
        illustration: <StoryBook size={140} />,
        hindiParagraph: [
          'एक', 'बार', 'की', 'बात', 'है,', 'दुमका', 'के', 'हरे-भरे', 'जंगल', 'में',
          'एक', 'सुंदर', 'हॉर्नबिल', 'पक्षी', 'रहता', 'था।'
        ],
        santhaliParagraph: [
          'ᱢᱤᱫ', 'ᱫᱷᱟᱣ', 'ᱨᱮᱭᱟᱜ', 'ᱠᱟᱛᱷᱟ', 'ᱠᱟᱱᱟ,', 'ᱫᱩᱢᱠᱟᱹ', 'ᱵᱤᱨ', 'ᱨᱮ',
          'ᱢᱤᱫ', 'ᱪᱮᱦᱨᱟ', 'ᱦᱟᱹᱛᱤ-ᱢᱤᱨᱩ', 'ᱛᱟᱦᱮᱸ', 'ᱠᱟᱱᱟᱭ ᱾'
        ],
        santhaliLatin: 'Mid dhaw reyag katha kana, Dumka bir re mid chehra hati-miru tahen kanay.',
      };

  const totalPages = Math.max(1, storyPages.length);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
      setSelectedWord(null);
    } else {
      setIsCompleted(true);
      if (onFinishStory) onFinishStory();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      setSelectedWord(null);
    }
  };

  const handleWordTap = (word: string) => {
    setSelectedWord(word);
    if (onWordClick) onWordClick(word);
  };

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6 select-none ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF5FF] text-purple-900 border border-purple-200">
              Interactive Reader
            </span>
            <span className="text-xs font-medium text-slate-500">
              Page {currentPage + 1} of {totalPages}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-baloo">
            {activeTitle}
          </h2>
        </div>

        {/* Script Language View Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setLangView('both')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              langView === 'both' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Bilingual
          </button>
          <button
            type="button"
            onClick={() => setLangView('santhali')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              langView === 'santhali' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Santali (Ol Chiki)
          </button>
          <button
            type="button"
            onClick={() => setLangView('hindi')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              langView === 'hindi' ? 'bg-white text-amber-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Hindi
          </button>
        </div>
      </div>

      {/* Main Reader Book Container */}
      <AnimatePresence mode="wait">
        {isCompleted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 space-y-4"
          >
            <div className="flex justify-center">
              <JoharHornbill size="hero" waving={true} speechBubble="Shabash! Story Completed! 🌟" />
            </div>
            <div className="space-y-1">
              <span className="text-4xl">⭐⭐⭐⭐⭐</span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-baloo">
                Congratulations! You Finished Reading!
              </h3>
              <p className="text-base font-bold text-emerald-800 font-devanagari">
                बधाई! आपने यह कहानी पूरी पढ़ ली!
              </p>
              <p className="text-sm text-slate-500">
                You earned <strong>+25 Stars</strong> and unlocked the <strong>Sal Leaf Scholar Badge</strong>!
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsCompleted(false);
                setCurrentPage(0);
              }}
              className="min-h-[48px] px-8 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <BookOpen size={16} />
              <span>Read Again</span>
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Illustration Frame */}
            <div className="w-full h-52 sm:h-64 rounded-2xl bg-[#FFFDF7] border-2 border-dashed border-amber-200 flex items-center justify-center p-4 relative overflow-hidden">
              <div className="transform hover:scale-105 transition-transform duration-300">
                {currentPageData.illustration}
              </div>
              <span className="absolute bottom-3 right-4 text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Illustrated Page {currentPage + 1}
              </span>
            </div>

            {/* Karaoke Word-by-Word Text Paragraphs */}
            <div className="p-6 rounded-2xl bg-[#FFFDF7] border border-slate-200 space-y-4">
              {/* Santali Ol Chiki line */}
              {(langView === 'both' || langView === 'santhali') && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Santali (Ol Chiki):
                  </span>
                  <div className="flex flex-wrap gap-2 text-xl sm:text-2xl font-bold font-olchiki leading-relaxed">
                    {currentPageData.santhaliParagraph.map((word, idx) => {
                      const isWordActive = isPlaying && idx === activeWordIndex;
                      return (
                        <span
                          key={idx}
                          onClick={() => handleWordTap(word)}
                          className={`px-1.5 py-0.5 rounded-lg cursor-pointer transition-all ${
                            isWordActive
                              ? 'bg-emerald-300 text-emerald-950 font-black scale-110 shadow-xs ring-2 ring-emerald-400'
                              : 'hover:bg-emerald-100 hover:text-emerald-900'
                          }`}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-500 italic pt-1">
                    ({currentPageData.santhaliLatin})
                  </p>
                </div>
              )}

              {/* Hindi Translation line */}
              {(langView === 'both' || langView === 'hindi') && (
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Hindi (कक्षा पठन):
                  </span>
                  <div className="flex flex-wrap gap-2 text-lg sm:text-xl font-medium font-devanagari leading-relaxed text-slate-800">
                    {currentPageData.hindiParagraph.map((word, idx) => (
                      <span
                        key={idx}
                        onClick={() => handleWordTap(word)}
                        className="px-1.5 py-0.5 rounded-lg cursor-pointer hover:bg-amber-100 hover:text-amber-900 transition-colors"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Word Helper Popup when word is tapped */}
            {selectedWord && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-[#EFF6FF] border-2 border-blue-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block">
                      Tapped Word • शब्द उच्चारण
                    </span>
                    <strong className="text-blue-950 text-base font-bold">
                      {selectedWord.replace(/[,.!?।॥]/g, '')}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const cleanWord = selectedWord.replace(/[,.!?।॥]/g, '').trim();
                      const detected = languageDetector.detectLanguage(cleanWord);
                      const langCode = detected.language === 'santhali' ? 'santhali' : 'hindi';
                      speechSynthesisService.speak(cleanWord, langCode);
                    }}
                    className="min-h-[40px] px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-blue-700 shadow-xs"
                    aria-label="Pronounce word"
                  >
                    <Volume2 size={15} />
                    <span>Pronounce</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedWord(null)}
                    className="w-8 h-8 rounded-full bg-blue-100/70 hover:bg-blue-200 text-blue-800 flex items-center justify-center cursor-pointer transition-colors"
                    aria-label="Close word popup"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Page Navigation Controls (Minimum 48px height) */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={currentPage === 0}
                onClick={handlePrevPage}
                className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Previous Page</span>
              </button>

              <span className="text-xs font-bold text-slate-500">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>{currentPage < totalPages - 1 ? 'Next Page' : 'Finish Story 🏆'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
