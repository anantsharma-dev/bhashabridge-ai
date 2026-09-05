import type { Classroom } from '../types/auth';

export interface CohortAnalytics {
  totalStudents: number;
  averageAttendancePercent: number;
  flnMasteryPercent: number;
  averageReadingSpeedWpm: number;
  oralVocabularyMasteryPercent: number;
  totalReadingMinutesWeekly: number;
  averageQuizAccuracy: number;
  totalVocabularyMastered: number;
  attendanceTrendWeekly: { day: string; percent: number }[];
  quizScoreTrendMonthly: { week: string; averageScore: number }[];
  dailyXpWeekly: { day: string; xp: number }[];
  weakTopicsIdentified: number;
  readingLevelBreakdown: {
    level1Count: number;
    level2Count: number;
    level3Count: number;
  };
}

export interface StudentAnalytics {
  studentId: string;
  name: string;
  totalXp: number;
  starsCount: number;
  readingSpeedWpm: number; // Words Per Minute
  readingSpeedTargetWpm: number;
  readingMinutes: number;
  pronunciationScoreAverage: number; // 0-100%
  pronunciationGainMonth: number; // e.g. +14%
  masteredVocabularyCount: number;
  quizAccuracy: number;
  totalQuizzesTaken: number;
  weeklyXpTrend: { day: string; xp: number }[];
}

export interface OfflineSyncStats {
  pendingSyncQueueCount: number;
  lastSyncedTimestamp: number;
  totalCachedAssetsMb: number;
  offlineReadyStatus: '100% Offline Capable' | 'Needs Sync';
}

class AnalyticsService {
  public getClassroomAnalytics(classroom: Classroom): CohortAnalytics {
    const students = classroom.students || [];
    const totalStudents = students.length || 1;

    let totalXp = 0;
    let totalReadingMinutes = 0;
    let totalVocab = 0;
    let totalQuizAcc = 0;
    let l1 = 0;
    let l2 = 0;
    let l3 = 0;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dailyXpTotals = [0, 0, 0, 0, 0, 0, 0];

    for (const s of students) {
      totalXp += s.xp || 0;
      totalReadingMinutes += s.readingMinutes || 30;
      totalVocab += s.vocabMastered || 20;
      totalQuizAcc += s.quizAccuracy || 75;

      if (s.readingLevel?.includes('Level 1') || s.grade === 'Grade 1') {
        l1 += 1;
      } else if (s.readingLevel?.includes('Level 3')) {
        l3 += 1;
      } else {
        l2 += 1;
      }

      if (Array.isArray(s.dailyXp) && s.dailyXp.length === 7) {
        for (let d = 0; d < 7; d++) {
          dailyXpTotals[d] += s.dailyXp[d];
        }
      } else {
        // distribute estimated XP
        const base = Math.round((s.xp || 500) / 14);
        for (let d = 0; d < 7; d++) {
          dailyXpTotals[d] += Math.round(base * (0.8 + 0.1 * d));
        }
      }
    }

    const avgQuizAcc = Math.round(totalQuizAcc / totalStudents);

    return {
      totalStudents,
      averageAttendancePercent: 94,
      flnMasteryPercent: Math.min(95, Math.round(avgQuizAcc * 0.95)),
      averageReadingSpeedWpm: 48,
      oralVocabularyMasteryPercent: Math.min(100, Math.round((totalVocab / (totalStudents * 50)) * 100)),
      totalReadingMinutesWeekly: totalReadingMinutes,
      averageQuizAccuracy: avgQuizAcc,
      totalVocabularyMastered: totalVocab,
      attendanceTrendWeekly: [
        { day: 'Mon', percent: 92 },
        { day: 'Tue', percent: 96 },
        { day: 'Wed', percent: 94 },
        { day: 'Thu', percent: 90 },
        { day: 'Fri', percent: 98 },
        { day: 'Sat', percent: 92 },
      ],
      quizScoreTrendMonthly: [
        { week: 'Wk 1', averageScore: Math.max(50, avgQuizAcc - 14) },
        { week: 'Wk 2', averageScore: Math.max(55, avgQuizAcc - 8) },
        { week: 'Wk 3', averageScore: Math.max(60, avgQuizAcc - 3) },
        { week: 'Wk 4', averageScore: avgQuizAcc },
      ],
      dailyXpWeekly: days.map((day, idx) => ({
        day,
        xp: dailyXpTotals[idx] || (idx + 1) * 60,
      })),
      weakTopicsIdentified: 2,
      readingLevelBreakdown: {
        level1Count: l1,
        level2Count: l2,
        level3Count: l3,
      },
    };
  }

  public getCohortAnalytics(_classroomId?: string): CohortAnalytics {
    return {
      totalStudents: 28,
      averageAttendancePercent: 94,
      flnMasteryPercent: 78,
      averageReadingSpeedWpm: 46,
      oralVocabularyMasteryPercent: 82,
      totalReadingMinutesWeekly: 240,
      averageQuizAccuracy: 88,
      totalVocabularyMastered: 248,
      attendanceTrendWeekly: [
        { day: 'Mon', percent: 92 },
        { day: 'Tue', percent: 96 },
        { day: 'Wed', percent: 94 },
        { day: 'Thu', percent: 90 },
        { day: 'Fri', percent: 98 },
        { day: 'Sat', percent: 92 },
      ],
      quizScoreTrendMonthly: [
        { week: 'Wk 1', averageScore: 68 },
        { week: 'Wk 2', averageScore: 74 },
        { week: 'Wk 3', averageScore: 82 },
        { week: 'Wk 4', averageScore: 88 },
      ],
      dailyXpWeekly: [
        { day: 'Mon', xp: 210 },
        { day: 'Tue', xp: 295 },
        { day: 'Wed', xp: 380 },
        { day: 'Thu', xp: 340 },
        { day: 'Fri', xp: 460 },
        { day: 'Sat', xp: 390 },
        { day: 'Sun', xp: 230 },
      ],
      weakTopicsIdentified: 2,
      readingLevelBreakdown: {
        level1Count: 10,
        level2Count: 14,
        level3Count: 4,
      },
    };
  }

  public getStudentAnalytics(studentId: string): StudentAnalytics {
    return {
      studentId,
      name: 'Ravi Marandi',
      totalXp: 1240,
      starsCount: 48,
      readingSpeedWpm: 48,
      readingSpeedTargetWpm: 60,
      readingMinutes: 52,
      pronunciationScoreAverage: 88,
      pronunciationGainMonth: 16,
      masteredVocabularyCount: 42,
      quizAccuracy: 92,
      totalQuizzesTaken: 12,
      weeklyXpTrend: [
        { day: 'Mon', xp: 45 },
        { day: 'Tue', xp: 60 },
        { day: 'Wed', xp: 90 },
        { day: 'Thu', xp: 75 },
        { day: 'Fri', xp: 110 },
        { day: 'Sat', xp: 85 },
        { day: 'Sun', xp: 50 },
      ],
    };
  }

  public getOfflineSyncStats(): OfflineSyncStats {
    return {
      pendingSyncQueueCount: 0,
      lastSyncedTimestamp: Date.now() - 3600000 * 4,
      totalCachedAssetsMb: 420,
      offlineReadyStatus: '100% Offline Capable',
    };
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
