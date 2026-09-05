/**
 * BhashaBridge AI - Production Flashcard Service
 * Queries curriculum flashcard library with multi-filters and IndexedDB offline cache.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { indexedDbEngine } from '../offline/indexedDbEngine';
import type { Flashcard, GradeLevel, SubjectCode, CurriculumDifficulty } from '../types/curriculum';
import { PRODUCTION_FLASHCARDS } from '../data/curriculumData';

class FlashcardService {
  /**
   * 1. Get Flashcards with Multi-filters
   */
  public async getFlashcards(options: {
    grade?: GradeLevel;
    category?: string;
    subject?: SubjectCode | string;
    difficulty?: CurriculumDifficulty;
    relatedLesson?: string;
  } = {}): Promise<Flashcard[]> {
    try {
      let q = query(collection(db, 'flashcardsLibrary'));
      if (options.grade) q = query(q, where('grade', '==', options.grade));
      if (options.category) q = query(q, where('category', '==', options.category));
      if (options.subject) q = query(q, where('subject', '==', options.subject));
      if (options.difficulty) q = query(q, where('difficulty', '==', options.difficulty));
      if (options.relatedLesson) q = query(q, where('relatedLesson', '==', options.relatedLesson));

      const snap = await getDocs(q);
      if (!snap.empty) {
        const cards = snap.docs.map((d) => d.data() as Flashcard);
        for (const c of cards) {
          indexedDbEngine.setItem('flashcards' as any, { id: `fc_${c.cardId}`, ...c }).catch(() => {});
        }
        return cards;
      }
    } catch (err) {
      console.warn('Firestore getFlashcards failed, trying offline cache:', err);
    }

    try {
      const cached = await indexedDbEngine.getAll<any>('flashcards');
      const filtered = cached.filter((c) => {
        if (options.grade && c.grade !== options.grade) return false;
        if (options.category && c.category !== options.category) return false;
        if (options.subject && c.subject !== options.subject) return false;
        if (options.difficulty && c.difficulty !== options.difficulty) return false;
        if (options.relatedLesson && c.relatedLesson !== options.relatedLesson) return false;
        return c && c.cardId;
      });
      if (filtered.length > 0) return filtered;
    } catch {}

    return PRODUCTION_FLASHCARDS.filter((c) => {
      if (options.grade && c.grade !== options.grade) return false;
      if (options.category && c.category !== options.category) return false;
      if (options.subject && c.subject !== options.subject) return false;
      if (options.difficulty && c.difficulty !== options.difficulty) return false;
      if (options.relatedLesson && c.relatedLesson !== options.relatedLesson) return false;
      return true;
    });
  }

  /**
   * 2. Real-time Flashcard Listener
   */
  public listenToFlashcards(
    grade: GradeLevel,
    callback: (cards: Flashcard[]) => void
  ): Unsubscribe {
    const q = query(collection(db, 'flashcardsLibrary'), where('grade', '==', grade));
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => d.data() as Flashcard);
        callback(list);
      },
      (err) => console.warn('Error listening to flashcards:', err)
    );
  }

  /**
   * 3. Get Single Flashcard by ID
   */
  public async getFlashcardById(cardId: string): Promise<Flashcard | null> {
    try {
      const snap = await getDoc(doc(db, 'flashcardsLibrary', cardId));
      if (snap.exists()) {
        const data = snap.data() as Flashcard;
        indexedDbEngine.setItem('flashcards' as any, { id: `fc_${data.cardId}`, ...data }).catch(() => {});
        return data;
      }
    } catch {
      const cached = await indexedDbEngine.getItem<Flashcard>('flashcards', `fc_${cardId}`);
      if (cached) return cached;
    }

    return PRODUCTION_FLASHCARDS.find((c) => c.cardId === cardId) || null;
  }

  /**
   * 4. Get Flashcards for a Specific Lesson
   */
  public async getFlashcardsForLesson(lessonId: string): Promise<Flashcard[]> {
    return this.getFlashcards({ relatedLesson: lessonId });
  }
}

export const flashcardService = new FlashcardService();
export default flashcardService;
