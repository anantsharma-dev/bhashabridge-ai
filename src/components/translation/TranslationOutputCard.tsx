import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Copy, Check, Star, Snail, Sparkles, Languages, CheckCircle2 } from 'lucide-react';
import type { LanguageCode, TranslationResult } from '../../types/translation';

interface TranslationOutputCardProps {
  result: TranslationResult | null;
  targetLang: LanguageCode;
  isLoading?: boolean;
  onPlayAudio?: (text: string, lang: LanguageCode, slow?: boolean) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
  onSampleClick?: (text: string) => void;
  className?: string;
}

const SAMPLE_PHRASES = [
  { text: 'नमस्ते', label: 'Johar (नमस्ते)' },
  { text: 'बैठ जाओ', label: 'Durub me (बैठ जाओ)' },
  { text: 'किताब पढ़ो', label: 'Puthi parhaw me (किताब पढ़ो)' },
  { text: 'धन्यवाद', label: 'Sarhaw (धन्यवाद)' },
];

export const TranslationOutputCard: React.FC<TranslationOutputCardProps> = ({
  result,
  targetLang,
  isLoading = false,
  onPlayAudio,
  onToggleFavorite,
  isFavorite = false,
  onSampleClick,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlowPlaying, setIsSlowPlaying] = useState(false);

  const handleCopy = () => {
    if (!result?.translatedText) return;
    const textToCopy = `${result.translatedText} (${result.romanPronunciation})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayAudio = (slow: boolean = false) => {
    if (!result?.translatedText) return;
    if (slow) {
      setIsSlowPlaying(true);
      setTimeout(() => setIsSlowPlaying(false), 3000);
    } else {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2500);
    }
    if (onPlayAudio) {
      onPlayAudio(result.translatedText, result.targetLang, slow);
    }
  };

  const getTargetTitle = () => {
    switch (targetLang) {
      case 'santhali':
        return 'Santali (Ol Chiki • ᱥᱟᱱᱛᱟᱲᱤ)';
      case 'roman_santhali':
        return 'Santali (Roman Latin)';
      case 'mundari':
        return 'Mundari (ᱢᱩᱱᱰᱟᱨᱤ)';
      case 'hindi':
      default:
        return 'Hindi (हिन्दी)';
    }
  };

  return (
    <div
      className={`rounded-[28px] bg-white border-2 border-emerald-100/90 shadow-md p-6 relative flex flex-col justify-between min-h-[340px] transition-all ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-50">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shadow-xs">
            ✨
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{getTargetTitle()}</h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Offline Instant Model (SCERT MTB-MLE)</span>
            </div>
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-1">
            {onToggleFavorite && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                type="button"
                onClick={() => onToggleFavorite(result.id)}
                className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-100 border-amber-300 text-amber-600'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-400 hover:text-amber-500'
                }`}
                title="Star phrase"
                aria-label="Star phrase"
              >
                <Star size={18} className={isFavorite ? 'fill-amber-500 text-amber-500' : ''} />
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.85 }}
              type="button"
              onClick={handleCopy}
              className="p-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Copy translation"
              aria-label="Copy translation"
            >
              {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
            </motion.button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="py-6 flex-1 flex flex-col justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Translating classroom phrase...</p>
          </div>
        ) : result && result.translatedText ? (
          <div className="space-y-4">
            {/* Primary Translation */}
            <div className="bg-[#F0FDF4] border border-emerald-200/80 rounded-2xl p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1 block">
                Classroom Translation
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug tracking-wide">
                {result.translatedText}
              </p>
            </div>

            {/* Roman Script / Pronunciation Pill */}
            {result.romanPronunciation && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs">
                  <span>🗣️ Pronunciation:</span>
                  <span className="italic font-extrabold text-amber-950">{result.romanPronunciation}</span>
                </span>
                {result.confidence && (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    {Math.round(result.confidence * 100)}% Match
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 px-4 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
              <Languages size={28} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-700 text-base">Translation will appear here</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Type Hindi or tribal vocabulary above, or try one of these common classroom phrases:
              </p>
            </div>

            {/* Quick Suggestions */}
            {onSampleClick && (
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {SAMPLE_PHRASES.map((sample) => (
                  <button
                    key={sample.text}
                    type="button"
                    onClick={() => onSampleClick(sample.text)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer transition-all hover:scale-105"
                  >
                    + {sample.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Audio Toolbar Footer */}
      {result && result.translatedText && (
        <div className="pt-4 border-t border-emerald-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Standard Audio Playback */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => handlePlayAudio(false)}
              className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all"
            >
              <Volume2 size={18} className={isPlaying ? 'animate-bounce' : ''} />
              <span>{isPlaying ? 'Playing...' : 'Pronounce (Piper)'}</span>
            </motion.button>

            {/* Slow Audio (Turtle) */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => handlePlayAudio(true)}
              className="min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              <Snail size={18} className={isSlowPlaying ? 'animate-pulse text-amber-700' : 'text-amber-600'} />
              <span>Slow 0.75x</span>
            </motion.button>
          </div>

          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles size={12} className="text-amber-500" />
            Classroom Safe
          </div>
        </div>
      )}
    </div>
  );
};
