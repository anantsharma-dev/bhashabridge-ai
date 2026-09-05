/**
 * BhashaBridge AI - Production Quiz Service
 * Handles quiz definitions, submissions, automatic grading, +40 XP awards, and Firestore sync.
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { indexedDbEngine } from '../offline/indexedDbEngine';
import { awardStudentXP, enqueueOfflineOperation } from './progress.service';
import type { QuizAttemptRecord } from '../firebase/types';

export type QuestionType =
  | 'multiple_choice'
  | 'picture_match'
  | 'voice_answer'
  | 'reading_aloud'
  | 'drawing_trace'
  | 'fill_blanks'
  | 'sequence';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  promptHindi: string;
  promptSanthali: string;
  options?: string[];
  correctAnswer: string;
  imageUrl?: string;
  audioPrompt?: string;
  targetScript?: string;
  points: number;
}

export interface QuizAttemptResult {
  quizId: string;
  score: number;
  totalPoints: number;
  accuracyPercent: number;
  xpEarned: number;
  badgesEarned: string[];
  completedAt: number;
}

export interface QuizPack {
  id: string;
  title: string;
  hindiTitle: string;
  grade: string;
  subject: string;
  questions: QuizQuestion[];
  timeLimitSeconds: number;
}

export interface QuizSubmissionInput {
  studentId: string;
  classroomId: string;
  quizId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  timeSpentSeconds: number;
  answersJson?: string;
}

export interface QuizSubmissionResult {
  attemptId: string;
  score: number;
  passed: boolean;
  xpEarned: number;
  starsEarned: number;
  accuracy: number;
}

export const SAMPLE_QUIZZES: QuizPack[] = [
  {
    id: 'quiz-animals-g1',
    title: 'Forest Animals MTB-MLE Quiz',
    hindiTitle: 'वन्य जीव मूल्यांकन प्रश्नोत्तरी',
    grade: 'Grade 1–2',
    subject: 'Language MTB-MLE',
    timeLimitSeconds: 180,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        promptHindi: 'हाथी को संताली (ओल चिकी) में क्या कहते हैं?',
        promptSanthali: 'ᱦᱟᱹᱛᱤ ᱧᱩᱛᱩᱢ ᱪᱮᱫ ᱠᱟᱱᱟ?',
        options: ['ᱦᱟᱹᱛᱤ (Hati)', 'ᱛᱟᱹᱨᱩᱵ (Tarub)', 'ᱡᱤᱞ (Jil)', 'ᱥᱮᱛᱟ (Seta)'],
        correctAnswer: 'ᱦᱟᱹᱛᱤ (Hati)',
        points: 20,
      },
      {
        id: 'q2',
        type: 'picture_match',
        promptHindi: 'चित्र में दिख रहे पक्षी का सही नाम चुनें (मयूर / मोर):',
        promptSanthali: 'ᱪᱤᱛᱟᱹᱨ ᱨᱮ ᱢᱮᱱᱟᱭ ᱢᱟᱨᱟᱜ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ ᱾',
        imageUrl: 'peacock',
        options: ['ᱢᱟᱨᱟᱜ (Marag / Peacock)', 'ᱠᱩᱞ (Kul / Tiger)', 'ᱦᱟᱺᱥ (Hans / Swan)'],
        correctAnswer: 'ᱢᱟᱨᱟᱜ (Marag / Peacock)',
        points: 20,
      },
      {
        id: 'q3',
        type: 'voice_answer',
        promptHindi: 'माइक दबाकर संताली में बोलें: "हाथी" (ᱦᱟᱹᱛᱤ)',
        promptSanthali: 'ᱢᱟᱭᱤᱠ ᱛᱮ "ᱦᱟᱹᱛᱤ" ᱨᱚᱲ ᱢᱮ ᱾',
        correctAnswer: 'ᱦᱟᱹᱛᱤ',
        targetScript: 'Hati',
        points: 25,
      },
      {
        id: 'q4',
        type: 'drawing_trace',
        promptHindi: 'ओल चिकी अक्षर "ᱚ" (LA) को उंगली से अनुरेखित करें:',
        promptSanthali: 'ᱚᱞ ᱪᱤᱠᱤ "ᱚ" ᱟᱠᱷᱚᱨ ᱚᱞ ᱢᱮ ᱾',
        correctAnswer: 'ᱚ',
        points: 20,
      },
      {
        id: 'q5',
        type: 'fill_blanks',
        promptHindi: 'रिक्त स्थान भरें: ᱛᱟᱹ___ (बाघ / Tarub)',
        promptSanthali: 'ᱠᱷᱟᱹᱞᱤ ᱴᱷᱟᱶ ᱯᱮᱨᱮᱡ ᱢᱮ: ᱛᱟᱹ___ ᱾',
        options: ['ᱨᱩᱵ', 'ᱛᱤ', 'ᱨᱟᱜ', 'ᱞᱮ'],
        correctAnswer: 'ᱨᱩᱵ',
        points: 15,
      },
    ],
  },
  {
    id: 'quiz-math-g1',
    title: 'FLN Counting 1–10 Quiz',
    hindiTitle: 'एफएलएन संख्या ज्ञान मूल्यांकन (१-१०)',
    grade: 'Grade 1',
    subject: 'Foundational Numeracy',
    timeLimitSeconds: 120,
    questions: [
      {
        id: 'mq1',
        type: 'multiple_choice',
        promptHindi: 'संताली में "३" (तीन) को क्या कहते हैं?',
        promptSanthali: '᱓ ᱫᱚ ᱪᱮᱫ ᱠᱚ ᱢᱮᱛᱟᱜ-ᱟ?',
        options: ['ᱯᱮ (Pe)', 'ᱢᱤᱫ (Mid)', 'ᱵᱟᱨ (Bar)', 'ᱯᱩᱱ (Pun)'],
        correctAnswer: 'ᱯᱮ (Pe)',
        points: 25,
      },
      {
        id: 'mq2',
        type: 'sequence',
        promptHindi: 'संख्याओं को सही क्रम में व्यवस्थित करें (१, २, ३, ४):',
        promptSanthali: 'ᱮᱞ ᱠᱚ ᱞᱮᱠᱷᱟ ᱞᱮᱠᱟᱛᱮ ᱥᱟᱡᱟᱣ ᱢᱮ ᱾',
        options: ['ᱢᱤᱫ (1)', 'ᱵᱟᱨ (2)', 'ᱯᱮ (3)', 'ᱯᱩᱱ (4)'],
        correctAnswer: 'ᱢᱤᱫ (1), ᱵᱟᱨ (2), ᱯᱮ (3), ᱯᱩᱱ (4)',
        points: 25,
      },
    ],
  },
];

class QuizService {
  public getQuizzes(): QuizPack[] {
    return SAMPLE_QUIZZES;
  }

  public getQuizById(id: string): QuizPack | null {
    return SAMPLE_QUIZZES.find((q) => q.id === id) || SAMPLE_QUIZZES[0];
  }

  /**
   * Submit quiz attempt from interactive UI (QuizPlayer), evaluates score,
   * awards +40 XP, writes to Firestore + IndexedDB, and returns QuizAttemptResult
   */
  public submitQuizAttempt(
    quizId: string,
    userAnswers: Record<string, string>,
    studentId: string = 'stu_dumka_1',
    classroomId: string = 'class_dumka_g2'
  ): QuizAttemptResult {
    const quiz = this.getQuizById(quizId);
    if (!quiz) {
      return {
        quizId,
        score: 0,
        totalPoints: 100,
        accuracyPercent: 0,
        xpEarned: 10,
        badgesEarned: [],
        completedAt: Date.now(),
      };
    }

    let earned = 0;
    let total = 0;

    quiz.questions.forEach((q) => {
      total += q.points;
      const ans = userAnswers[q.id]?.trim().toLowerCase();
      const expected = q.correctAnswer.trim().toLowerCase();
      if (ans && (ans === expected || expected.includes(ans) || ans.includes(expected))) {
        earned += q.points;
      }
    });

    const accuracyPercent = Math.round((earned / total) * 100);
    const passed = accuracyPercent >= 60;
    // Standard rule: +40 quizXP on pass, +15 XP on attempt
    const xpEarned = passed ? 40 : 15;
    const badgesEarned: string[] = [];

    if (accuracyPercent === 100) {
      badgesEarned.push('NIPUN Mastery Star 🌟');
    }
    if (accuracyPercent >= 80) {
      badgesEarned.push('Ol Chiki Champion 🏆');
    }

    const now = Date.now();
    const attemptId = `att_${studentId}_${quizId}_${now}`;

    const record: QuizAttemptRecord = {
      id: attemptId,
      studentId,
      classroomId,
      quizId,
      quizTitle: quiz.title,
      score: earned,
      totalPoints: total,
      percentage: accuracyPercent,
      passed,
      timeSpentSeconds: quiz.timeLimitSeconds,
      xpEarned,
      starsEarned: accuracyPercent >= 90 ? 3 : passed ? 2 : 1,
      answersJson: JSON.stringify(userAnswers),
      timestamp: now,
    };

    // 1. Enqueue offline operation
    enqueueOfflineOperation('quizAttempts', attemptId, record);

    // 2. Write to Firestore & IndexedDB asynchronously
    setDoc(doc(db, 'quizAttempts', attemptId), record).catch(() => {});
    indexedDbEngine.setItem('quizzes' as any, record).catch(() => {});

    // 3. Award real student quizXP
    awardStudentXP(studentId, xpEarned, 'quiz', quizId, accuracyPercent).catch(() => {});

    const result: QuizAttemptResult = {
      quizId,
      score: earned,
      totalPoints: total,
      accuracyPercent,
      xpEarned,
      badgesEarned,
      completedAt: now,
    };

    this.saveResult(result);
    return result;
  }

  /**
   * Structured API submission
   */
  public async submitStructuredAttempt(input: QuizSubmissionInput): Promise<QuizSubmissionResult> {
    const now = Date.now();
    const passed = input.percentage >= 60;
    const xpEarned = passed ? 40 : 15;
    const starsEarned = input.percentage >= 90 ? 3 : passed ? 2 : 1;
    const attemptId = `att_${input.studentId}_${input.quizId}_${now}`;

    const record: QuizAttemptRecord = {
      id: attemptId,
      studentId: input.studentId,
      classroomId: input.classroomId,
      quizId: input.quizId,
      quizTitle: input.quizId,
      score: input.score,
      totalPoints: input.totalPoints,
      percentage: input.percentage,
      passed,
      timeSpentSeconds: input.timeSpentSeconds,
      xpEarned,
      starsEarned,
      answersJson: input.answersJson || '',
      timestamp: now,
    };

    enqueueOfflineOperation('quizAttempts', attemptId, record);

    try {
      await setDoc(doc(db, 'quizAttempts', attemptId), record);
    } catch {}
    await indexedDbEngine.setItem('quizzes' as any, record).catch(() => {});

    await awardStudentXP(input.studentId, xpEarned, 'quiz', input.quizId, input.percentage);

    return {
      attemptId,
      score: input.score,
      passed,
      xpEarned,
      starsEarned,
      accuracy: input.percentage,
    };
  }

  private saveResult(res: QuizAttemptResult) {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('bhashabridge_quiz_history');
      const list = raw ? JSON.parse(raw) : [];
      localStorage.setItem('bhashabridge_quiz_history', JSON.stringify([res, ...list].slice(0, 20)));
    } catch {
      // ignore
    }
  }

  /**
   * Fetch recent quiz attempts for a student
   */
  public async getStudentAttempts(studentId: string, limitCount: number = 10): Promise<QuizAttemptRecord[]> {
    try {
      const q = query(
        collection(db, 'quizAttempts'),
        where('studentId', '==', studentId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as QuizAttemptRecord);
    } catch {
      return [];
    }
  }
}

export const quizService = new QuizService();
export default quizService;
