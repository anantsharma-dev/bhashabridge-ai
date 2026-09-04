import React from 'react';
import { BookOpen, Clock, Award, Star, CheckCircle2 } from 'lucide-react';

export interface ReadingProgressCardProps {
  booksCompleted?: number;
  minutesRead?: number;
  wordsLearned?: number;
  daysActive?: number;
  className?: string;
}

export const ReadingProgressCard: React.FC<ReadingProgressCardProps> = ({
  booksCompleted = 6,
  minutesRead = 48,
  wordsLearned = 32,
  daysActive = 4,
  className = '',
}) => {
  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            Reading Journey & Fluency Milestones
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Student classroom progress in mother tongue reading
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <CheckCircle2 size={14} className="text-emerald-600" />
          <span>FLN Level 2 Reading Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Books Completed */}
        <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-blue-200 space-y-1">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
            <BookOpen size={16} className="text-blue-600" />
            <span>Books Finished</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-baloo">
            {booksCompleted} <span className="text-xs font-normal text-slate-500">Stories</span>
          </p>
          <span className="text-[10px] text-blue-700 font-medium block">Dumka Block Folktales</span>
        </div>

        {/* Minutes Read */}
        <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-emerald-200 space-y-1">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
            <Clock size={16} className="text-emerald-600" />
            <span>Minutes Read</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-baloo">
            {minutesRead} <span className="text-xs font-normal text-slate-500">Mins</span>
          </p>
          <span className="text-[10px] text-emerald-700 font-medium block">This Week Goal Met</span>
        </div>

        {/* Words Learned */}
        <div className="p-4 rounded-2xl bg-[#FEFCE8] border border-yellow-200 space-y-1">
          <div className="flex items-center gap-2 text-yellow-900 font-bold text-xs">
            <Award size={16} className="text-yellow-600" />
            <span>Words Mastered</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-baloo">
            {wordsLearned} <span className="text-xs font-normal text-slate-500">Words</span>
          </p>
          <span className="text-[10px] text-yellow-800 font-medium block">Bilingual Vocabulary</span>
        </div>

        {/* Weekly Reading Days */}
        <div className="p-4 rounded-2xl bg-[#FFF1F2] border border-rose-200 space-y-1">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
            <Star size={16} className="text-rose-600" />
            <span>Weekly Goal</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-baloo">
            {daysActive}/5 <span className="text-xs font-normal text-slate-500">Days</span>
          </p>
          <span className="text-[10px] text-rose-700 font-medium block">Active Reader Streak</span>
        </div>
      </div>
    </div>
  );
};
