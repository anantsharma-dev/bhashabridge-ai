import { useState, useEffect } from 'react';
import type { SpeechSession } from '../types/progress';
import {
  listenToSpeechSessions,
  recordSpeechSession,
} from '../services/analytics.service';

export interface UseSpeechAnalyticsReturn {
  sessions: SpeechSession[];
  loading: boolean;
  error: string | null;
  averagePronunciation: number;
  averageConfidence: number;
  averageAccuracy: number;
  logSpeechSession: (
    data: Omit<SpeechSession, 'sessionId' | 'createdAt'>
  ) => Promise<void>;
}

export function useSpeechAnalytics(studentId?: string): UseSpeechAnalyticsReturn {
  const [sessions, setSessions] = useState<SpeechSession[]>([]);
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

    const unsubscribe = listenToSpeechSessions(studentId, (list) => {
      setSessions(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [studentId]);

  const logSpeechSession = async (
    data: Omit<SpeechSession, 'sessionId' | 'createdAt'>
  ): Promise<void> => {
    try {
      await recordSpeechSession(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to record speech session');
      throw err;
    }
  };

  const averagePronunciation =
    sessions.length > 0
      ? Math.round(sessions.reduce((acc, s) => acc + (s.pronunciation || 0), 0) / sessions.length)
      : 80;
  const averageConfidence =
    sessions.length > 0
      ? Math.round(sessions.reduce((acc, s) => acc + (s.confidence || 0), 0) / sessions.length)
      : 82;
  const averageAccuracy =
    sessions.length > 0
      ? Math.round(sessions.reduce((acc, s) => acc + (s.accuracy || 0), 0) / sessions.length)
      : 85;

  return {
    sessions,
    loading,
    error,
    averagePronunciation,
    averageConfidence,
    averageAccuracy,
    logSpeechSession,
  };
}

export default useSpeechAnalytics;
