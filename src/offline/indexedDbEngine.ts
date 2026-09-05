const DB_NAME = 'BhashaBridgeOfflineDB_v5';
const DB_VERSION = 5;

export const STORES = [
  'flashcards',
  'stories',
  'translationHistory',
  'quizzes',
  'progress',
  'attendance',
  'assignments',
  'syncQueue',
  'cachedBlobs',
  'sqliteTables',
  'aiContent',
  'curriculum',
  'lessons',
  'vocabulary',
  'activities',
] as const;

export type StoreName = (typeof STORES)[number];

class IndexedDbEngine {
  private dbPromise: Promise<IDBDatabase> | null = null;

  public async getDb(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB not available in current environment'));
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        STORES.forEach((store) => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  public async setItem<T extends { id: string }>(storeName: StoreName, item: T): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(item);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Graceful fallback to localStorage
      try {
        localStorage.setItem(`idb_fallback_${storeName}_${item.id}`, JSON.stringify(item));
      } catch {
        // ignore
      }
    }
  }

  public async getItem<T>(storeName: StoreName, id: string): Promise<T | null> {
    try {
      const db = await this.getDb();
      return new Promise<T | null>((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      try {
        const raw = localStorage.getItem(`idb_fallback_${storeName}_${id}`);
        if (raw) return JSON.parse(raw);
      } catch {
        // ignore
      }
      return null;
    }
  }

  public async getAll<T>(storeName: StoreName): Promise<T[]> {
    try {
      const db = await this.getDb();
      return new Promise<T[]>((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  }

  public async deleteItem(storeName: StoreName, id: string): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      try {
        localStorage.removeItem(`idb_fallback_${storeName}_${id}`);
      } catch {
        // ignore
      }
    }
  }

  public async clearStore(storeName: StoreName): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // ignore
    }
  }

  // Audio/Image Blob Caching for 100% Offline Access
  public async cacheBlob(id: string, blob: Blob, mimeType: string): Promise<void> {
    await this.setItem('cachedBlobs', {
      id,
      blob,
      mimeType,
      cachedAt: Date.now(),
    } as any);
  }

  public async getCachedBlob(id: string): Promise<{ blob: Blob; mimeType: string } | null> {
    const record = await this.getItem<{ id: string; blob: Blob; mimeType: string }>('cachedBlobs', id);
    return record ? { blob: record.blob, mimeType: record.mimeType } : null;
  }
}

export const indexedDbEngine = new IndexedDbEngine();
export default indexedDbEngine;
