/**
 * BhashaBridge AI — Offline Curriculum IndexedDB Abstraction
 * Stores and manages on-device curriculum packs, lesson bundles, and sync cache.
 */

import type { CurriculumPack } from './curriculumStore';

const DB_NAME = 'bhashabridge_curriculum_db';
const DB_VERSION = 1;
const STORE_PACKS = 'curriculum_packs';
const STORE_LESSONS = 'cached_lessons';

export interface CachedLessonItem {
  id: string;
  grade: number;
  subject: string;
  chapterTitle: string;
  hindiVocab: string;
  santhaliVocab: string;
  romanVocab: string;
  nipunCompetency?: string;
}

class CurriculumDbService {
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  private initDb(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.resolve(null);
    }

    this.dbPromise = new Promise((resolve) => {
      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE_PACKS)) {
            db.createObjectStore(STORE_PACKS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_LESSONS)) {
            const lessonStore = db.createObjectStore(STORE_LESSONS, { keyPath: 'id' });
            lessonStore.createIndex('grade', 'grade', { unique: false });
            lessonStore.createIndex('subject', 'subject', { unique: false });
          }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  public async savePacks(packs: CurriculumPack[]): Promise<void> {
    const db = await this.initDb();
    if (!db) return;

    try {
      const tx = db.transaction([STORE_PACKS], 'readwrite');
      const store = tx.objectStore(STORE_PACKS);
      await new Promise<void>((resolve, reject) => {
        const clearReq = store.clear();
        clearReq.onsuccess = () => {
          for (const pack of packs) {
            store.put(pack);
          }
          resolve();
        };
        clearReq.onerror = () => reject(clearReq.error);
      });
    } catch {
      // ignore
    }
  }

  public async getPacks(): Promise<CurriculumPack[]> {
    const db = await this.initDb();
    if (!db) return [];

    return new Promise((resolve) => {
      try {
        const tx = db.transaction([STORE_PACKS], 'readonly');
        const store = tx.objectStore(STORE_PACKS);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  public async cacheLessons(lessons: CachedLessonItem[]): Promise<void> {
    const db = await this.initDb();
    if (!db) return;

    try {
      const tx = db.transaction([STORE_LESSONS], 'readwrite');
      const store = tx.objectStore(STORE_LESSONS);
      for (const lesson of lessons) {
        store.put(lesson);
      }
    } catch {
      // ignore
    }
  }

  public async searchOfflineLessons(query: string, grade?: number): Promise<CachedLessonItem[]> {
    const db = await this.initDb();
    if (!db) return [];

    return new Promise((resolve) => {
      try {
        const tx = db.transaction([STORE_LESSONS], 'readonly');
        const store = tx.objectStore(STORE_LESSONS);
        const req = store.getAll();
        req.onsuccess = () => {
          const all: CachedLessonItem[] = req.result || [];
          const q = query.toLowerCase().trim();
          const filtered = all.filter((item) => {
            const matchesGrade = grade ? item.grade === grade : true;
            const matchesQuery =
              !q ||
              item.chapterTitle.toLowerCase().includes(q) ||
              item.hindiVocab.toLowerCase().includes(q) ||
              item.santhaliVocab.includes(q) ||
              item.romanVocab.toLowerCase().includes(q);
            return matchesGrade && matchesQuery;
          });
          resolve(filtered);
        };
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }
}

export const curriculumDb = new CurriculumDbService();
export default curriculumDb;
