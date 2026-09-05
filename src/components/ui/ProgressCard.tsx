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
  color: string;
  barColor: string;
  icon: React.ReactNode;
  hint: string;
}

export interface ProgressCardProps {
  className?: string;
  vocabularyMastered?: number;
  speakingPhrases?: number;
  readingCards?: number;
  nipunScore?: number;
  accuracyScore?: number;
  readingFluency?: number;
  pronunciationScore?: number;
  goalPercent?: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  className = '',
  vocabularyMastered = 28,
  speakingPhrases = 15,
  readingCards = 8,
  accuracyScore = 82,
  readingFluency = 64,
  pronunciationScore = 78,
  goalPercent,
}) => {
  const vocabTarget = 35;
  const speakingTarget = 20;
  const readingTarget = 10;

  const vocabPercent = Math.min(100, Math.round((vocabularyMastered / vocabTarget) * 100));
  const speakingPercent = Math.min(100, pronunciationScore || Math.round((speakingPhrases / speakingTarget) * 100));
  const readingPercent = Math.min(100, Math.round((readingCards / readingTarget) * 100));
  const countingPercent = Math.min(100, accuracyScore || 90);

  const overallGoal = goalPercent ?? Math.round((vocabPercent + speakingPercent + readingPercent + countingPercent) / 4);

  const items: ProgressItemData[] = [
    {
      id: 'vocab',
      label: 'Vocabulary Mastered',
      hindiLabel: 'शब्द ज्ञान (Spaced Repetition)',
      current: vocabularyMastered,
      total: vocabTarget,
      unit: 'words',
      percent: vocabPercent,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      barColor: '#22C55E',
      icon: <BookOpen size={18} className="text-emerald-600" />,
      hint: `${vocabularyMastered} words in memory with SM-2`,
    },
    {
      id: 'speaking',
      label: 'Speaking & Pronunciation',
      hindiLabel: 'मौखिक उच्चारण अभ्यास',
      current: pronunciationScore || speakingPhrases,
      total: 100,
      unit: '% score',
      percent: speakingPercent,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      barColor: '#2563EB',
      icon: <Mic size={18} className="text-blue-600" />,
      hint: 'Indigenous phoneme clarity in Santali & Hindi',
    },
    {
      id: 'reading',
      label: 'Reading Practice',
      hindiLabel: 'पठन अभ्यास (Fluency)',
      current: readingCards,
      total: readingTarget,
      unit: 'stories',
      percent: readingPercent,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      barColor: '#F59E0B',
      icon: <BookMarked size={18} className="text-amber-600" />,
      hint: `Speed: ~${readingFluency} words per minute`,
    },
    {
      id: 'counting',
      label: 'Quiz & Cognitive Accuracy',
      hindiLabel: 'मूल्यांकन एवं शुद्धता',
      current: accuracyScore,
      total: 100,
      unit: '% accuracy',
      percent: countingPercent,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      barColor: '#8B5CF6',
      icon: <Hash size={18} className="text-purple-600" />,
      hint: 'Foundational literacy & numeracy answers',
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
              Grade 1–2 Multilingual Learning • Live Firestore
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-baloo">
            Foundational Learning Progress
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-blue-200 text-blue-900 text-xs font-bold shadow-2xs">
          <CheckCircle2 size={16} className="text-blue-600" />
          <span>Classroom Goal: {overallGoal}% Completed</span>
        </div>
      </div>

      {/* Progress Items Grid */}
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

      {/* Classroom milestone encouragement banner */}
      <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-amber-200/80 flex items-center gap-3">
        <span className="text-xl">🌟</span>
        <p className="text-xs sm:text-sm font-medium text-amber-950 leading-relaxed">
          <strong>Daily Milestone:</strong> Multilingual learners achieved <strong>{overallGoal}% mastery</strong> in Santali and Hindi foundational competencies today. Keep the conversation going!
        </p>
      </div>
    </div>
  );
};

export default ProgressCard;
