import React from 'react';
import { Award, BookOpen, Mic, CheckCircle2, TrendingUp } from 'lucide-react';

export interface ClassroomAnalyticsProps {
  className?: string;
}

export const ClassroomAnalytics: React.FC<ClassroomAnalyticsProps> = ({ className = '' }) => {
  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            Classroom Learning Analytics & NIPUN Milestones
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Aggregated FLN learning outcomes across oral, reading, and writing competencies
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 self-start sm:self-auto">
          <TrendingUp size={14} className="text-emerald-600" />
          +14% Growth This Month
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vocab Mastered */}
        <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-amber-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
              <Award size={15} className="text-amber-600" />
              Vocabulary Mastered
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
              Grade 2
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-baloo">
            142 <span className="text-xs font-normal text-slate-500">Words</span>
          </p>
          <div className="h-2 w-full bg-amber-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '84%' }} />
          </div>
        </div>

        {/* Stories Read */}
        <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-blue-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
              <BookOpen size={15} className="text-blue-600" />
              Stories Completed
            </span>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-200 px-2 py-0.5 rounded-full">
              Read Along
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-baloo">
            26 <span className="text-xs font-normal text-slate-500">Books</span>
          </p>
          <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '76%' }} />
          </div>
        </div>

        {/* Speaking Practice */}
        <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-emerald-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
              <Mic size={15} className="text-emerald-600" />
              Speaking Practice
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full">
              Oral Dialogues
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-baloo">
            18.5 <span className="text-xs font-normal text-slate-500">Hours</span>
          </p>
          <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
          </div>
        </div>

        {/* NIPUN Bharat Competency */}
        <div className="p-4 rounded-2xl bg-[#FAF5FF] border border-purple-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
              <CheckCircle2 size={15} className="text-purple-600" />
              NIPUN FLN Goal
            </span>
            <span className="text-[10px] font-bold text-purple-800 bg-purple-200 px-2 py-0.5 rounded-full">
              Target 2026
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-baloo">
            86% <span className="text-xs font-normal text-slate-500">Achieved</span>
          </p>
          <div className="h-2 w-full bg-purple-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: '86%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
