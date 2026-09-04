import type { OfflineSyncQueueItem } from '../firebase/types';
import { indexedDbEngine } from './indexedDbEngine';
import { db, isFirebaseConfigured } from '../services/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

class OfflineSyncQueueEngine {
  private isProcessing: boolean = false;
  private listeners: ((pendingCount: number) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.processQueue();
      });
    }
  }

  public async enqueue(item: OfflineSyncQueueItem): Promise<void> {
    await indexedDbEngine.setItem('syncQueue', item);
    this.notifyListeners();

    // If currently online, try processing immediately
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.processQueue();
    }
  }

  public async getPendingItems(): Promise<OfflineSyncQueueItem[]> {
    const all = await indexedDbEngine.getAll<OfflineSyncQueueItem>('syncQueue');
    return all.filter((i) => i.status === 'pending' || i.status === 'failed');
  }

  public async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;
    if (!isFirebaseConfigured() || !db) return;

    this.isProcessing = true;

    try {
      const pending = await this.getPendingItems();

      for (const item of pending) {
        try {
          const docRef = doc(db, item.collection, item.documentId);

          if (item.action === 'delete') {
            await deleteDoc(docRef);
          } else {
            const payload = item.payloadJson ? JSON.parse(item.payloadJson) : {};
            // Last-write-wins with server timestamp update
            await setDoc(docRef, { ...payload, syncedAt: Date.now() }, { merge: true });
          }

          // Successfully synchronized -> remove from queue
          await indexedDbEngine.deleteItem('syncQueue', item.id);
        } catch (err: any) {
          // Increment retry count
          const updated: OfflineSyncQueueItem = {
            ...item,
            retryCount: item.retryCount + 1,
            lastAttemptAt: Date.now(),
            status: item.retryCount >= 5 ? 'failed' : 'pending',
            errorMessage: err?.message || 'Sync failed',
          };
          await indexedDbEngine.setItem('syncQueue', updated);
        }
      }
    } finally {
      this.isProcessing = false;
      this.notifyListeners();
    }
  }

  public onQueueChange(callback: (pendingCount: number) => void): () => void {
    this.listeners.push(callback);
    this.getPendingItems().then((items) => callback(items.length));
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private async notifyListeners() {
    const pending = await this.getPendingItems();
    this.listeners.forEach((l) => l(pending.length));
  }
}

export const offlineSyncQueueEngine = new OfflineSyncQueueEngine();
export default offlineSyncQueueEngine;
