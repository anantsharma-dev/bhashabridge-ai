import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  type WhereFilterOp,
  type Unsubscribe,
  onSnapshot,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../services/firebase';
import type {
  TeacherProfile,
  StudentProfile,
  Classroom,
  AttendanceRecord,
  AssignmentRecord,
  WorksheetRecord,
  StoryRecord,
  FlashcardRecord,
  TranslationRecord,
  QuizRecord,
  StudentProgressRecord,
  BadgeRecord,
  StreakRecord,
  VoiceHistoryRecord,
  OfflineSyncQueueItem,
} from './types';
import { offlineSyncQueueEngine } from '../offline/syncQueueEngine';

export interface Repository<T extends { id?: string; code?: string }> {
  getById: (id: string) => Promise<T | null>;
  getAll: () => Promise<T[]>;
  save: (item: T) => Promise<void>;
  delete: (id: string) => Promise<void>;
  queryWhere: (field: string, op: WhereFilterOp, value: any) => Promise<T[]>;
  subscribeById?: (id: string, callback: (item: T | null) => void) => Unsubscribe;
}

export class FirestoreRepository<T extends { id?: string; code?: string }> implements Repository<T> {
  private collectionName: string;
  private localKey: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.localKey = `bhashabridge_repo_${collectionName}`;
  }

  private getLocalCache(): T[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.localKey);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [];
  }

  private setLocalCache(items: T[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.localKey, JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  public async getById(id: string): Promise<T | null> {
    const local = this.getLocalCache().find((item) => item.id === id);
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;

    if (!isFirebaseConfigured() || !db || !isOnline) {
      return local || null;
    }

    try {
      const docRef = doc(db, this.collectionName, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = { id: snapshot.id, ...snapshot.data() } as T;
        // Update local cache
        const updated = this.getLocalCache().filter((i) => i.id !== id);
        this.setLocalCache([data, ...updated]);
        return data;
      }
      return local || null;
    } catch {
      return local || null;
    }
  }

  public async getAll(): Promise<T[]> {
    const local = this.getLocalCache();
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;

    if (!isFirebaseConfigured() || !db || !isOnline) {
      return local;
    }

    try {
      const colRef = collection(db, this.collectionName);
      const snapshot = await getDocs(colRef);
      const remoteItems: T[] = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as T));
      if (remoteItems.length > 0) {
        this.setLocalCache(remoteItems);
        return remoteItems;
      }
      return local;
    } catch {
      return local;
    }
  }

  public async save(item: T): Promise<void> {
    const itemId = item.id || item.code || 'doc';
    // 1. Save immediately to local cache
    const current = this.getLocalCache().filter((i) => (i.id || i.code) !== itemId);
    this.setLocalCache([item, ...current]);

    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;

    // 2. If online and configured, sync directly to Firestore
    if (isFirebaseConfigured() && db && isOnline) {
      try {
        const docRef = doc(db, this.collectionName, itemId);
        await setDoc(docRef, item, { merge: true });
        return;
      } catch {
        // Fall through to offline queue
      }
    }

    // 3. Queue for offline sync
    await offlineSyncQueueEngine.enqueue({
      id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      collection: this.collectionName,
      documentId: itemId,
      action: 'update',
      payloadJson: JSON.stringify(item),
      retryCount: 0,
      status: 'pending',
      queuedAt: Date.now(),
    });
  }

  public async delete(id: string): Promise<void> {
    const current = this.getLocalCache().filter((i) => (i.id || i.code) !== id);
    this.setLocalCache(current);

    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;

    if (isFirebaseConfigured() && db && isOnline) {
      try {
        const docRef = doc(db, this.collectionName, id);
        await deleteDoc(docRef);
        return;
      } catch {
        // Fall through to offline queue
      }
    }

    await offlineSyncQueueEngine.enqueue({
      id: `queue-del-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      collection: this.collectionName,
      documentId: id,
      action: 'delete',
      payloadJson: '',
      retryCount: 0,
      status: 'pending',
      queuedAt: Date.now(),
    });
  }

  public async queryWhere(field: string, op: WhereFilterOp, value: any): Promise<T[]> {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;

    if (isFirebaseConfigured() && db && isOnline) {
      try {
        const colRef = collection(db, this.collectionName);
        const q = query(colRef, where(field, op, value));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as T));
      } catch {
        // Fall back to local query
      }
    }

    // Client-side local filtering
    return this.getLocalCache().filter((item: any) => {
      const val = item[field];
      if (op === '==') return val === value;
      if (op === '!=') return val !== value;
      if (op === '>') return val > value;
      if (op === '>=') return val >= value;
      if (op === '<') return val < value;
      if (op === '<=') return val <= value;
      if (op === 'array-contains') return Array.isArray(val) && val.includes(value);
      return false;
    });
  }

  public subscribeById(id: string, callback: (item: T | null) => void): Unsubscribe {
    // Deliver local first immediately
    const local = this.getLocalCache().find((i) => i.id === id);
    callback(local || null);

    if (!isFirebaseConfigured() || !db) {
      return () => {};
    }

    try {
      const docRef = doc(db, this.collectionName, id);
      return onSnapshot(docRef, (snap: any) => {
        if (snap.exists()) {
          const item = { id: snap.id, ...snap.data() } as T;
          callback(item);
        } else {
          callback(null);
        }
      });
    } catch {
      return () => {};
    }
  }
}

// 18 Typed Repositories
export const teacherRepo = new FirestoreRepository<TeacherProfile>('teachers');
export const studentRepo = new FirestoreRepository<StudentProfile>('students');
export const classroomRepo = new FirestoreRepository<Classroom>('classrooms');
export const attendanceRepo = new FirestoreRepository<AttendanceRecord>('attendance');
export const assignmentRepo = new FirestoreRepository<AssignmentRecord>('assignments');
export const worksheetRepo = new FirestoreRepository<WorksheetRecord>('worksheets');
export const storyRepo = new FirestoreRepository<StoryRecord>('stories');
export const flashcardRepo = new FirestoreRepository<FlashcardRecord>('flashcards');
export const translationRepo = new FirestoreRepository<TranslationRecord>('translations');
export const quizRepo = new FirestoreRepository<QuizRecord>('quizzes');
export const progressRepo = new FirestoreRepository<StudentProgressRecord>('progress');
export const badgeRepo = new FirestoreRepository<BadgeRecord>('badges');
export const streakRepo = new FirestoreRepository<StreakRecord>('streaks');
export const voiceHistoryRepo = new FirestoreRepository<VoiceHistoryRecord>('voiceHistory');
export const syncQueueRepo = new FirestoreRepository<OfflineSyncQueueItem>('offlineSyncQueue');
