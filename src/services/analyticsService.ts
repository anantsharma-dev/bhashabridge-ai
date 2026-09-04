export interface CohortAnalytics {
  totalStudents: number;
  averageAttendancePercent: number;
  flnMasteryPercent: number;
  averageReadingSpeedWpm: number;
  oralVocabularyMasteryPercent: number;
  attendanceTrendWeekly: { day: string; percent: number }[];
  quizScoreTrendMonthly: { week: string; averageScore: number }[];
  weakTopicsIdentified: number;
}

export interface StudentAnalytics {
  studentId: string;
  name: string;
  totalXp: number;
  starsCount: number;
  readingSpeedWpm: number; // Words Per Minute
  readingSpeedTargetWpm: number;
  pronunciationScoreAverage: number; // 0-100%
  pronunciationGainMonth: number; // e.g. +14%
  masteredVocabularyCount: number;
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
  public getCohortAnalytics(_classroomId?: string): CohortAnalytics {
    return {
      totalStudents: 28,
      averageAttendancePercent: 94,
      flnMasteryPercent: 78,
      averageReadingSpeedWpm: 46,
      oralVocabularyMasteryPercent: 82,
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
      weakTopicsIdentified: 2,
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
      pronunciationScoreAverage: 88,
      pronunciationGainMonth: 16,
      masteredVocabularyCount: 38,
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
