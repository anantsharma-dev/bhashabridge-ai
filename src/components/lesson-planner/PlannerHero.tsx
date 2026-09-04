import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, BookOpen } from 'lucide-react';
import { JoharHornbill } from '../ui/JoharHornbill';

export interface PlannerHeroProps {
  onCreatePlanClick?: () => void;
  className?: string;
}

export const PlannerHero: React.FC<PlannerHeroProps> = ({
  onCreatePlanClick,
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
              Gemini AI Teacher Co-Pilot
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-emerald-900 border border-emerald-200 shadow-2xs">
              <BookOpen size={13} className="text-emerald-600" />
              NIPUN Bharat FLN Alignment
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-baloo leading-tight">
              Plan Tomorrow's Lesson in Minutes
            </h1>
            <p className="text-base sm:text-lg text-slate-700 font-devanagari font-medium">
              कक्षा योजना 2 मिनट में तैयार करें • ᱠᱟᱹᱢᱤ ᱦᱚᱨᱟ ᱥᱟᱯᱲᱟᱣ ᱢᱮ
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
              AI-generated step-by-step bilingual lesson timelines with culturally contextual stories, local songs, and flashcard sets.
            </p>
          </div>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={onCreatePlanClick}
              className="min-h-[50px] px-8 py-3.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base shadow-md shadow-blue-500/20 flex items-center gap-2.5 cursor-pointer transition-colors"
            >
              <Calendar size={18} />
              <span>Create New Lesson Plan</span>
            </motion.button>
          </div>
        </div>

        {/* Right: Teacher Johar Mascot */}
        <div className="shrink-0 flex items-center justify-center">
          <JoharHornbill
            size="hero"
            waving={true}
            speechBubble="Lesson ready for Dumka! 📚"
            className="transform hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </motion.section>
  );
};
