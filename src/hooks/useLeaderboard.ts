import { useState, useEffect, useMemo } from 'react';
import type { LeaderboardEntry } from '../types/progress';
import type { LeaderboardSortOption } from '../types/quiz';
import {
  listenToClassroomLeaderboard,
  getClassroomLeaderboard,
} from '../services/leaderboard.service';

export interface UseLeaderboardReturn {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  sortBy: LeaderboardSortOption;
  setSortBy: (option: LeaderboardSortOption) => void;
  refresh: () => Promise<void>;
}

export function useLeaderboard(
  classroomId?: string,
  initialSort: LeaderboardSortOption = 'xp'
): UseLeaderboardReturn {
  const [rawLeaderboard, setRawLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<LeaderboardSortOption>(initialSort);

  useEffect(() => {
    if (!classroomId) {
      setRawLeaderboard([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to live leaderboard updates
    const unsubscribe = listenToClassroomLeaderboard(classroomId, (items) => {
      setRawLeaderboard(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [classroomId]);

  const refresh = async (): Promise<void> => {
    if (!classroomId) return;
    try {
      setLoading(true);
      const items = await getClassroomLeaderboard(classroomId);
      setRawLeaderboard(items);
    } catch (err: any) {
      setError(err?.message || 'Failed to refresh leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const sortedLeaderboard = useMemo(() => {
    const list = [...rawLeaderboard];
    switch (sortBy) {
      case 'highest_score':
      case 'xp':
        list.sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
        break;
      case 'best_streak':
        list.sort((a, b) => (b.streak || 0) - (a.streak || 0));
        break;
      case 'lowest_mistakes':
      case 'fastest_completion':
        list.sort((a, b) => (b.attendanceXP || 0) - (a.attendanceXP || 0));
        break;
      default:
        list.sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
    }
    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [rawLeaderboard, sortBy]);

  return {
    leaderboard: sortedLeaderboard,
    loading,
    error,
    sortBy,
    setSortBy,
    refresh,
  };
}

export default useLeaderboard;
