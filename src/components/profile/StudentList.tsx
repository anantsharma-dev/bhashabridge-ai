import React from 'react';
import { motion } from 'framer-motion';
import { Star, AlertCircle, Sparkles } from 'lucide-react';

export interface StudentItem {
  id: string;
  name: string;
  nativeScript: string;
  grade: string;
  motherTongue: string;
  progressPercent: number;
  badge?: 'star' | 'needs_help' | 'on_track';
  avatarEmoji: string;
}

export interface StudentListProps {
  className?: string;
}

export const StudentList: React.FC<StudentListProps> = ({ className = '' }) => {
  const students: StudentItem[] = [
    {
      id: 's1',
      name: 'Ravi Marandi',
      nativeScript: 'ᱨᱚᱵᱤ ᱢᱟᱨᱟᱱᱰᱤ',
      grade: 'Grade 2',
      motherTongue: 'Santali',
      progressPercent: 92,
      badge: 'star',
      avatarEmoji: '👦',
    },
    {
      id: 's2',
      name: 'Pooja Hansda',
      nativeScript: 'ᱯᱩᱡᱟ ᱦᱟᱸᱥᱫᱟᱜ',
      grade: 'Grade 2',
      motherTongue: 'Santali',
      progressPercent: 88,
      badge: 'star',
      avatarEmoji: '👧',
    },
    {
      id: 's3',
      name: 'Amit Murmu',
      nativeScript: 'ᱚᱢᱤᱛ ᱢᱩᱨᱢᱩ',
      grade: 'Grade 1',
      motherTongue: 'Santali',
      progressPercent: 54,
      badge: 'needs_help',
      avatarEmoji: '👦',
    },
    {
      id: 's4',
      name: 'Sunita Hembrom',
      nativeScript: 'ᱥᱩᱱᱤᱛᱟ ᱦᱮᱢᱵᱽᱨᱚᱢ',
      grade: 'Grade 1',
      motherTongue: 'Santali',
      progressPercent: 78,
      badge: 'on_track',
      avatarEmoji: '👧',
    },
  ];

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 font-baloo">
            Classroom Students & Individual Mastery
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Monitor each child's bilingual progress and provide targeted phonics support
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500">
          Showing 4 of 28 Students
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {students.map((student) => {
          const radius = 20;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (student.progressPercent / 100) * circumference;

          return (
            <motion.div
              key={student.id}
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3 select-none"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shadow-2xs">
                  {student.avatarEmoji}
                </div>

                {/* Mini Circular Progress Ring */}
                <div className="relative flex items-center justify-center w-12 h-12">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r={radius} stroke="#E2E8F0" strokeWidth="5" fill="transparent" />
                    <circle
                      cx="25"
                      cy="25"
                      r={radius}
                      stroke={student.progressPercent >= 80 ? '#22C55E' : '#F59E0B'}
                      strokeWidth="5"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute text-[11px] font-extrabold text-slate-800 font-baloo">
                    {student.progressPercent}%
                  </span>
                </div>
              </div>

              <div className="space-y-0.5">
                <h4 className="text-sm font-extrabold text-slate-900 font-baloo">
                  {student.name}
                </h4>
                <p className="text-xs font-semibold text-slate-700 font-olchiki">
                  {student.nativeScript}
                </p>
                <p className="text-[11px] text-slate-500">
                  {student.grade} • {student.motherTongue}
                </p>
              </div>

              {/* Status Badge */}
              <div className="pt-2 border-t border-slate-100">
                {student.badge === 'star' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    Star Student ⭐
                  </span>
                )}
                {student.badge === 'needs_help' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
                    <AlertCircle size={12} className="text-rose-600" />
                    Needs Help in Reading 💡
                  </span>
                )}
                {student.badge === 'on_track' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <Sparkles size={12} className="text-emerald-600" />
                    On Track
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
