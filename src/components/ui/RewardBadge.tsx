import React from 'react';
import { motion } from 'framer-motion';
import {
  StarRewardBadge,
  StreakFlameBadge,
  PalashFlowerBadge,
  SalLeafBadge,
} from './DashboardIllustrations';

export interface RewardItem {
  id: string;
  title: string;
  hindiTitle: string;
  badgeTag: string;
  subtitle: string;
  illustration: React.ReactNode;
  bgColor: string;
  borderColor: string;
  tagColor: string;
}

export interface RewardBadgeProps {
  className?: string;
  starsCount?: number;
  streakDays?: number;
  badgesCount?: number;
}

export const DailyRewardsSection: React.FC<RewardBadgeProps> = ({
  className = '',
  starsCount = 18,
  streakDays = 5,
}) => {
  const rewards: RewardItem[] = [
    {
      id: 'stars',
      title: `${starsCount} Stars Earned`,
      hindiTitle: 'आज के सितारे',
      badgeTag: `Goal: ${Math.max(20, starsCount + 5)} ⭐`,
      subtitle: 'Classroom rewards today',
      illustration: <StarRewardBadge size={68} />,
      bgColor: 'bg-[#FEFCE8]',
      borderColor: 'border-[#FEF08A]',
      tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      id: 'streak',
      title: `${streakDays} Days Active`,
      hindiTitle: 'दैनिक लकीर',
      badgeTag: `${streakDays} Days 🔥`,
      subtitle: 'Consistent learning streak',
      illustration: <StreakFlameBadge size={68} />,
      bgColor: 'bg-[#FFF7ED]',
      borderColor: 'border-[#FED7AA]',
      tagColor: 'bg-orange-100 text-orange-900 border-orange-300',
    },
    {
      id: 'palash',
      title: 'Palash Flower',
      hindiTitle: 'पलाश पदक • भाषा सम्मान',
      badgeTag: 'Unlocked! 🌸',
      subtitle: 'Mother tongue speaking champion',
      illustration: <PalashFlowerBadge size={68} />,
      bgColor: 'bg-[#FFF1F2]',
      borderColor: 'border-[#FECDD3]',
      tagColor: 'bg-rose-100 text-rose-900 border-rose-300',
    },
    {
      id: 'sal',
      title: 'Sal Leaf Badge',
      hindiTitle: 'साल पत्ता • पठन मित्र',
      badgeTag: 'Mastered 🍃',
      subtitle: 'Reading practice milestone',
      illustration: <SalLeafBadge size={68} />,
      bgColor: 'bg-[#F0FDF4]',
      borderColor: 'border-[#BBF7D0]',
      tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
  ];

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6 ${className}`}
    >
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-amber-900 border border-amber-300">
              Classroom Celebrations
            </span>
            <span className="text-xs font-medium text-slate-500">
              Jharkhand Cultural Badges
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-baloo">
            Daily Rewards & Badges
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Encouraging children through positive reinforcement
        </p>
      </div>

      {/* Grid of 4 Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {rewards.map((reward) => (
          <motion.div
            key={reward.id}
            whileHover={{ y: -3, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className={`rounded-[24px] p-4 sm:p-5 border ${reward.bgColor} ${reward.borderColor} shadow-xs flex flex-col items-center text-center justify-between space-y-3 cursor-default select-none`}
          >
            {/* Tag */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${reward.tagColor}`}
            >
              {reward.badgeTag}
            </span>

            {/* Cheerful Vector Badge Illustration */}
            <div className="py-1">{reward.illustration}</div>

            {/* Title & Subtitles */}
            <div className="space-y-0.5 w-full">
              <h3 className="text-base font-extrabold text-slate-900 font-baloo leading-tight">
                {reward.title}
              </h3>
              <p className="text-xs font-semibold text-slate-700 font-devanagari">
                {reward.hindiTitle}
              </p>
              <p className="text-[11px] text-slate-500 font-medium leading-tight pt-1 line-clamp-2">
                {reward.subtitle}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
