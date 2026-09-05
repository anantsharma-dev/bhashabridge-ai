import React, { useState } from 'react';
import {
  FileCheck2,
  Clock,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Database,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { seedSprint3QuizzesAndAssessments } from '../../services/quizSeedService';

export interface QuizDashboardCardProps {
  teacherId?: string;
  classroomId?: string;
  assignedCount?: number;
  completedTodayCount?: number;
  averageScore?: number;
  pendingCount?: number;
  weeklyAccuracy?: number;
  weakCompetencies?: Array<{ name: string; score: number }>;
  onNotification?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const QuizDashboardCard: React.FC<QuizDashboardCardProps> = ({
  teacherId = 'teacher_dumka_01',
  classroomId = 'class_dumka_g2',
  assignedCount = 3,
  completedTodayCount = 24,
  averageScore = 84,
  pendingCount = 4,
  weeklyAccuracy = 82,
  weakCompetencies = [
    { name: 'Ol Chiki Consonant Conjuncts', score: 58 },
    { name: 'Number Regrouping within 50', score: 64 },
  ],
  onNotification,
}) => {
  const navigate = useNavigate();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    try {
      setIsSeeding(true);
      onNotification?.('Seeding 100 quizzes, 2,000 questions & 500 attempts into Firestore...', 'info');
      const stats = await seedSprint3QuizzesAndAssessments({ teacherId, classroomId });
      onNotification?.(
        `Successfully seeded ${stats.quizzesCount} quizzes and ${stats.questionsCount} questions across 50 classrooms! 🎉`,
        'success'
      );
    } catch (err: any) {
      onNotification?.('Seeding failed: ' + (err?.message || 'Error'), 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="p-6 rounded-[24px] bg-white border border-[#F1EFE8] shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 shadow-2xs">
            <FileCheck2 size={20} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-baloo">
                Classroom Assessment Platform (ᱵᱤᱱᱤᱰ)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                Live Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Grade 1–5 Continuous FLN Evaluation & Adaptive Feedback
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSeeding}
            onClick={handleSeed}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Database size={13} className={isSeeding ? 'animate-spin' : ''} />
            <span>{isSeeding ? 'Seeding...' : 'Seed 100 Quizzes & 2,000 Questions'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/quizzes')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <span>Open Quiz Center</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Assigned Today</span>
            <BookOpen size={14} className="text-amber-500" />
          </div>
          <div className="text-xl font-black text-slate-900">{assignedCount} Quizzes</div>
          <div className="text-[10px] text-slate-500 font-semibold">{pendingCount} Submissions Pending</div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed Today</span>
            <Clock size={14} className="text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-800">{completedTodayCount} Attempts</div>
          <div className="text-[10px] text-emerald-700 font-semibold">100% Offline-Safe Synced</div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Average Score</span>
            <TrendingUp size={14} className="text-blue-600" />
          </div>
          <div className="text-xl font-black text-blue-900">{averageScore}%</div>
          <div className="text-[10px] text-blue-700 font-semibold">Target: 75% NIPUN Target</div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-slate-200/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Weekly Accuracy</span>
            <Sparkles size={14} className="text-purple-600" />
          </div>
          <div className="text-xl font-black text-purple-900">{weeklyAccuracy}%</div>
          <div className="text-[10px] text-purple-700 font-semibold">Bloom: Remember & Apply</div>
        </div>
      </div>

      {/* Weak Competency Remedial Alert */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-amber-200 text-amber-950 shrink-0">
            <AlertCircle size={15} />
          </span>
          <div>
            <span className="font-extrabold text-amber-950 block">
              Remedial Intervention Needed ({weakCompetencies.length} Competencies &lt; 65%)
            </span>
            <p className="text-amber-900 text-[11px]">
              {weakCompetencies.map((c) => `${c.name} (${c.score}%)`).join(' • ')}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onNotification?.('Generated 15-minute remedial phoneme & sand-tray tracing lesson.', 'info');
          }}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-2xs"
        >
          Assign Remedial Practice
        </button>
      </div>
    </div>
  );
};

export default QuizDashboardCard;
