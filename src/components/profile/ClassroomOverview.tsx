import React from 'react';
import { Users, GraduationCap, CheckCircle, Award, BookOpen, FileCheck } from 'lucide-react';

export interface ClassroomOverviewProps {
  studentCount?: number;
  grades?: string;
  attendanceRate?: number;
  vocabProgress?: number;
  readingProgress?: number;
  worksheetsCompleted?: number;
  className?: string;
}

export const ClassroomOverview: React.FC<ClassroomOverviewProps> = ({
  studentCount = 28,
  grades = 'Grade 1 & Grade 2 MTB-MLE',
  attendanceRate = 94,
  vocabProgress = 78,
  readingProgress = 82,
  worksheetsCompleted = 42,
  className = '',
}) => {
  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            Classroom Cohort Overview
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Active MTB-MLE classroom metrics for GPS Dumka
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EFF6FF] text-blue-900 border border-blue-200">
          {grades}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Students */}
        <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-blue-200 space-y-1 text-left">
          <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
            <Users size={15} className="text-blue-600" />
            <span>Students</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 font-baloo">
            {studentCount}
          </p>
          <span className="text-[10px] text-slate-500 block">Enrolled Total</span>
        </div>

        {/* Grades */}
        <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-amber-200 space-y-1 text-left">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
            <GraduationCap size={15} className="text-amber-600" />
            <span>Grades</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 font-baloo">
            1 & 2
          </p>
          <span className="text-[10px] text-slate-500 block">Multi-grade</span>
        </div>

        {/* Attendance */}
        <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-emerald-200 space-y-1 text-left">
          <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
            <CheckCircle size={15} className="text-emerald-600" />
            <span>Attendance</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 font-baloo">
            {attendanceRate}%
          </p>
          <span className="text-[10px] text-slate-500 block">Present Today</span>
        </div>

        {/* Vocabulary */}
        <div className="p-3.5 rounded-2xl bg-[#FAF5FF] border border-purple-200 space-y-1 text-left">
          <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs">
            <Award size={15} className="text-purple-600" />
            <span>Vocab Goal</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 font-baloo">
            {vocabProgress}%
          </p>
          <span className="text-[10px] text-slate-500 block">FLN Mastery</span>
        </div>

        {/* Reading */}
        <div className="p-3.5 rounded-2xl bg-[#FFF1F2] border border-rose-200 space-y-1 text-left">
          <div className="flex items-center gap-1.5 text-rose-900 font-bold text-xs">
            <BookOpen size={15} className="text-rose-600" />
            <span>Reading</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 font-baloo">
            {readingProgress}%
          </p>
          <span className="text-[10px] text-slate-500 block">Fluency Rate</span>
        </div>

        {/* Worksheets */}
        <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-emerald-200 space-y-1 text-left">
          <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
            <FileCheck size={15} className="text-emerald-600" />
            <span>Worksheets</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 font-baloo">
            {worksheetsCompleted}
          </p>
          <span className="text-[10px] text-slate-500 block">Graded This Mo.</span>
        </div>
      </div>
    </div>
  );
};
