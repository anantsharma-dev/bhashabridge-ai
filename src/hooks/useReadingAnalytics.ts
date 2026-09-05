import { useState, useEffect } from 'react';
import type { ReadingSession } from '../types/progress';
import {
  listenToReadingSessions,
  recordReadingSession,
} from '../services/analytics.service';

export interface UseReadingAnalyticsReturn {
  sessions: ReadingSession[];
  loading: boolean;
  error: string | null;
  averageFluency: number; // words per minute
  averageAccuracy: number; // percent
  totalWordsRead: number;
  logReadingSession: (
    data: Omit<ReadingSession, 'sessionId' | 'createdAt'>
  ) => Promise<void>;
}

export function useReadingAnalytics(studentId?: string): UseReadingAnalyticsReturn {
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) {
      setSessions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = listenToReadingSessions(studentId, (list) => {
      setSessions(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [studentId]);

  const logReadingSession = async (
    data: Omit<ReadingSession, 'sessionId' | 'createdAt'>
  ): Promise<void> => {
    try {
      await recordReadingSession(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to record reading session');
      throw err;
    }
  };

  const totalWordsRead = sessions.reduce((acc, s) => acc + (s.wordsRead || 0), 0);
  const averageFluency =
    sessions.length > 0
      ? Math.round(sessions.reduce((acc, s) => acc + (s.fluency || 0), 0) / sessions.length)
      : 65;
  const averageAccuracy =
    sessions.length > 0
      ? Math.round(sessions.reduce((acc, s) => acc + (s.accuracy || 0), 0) / sessions.length)
      : 82;

  return {
    sessions,
    loading,
    error,
    averageFluency,
    averageAccuracy,
    totalWordsRead,
    logReadingSession,
  };
}

export default useReadingAnalytics;
