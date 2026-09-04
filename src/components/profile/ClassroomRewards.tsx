import React from 'react';
import { motion } from 'framer-motion';
import { Award, Printer } from 'lucide-react';
import { PalashFlowerBadge, SalLeafBadge, StarRewardBadge } from '../ui/DashboardIllustrations';

export interface ClassroomRewardsProps {
  className?: string;
}

export const ClassroomRewards: React.FC<ClassroomRewardsProps> = ({ className = '' }) => {
  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            Classroom Rewards, Badges & Certificates
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Positive motivation & cultural recognition for Jharkhand primary learners
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Printer size={14} />
          <span>Print Merit Certificates</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Badge 1: Palash Flower */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-2xl bg-[#FFF1F2] border border-rose-200 flex items-center gap-3.5 shadow-2xs"
        >
          <PalashFlowerBadge size={60} />
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded-full">
              Mother Tongue Honor
            </span>
            <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
              Palash Flower Award
            </h4>
            <p className="text-xs text-slate-600 font-devanagari">
              पलाश पदक: 18 छात्रों को मिला
            </p>
          </div>
        </motion.div>

        {/* Badge 2: Sal Leaf */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-2xl bg-[#F0FDF4] border border-emerald-200 flex items-center gap-3.5 shadow-2xs"
        >
          <SalLeafBadge size={60} />
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
              Reading Champion
            </span>
            <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
              Sal Leaf Scholar
            </h4>
            <p className="text-xs text-slate-600 font-devanagari">
              साल पत्ता: 14 छात्रों को मिला
            </p>
          </div>
        </motion.div>

        {/* Badge 3: Golden Star */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-2xl bg-[#FEFCE8] border border-yellow-200 flex items-center gap-3.5 shadow-2xs"
        >
          <StarRewardBadge size={60} />
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
              Full Attendance
            </span>
            <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
              Golden Star Scholar
            </h4>
            <p className="text-xs text-slate-600 font-devanagari">
              स्वर्ण तारा: 22 छात्रों को मिला
            </p>
          </div>
        </motion.div>
      </div>

      {/* Weekly Honors Leaderboard Card */}
      <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 text-amber-900">
            <Award size={15} className="text-amber-600" />
            This Week's Classroom Student Honors (Top 3)
          </span>
          <span className="text-slate-400">Weekly Refresh</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-800">
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 flex items-center gap-1.5">
            🥇 Ravi Marandi (120 Stars)
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1.5">
            🥈 Pooja Hansda (105 Stars)
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-orange-100 border border-orange-200 flex items-center gap-1.5">
            🥉 Sunita Hembrom (95 Stars)
          </span>
        </div>
      </div>
    </div>
  );
};
