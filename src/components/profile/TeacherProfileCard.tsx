import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, School, MapPin, Sparkles } from 'lucide-react';
import { JoharHornbill } from '../ui/JoharHornbill';

export interface TeacherProfileCardProps {
  name?: string;
  role?: string;
  school?: string;
  district?: string;
  block?: string;
  village?: string;
  level?: number;
  xp?: number;
  className?: string;
}

export const TeacherProfileCard: React.FC<TeacherProfileCardProps> = ({
  name = 'Sangeeta Soren',
  role = 'MTB-MLE Senior Language Mentor',
  school = 'GPS Dumka Tribal Primary School',
  district = 'Dumka',
  block = 'Ranishwar Block',
  village = 'Barmasia Village',
  level = 8,
  xp = 2450,
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
        {/* Left: Avatar + Details */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full text-center sm:text-left">
          {/* Teacher Photo Placeholder with Tribal Mentor Ring */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] bg-gradient-to-tr from-amber-400 via-orange-400 to-emerald-400 p-1 shadow-md">
              <div className="w-full h-full rounded-[24px] bg-white flex items-center justify-center text-4xl font-extrabold text-amber-900 font-baloo shadow-inner">
                👩‍🏫
              </div>
            </div>
            <span className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[10px] shadow-sm flex items-center gap-0.5">
              <Sparkles size={10} /> Lvl {level}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#ECFDF5] text-emerald-900 border border-emerald-300">
                <Award size={13} className="text-emerald-700" />
                {role}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <Star size={12} className="fill-amber-500 text-amber-500" />
                {xp} XP Contributed
              </span>
            </div>

            <div className="space-y-0.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-baloo">
                {name}
              </h1>
              <p className="text-sm font-semibold text-slate-600 font-devanagari">
                संगीता सोरेन • प्राथमिक विद्यालय शिक्षिका
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-500 font-medium pt-1">
              <span className="flex items-center gap-1">
                <School size={13} className="text-blue-600" />
                {school}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-emerald-600" />
                {village}, {block}, {district}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Mascot Encouragement */}
        <div className="shrink-0 flex items-center justify-center">
          <JoharHornbill
            size="hero"
            waving={true}
            speechBubble="Johar Sangeeta Ma'am! 🌟"
            className="transform hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </motion.section>
  );
};
