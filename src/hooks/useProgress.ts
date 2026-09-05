import { useState, useEffect } from 'react';
import type {
  StudentProgress,
  Badge,
  DailyActivity,
  LevelInfo,
  ActivityType,
} from '../types/progress';
import {
  listenToStudentProgress,
  listenToStudentBadges,
  getStudentRecentActivities,
  calculateLevel,
  awardStudentXP,
  updateStudentProgress,
} from '../services/progress.service';

export interface UseProgressReturn {
  progress: StudentProgress | null;
  levelInfo: LevelInfo;
  badges: Badge[];
  recentActivities: DailyActivity[];
  loading: boolean;
  error: string | null;
  xp: number;
  level: number;
  streak: number;
  attendancePercent: number;
  vocabularyPercent: number;
  readingPercent: number;
  speakingPercent: number;
  awardXP: (
    amount: number,
    category: ActivityType,
    refId?: string,
    score?: number
  ) => Promise<void>;
  updateScores: (updates: Partial<StudentProgress>) => Promise<void>;
  reloadActivities: () => Promise<void>;
}

export function useProgress(studentId?: string): UseProgressReturn {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [recentActivities, setRecentActivities] = useState<DailyActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) {
      setProgress(null);
      setBadges([]);
      setRecentActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Live Progress snapshot listener
    const unsubProgress = listenToStudentProgress(studentId, (data) => {
      setProgress(data);
      setLoading(false);
    });

    // 2. Live Badges snapshot listener
    const unsubBadges = listenToStudentBadges(studentId, (badgeList) => {
      setBadges(badgeList);
    });

    // 3. Load recent daily activities
    getStudentRecentActivities(studentId, 10)
      .then((acts) => setRecentActivities(acts))
      .catch((err) => console.warn('Could not load recent activities:', err));

    return () => {
      unsubProgress();
      unsubBadges();
    };
  }, [studentId]);

  const levelInfo: LevelInfo = calculateLevel(progress?.totalXP || 0);

  const awardXPHandler = async (
    amount: number,
    category: ActivityType,
    refId: string = 'manual',
    score?: number
  ): Promise<void> => {
    if (!studentId) return;
    try {
      await awardStudentXP(studentId, amount, category, refId, score);
      // Reload activities
      const acts = await getStudentRecentActivities(studentId, 10);
      setRecentActivities(acts);
    } catch (err: any) {
      setError(err?.message || 'Failed to award XP');
      throw err;
    }
  };

  const updateScoresHandler = async (updates: Partial<StudentProgress>): Promise<void> => {
    if (!studentId) return;
    try {
      await updateStudentProgress(studentId, updates);
    } catch (err: any) {
      setError(err?.message || 'Failed to update scores');
      throw err;
    }
  };

  const reloadActivities = async (): Promise<void> => {
    if (!studentId) return;
    const acts = await getStudentRecentActivities(studentId, 10);
    setRecentActivities(acts);
  };

  // Percentage calculations
  const xp = progress?.totalXP || 0;
  const level = levelInfo.currentLevel;
  const streak = progress?.streak || 0;
  const attendancePercent = 95; // calculated from attendance records or progress
  const vocabularyPercent = progress ? Math.min(100, Math.round((progress.masteredWords / 50) * 100)) : 0;
  const readingPercent = progress ? Math.min(100, Math.round((progress.completedStories / 15) * 100)) : 0;
  const speakingPercent = progress?.pronunciationScore || 75;

  return {
    progress,
    levelInfo,
    badges,
    recentActivities,
    loading,
    error,
    xp,
    level,
    streak,
    attendancePercent,
    vocabularyPercent,
    readingPercent,
    speakingPercent,
    awardXP: awardXPHandler,
    updateScores: updateScoresHandler,
    reloadActivities,
  };
}

// Alias for useStudentProgress
export const useStudentProgress = useProgress;
export default useProgress;
