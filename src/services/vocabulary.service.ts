/**
 * BhashaBridge AI - Vocabulary Service
 * Production Firestore Service for SuperMemo SM-2 Spaced Repetition, Word Mastery, and Flashcards
 */

import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { VocabularyProgress, OfflineSyncOperation } from '../types/progress';
import { enqueueOfflineOperation, getKolkataDateString, awardStudentXP } from './progress.service';

/**
 * SuperMemo SM-2 Algorithm calculation
 */
export function calculateSM2(
  quality: number,
  reviewStage: number,
  easeFactor: number,
  previousIntervalDays: number
): {
  newReviewStage: number;
  newEaseFactor: number;
  intervalDays: number;
} {
  const q = Math.max(1, Math.min(5, quality));

  let newEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  let newReviewStage = reviewStage;
  let intervalDays = 1;

  if (q >= 3) {
    if (reviewStage === 0) {
      intervalDays = 1;
      newReviewStage = 1;
    } else if (reviewStage === 1) {
      intervalDays = 6;
      newReviewStage = 2;
    } else {
      intervalDays = Math.round(previousIntervalDays * newEaseFactor);
      newReviewStage = reviewStage + 1;
    }
  } else {
    newReviewStage = 0;
    intervalDays = 1;
  }

  return {
    newReviewStage,
    newEaseFactor: Number(newEaseFactor.toFixed(2)),
    intervalDays: Math.max(1, intervalDays),
  };
}

/**
 * 1. Record flashcard review with SM-2 algorithm
 */
export async function reviewVocabularyWord(
  studentId: string,
  wordId: string,
  language: string = 'santali',
  isCorrect: boolean = true,
  wordText?: string,
  meaningHindi?: string,
  qualityRating?: number
): Promise<{
  progress: VocabularyProgress;
  xpEarned: number;
  isMastered: boolean;
  justMastered: boolean;
  offlineOp: OfflineSyncOperation;
}> {
  const now = Date.now();
  const quality = typeof qualityRating === 'number' ? qualityRating : isCorrect ? 5 : 2;

  const docId = `vocab_${studentId}_${wordId}`;
  const vocabRef = doc(db, 'vocabularyProgress', docId);

  const snap = await getDoc(vocabRef);
  const existing = snap.exists() ? (snap.data() as VocabularyProgress) : null;

  const currentStage = existing?.reviewStage ?? 0;
  const currentEF = existing?.easeFactor ?? 2.5;
  const currentInterval = existing?.intervalDays ?? 1;
  const prevCorrect = existing?.correctAttempts ?? 0;
  const prevWrong = existing?.wrongAttempts ?? 0;

  const sm2 = calculateSM2(quality, currentStage, currentEF, currentInterval);

  const nextDate = new Date(Date.now() + sm2.intervalDays * 24 * 60 * 60 * 1000);
  const nextReviewDate = getKolkataDateString(nextDate);

  const newCorrectAttempts = isCorrect ? prevCorrect + 1 : prevCorrect;
  const newWrongAttempts = !isCorrect ? prevWrong + 1 : prevWrong;

  const wasMastered = existing?.mastered ?? false;
  const isNowMastered = sm2.newReviewStage >= 3 && newCorrectAttempts >= 3;
  const justMastered = !wasMastered && isNowMastered;

  const difficultyScore = Math.min(5, Math.max(1, Math.round(6 - sm2.newEaseFactor)));

  const payload: VocabularyProgress = {
    id: docId,
    studentId,
    wordId,
    language,
    wordText: wordText || existing?.wordText || '',
    meaningHindi: meaningHindi || existing?.meaningHindi || '',
    correctAttempts: newCorrectAttempts,
    wrongAttempts: newWrongAttempts,
    mastered: isNowMastered,
    lastReviewed: now,
    difficultyScore,
    reviewStage: sm2.newReviewStage,
    easeFactor: sm2.newEaseFactor,
    intervalDays: sm2.intervalDays,
    nextReviewDate,
  };

  const offlineOp = enqueueOfflineOperation('vocabularyProgress', docId, payload);
  await setDoc(vocabRef, payload, { merge: true });

  // Award +5 XP on correct attempt
  const xpEarned = isCorrect ? 5 : 1;
  awardStudentXP(studentId, xpEarned, 'flashcard', wordId).catch(console.warn);

  return {
    progress: payload,
    xpEarned,
    isMastered: isNowMastered,
    justMastered,
    offlineOp,
  };
}

/**
 * 2. Fetch all vocabulary progress items for a student
 */
export async function getStudentVocabularyProgress(
  studentId: string
): Promise<VocabularyProgress[]> {
  try {
    const q = query(
      collection(db, 'vocabularyProgress'),
      where('studentId', '==', studentId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as VocabularyProgress);
  } catch (err) {
    console.error(`Error fetching vocabulary progress for ${studentId}:`, err);
    return [];
  }
}

/**
 * 3. Real-time Vocabulary Progress Listener
 */
export function listenToStudentVocabulary(
  studentId: string,
  callback: (list: VocabularyProgress[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'vocabularyProgress'),
    where('studentId', '==', studentId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as VocabularyProgress);
      callback(list);
    },
    (err) => {
      console.warn(`Vocabulary listener error for ${studentId}:`, err);
    }
  );
}

/**
 * 4. Get Words Due for Review Today (SM-2 review schedule)
 */
export async function getDueVocabularyReviews(
  studentId: string
): Promise<VocabularyProgress[]> {
  const todayStr = getKolkataDateString();
  try {
    const q = query(
      collection(db, 'vocabularyProgress'),
      where('studentId', '==', studentId),
      where('nextReviewDate', '<=', todayStr)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as VocabularyProgress);
  } catch (err) {
    console.error(`Error fetching due reviews for ${studentId}:`, err);
    return [];
  }
}

import { indexedDbEngine } from '../offline/indexedDbEngine';
import type { VocabularyWord, GradeLevel, SubjectCode } from '../types/curriculum';
import { PRODUCTION_VOCABULARY } from '../data/curriculumData';

/**
 * 5. Curriculum Vocabulary Catalog Queries
 */
class VocabularyService {
  public async getVocabularyWords(options: {
    grade?: GradeLevel;
    subject?: SubjectCode | string;
    category?: string;
    relatedLesson?: string;
  } = {}): Promise<VocabularyWord[]> {
    try {
      let q = query(collection(db, 'vocabulary'));
      if (options.grade) q = query(q, where('grade', '==', options.grade));
      if (options.subject) q = query(q, where('subject', '==', options.subject));
      if (options.category) q = query(q, where('category', '==', options.category));
      if (options.relatedLesson) q = query(q, where('relatedLesson', '==', options.relatedLesson));

      const snap = await getDocs(q);
      if (!snap.empty) {
        const words = snap.docs.map((d) => d.data() as VocabularyWord);
        for (const w of words) {
          indexedDbEngine.setItem('vocabulary' as any, { id: `voc_${w.wordId}`, ...w }).catch(() => {});
        }
        return words;
      }
    } catch (err) {
      console.warn('Firestore getVocabularyWords failed, checking cache:', err);
    }

    try {
      const cached = await indexedDbEngine.getAll<any>('vocabulary');
      const filtered = cached.filter((w) => {
        if (options.grade && w.grade !== options.grade) return false;
        if (options.subject && w.subject !== options.subject) return false;
        if (options.category && w.category !== options.category) return false;
        if (options.relatedLesson && w.relatedLesson !== options.relatedLesson) return false;
        return w && w.wordId;
      });
      if (filtered.length > 0) return filtered;
    } catch {}

    return PRODUCTION_VOCABULARY.filter((w) => {
      if (options.grade && w.grade !== options.grade) return false;
      if (options.subject && w.subject !== options.subject) return false;
      if (options.category && w.category !== options.category) return false;
      if (options.relatedLesson && w.relatedLesson !== options.relatedLesson) return false;
      return true;
    });
  }

  public async getWordById(wordId: string): Promise<VocabularyWord | null> {
    try {
      const snap = await getDoc(doc(db, 'vocabulary', wordId));
      if (snap.exists()) {
        const data = snap.data() as VocabularyWord;
        indexedDbEngine.setItem('vocabulary' as any, { id: `voc_${data.wordId}`, ...data }).catch(() => {});
        return data;
      }
    } catch {
      const cached = await indexedDbEngine.getItem<VocabularyWord>('vocabulary', `voc_${wordId}`);
      if (cached) return cached;
    }

    return PRODUCTION_VOCABULARY.find((w) => w.wordId === wordId) || null;
  }

  public async searchVocabulary(term: string): Promise<VocabularyWord[]> {
    const clean = term.trim().toLowerCase();
    if (!clean) return [];
    const all = await this.getVocabularyWords();
    return all.filter(
      (w) =>
        w.english.toLowerCase().includes(clean) ||
        w.hindi.toLowerCase().includes(clean) ||
        w.santaliOlChiki.includes(clean) ||
        w.romanSantali.toLowerCase().includes(clean) ||
        w.definition.toLowerCase().includes(clean) ||
        w.tags.some((t) => t.toLowerCase().includes(clean))
    );
  }

  public async getCategories(): Promise<string[]> {
    const all = await this.getVocabularyWords();
    const set = new Set(all.map((w) => w.category));
    return Array.from(set);
  }

  // Preserve SM-2 methods on service instance
  public reviewWord = reviewVocabularyWord;
  public getStudentProgress = getStudentVocabularyProgress;
  public listenToProgress = listenToStudentVocabulary;
  public getDueReviews = getDueVocabularyReviews;
}

export const vocabularyService = new VocabularyService();
export default vocabularyService;

