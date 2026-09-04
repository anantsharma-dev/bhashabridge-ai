import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Sparkles } from 'lucide-react';
import { JoharHornbill } from '../ui/JoharHornbill';

export interface StoryHeroProps {
  onContinueReading?: () => void;
  activeStoryTitle?: string;
  className?: string;
}

export const StoryHero: React.FC<StoryHeroProps> = ({
  onContinueReading,
  activeStoryTitle = 'The Clever Fox & the Sacred Hornbill',
  className = '',
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-[24px] bg-gradient-to-br from-[#FFFDF7] via-[#FFF9EE] to-[#FEF3C7]/40 border border-[#FED7AA]/70 p-6 sm:p-8 shadow-[0_4px_24px_rgba(245,158,11,0.07)] relative overflow-hidden ${className}`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        <div className="space-y-4 max-w-xl text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF5FF] text-purple-900 border border-purple-200 shadow-2xs">
              <Sparkles size={13} className="text-purple-600" />
              Google Read Along Powered
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-emerald-900 border border-emerald-200 shadow-2xs">
              <BookOpen size={13} className="text-emerald-600" />
              Karaoke Word Highlighting
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-baloo leading-tight">
              Johar Story Time
            </h1>
            <p className="text-base sm:text-lg text-slate-700 font-devanagari font-medium">
              जोहार कहानी समय • ᱡᱚᱦᱟᱨ ᱠᱟᱹᱦᱱᱤ ᱚᱠᱛᱚ
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
              Listen, read along, and tap any word to hear fluent native pronunciation in Hindi and Santali (Ol Chiki).
            </p>
          </div>

          {/* Continue Reading Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={onContinueReading}
              className="min-h-[50px] px-7 py-3.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-md shadow-blue-500/20 flex items-center gap-2.5 cursor-pointer transition-colors"
            >
              <Play size={18} className="fill-white" />
              <span>Continue Reading: {activeStoryTitle}</span>
            </motion.button>
          </div>
        </div>

        {/* Right: Johar Mascot sitting under tree */}
        <div className="shrink-0 flex items-center justify-center">
          <div className="relative">
            {/* Tree canopy sketch behind mascot */}
            <div className="w-40 h-40 rounded-full bg-emerald-100/60 border border-emerald-200 absolute -top-4 -left-4 pointer-events-none -z-10" />
            <JoharHornbill
              size="hero"
              waving={true}
              speechBubble="Let's read a story! 📖"
              className="transform hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};
