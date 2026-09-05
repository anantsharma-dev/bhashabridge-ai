/**
 * BhashaBridge AI - Production Lesson Service
 * Manages curriculum lessons, lesson graph dependencies, prerequisites,
 * and student lesson completion tracking with Firestore & IndexedDB offline cache.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { indexedDbEngine } from '../offline/indexedDbEngine';
import { enqueueOfflineOperation, awardStudentXP } from './progress.service';
import type { Lesson, LessonGraphNode, GradeLevel, SubjectCode } from '../types/curriculum';
import { PRODUCTION_LESSONS } from '../data/curriculumData';

class LessonService {
  /**
   * 1. Get Lessons by Chapter, Subject, or Grade
   */
  public async getLessons(
    chapterId?: string,
    subject?: SubjectCode | string,
    grade?: GradeLevel
  ): Promise<Lesson[]> {
    try {
      let q = query(collection(db, 'lessons'));
      if (chapterId) {
        q = query(q, where('chapterId', '==', chapterId));
      }
      if (subject) {
        q = query(q, where('subject', '==', subject));
      }
      if (grade) {
        q = query(q, where('grade', '==', grade));
      }

      const snap = await getDocs(q);
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as Lesson);
        for (const l of list) {
          indexedDbEngine.setItem('lessons' as any, { id: `les_${l.lessonId}`, ...l }).catch(() => {});
        }
        return list;
      }
    } catch (err) {
      console.warn('Firestore getLessons failed, checking offline cache:', err);
    }

    try {
      const cached = await indexedDbEngine.getAll<any>('lessons');
      const filtered = cached.filter((l) => {
        if (chapterId && l.chapterId !== chapterId) return false;
        if (subject && l.subject !== subject) return false;
        if (grade && l.grade !== grade) return false;
        return l && l.lessonId;
      });
      if (filtered.length > 0) return filtered;
    } catch {}

    return PRODUCTION_LESSONS.filter((l) => {
      if (chapterId && l.chapterId !== chapterId) return false;
      if (subject && l.subject !== subject) return false;
      if (grade && l.grade !== grade) return false;
      return true;
    });
  }

  /**
   * 2. Real-time Lesson Listener
   */
  public listenToLessons(
    chapterId: string,
    callback: (lessons: Lesson[]) => void
  ): Unsubscribe {
    const q = query(collection(db, 'lessons'), where('chapterId', '==', chapterId));
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => d.data() as Lesson);
        callback(list);
      },
      (err) => console.warn('Error listening to lessons:', err)
    );
  }

  /**
   * 3. Get Single Lesson by ID
   */
  public async getLessonById(lessonId: string): Promise<Lesson | null> {
    try {
      const snap = await getDoc(doc(db, 'lessons', lessonId));
      if (snap.exists()) {
        const data = snap.data() as Lesson;
        indexedDbEngine.setItem('lessons' as any, { id: `les_${data.lessonId}`, ...data }).catch(() => {});
        return data;
      }
    } catch {
      const cached = await indexedDbEngine.getItem<Lesson>('lessons', `les_${lessonId}`);
      if (cached) return cached;
    }

    return PRODUCTION_LESSONS.find((l) => l.lessonId === lessonId) || null;
  }

  /**
   * 4. Lesson Graph & Prerequisites Engine
   */
  public async getLessonGraph(grade?: GradeLevel, subject?: string): Promise<LessonGraphNode[]> {
    const lessons = await this.getLessons(undefined, subject, grade);
    return lessons.map((l) => ({
      lessonId: l.lessonId,
      title: l.title,
      subject: l.subject,
      grade: l.grade,
      prerequisites: l.prerequisiteLessonIds || [],
      unlocks: l.nextLessonIds || [],
      competency: l.competency,
    }));
  }

  /**
   * 5. Get Direct Prerequisites for a Lesson
   */
  public async getPrerequisites(lessonId: string): Promise<Lesson[]> {
    const target = await this.getLessonById(lessonId);
    if (!target || !target.prerequisiteLessonIds || target.prerequisiteLessonIds.length === 0) {
      return [];
    }

    const prereqs: Lesson[] = [];
    for (const pid of target.prerequisiteLessonIds) {
      const p = await this.getLessonById(pid);
      if (p) prereqs.push(p);
    }
    return prereqs;
  }

  /**
   * 6. Mark Lesson Completed by Student (Syncs XP, unlocks graph)
   */
  public async completeLesson(
    studentId: string,
    lessonId: string,
    timeSpentMinutes: number = 30
  ): Promise<{ success: boolean; earnedXP: number }> {
    const now = Date.now();
    const earnedXP = 30; // 30 XP per completed lesson
    const docId = `${studentId}_${lessonId}`;

    const completionDoc = {
      completionId: docId,
      studentId,
      lessonId,
      timeSpentMinutes,
      earnedXP,
      completedAt: now,
    };

    // 1. Enqueue offline operation
    enqueueOfflineOperation('lessonCompletions', docId, completionDoc);

    // 2. Write to Firestore
    try {
      await setDoc(doc(db, 'lessonCompletions', docId), completionDoc, { merge: true });
    } catch {}

    // 3. Award XP to student progress
    await awardStudentXP(studentId, earnedXP, 'story', lessonId, 100, timeSpentMinutes * 60);

    return { success: true, earnedXP };
  }

  /**
   * 7. Get Completed Lesson IDs for a Student
   */
  public async getStudentCompletedLessons(studentId: string): Promise<string[]> {
    try {
      const q = query(
        collection(db, 'lessonCompletions'),
        where('studentId', '==', studentId)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data().lessonId as string);
    } catch {
      return [];
    }
  }
}

export const lessonService = new LessonService();
export default lessonService;
