/**
 * BhashaBridge AI - Progress, Gamification, and Analytics TypeScript Types
 * Production Data Models for Jharkhand MTB-MLE Classrooms
 */

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export type ActivityType =
  | 'flashcard'
  | 'story'
  | 'worksheet'
  | 'quiz'
  | 'reading'
  | 'speech'
  | 'attendance'
  | 'teacher_bonus';

export interface LevelInfo {
  currentLevel: number;
  currentXP: number;
  currentLevelBaseXP: number;
  nextLevelXP: number;
  progressPercentage: number;
}

export interface StudentProgress {
  studentId: string;
  teacherId: string;
  classroomId: string;
  grade: string;

  // Granular XP Breakdown
  readingXP: number;
  vocabularyXP: number;
  quizXP: number;
  storyXP: number;
  speakingXP: number;
  writingXP: number;
  attendanceXP: number;
  totalXP: number;

  // Progression Metrics
  level: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD in Asia/Kolkata

  // Volume Counters
  masteredWords: number;
  completedStories: number;
  completedWorksheets: number;
  completedQuizzes: number;

  // FLN Cognitive & Mastery Scores (0 - 100)
  pronunciationScore: number;
  readingFluency: number; // Words per minute or fluency %
  confidenceScore: number;
  accuracyScore: number;
  attentionScore: number;

  // Metadata
  createdAt: number;
  updatedAt: number;
}

export interface AttendanceRecord {
  attendanceId: string;
  studentId: string;
  teacherId: string;
  classroomId: string;
  date: string; // YYYY-MM-DD (Asia/Kolkata)
  status: AttendanceStatus;
  checkInTime: number; // timestamp
  remarks?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface DailyActivity {
  activityId: string;
  studentId: string;
  teacherId: string;
  activityType: ActivityType;
  activityIdRef: string; // ID of the story/quiz/card/worksheet
  xpEarned: number;
  durationSeconds: number;
  score?: number; // 0 - 100 if applicable
  createdAt: number;
}

export interface VocabularyProgress {
  id?: string;
  studentId: string;
  wordId: string;
  language: string; // 'santali' | 'hindi' | 'ho' | 'mundari' | 'kurukh'
  wordText?: string;
  meaningHindi?: string;
  correctAttempts: number;
  wrongAttempts: number;
  mastered: boolean;
  lastReviewed: number;
  difficultyScore: number; // 1 (easy) to 5 (hard)

  // SM-2 Spaced Repetition Parameters
  reviewStage: number; // 0 = new, 1 = learning, 2+ = review
  easeFactor: number; // default 2.5 (min 1.3)
  intervalDays: number; // days until next review
  nextReviewDate: string; // YYYY-MM-DD
}

export interface ReadingSession {
  sessionId: string;
  studentId: string;
  storyId: string;
  readingTime: number; // seconds
  wordsRead: number;
  accuracy: number; // 0 - 100
  fluency: number; // words per minute
  pronunciation: number; // 0 - 100
  confidence: number; // 0 - 100
  createdAt: number;
}

export interface SpeechSession {
  sessionId: string;
  studentId: string;
  teacherId: string;
  sentence: string;
  transcript: string;
  accuracy: number; // 0 - 100
  pronunciation: number; // 0 - 100
  fluency: number; // 0 - 100
  confidence: number; // 0 - 100
  feedback: string;
  phonemeErrors?: string[];
  missedWords?: string[];
  createdAt: number;
}

export interface StreakHistory {
  id?: string;
  studentId: string;
  date: string; // YYYY-MM-DD in Asia/Kolkata
  completedToday: boolean;
  xpEarned: number;
  timestamp: number;
}

export interface Badge {
  badgeId: string;
  studentId: string;
  title: string;
  description: string;
  icon: string; // Emoji or SVG identifier
  category: 'story' | 'vocabulary' | 'streak' | 'quiz' | 'reading' | 'speaking' | 'eco' | 'art';
  earnedAt: number;
}

export interface LeaderboardEntry {
  studentId: string;
  classroomId: string;
  studentName: string;
  avatar: string;
  rank: number;
  totalXP: number;
  streak: number;
  attendanceXP: number;
  level: number;
}

export interface OfflineSyncOperation {
  operationId: string;
  collection: string;
  documentId: string;
  payload: Record<string, any>;
  timestamp: number;
  status: 'pending' | 'synced' | 'failed';
  retryCount?: number;
  error?: string;
}

export interface ClassroomAnalyticsSummary {
  classroomId: string;
  todayAttendanceRate: number;
  presentStudentsCount: number;
  totalStudentsCount: number;
  averageXP: number;
  topPerformerName: string;
  topPerformerXP: number;
  readingFluencyAverage: number; // WPM
  vocabularyMasteryPercent: number;
  weeklyActiveStudents: number;
  speakingPracticeCount: number;
  quizCompletionRate: number;
}

// Chart-ready aggregated data points for Recharts
export interface TimeSeriesPoint {
  label: string; // e.g. "Mon", "Day 1", "Week 1", or "2026-09-01"
  value: number;
  secondaryValue?: number;
}

export interface AnalyticsChartData {
  weeklyXP: TimeSeriesPoint[];
  monthlyXP: TimeSeriesPoint[];
  readingTrend: TimeSeriesPoint[];
  attendanceTrend: TimeSeriesPoint[];
  vocabularyGrowth: TimeSeriesPoint[];
  pronunciationGrowth: TimeSeriesPoint[];
  quizTrend: TimeSeriesPoint[];
}
