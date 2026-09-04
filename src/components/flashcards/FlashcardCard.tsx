import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Star, RotateCw, Snail, CheckCircle2 } from 'lucide-react';

export interface FlashcardData {
  id: string;
  hindi: string;
  santhali: string;
  santhaliLatin: string;
  english: string;
  category: string;
  illustration: React.ReactNode;
  sampleSentenceHindi: string;
  sampleSentenceSanthali: string;
  isMastered?: boolean;
  didYouKnow?: string;
}

export interface FlashcardCardProps {
  card: FlashcardData;
  onPlayAudio?: (card: FlashcardData, slow?: boolean) => void;
  onToggleFavorite?: (id: string) => void;
  className?: string;
}

export const FlashcardCard: React.FC<FlashcardCardProps> = ({
  card,
  onPlayAudio,
  onToggleFavorite,
  className = '',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudio = (slow = false, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPlaying(true);
    if (onPlayAudio) {
      onPlayAudio(card, slow);
    }
    setTimeout(() => setIsPlaying(false), slow ? 3000 : 2000);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFav(!isFav);
    if (onToggleFavorite) onToggleFavorite(card.id);
  };

  return (
    <div className={`relative perspective-1000 select-none ${className}`}>
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="w-full min-h-[360px] rounded-[24px] bg-white border-2 border-[#F1EFE8] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md cursor-pointer relative preserve-3d"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* ================= FRONT SIDE ================= */}
        <div
          className={`absolute inset-0 p-6 flex flex-col justify-between backface-hidden rounded-[24px] ${
            isFlipped ? 'pointer-events-none' : ''
          }`}
        >
          {/* Top Bar: Category badge + Favorite star */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#EFF6FF] text-blue-900 border border-blue-200">
              {card.category}
            </span>

            <div className="flex items-center gap-1.5">
              {card.isMastered && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Mastered
                </span>
              )}
              <button
                type="button"
                onClick={handleFavorite}
                className="w-9 h-9 rounded-full bg-slate-50 hover:bg-amber-50 text-slate-400 hover:text-amber-500 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Toggle favorite"
              >
                <Star size={18} className={isFav ? 'fill-amber-400 text-amber-400' : ''} />
              </button>
            </div>
          </div>

          {/* Centered Illustration */}
          <div className="flex items-center justify-center py-3">
            <div className="transform hover:scale-105 transition-transform duration-200">
              {card.illustration}
            </div>
          </div>

          {/* Words Info: Hindi + English */}
          <div className="text-center space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-devanagari">
              {card.hindi}
            </h3>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider font-heading">
              {card.english}
            </p>
          </div>

          {/* Bottom Toolbar: Audio buttons + Tap to flip */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => handleAudio(false, e)}
                className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                aria-label="Listen pronunciation"
              >
                <Volume2 size={15} className={isPlaying ? 'animate-bounce' : ''} />
                <span>Listen</span>
              </button>
              <button
                type="button"
                onClick={(e) => handleAudio(true, e)}
                className="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                aria-label="Slow audio"
              >
                <Snail size={14} className="text-slate-600" />
                <span>0.75x</span>
              </button>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-600">
              <RotateCw size={13} /> Tap to Flip
            </span>
          </div>
        </div>

        {/* ================= BACK SIDE (Santali Ol Chiki) ================= */}
        <div
          className={`absolute inset-0 p-6 flex flex-col justify-between backface-hidden rotate-y-180 rounded-[24px] bg-[#FFFDF7] ${
            !isFlipped ? 'pointer-events-none' : ''
          }`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#ECFDF5] text-emerald-900 border border-emerald-300">
              Santali (Ol Chiki Script)
            </span>
            <span className="text-xs font-bold text-emerald-700">Mother Tongue</span>
          </div>

          {/* Santali Ol Chiki Display */}
          <div className="text-center space-y-2 py-4">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-emerald-900 font-olchiki leading-relaxed">
              {card.santhali}
            </h3>
            <p className="text-base font-bold text-slate-700 italic">
              ({card.santhaliLatin})
            </p>
            <p className="text-sm font-semibold text-slate-600 font-devanagari">
              Hindi: {card.hindi} • English: {card.english}
            </p>
          </div>

          {/* Bilingual Context Sentence */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-0.5 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Classroom Sentence:
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 font-olchiki">
              {card.sampleSentenceSanthali}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-600 font-devanagari">
              {card.sampleSentenceHindi}
            </p>
          </div>

          {/* Did You Know? Tribal/Jharkhand Fact */}
          {card.didYouKnow && (
            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-start gap-2 text-left">
              <span className="text-base leading-none shrink-0 mt-0.5">💡</span>
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 block font-heading">
                  Did You Know? • क्या आप जानते हैं?
                </span>
                <p className="text-[11px] sm:text-xs text-amber-950 font-medium leading-relaxed font-devanagari">
                  {card.didYouKnow}
                </p>
              </div>
            </div>
          )}

          {/* Back Footer */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={(e) => handleAudio(false, e)}
              className="min-h-[40px] px-4 py-1.5 rounded-xl bg-[#22C55E] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Volume2 size={15} className={isPlaying ? 'animate-bounce' : ''} />
              <span>Pronounce Ol Chiki</span>
            </button>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <RotateCw size={13} /> Tap to Return
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
