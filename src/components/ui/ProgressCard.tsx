import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Mic, BookMarked, Hash, CheckCircle2 } from 'lucide-react';

export interface ProgressItemData {
  id: string;
  label: string;
  hindiLabel: string;
  current: number;
  total: number;
  unit: string;
  percent: number;
  color: string; // Tailwind or Hex
  barColor: string;
  icon: React.ReactNode;
  hint: string;
}

export interface ProgressCardProps {
  className?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ className = '' }) => {
  const items: ProgressItemData[] = [
    {
      id: 'vocab',
      label: 'Vocabulary Completed',
      hindiLabel: 'शब्द ज्ञान',
      current: 28,
      total: 35,
      unit: 'words',
      percent: 80,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      barColor: '#22C55E',
      icon: <BookOpen size={18} className="text-emerald-600" />,
      hint: 'Animals, family & classroom objects',
    },
    {
      id: 'speaking',
      label: 'Speaking Practice',
      hindiLabel: 'मौखिक अभ्यास',
      current: 15,
      total: 20,
      unit: 'phrases',
      percent: 75,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      barColor: '#2563EB',
      icon: <Mic size={18} className="text-blue-600" />,
      hint: 'Hindi ↔ Santhali sentence practice',
    },
    {
      id: 'reading',
      label: 'Reading Practice',
      hindiLabel: 'पठन अभ्यास',
      current: 8,
      total: 10,
      unit: 'cards',
      percent: 80,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      barColor: '#F59E0B',
      icon: <BookMarked size={18} className="text-amber-600" />,
      hint: 'Picture cards with Ol Chiki script',
    },
    {
      id: 'counting',
      label: 'Counting Practice',
      hindiLabel: 'संख्या ज्ञान',
      current: 18,
      total: 20,
      unit: 'numbers',
      percent: 90,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      barColor: '#8B5CF6',
      icon: <Hash size={18} className="text-purple-600" />,
      hint: 'Numbers 1 to 20 with counting blocks',
    },
  ];

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ECFDF5] text-emerald-800 border border-emerald-200">
              NIPUN Bharat FLN
            </span>
            <span className="text-xs font-medium text-slate-500">
              Grade 1–2 Multilingual Learning
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-baloo">
            Foundational Learning Progress
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-blue-200 text-blue-900 text-xs font-bold shadow-2xs">
          <CheckCircle2 size={16} className="text-blue-600" />
          <span>Classroom Goal: 82% Completed</span>
        </div>
      </div>

      {/* Progress Items Grid (2 cols on tablet landscape, 1 on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 font-baloo">
                    {item.label}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 font-devanagari">
                    {item.hindiLabel}
                  </p>
                </div>
              </div>

              {/* Milestone Count */}
              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-slate-900 font-baloo">
                  {item.current}/{item.total}
                </span>
                <span className="text-xs text-slate-500 ml-1 font-medium">{item.unit}</span>
              </div>
            </div>

            {/* Rounded Friendly Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full transition-all"
                  style={{ backgroundColor: item.barColor }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{item.hint}</span>
                <span className="font-bold text-slate-700">{item.percent}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cheerful classroom milestone encouragement banner */}
      <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-amber-200/80 flex items-center gap-3">
        <span className="text-xl">🌟</span>
        <p className="text-xs sm:text-sm font-medium text-amber-950 leading-relaxed">
          <strong>Daily Milestone:</strong> Children achieved <strong>80% mastery</strong> in Santhali animal vocabulary today. Keep the conversation going!
        </p>
      </div>
    </div>
  );
};
