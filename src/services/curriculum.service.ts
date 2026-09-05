/**
 * BhashaBridge AI - Production Curriculum Service
 * Queries curriculum units, subjects, chapters, and curriculum packs
 * with Firestore listeners and IndexedDB offline cache.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { indexedDbEngine } from '../offline/indexedDbEngine';
import type {
  Subject,
  Chapter,
  CurriculumPack,
  CurriculumSearchFilter,
  GradeLevel,
} from '../types/curriculum';
import {
  PRODUCTION_SUBJECTS,
  PRODUCTION_CHAPTERS,
  PRODUCTION_CURRICULUM_PACKS,
} from '../data/curriculumData';

class CurriculumService {
  /**
   * 1. Get Subjects by Grade or All
   */
  public async getSubjects(grade?: GradeLevel): Promise<Subject[]> {
    try {
      let q = query(collection(db, 'subjects'));
      if (grade) {
        q = query(q, where('grade', '==', grade));
      }
      const snap = await getDocs(q);
      if (!snap.empty) {
        const subjects = snap.docs.map((d) => d.data() as Subject);
        for (const sub of subjects) {
          indexedDbEngine.setItem('curriculum' as any, { id: `sub_${sub.subjectId}`, ...sub }).catch(() => {});
        }
        return subjects;
      }
    } catch (err) {
      console.warn('Firestore getSubjects failed, trying offline cache:', err);
    }

    try {
      const cached = await indexedDbEngine.getAll<any>('curriculum');
      const filtered = cached.filter((c) => c && c.subjectId && (!grade || c.grade === grade));
      if (filtered.length > 0) return filtered;
    } catch {}

    return grade
      ? PRODUCTION_SUBJECTS.filter((s) => s.grade === grade)
      : PRODUCTION_SUBJECTS;
  }

  /**
   * 2. Real-time Subject Listener
   */
  public listenToSubjects(
    callback: (subjects: Subject[]) => void,
    grade?: GradeLevel
  ): Unsubscribe {
    let q = query(collection(db, 'subjects'));
    if (grade) {
      q = query(q, where('grade', '==', grade));
    }
    return onSnapshot(
      q,
      (snap) => {
        const subjects = snap.docs.map((d) => d.data() as Subject);
        for (const sub of subjects) {
          indexedDbEngine.setItem('curriculum' as any, { id: `sub_${sub.subjectId}`, ...sub }).catch(() => {});
        }
        callback(subjects);
      },
      (err) => console.warn('Error listening to subjects:', err)
    );
  }

  /**
   * 3. Get Chapters by Subject and Grade
   */
  public async getChapters(subjectId: string, grade?: GradeLevel): Promise<Chapter[]> {
    try {
      let q = query(collection(db, 'chapters'), where('subjectId', '==', subjectId));
      if (grade) {
        q = query(q, where('grade', '==', grade));
      }
      q = query(q, orderBy('chapterNumber', 'asc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const chapters = snap.docs.map((d) => d.data() as Chapter);
        for (const ch of chapters) {
          indexedDbEngine.setItem('curriculum' as any, { id: `chap_${ch.chapterId}`, ...ch }).catch(() => {});
        }
        return chapters;
      }
    } catch (err) {
      console.warn(`Firestore getChapters failed for ${subjectId}:`, err);
    }

    try {
      const cached = await indexedDbEngine.getAll<any>('curriculum');
      const filtered = cached.filter((c) => c && c.chapterId && c.subjectId === subjectId);
      if (filtered.length > 0) return filtered;
    } catch {}

    return PRODUCTION_CHAPTERS.filter((ch) => ch.subjectId === subjectId);
  }

  /**
   * 4. Get Single Chapter by ID
   */
  public async getChapterById(chapterId: string): Promise<Chapter | null> {
    try {
      const snap = await getDoc(doc(db, 'chapters', chapterId));
      if (snap.exists()) {
        const data = snap.data() as Chapter;
        indexedDbEngine.setItem('curriculum' as any, { id: `chap_${data.chapterId}`, ...data }).catch(() => {});
        return data;
      }
    } catch {
      const cached = await indexedDbEngine.getItem<Chapter>('curriculum', `chap_${chapterId}`);
      if (cached) return cached;
    }

    return PRODUCTION_CHAPTERS.find((c) => c.chapterId === chapterId) || null;
  }

  /**
   * 5. Search Curriculum Metadata
   */
  public async searchCurriculum(filter: CurriculumSearchFilter): Promise<{
    subjects: Subject[];
    chapters: Chapter[];
  }> {
    const qTerm = (filter.query || '').trim().toLowerCase();
    const allSubjects = await this.getSubjects(filter.grade);
    const matchedSubjects = allSubjects.filter((s) => {
      if (filter.subject && s.subjectCode !== filter.subject && s.subjectId !== filter.subject) return false;
      if (!qTerm) return true;
      return (
        s.subjectName.toLowerCase().includes(qTerm) ||
        s.description.toLowerCase().includes(qTerm) ||
        s.subjectCode.toLowerCase().includes(qTerm)
      );
    });

    let matchedChapters: Chapter[] = [];
    for (const sub of matchedSubjects) {
      const chaps = await this.getChapters(sub.subjectId, filter.grade);
      matchedChapters.push(...chaps);
    }

    if (qTerm) {
      matchedChapters = matchedChapters.filter((ch) => {
        return (
          ch.titleEnglish.toLowerCase().includes(qTerm) ||
          ch.titleHindi.toLowerCase().includes(qTerm) ||
          ch.titleSantali.toLowerCase().includes(qTerm) ||
          ch.summary.toLowerCase().includes(qTerm) ||
          ch.keywords.some((k) => k.toLowerCase().includes(qTerm))
        );
      });
    }

    return {
      subjects: matchedSubjects.slice(0, filter.limitCount || 20),
      chapters: matchedChapters.slice(0, filter.limitCount || 40),
    };
  }

  /**
   * 6. Get Downloadable Curriculum Packs
   */
  public async getCurriculumPacks(grade?: GradeLevel): Promise<CurriculumPack[]> {
    try {
      let q = query(collection(db, 'curriculumPacks'));
      if (grade) {
        q = query(q, where('grade', '==', grade));
      }
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as CurriculumPack);
      }
    } catch {}

    return grade
      ? PRODUCTION_CURRICULUM_PACKS.filter((p) => p.grade === grade)
      : PRODUCTION_CURRICULUM_PACKS;
  }
}

export const curriculumService = new CurriculumService();
export default curriculumService;
