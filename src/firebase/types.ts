import type { TeacherProfile, StudentProfile, Classroom, ClassroomStudentRecord } from '../types/auth';

export type { TeacherProfile, StudentProfile, Classroom, ClassroomStudentRecord };

export interface SchoolRecord {
  id: string;
  name: string;
  code: string;
  district: string;
  block: string;
  village: string;
  category: 'primary' | 'middle';
  isMTBMLECenter: boolean;
  activeTribalLanguages: string[];
}

export interface DistrictRecord {
  id: string;
  name: string;
  state: 'Jharkhand';
  primaryTribalLanguages: string[];
  totalTribalSchools: number;
  nipunTargetFLNRate: number;
}

export interface AttendanceRecord {
  id: string;
  classroomId: string;
  date: string; // YYYY-MM-DD
  teacherId: string;
  records: {
    studentId: string;
    studentName: string;
    status: 'present' | 'absent' | 'late';
  }[];
  createdAt: number;
  synced: boolean;
}

export interface AssignmentRecord {
  id: string;
  classroomId: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  dueDate: string; // YYYY-MM-DD
  worksheetId?: string;
  quizId?: string;
  assignedBy: string;
  submissionsCount: number;
  createdAt: number;
}

export interface WorksheetRecord {
  id: string;
  title: string;
  grade: string;
  subject: string;
  language: string;
  topic: string;
  difficulty: string;
  nipunCompetency: string;
  questionCount: number;
  contentJson: string;
  answerKeyJson: string;
  pdfUrl?: string;
  createdBy: string;
  createdAt: number;
}

export interface StoryRecord {
  id: string;
  titleHindi: string;
  titleSanthali: string;
  titleEnglish: string;
  category: string;
  gradeLevel: string;
  pagesCount: number;
  pagesJson: string;
  audioUrl?: string;
  culturalContext?: string;
  createdAt: number;
}

export interface FlashcardRecord {
  id: string;
  category: string;
  english: string;
  hindi: string;
  santhaliOlChiki: string;
  santhaliLatin: string;
  audioUrl?: string;
  imageUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  grade: string;
  curriculumTags: string[];
  createdAt: number;
}

export interface TranslationRecord {
  id: string;
  userId: string;
  sourceText: string;
  sourceLang: string;
  targetLang: string;
  translatedText: string;
  romanPronunciation: string;
  timestamp: number;
}

export interface QuizRecord {
  id: string;
  title: string;
  grade: string;
  subject: string;
  questionsJson: string;
  totalPoints: number;
  timeLimitSeconds: number;
  createdAt: number;
}

export interface StudentProgressRecord {
  id: string;
  studentId: string;
  classroomId: string;
  totalXp: number;
  starsCount: number;
  streakDays: number;
  masteredWordsCount: number;
  storiesCompletedCount: number;
  quizzesCompletedCount: number;
  nipunFLNScore: number; // 0-100
  updatedAt: number;
}

export interface BadgeRecord {
  id: string;
  studentId: string;
  badgeCode: string;
  badgeName: string;
  badgeIcon: string;
  unlockedAt: number;
  category: string;
}

export interface StreakRecord {
  id: string;
  userId: string;
  currentStreakDays: number;
  maxStreakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  historyDates: string[];
}

export interface VoiceHistoryRecord {
  id: string;
  userId: string;
  audioBlobUrl?: string;
  transcript: string;
  detectedLanguage: string;
  translatedOutput: string;
  pronunciationScore?: number;
  durationSeconds: number;
  timestamp: number;
}

export interface OfflineSyncQueueItem {
  id: string;
  collection: string;
  documentId: string;
  action: 'create' | 'update' | 'delete';
  payloadJson: string;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed';
  queuedAt: number;
  lastAttemptAt?: number;
  errorMessage?: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  pin: string;
  classroomCode: string;
  classroomId: string;
  schoolName: string;
  grade: string;
  motherTongue: string;
  nativeScript: string;
  avatarEmoji: string;
  stars: number;
  xp: number;
  streakDays: number;
  badge?: 'star' | 'needs_help' | 'on_track';
  teacherId: string;
  createdAt: number;
  updatedAt?: number;
}

export interface FlashcardHistoryRecord {
  id: string;
  studentId: string;
  cardId: string;
  category: string;
  quality: number; // 0-5
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReviewAt: number;
  timestamp: number;
}

export interface StoryHistoryRecord {
  id: string;
  studentId: string;
  storyId: string;
  storyTitle: string;
  pagesRead: number;
  totalPages: number;
  quizScore?: number;
  timeSpentSeconds: number;
  completed: boolean;
  timestamp: number;
}

export interface WorksheetHistoryRecord {
  id: string;
  worksheetId: string;
  worksheetTitle: string;
  studentId?: string;
  teacherId?: string;
  classroomId: string;
  score?: number;
  totalQuestions: number;
  submittedAnswersJson?: string;
  timestamp: number;
}

export interface LeaderboardEntryRecord {
  id: string;
  classroomId: string;
  studentId: string;
  studentName: string;
  avatarEmoji: string;
  xp: number;
  stars: number;
  rank: number;
  updatedAt: number;
}

export interface QuizAttemptRecord {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  classroomId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  answersJson: string;
  passed: boolean;
  xpEarned: number;
  starsEarned: number;
  timeSpentSeconds?: number;
  timestamp: number;
}

export interface DistrictAnalytics {
  district: string;
  totalSchools: number;
  totalTeachers: number;
  totalStudents: number;
  averageFLNMastery: number;
  attendanceRate: number;
  activeLanguages: string[];
  topPerformingSchools: { schoolName: string; masteryPercent: number }[];
  weakTopics: { topic: string; masteryPercent: number }[];
  lastUpdated: number;
}
