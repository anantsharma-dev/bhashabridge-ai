import { useState, useEffect } from 'react';
import type { LeaderboardEntry } from '../types/progress';
import {
  listenToClassroomLeaderboard,
  getClassroomLeaderboard,
} from '../services/leaderboard.service';

export interface UseLeaderboardReturn {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useLeaderboard(classroomId?: string): UseLeaderboardReturn {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classroomId) {
      setLeaderboard([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to live leaderboard updates
    const unsubscribe = listenToClassroomLeaderboard(classroomId, (items) => {
      setLeaderboard(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [classroomId]);

  const refresh = async (): Promise<void> => {
    if (!classroomId) return;
    try {
      setLoading(true);
      const items = await getClassroomLeaderboard(classroomId);
      setLeaderboard(items);
    } catch (err: any) {
      setError(err?.message || 'Failed to refresh leaderboard');
    } finally {
      setLoading(false);
    }
  };

  return {
    leaderboard,
    loading,
    error,
    refresh,
  };
}

export default useLeaderboard;
