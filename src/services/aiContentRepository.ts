import type { GeneratedContentPackage } from '../types/contentGenerator';
import { indexedDbEngine } from '../offline/indexedDbEngine';
import { offlineSyncQueueEngine } from '../offline/syncQueueEngine';
import { db, isFirebaseConfigured } from './firebase';
import { doc, getDoc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

class AiContentRepository {
  private localKeyPrefix = 'bhasha_ai_content_';

  public async savePackage(pkg: GeneratedContentPackage): Promise<void> {
    const updated = {
      ...pkg,
      updatedAt: Date.now(),
    };

    // 1. Save to IndexedDB local offline cache
    await indexedDbEngine.setItem('aiContent', updated as any);

    // Also backup to localStorage
    try {
      localStorage.setItem(`${this.localKeyPrefix}${updated.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // 2. Save to Firestore if online & configured
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;
    if (isOnline && isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'aiContentPackages', updated.id);
        await setDoc(docRef, updated, { merge: true });
        return;
      } catch {
        // Fall through to offline sync queue
      }
    }

    // 3. If offline or save failed, register in background sync queue
    await offlineSyncQueueEngine.enqueue({
      id: `sync_content_${updated.id}`,
      collection: 'aiContentPackages',
      documentId: updated.id,
      action: 'create',
      payloadJson: JSON.stringify(updated),
      retryCount: 0,
      status: 'pending',
      queuedAt: Date.now(),
    });
  }

  public async getPackageById(id: string): Promise<GeneratedContentPackage | null> {
    // 1. Check IndexedDB
    const fromIdb = await indexedDbEngine.getItem<GeneratedContentPackage>('aiContent', id);
    if (fromIdb) return fromIdb;

    // 2. Check localStorage
    try {
      const raw = localStorage.getItem(`${this.localKeyPrefix}${id}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }

    // 3. Fetch from Firestore if online
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;
    if (isOnline && isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'aiContentPackages', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as GeneratedContentPackage;
          await indexedDbEngine.setItem('aiContent', data as any);
          return data;
        }
      } catch {
        // ignore
      }
    }

    return null;
  }

  public async getAllPackages(): Promise<GeneratedContentPackage[]> {
    // 1. Check IndexedDB
    const cached = await indexedDbEngine.getAll<GeneratedContentPackage>('aiContent');
    if (cached && cached.length > 0) {
      return cached.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    // 2. Fallback to localStorage
    const localPackages: GeneratedContentPackage[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.localKeyPrefix)) {
          const raw = localStorage.getItem(key);
          if (raw) localPackages.push(JSON.parse(raw));
        }
      }
    } catch {
      // ignore
    }

    if (localPackages.length > 0) {
      return localPackages.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    // 3. Fallback to Firestore if online
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;
    if (isOnline && isFirebaseConfigured() && db) {
      try {
        const colRef = collection(db, 'aiContentPackages');
        const snap = await getDocs(colRef);
        const list: GeneratedContentPackage[] = [];
        snap.forEach((d) => list.push(d.data() as GeneratedContentPackage));
        for (const item of list) {
          await indexedDbEngine.setItem('aiContent', item as any);
        }
        return list.sort((a, b) => b.updatedAt - a.updatedAt);
      } catch {
        // ignore
      }
    }

    return [];
  }

  public async deletePackage(id: string): Promise<void> {
    await indexedDbEngine.deleteItem('aiContent', id);
    try {
      localStorage.removeItem(`${this.localKeyPrefix}${id}`);
    } catch {
      // ignore
    }

    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;
    if (isOnline && isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'aiContentPackages', id);
        await deleteDoc(docRef);
      } catch {
        // ignore
      }
    }
  }
}

export const aiContentRepository = new AiContentRepository();
export default aiContentRepository;
