import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Database, Sparkles } from 'lucide-react';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { seedFirestoreDatabase } from '../../services/seedService';

export interface LeaderboardCardProps {
  classroomId?: string;
  currentStudentId?: string;
  limitCount?: number;
  className?: string;
  onNotification?: (message: string, type: 'success' | 'info' | 'error') => void;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  classroomId = 'class_dumka_g2',
  currentStudentId,
  limitCount = 5,
  className = '',
  onNotification,
}) => {
  const { leaderboard, loading, refresh } = useLeaderboard(classroomId);
  const [isSeeding, setIsSeeding] = useState(false);

  const displayList = leaderboard.slice(0, limitCount);

  const handleSeed = async () => {
    try {
      setIsSeeding(true);
      if (onNotification) {
        onNotification('Seeding 50 students, 500 vocabulary & 30 attendance records...', 'info');
      }
      await seedFirestoreDatabase({ classroomId });
      await refresh();
      if (onNotification) {
        onNotification('Classroom leaderboard populated with 50 students! 🎉', 'success');
      }
    } catch (err: any) {
      if (onNotification) {
        onNotification('Seeding error: ' + (err?.message || 'Failed'), 'error');
      }
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div
      className={`p-5 sm:p-6 rounded-[24px] bg-white border border-[#F1EFE8] shadow-2xs space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 shadow-2xs">
            <Trophy size={20} className="text-amber-700" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-baloo">
                Classroom Leaderboard (ᱛᱟᱹᱞᱠᱟᱹ)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Live Firestore
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Grade 2 Multilingual Classroom Rankings • Dumka
            </p>
          </div>
        </div>

        {/* Action Button: Seed Data */}
        <button
          type="button"
          disabled={isSeeding}
          onClick={handleSeed}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
          title="Seed realistic classroom records"
        >
          <Database size={13} className={isSeeding ? 'animate-spin' : ''} />
          <span>{isSeeding ? 'Seeding...' : 'Seed 50 Students'}</span>
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400 font-semibold animate-pulse">
            Loading live classroom rankings...
          </div>
        ) : displayList.length > 0 ? (
          displayList.map((entry) => {
            const isSelf = currentStudentId && entry.studentId === currentStudentId;
            return (
              <motion.div
                key={entry.studentId}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                  isSelf
                    ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-400/20'
                    : 'bg-[#FFFDF7] border-slate-200/70 hover:bg-slate-50/60'
                }`}
              >
                {/* Left: Rank, Avatar & Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 text-center font-black text-sm shrink-0 ${
                      entry.rank === 1
                        ? 'text-amber-500 text-base'
                        : entry.rank === 2
                        ? 'text-slate-400 text-base'
                        : entry.rank === 3
                        ? 'text-amber-700 text-base'
                        : 'text-slate-500'
                    }`}
                  >
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                  </span>

                  <span className="text-2xl shrink-0">{entry.avatar || '👦'}</span>

                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 truncate font-baloo text-sm">
                      {entry.studentName}
                      {isSelf && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-blue-200 text-blue-900 font-bold">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 font-bold">
                        Level {entry.level || 1}
                      </span>
                      <span>•</span>
                      <span>Attendance {entry.attendanceXP || 0} XP</span>
                    </div>
                  </div>
                </div>

                {/* Right: Streak & XP */}
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 text-orange-800 font-bold border border-orange-200 text-[11px]"
                    title="Consecutive Days Streak"
                  >
                    <Flame size={13} className="text-orange-500 fill-orange-500" />
                    <span>{entry.streak}d</span>
                  </div>

                  <div
                    className="px-3 py-1 rounded-xl bg-blue-50 text-blue-900 font-extrabold border border-blue-200 text-xs"
                    title="Total Student XP"
                  >
                    {entry.totalXP} XP
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <Sparkles size={24} className="mx-auto text-amber-500" />
            <p className="text-xs font-bold text-slate-700">
              No students recorded in this classroom yet.
            </p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Click <strong>"Seed 50 Students"</strong> above to load realistic Dumka Grade 2 students and see live rankings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardCard;
