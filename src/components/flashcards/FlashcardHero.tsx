import React from 'react';
import { motion } from 'framer-motion';
import { Star, Flame, Award, BookOpen } from 'lucide-react';
import { JoharHornbill } from '../ui/JoharHornbill';

export interface FlashcardHeroProps {
  xpCurrent?: number;
  xpGoal?: number;
  streakDays?: number;
  starsCount?: number;
  masteredCount?: number;
  totalWords?: number;
  className?: string;
}

export const FlashcardHero: React.FC<FlashcardHeroProps> = ({
  xpCurrent = 160,
  xpGoal = 200,
  streakDays = 7,
  starsCount = 45,
  masteredCount = 12,
  totalWords = 16,
  className = '',
}) => {
  // SVG progress ring
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.round((masteredCount / totalWords) * 100);
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-[24px] bg-gradient-to-br from-[#FFFDF7] via-[#FFF9EE] to-[#FEF3C7]/40 border border-[#FED7AA]/70 p-6 sm:p-8 shadow-[0_4px_24px_rgba(245,158,11,0.07)] relative overflow-hidden ${className}`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        {/* Left: Introducing Today's Words */}
        <div className="space-y-4 max-w-xl text-left">
          {/* Gamification Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF7ED] text-orange-950 border border-orange-200 shadow-2xs">
              <Flame size={14} className="fill-orange-500 text-orange-500" />
              <span>{streakDays} Day Vocabulary Streak</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEFCE8] text-amber-950 border border-amber-200 shadow-2xs">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span>{starsCount} Stars Earned</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0FDF4] text-emerald-900 border border-emerald-200 shadow-2xs">
              <Award size={14} className="text-emerald-600" />
              <span>Grade 2 FLN Explorer</span>
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-baloo leading-tight">
              Today's Bilingual Words!
            </h1>
            <p className="text-base sm:text-lg text-slate-700 font-devanagari font-medium">
              आज के नए शब्द सीखें और बोलें • ᱛᱮᱦᱮᱧᱟᱜ ᱟᱹᱲᱟᱹ ᱪᱮᱫᱚᱜ ᱢᱮ
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
              Explore colorful picture cards in Hindi, Santali (Ol Chiki), and English with native pronunciation.
            </p>
          </div>

          {/* Daily XP Progress Bar */}
          <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-200/80 max-w-md space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <BookOpen size={14} className="text-amber-600" />
                Daily XP Goal
              </span>
              <span className="text-amber-900 font-baloo text-sm">
                {xpCurrent} / {xpGoal} XP
              </span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                style={{ width: `${(xpCurrent / xpGoal) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Progress Ring + Johar Mascot */}
        <div className="shrink-0 flex items-center gap-6">
          {/* Progress Ring */}
          <div className="flex flex-col items-center gap-1.5 bg-white/80 p-3.5 rounded-2xl border border-amber-200/60 shadow-2xs">
            <div className="relative flex items-center justify-center w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r={radius} stroke="#E2E8F0" strokeWidth="6" fill="transparent" />
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="#22C55E"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-slate-800 font-baloo">
                {progressPercent}%
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
              {masteredCount}/{totalWords} Mastered
            </span>
          </div>

          <JoharHornbill
            size="hero"
            waving={true}
            speechBubble="Let's learn new words! 🌟"
            className="transform hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </motion.section>
  );
};
