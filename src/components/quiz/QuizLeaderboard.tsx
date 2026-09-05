import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, Clock, Sparkles, WifiOff } from 'lucide-react';
import type { QuizLeaderboardEntry, LeaderboardSortOption } from '../../types/quiz';
import { quizService } from '../../services/quiz.service';

export interface QuizLeaderboardProps {
  quizId: string;
  quizTitle?: string;
  classroomId?: string;
  className?: string;
}

export const QuizLeaderboard: React.FC<QuizLeaderboardProps> = ({
  quizId,
  quizTitle = 'Classroom Quiz Leaderboard',
  classroomId: _classroomId = 'class_dumka_g2',
  className = '',
}) => {
  const [entries, setEntries] = useState<QuizLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<LeaderboardSortOption>('highest_score');
  const isOffline = typeof navigator !== 'undefined' ? !navigator.onLine : false;

  useEffect(() => {
    setLoading(true);

    // Initial fetch
    quizService
      .getQuizLeaderboard(quizId)
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Real-time listener
    const unsub = quizService.listenToQuizLeaderboard(quizId, (updated) => {
      setEntries(updated);
      setLoading(false);
    });

    return () => unsub();
  }, [quizId]);

  const sortedEntries = React.useMemo(() => {
    const list = [...entries];
    switch (sortBy) {
      case 'highest_score':
        list.sort((a, b) => b.score - a.score || a.timeTakenSeconds - b.timeTakenSeconds);
        break;
      case 'xp':
        list.sort((a, b) => b.earnedXP - a.earnedXP);
        break;
      case 'best_streak':
        list.sort((a, b) => (b.streak || 0) - (a.streak || 0));
        break;
      case 'fastest_completion':
        list.sort((a, b) => a.timeTakenSeconds - b.timeTakenSeconds);
        break;
      default:
        list.sort((a, b) => b.score - a.score);
    }
    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [entries, sortBy]);

  const topThree = sortedEntries.slice(0, 3);
  const remaining = sortedEntries.slice(3);

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 2:
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 3:
        return 'bg-orange-100 text-orange-900 border-orange-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#F1EFE8] p-5 sm:p-6 shadow-2xs space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 shadow-2xs">
            <Trophy size={20} />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-baloo">
              {quizTitle}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Real-time Classroom Rankings & NIPUN Stars (ᱞᱟᱦᱟᱱᱛᱤ)
            </p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSortBy('highest_score')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              sortBy === 'highest_score'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Highest Score
          </button>
          <button
            type="button"
            onClick={() => setSortBy('xp')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              sortBy === 'xp'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            XP Earned
          </button>
          <button
            type="button"
            onClick={() => setSortBy('best_streak')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              sortBy === 'best_streak'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Streak
          </button>
        </div>
      </div>

      {isOffline && (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <WifiOff size={14} className="shrink-0" />
          <span>Viewing locally cached classroom leaderboard. Syncs automatically when back online.</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-slate-400 animate-pulse">
          Loading classroom standings...
        </div>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topThree.map((item) => (
                <div
                  key={item.studentId}
                  className={`p-4 rounded-2xl border flex flex-col items-center text-center space-y-2 relative ${getMedalColor(
                    item.rank
                  )}`}
                >
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/70">
                    Rank #{item.rank}
                  </span>

                  <div className="w-12 h-12 rounded-full bg-white shadow-2xs flex items-center justify-center text-2xl">
                    {item.avatar || '👦'}
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900 line-clamp-1">{item.studentName}</h4>
                    <p className="text-[11px] font-bold text-slate-600">
                      {item.score} Marks ({item.percentage}%)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[11px] font-bold">
                    <span className="flex items-center gap-0.5 text-purple-700">
                      <Sparkles size={12} /> +{item.earnedXP} XP
                    </span>
                    <span className="flex items-center gap-0.5 text-orange-600">
                      <Flame size={12} /> {item.streak}d
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Remaining Ranked List */}
          {remaining.length > 0 && (
            <div className="space-y-2 divide-y divide-slate-100">
              {remaining.map((item) => (
                <div
                  key={item.studentId}
                  className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-black text-slate-400">#{item.rank}</span>
                    <span className="text-base">{item.avatar || '👦'}</span>
                    <span className="font-bold text-slate-900">{item.studentName}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-slate-600">{item.score} pts</span>
                    <span className="text-purple-700 font-bold">+{item.earnedXP} XP</span>
                    <span className="text-slate-400 text-[11px] flex items-center gap-0.5">
                      <Clock size={11} /> {item.timeTakenSeconds}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {entries.length === 0 && (
            <div className="py-10 text-center space-y-2">
              <Medal size={32} className="mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-500">No attempts yet for this quiz.</p>
              <p className="text-[11px] text-slate-400">
                Be the first student in your class to complete it and earn +40 XP! 🌟
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizLeaderboard;
