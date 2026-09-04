import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Copy, Check, Star, Snail, FilePlus, Sparkles } from 'lucide-react';

export interface TranslationResultProps {
  hindiText: string;
  santhaliText: string;
  santhaliLatin: string;
  onReplayAudio: (slow?: boolean) => void;
  onAddToWorksheet?: () => void;
  className?: string;
}

export const TranslationResult: React.FC<TranslationResultProps> = ({
  hindiText = 'बच्चों, अपनी किताब का पन्ना नंबर पाँच खोलो।',
  santhaliText = 'ᱜᱤᱫᱽᱨᱟᱹ, ᱟᱯᱱᱟᱨ ᱯᱩᱛᱷᱤ ᱨᱮᱭᱟᱜ ᱥᱟᱠᱟᱢ ᱮᱞ ᱢᱚᱬᱮ ᱡᱷᱤᱡᱽ ᱢᱮ ᱾',
  santhaliLatin = 'Gidra, apnar puthi reyag sakam el mone jhij me.',
  onReplayAudio,
  onAddToWorksheet,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${hindiText}\n${santhaliText}\n${santhaliLatin}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlay = (slow = false) => {
    setIsPlaying(true);
    onReplayAudio(slow);
    setTimeout(() => setIsPlaying(false), slow ? 3500 : 2500);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. Teacher Speaks Card */}
      <div className="rounded-[24px] bg-[#FFFBEB] border border-amber-200/80 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-900 flex items-center gap-1.5">
            <span>👩‍🏫</span> Teacher Speaks (Hindi)
          </span>
          <span className="text-xs text-amber-800/80 font-medium">Classroom Instruction</span>
        </div>

        <p className="text-lg sm:text-xl font-bold text-slate-900 font-devanagari leading-relaxed">
          "{hindiText}"
        </p>
      </div>

      {/* 2. Student Hears Card (Santali Translation) */}
      <div className="rounded-[24px] bg-[#F0FDF4] border border-emerald-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-200 text-emerald-900 flex items-center gap-1.5">
            <span>🧒</span> Student Hears (Santali • ᱥᱟᱱᱛᱟᱲᱤ)
          </span>
          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
            <Sparkles size={12} /> Piper Voice Model
          </span>
        </div>

        {/* Big Ol Chiki Script */}
        <div className="space-y-1.5">
          <p className="text-xl sm:text-2xl font-bold text-slate-900 font-olchiki leading-relaxed">
            "{santhaliText}"
          </p>
          <p className="text-sm font-semibold text-emerald-800 italic">
            ({santhaliLatin})
          </p>
        </div>

        {/* Action Toolbar (Minimum 48px touch targets) */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Replay Normal Speed */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => handlePlay(false)}
              className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#22C55E] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Volume2 size={16} className={isPlaying ? 'animate-bounce' : ''} />
              <span>Listen Audio</span>
            </motion.button>

            {/* Slow Pronunciation (Turtle speed) */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => handlePlay(true)}
              className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              aria-label="Play slow pronunciation"
            >
              <Snail size={16} className="text-emerald-600" />
              <span>Slow (0.75x)</span>
            </motion.button>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[44px] px-3 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              aria-label="Copy translated phrase"
            >
              {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Favorite Phrase Toggle */}
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`min-h-[44px] px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isFavorite
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50'
              }`}
              aria-label="Favorite phrase"
            >
              <Star size={15} className={isFavorite ? 'fill-amber-500 text-amber-500' : ''} />
              <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
            </button>

            {/* Share to Worksheet */}
            {onAddToWorksheet && (
              <button
                type="button"
                onClick={onAddToWorksheet}
                className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                aria-label="Add to worksheet"
              >
                <FilePlus size={15} />
                <span>To Worksheet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
