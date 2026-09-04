import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Clock, Sparkles } from 'lucide-react';
import { CuteElephant } from './DashboardIllustrations';

export interface LearningCardProps {
  title?: string;
  hindiTitle?: string;
  santhaliTitle?: string;
  duration?: string;
  progressPercent?: number;
  wordsMastered?: string;
  targetLink?: string;
  className?: string;
}

export const LearningCard: React.FC<LearningCardProps> = ({
  title = 'Animals in Hindi & Santhali',
  hindiTitle = 'वन्य एवं घरेलू पशु (गाय, बकरी, हाथी, बाघ)',
  santhaliTitle = 'ᱵᱤᱨ ᱟᱨ ᱚᱲᱟᱜ ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ',
  duration = '12 mins',
  progressPercent = 75,
  wordsMastered = '12 of 16 Words Mastered',
  targetLink = '/flashcards',
  className = '',
}) => {
  // SVG progress ring calculations
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative overflow-hidden ${className}`}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left + Middle: Illustration + Lesson Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full text-center sm:text-left">
          {/* Last lesson illustration placeholder (Cute Elephant) */}
          <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-[22px] bg-[#FFF7ED] border border-orange-100 flex items-center justify-center p-2 shadow-inner">
            <CuteElephant size={105} />
          </div>

          {/* Lesson Details */}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ECFDF5] text-emerald-800 border border-emerald-200">
                Continue Learning
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                <Clock size={13} className="text-slate-400" />
                {duration}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                <Sparkles size={12} />
                {wordsMastered}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-baloo leading-tight">
              {title}
            </h2>

            {/* Bilingual Subtitles (Hindi slightly larger for classroom readability) */}
            <div className="space-y-1">
              <p className="text-base sm:text-lg font-medium text-slate-800 font-devanagari">
                {hindiTitle}
              </p>
              <p className="text-sm font-semibold text-slate-500 font-olchiki">
                {santhaliTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Progress Ring + Action Button */}
        <div className="shrink-0 flex items-center gap-5 w-full sm:w-auto justify-center sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
          {/* Circular Progress Ring */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative flex items-center justify-center w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth="6"
                  fill="transparent"
                />
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
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-slate-800 font-baloo">
                {progressPercent}%
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Completed
            </span>
          </div>

          {/* Continue Lesson Button (Min 48px height, rounded-2xl, filled) */}
          <Link to={targetLink} className="inline-block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-colors"
              aria-label="Continue Lesson: Animals in Hindi & Santhali"
            >
              <Play size={16} className="fill-white" />
              <span>Continue Lesson</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
};
