/**
 * BhashaBridge AI - Production Quiz Engine Types
 * Covers complete Classes 1-5 assessment platform, Bloom's taxonomy,
 * NIPUN FLN competency analytics, adaptive engine, offline attempts, and report cards.
 */

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'match_following'
  | 'picture_identification'
  | 'audio_identification'
  | 'sequence_ordering'
  | 'short_answer'
  | 'speaking_answer'
  | 'drawing_upload'
  | 'reading_comprehension'
  | 'listening_comprehension';

export type BloomsLevel =
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create';

export type CompetencyArea =
  | 'reading'
  | 'writing'
  | 'listening'
  | 'speaking'
  | 'vocabulary'
  | 'grammar'
  | 'ecology'
  | 'numeracy'
  | 'civics'
  | 'art_appreciation'
  | 'sel';

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type CurriculumBoard = 'NCERT' | 'NIPUN' | 'JHARKHAND';
export type QuizStatus = 'draft' | 'published' | 'archived';
export type AssignmentStatus = 'active' | 'upcoming' | 'completed' | 'archived';
export type SyncStatus = 'synced' | 'pending_sync' | 'conflict';

// ----------------------------------------------------------------------
// 1. QUIZ DEFINITIONS
// ----------------------------------------------------------------------

export interface Quiz {
  quizId: string;
  teacherId: string;
  classroomId: string;
  title: string;
  description: string;
  grade: string; // e.g. "Grade 1", "Grade 2"
  subject: string; // e.g. "Language MTB-MLE", "Foundational Numeracy"
  language: string; // "hindi" | "santali" | "english" | "bilingual"
  difficulty: QuizDifficulty;
  curriculumBoard: CurriculumBoard;
  chapter: string;
  competency: string;
  totalMarks: number;
  timeLimitMinutes: number;
  shuffleQuestions: boolean;
  negativeMarking: boolean;
  passingMarks: number;
  status: QuizStatus;
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
  questionCount: number;
}

// ----------------------------------------------------------------------
// 2. QUIZ QUESTIONS
// ----------------------------------------------------------------------

export interface Question {
  questionId: string;
  quizId: string;
  type: QuestionType;
  question: string;
  questionHindi?: string;
  questionSanthali?: string;
  options?: string[];
  correctAnswer: string | string[] | Record<string, string>;
  explanation: string;
  difficulty: QuestionDifficulty;
  competency: CompetencyArea;
  bloomsLevel: BloomsLevel;
  audioUrl?: string;
  imageUrl?: string;
  hint?: string;
  tags: string[];
  points: number;
  language: string;
}

// ----------------------------------------------------------------------
// 3. QUIZ ATTEMPTS & SUBMISSIONS
// ----------------------------------------------------------------------

export interface QuizAttemptAnswer {
  questionId: string;
  userAnswer: any;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpentSeconds: number;
}

export interface QuizAttempt {
  attemptId: string;
  quizId: string;
  studentId: string;
  teacherId: string;
  classroomId: string;
  startedAt: number;
  submittedAt?: number;
  timeTakenSeconds: number;
  score: number;
  percentage: number;
  passed: boolean;
  answers: QuizAttemptAnswer[];
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  earnedXP: number;
  deviceOffline: boolean;
  syncStatus: SyncStatus;
}

// ----------------------------------------------------------------------
// 4. QUIZ RESULTS & ANALYTICS
// ----------------------------------------------------------------------

export interface QuestionMistake {
  questionId: string;
  question: string;
  userAnswer: any;
  correctAnswer: any;
  explanation: string;
  category: 'weak_vocabulary' | 'weak_phoneme' | 'weak_grammar' | 'conceptual';
}

export interface QuizRecommendations {
  nextStoryRecommendation?: string;
  nextFlashcardCategory?: string;
  nextWorksheetDifficulty?: string;
  remedialNotes?: string;
}

export interface QuizResult {
  resultId: string;
  studentId: string;
  quizId: string;
  teacherId: string;
  classroomId: string;
  competencyScores: Record<CompetencyArea | string, number>;
  topicScores: Record<string, number>;
  bloomsScores: Record<BloomsLevel | string, number>;
  mistakes: QuestionMistake[];
  strengths: string[];
  recommendations: QuizRecommendations;
  generatedAt: number;
}

// ----------------------------------------------------------------------
// 5. QUESTION BANK
// ----------------------------------------------------------------------

export interface QuestionBankItem {
  questionId: string;
  subject: string;
  grade: string;
  language: string;
  chapter: string;
  topic: string;
  difficulty: QuestionDifficulty;
  competency: CompetencyArea | string;
  bloomsLevel: BloomsLevel;
  question: string;
  questionHindi?: string;
  questionSanthali?: string;
  options?: string[];
  answer: string | string[] | Record<string, string>;
  explanation: string;
  audio?: string;
  image?: string;
  tags: string[];
  source: CurriculumBoard;
}

// ----------------------------------------------------------------------
// 6. QUIZ ASSIGNMENTS
// ----------------------------------------------------------------------

export interface Assignment {
  assignmentId: string;
  quizId: string;
  teacherId: string;
  classroomId: string;
  assignedDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  startTime?: number;
  endTime?: number;
  attemptLimit?: number;
  status: AssignmentStatus;
  allowLateSubmission: boolean;
  allowOfflineAttempt: boolean;
  students: string[]; // empty array indicates all students in classroom
}

// ----------------------------------------------------------------------
// 7. ADAPTIVE ENGINE
// ----------------------------------------------------------------------

export interface AdaptiveProfile {
  studentId: string;
  subject: string;
  currentDifficulty: QuizDifficulty;
  rollingAccuracy: number;
  totalAttempts: number;
  history: Array<{
    attemptId: string;
    accuracy: number;
    difficulty: QuizDifficulty;
    timestamp: number;
  }>;
  recommendedNextDifficulty: QuizDifficulty;
  updatedAt: number;
}

// ----------------------------------------------------------------------
// 8. REPORT CARDS & SUMMARIES
// ----------------------------------------------------------------------

export interface QuizReportCard {
  studentId: string;
  studentName: string;
  teacherName: string;
  schoolName: string;
  district: string;
  quizSummary: {
    totalQuizzesTaken: number;
    averageScorePercent: number;
    passedRatePercent: number;
    totalXPEarned: number;
  };
  competencyRadar: Record<string, number>;
  topicPerformance: Array<{ topic: string; masteryPercent: number }>;
  bloomLevels: Record<string, number>;
  recommendations: string[];
  attendancePercent: number;
  totalXP: number;
  currentLevel: number;
  generatedAt: number;
}

// ----------------------------------------------------------------------
// 9. LEADERBOARD
// ----------------------------------------------------------------------

export type LeaderboardSortOption =
  | 'highest_score'
  | 'xp'
  | 'fastest_completion'
  | 'lowest_mistakes'
  | 'best_streak';

export interface QuizLeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  avatar: string;
  score: number;
  percentage: number;
  earnedXP: number;
  timeTakenSeconds: number;
  wrongCount: number;
  streak: number;
  submittedAt: number;
}
