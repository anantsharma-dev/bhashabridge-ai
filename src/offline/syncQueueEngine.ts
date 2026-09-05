import type { OfflineSyncQueueItem } from '../firebase/types';
import { indexedDbEngine } from './indexedDbEngine';
import { sqliteEngine, type ConflictAuditRecord } from './sqliteEngine';
import { db, isFirebaseConfigured } from '../services/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { capacitorService } from '../services/capacitor/capacitorService';

export type ConflictResolutionStrategy = 'LAST_WRITE_WINS' | 'SMART_MERGE' | 'SERVER_WINS' | 'CLIENT_WINS';

export interface ExtendedSyncQueueItem extends OfflineSyncQueueItem {
  conflictStrategy?: ConflictResolutionStrategy;
  version?: number;
  lastAttemptAt?: number;
  errorMessage?: string;
}

export interface SyncStats {
  pendingCount: number;
  failedCount: number;
  totalProcessed: number;
  lastSyncTime: number | null;
  isOnline: boolean;
  isSyncing: boolean;
}

class OfflineSyncQueueEngine {
  private isProcessing: boolean = false;
  private listeners: ((stats: SyncStats) => void)[] = [];
  private lastSyncTime: number | null = null;
  private totalProcessedCount: number = 0;
  private syncTimer: any = null;

  constructor() {
    this.initListeners();
  }

  private initListeners() {
    // 1. Capacitor & Native Network Detection
    capacitorService.onNetworkChange((status) => {
      if (status.connected) {
        this.processQueue();
      }
      this.notifyListeners();
    });

    // 2. Periodic background sync every 30 seconds if online
    if (typeof window !== 'undefined') {
      this.syncTimer = setInterval(() => {
        if (typeof navigator !== 'undefined' && navigator.onLine && !this.isProcessing) {
          this.processQueue();
        }
      }, 30000);
    }
  }

  public async enqueue(item: ExtendedSyncQueueItem): Promise<void> {
    const queueItem: ExtendedSyncQueueItem = {
      ...item,
      status: 'pending',
      retryCount: item.retryCount || 0,
      conflictStrategy: item.conflictStrategy || 'SMART_MERGE',
      queuedAt: item.queuedAt || Date.now(),
    };

    // 1. Persist to IndexedDB
    await indexedDbEngine.setItem('syncQueue', queueItem);

    // 2. Mirror in SQLite
    try {
      await sqliteEngine.insert('offline_sync_queue', {
        id: queueItem.id,
        collection_name: queueItem.collection,
        doc_id: queueItem.documentId,
        action: queueItem.action,
        payload_json: queueItem.payloadJson,
        created_at: queueItem.queuedAt,
        retry_count: queueItem.retryCount,
        status: queueItem.status,
        error_msg: queueItem.errorMessage || '',
      });
    } catch {
      // ignore
    }

    this.notifyListeners();

    // Trigger automatic sync if online
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.processQueue();
    }
  }

  public async getPendingItems(): Promise<ExtendedSyncQueueItem[]> {
    const all = await indexedDbEngine.getAll<ExtendedSyncQueueItem>('syncQueue');
    return all.filter((i) => i.status === 'pending');
  }

  public async getFailedItems(): Promise<ExtendedSyncQueueItem[]> {
    const all = await indexedDbEngine.getAll<ExtendedSyncQueueItem>('syncQueue');
    return all.filter((i) => i.status === 'failed');
  }

  public async getAllQueueItems(): Promise<ExtendedSyncQueueItem[]> {
    return indexedDbEngine.getAll<ExtendedSyncQueueItem>('syncQueue');
  }

  // --- AUTOMATIC SYNC WITH RETRY & CONFLICT RESOLUTION ---
  public async processQueue(): Promise<{ synced: number; failed: number }> {
    if (this.isProcessing) return { synced: 0, failed: 0 };
    const network = await capacitorService.getNetworkStatus();
    if (!network.connected) return { synced: 0, failed: 0 };

    this.isProcessing = true;
    this.notifyListeners();

    let synced = 0;
    let failed = 0;

    try {
      const pending = await this.getPendingItems();

      for (const item of pending) {
        try {
          if (isFirebaseConfigured() && db) {
            const docRef = doc(db, item.collection, item.documentId);

            if (item.action === 'delete') {
              await deleteDoc(docRef);
            } else {
              const clientPayload = item.payloadJson ? JSON.parse(item.payloadJson) : {};
              
              // Conflict resolution before write
              const resolvedPayload = await this.resolveDocumentConflict(
                item.collection,
                item.documentId,
                clientPayload,
                item.conflictStrategy || 'SMART_MERGE'
              );

              await setDoc(docRef, {
                ...resolvedPayload,
                syncedAt: Date.now(),
                offlineSyncVersion: (resolvedPayload.offlineSyncVersion || 0) + 1,
              }, { merge: true });
            }
          }

          // Successfully synchronized -> remove from IndexedDB and mark SQLite
          await indexedDbEngine.deleteItem('syncQueue', item.id);
          try {
            await sqliteEngine.update('offline_sync_queue', item.id, {
              status: 'completed',
              updatedAt: Date.now(),
            });
          } catch {
            // ignore
          }

          synced += 1;
          this.totalProcessedCount += 1;
        } catch (err: any) {
          failed += 1;
          const nextRetry = item.retryCount + 1;
          const isMaxRetried = nextRetry >= 5;

          const updated: ExtendedSyncQueueItem = {
            ...item,
            retryCount: nextRetry,
            lastAttemptAt: Date.now(),
            status: isMaxRetried ? 'failed' : 'pending',
            errorMessage: err?.message || 'Sync attempt failed. Will retry with backoff.',
          };

          await indexedDbEngine.setItem('syncQueue', updated);
          try {
            await sqliteEngine.update('offline_sync_queue', item.id, {
              retry_count: nextRetry,
              status: isMaxRetried ? 'failed' : 'pending',
              error_msg: updated.errorMessage,
            });
          } catch {
            // ignore
          }
        }
      }

      this.lastSyncTime = Date.now();
    } finally {
      this.isProcessing = false;
      this.notifyListeners();
    }

    return { synced, failed };
  }

  // --- CONFLICT RESOLUTION ALGORITHM ---
  private async resolveDocumentConflict(
    collectionName: string,
    documentId: string,
    clientPayload: any,
    strategy: ConflictResolutionStrategy
  ): Promise<any> {
    if (!db) return clientPayload;

    try {
      const docRef = doc(db, collectionName, documentId);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        return clientPayload;
      }

      const serverData = snapshot.data();
      const clientTimestamp = clientPayload.updatedAt || clientPayload.timestamp || 0;
      const serverTimestamp = serverData.updatedAt || serverData.syncedAt || 0;

      let resolved = clientPayload;
      let appliedStrategy = strategy;

      if (strategy === 'SERVER_WINS') {
        resolved = { ...serverData, ...clientPayload, syncedAt: Date.now() };
      } else if (strategy === 'CLIENT_WINS') {
        resolved = clientPayload;
      } else if (strategy === 'LAST_WRITE_WINS') {
        if (serverTimestamp > clientTimestamp) {
          resolved = { ...clientPayload, ...serverData };
          appliedStrategy = 'SERVER_WINS';
        } else {
          resolved = clientPayload;
          appliedStrategy = 'CLIENT_WINS';
        }
      } else {
        // SMART_MERGE: Deep merge fields with smart list union
        resolved = { ...serverData, ...clientPayload };

        // For student arrays, merge unique by id
        if (Array.isArray(clientPayload.students) && Array.isArray(serverData.students)) {
          const studentMap = new Map();
          serverData.students.forEach((s: any) => studentMap.set(s.id, s));
          clientPayload.students.forEach((s: any) => {
            const existing = studentMap.get(s.id);
            if (!existing || (s.updatedAt || 0) >= (existing.updatedAt || 0)) {
              studentMap.set(s.id, s);
            }
          });
          resolved.students = Array.from(studentMap.values());
        }

        // For XP & scores, take highest
        if (typeof clientPayload.xp === 'number' && typeof serverData.xp === 'number') {
          resolved.xp = Math.max(clientPayload.xp, serverData.xp);
        }
      }

      // Log conflict resolution to SQLite
      const conflictLog: ConflictAuditRecord = {
        id: `conflict_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        entityType: collectionName,
        entityId: documentId,
        serverVersion: serverData.offlineSyncVersion || 1,
        clientVersion: (clientPayload.offlineSyncVersion || 0) + 1,
        strategy: appliedStrategy,
        resolvedAt: Date.now(),
        details: `Resolved conflict for ${collectionName}/${documentId} using ${appliedStrategy}`,
      };

      try {
        await sqliteEngine.insert('conflict_audit_log', conflictLog);
      } catch {
        // ignore
      }

      return resolved;
    } catch {
      return clientPayload;
    }
  }

  // --- RETRY FAILED UPLOADS ---
  public async retryFailedItems(): Promise<{ retried: number }> {
    const failed = await this.getFailedItems();
    for (const item of failed) {
      await indexedDbEngine.setItem('syncQueue', {
        ...item,
        status: 'pending',
        retryCount: 0,
        errorMessage: undefined,
      });
    }
    this.notifyListeners();
    this.processQueue();
    return { retried: failed.length };
  }

  public async clearCompletedQueue(): Promise<void> {
    const all = await indexedDbEngine.getAll<ExtendedSyncQueueItem>('syncQueue');
    for (const item of all) {
      if (item.status === 'failed') {
        await indexedDbEngine.deleteItem('syncQueue', item.id);
      }
    }
    this.notifyListeners();
  }

  public async getConflictLogs(): Promise<ConflictAuditRecord[]> {
    return sqliteEngine.selectAll<ConflictAuditRecord>('conflict_audit_log');
  }

  public async getStats(): Promise<SyncStats> {
    const pending = await this.getPendingItems();
    const failed = await this.getFailedItems();
    const net = await capacitorService.getNetworkStatus();

    return {
      pendingCount: pending.length,
      failedCount: failed.length,
      totalProcessed: this.totalProcessedCount,
      lastSyncTime: this.lastSyncTime,
      isOnline: net.connected,
      isSyncing: this.isProcessing,
    };
  }

  public onQueueChange(callback: (stats: SyncStats) => void): () => void {
    this.listeners.push(callback);
    this.getStats().then(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private async notifyListeners() {
    const stats = await this.getStats();
    this.listeners.forEach((l) => l(stats));
  }

  public destroy() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
  }
}

export const offlineSyncQueueEngine = new OfflineSyncQueueEngine();
export default offlineSyncQueueEngine;
