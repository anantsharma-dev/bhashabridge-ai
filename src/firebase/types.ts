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
