import { syncQueueRepo } from '../../firebase/repository';
import type { OfflineSyncQueueItem } from '../../firebase/types';
import { offlineSyncQueueEngine } from '../../offline/syncQueueEngine';

let lastSyncTimestamp: number | null = null;

export async function enqueueOfflineAction(
  collection: string,
  action: 'create' | 'update' | 'delete',
  documentId: string,
  payload: any
): Promise<void> {
  const item: OfflineSyncQueueItem = {
    id: `sync_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    collection,
    documentId,
    action,
    payloadJson: JSON.stringify(payload),
    retryCount: 0,
    status: 'pending',
    queuedAt: Date.now(),
  };

  // Save to both Firestore repo and offline sync engine
  await syncQueueRepo.save(item);
  await offlineSyncQueueEngine.enqueue(item);
}

export async function getPendingSyncQueue(): Promise<OfflineSyncQueueItem[]> {
  const list = await syncQueueRepo.getAll();
  return list.filter((i) => i.status === 'pending');
}

export async function processSyncQueue(): Promise<{ total: number; synced: number; failed: number }> {
  const pending = await getPendingSyncQueue();
  const total = pending.length;
  let synced = 0;
  let failed = 0;

  // Process via offlineSyncQueueEngine which interacts with Firestore directly
  await offlineSyncQueueEngine.processQueue();

  for (const item of pending) {
    try {
      await syncQueueRepo.save({
        ...item,
        status: 'syncing',
        lastAttemptAt: Date.now(),
      });
      synced += 1;
    } catch {
      failed += 1;
    }
  }

  lastSyncTimestamp = Date.now();
  return { total, synced, failed };
}

export async function clearProcessedQueue(): Promise<void> {
  const all = await syncQueueRepo.getAll();
  for (const item of all) {
    if (item.status === 'syncing' || item.status === 'pending') {
      await syncQueueRepo.delete(item.id);
    }
  }
}

export async function getSyncStatus(): Promise<{
  pendingCount: number;
  isOnline: boolean;
  lastSyncTime: number | null;
}> {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const pending = await getPendingSyncQueue();
  return {
    pendingCount: pending.length,
    isOnline,
    lastSyncTime: lastSyncTimestamp,
  };
}
