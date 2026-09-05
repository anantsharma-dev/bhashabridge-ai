import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { JoharHornbill } from './JoharHornbill';
import { Sparkles, ArrowRight, School, MapPin } from 'lucide-react';
import { useThemeStore } from './themeStore';

export interface HeroCardProps {
  onStartLesson?: () => void;
  className?: string;
  teacherName?: string;
  schoolName?: string;
  districtName?: string;
  grade?: string;
  languagePair?: string;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  onStartLesson,
  className = '',
  teacherName,
  schoolName = 'GPS Dumka Tribal Primary School',
  districtName = 'Dumka',
  grade = 'Grade 2 MTB-MLE',
  languagePair = 'Hindi + Santali',
}) => {
  const { currentLanguage, setCurrentLanguage } = useThemeStore();

  const languageOptions = [
    { code: 'santhali', label: 'ᱥᱟᱱᱛᱟᱲᱤ', sub: 'Santhali' },
    { code: 'ho', label: 'Warang Citi', sub: 'Ho' },
    { code: 'mundari', label: 'ᱢᱩᱱᱰᱟᱨᱤ', sub: 'Mundari' },
  ] as const;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-[24px] bg-gradient-to-br from-[#FFFDF7] via-[#FFF9EE] to-[#FEF3C7]/40 border border-[#FED7AA]/60 p-6 sm:p-8 shadow-[0_4px_24px_rgba(245,158,11,0.07)] relative overflow-hidden ${className}`}
    >
      {/* Background soft ambient circles */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#FEF3C7]/50 pointer-events-none blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#FFEDD5]/40 pointer-events-none blur-xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        {/* Left: Classroom Greeting & Action */}
        <div className="space-y-4 max-w-2xl text-left">
          {/* Secondary metadata chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-amber-900 border border-amber-300/80 shadow-xs">
              <School size={13} className="text-amber-700" />
              {grade}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#EFF6FF] text-blue-900 border border-blue-200 shadow-xs">
              <Sparkles size={13} className="text-blue-600" />
              {languagePair}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] text-emerald-800 border border-emerald-200 shadow-xs">
              <MapPin size={13} className="text-emerald-600" />
              {schoolName} • {districtName}
            </span>
          </div>

          {/* Main Playful Title & Subtitle */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-baloo leading-snug">
              Johar{teacherName ? `, ${teacherName}` : ''}! Ready for today's learning?
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
              Continue today's Hindi ↔ Santhali multilingual classroom journey.
            </p>
          </div>

          {/* Active Target Language Selector Pills */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
              Classroom Language:
            </span>
            {languageOptions.map((lang) => {
              const isActive = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setCurrentLanguage(lang.code as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[36px] flex items-center gap-1.5 active:scale-95 ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-sm ring-2 ring-blue-300/50'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="font-olchiki text-sm">{lang.label}</span>
                  <span className="opacity-75 font-normal text-[11px]">({lang.sub})</span>
                </button>
              );
            })}
          </div>

          {/* Primary CTA Button (Minimum 48px height, accessible, filled rounded) */}
          <div className="pt-2 flex items-center gap-4">
            <Link to="/flashcards" className="inline-block" onClick={onStartLesson}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                className="min-h-[48px] px-7 py-3.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base shadow-md shadow-blue-500/20 flex items-center gap-2.5 transition-colors cursor-pointer"
                aria-label="Start Today's Lesson"
              >
                <span>Start Today's Lesson</span>
                <ArrowRight size={18} />
              </motion.button>
            </Link>
            <span className="text-xs font-medium text-amber-800/80 hidden sm:inline-block">
              FLN 2026 Aligned • 100% Offline Ready
            </span>
          </div>
        </div>

        {/* Right: Cute Waving Hornbill Mascot */}
        <div className="shrink-0 flex justify-center items-center py-2">
          <JoharHornbill
            size="hero"
            waving={true}
            speechBubble="Johar! ᱡᱚᱦᱟᱨ!"
            className="transform hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </motion.section>
  );
};
