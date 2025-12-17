/**
 * Offline Sync Queue Service
 * Queues user actions while offline and syncs when connection is restored
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { updateProgress } from '../api/lessons';
import { saveToVocabulary } from '../api/vocabulary';

const SYNC_QUEUE_KEY = '@sync_queue';
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 1000; // 1 second

export interface SyncQueueItem {
  id: string;
  type: 'progress' | 'recording' | 'vocabulary';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retries: number;
  lastAttempt?: number;
  error?: string;
}

interface SyncStatus {
  isSyncing: boolean;
  queuedItems: number;
  failedItems: number;
  lastSyncTime?: number;
}

// In-memory sync status
let syncStatus: SyncStatus = {
  isSyncing: false,
  queuedItems: 0,
  failedItems: 0,
};

// Status change callbacks
const statusCallbacks: Array<(status: SyncStatus) => void> = [];

/**
 * Register status change callback
 */
export function onSyncStatusChange(
  callback: (status: SyncStatus) => void
): () => void {
  statusCallbacks.push(callback);
  callback(syncStatus); // Initial call
  return () => {
    const index = statusCallbacks.indexOf(callback);
    if (index > -1) {
      statusCallbacks.splice(index, 1);
    }
  };
}

/**
 * Update sync status and notify listeners
 */
function updateSyncStatus(updates: Partial<SyncStatus>): void {
  syncStatus = { ...syncStatus, ...updates };
  statusCallbacks.forEach((callback) => callback(syncStatus));
}

/**
 * Get sync queue from storage
 */
async function getQueue(): Promise<SyncQueueItem[]> {
  try {
    const data = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get sync queue:', error);
    return [];
  }
}

/**
 * Save sync queue to storage
 */
async function saveQueue(queue: SyncQueueItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    
    // Update status
    const failedCount = queue.filter((item) => item.retries >= MAX_RETRIES).length;
    updateSyncStatus({
      queuedItems: queue.length - failedCount,
      failedItems: failedCount,
    });
  } catch (error) {
    console.error('Failed to save sync queue:', error);
  }
}

/**
 * Add item to sync queue
 */
export async function addToSyncQueue(
  type: SyncQueueItem['type'],
  action: SyncQueueItem['action'],
  data: any
): Promise<void> {
  const queue = await getQueue();

  const item: SyncQueueItem = {
    id: `${type}_${action}_${Date.now()}_${Math.random()}`,
    type,
    action,
    data,
    timestamp: Date.now(),
    retries: 0,
  };

  queue.push(item);
  await saveQueue(queue);

  console.log('Added to sync queue:', item.id, type, action);
}

/**
 * Remove item from queue
 */
async function removeFromQueue(itemId: string): Promise<void> {
  const queue = await getQueue();
  const filtered = queue.filter((item) => item.id !== itemId);
  await saveQueue(filtered);
}

/**
 * Process a single sync item
 */
async function processSyncItem(item: SyncQueueItem): Promise<boolean> {
  try {
    switch (item.type) {
      case 'progress':
        await syncProgress(item);
        break;
      case 'vocabulary':
        await syncVocabulary(item);
        break;
      case 'recording':
        await syncRecording(item);
        break;
      default:
        console.warn('Unknown sync item type:', item.type);
        return false;
    }
    return true;
  } catch (error: any) {
    console.error(`Failed to sync ${item.type}:`, error.message);
    return false;
  }
}

/**
 * Sync progress update
 */
async function syncProgress(item: SyncQueueItem): Promise<void> {
  const { lessonId, updates } = item.data;
  await updateProgress(lessonId, updates);
}

/**
 * Sync vocabulary save
 */
async function syncVocabulary(item: SyncQueueItem): Promise<void> {
  const { word, sourceLessonId, sourceContext } = item.data;
  await saveToVocabulary({ word, sourceLessonId, sourceContext });
}

/**
 * Sync recording (placeholder - implement when recording API ready)
 */
async function syncRecording(item: SyncQueueItem): Promise<void> {
  // TODO: Implement recording sync when pronunciation API is ready
  console.log('Recording sync not yet implemented:', item.data);
}

/**
 * Process entire sync queue
 */
export async function processSyncQueue(): Promise<{
  synced: number;
  failed: number;
}> {
  // Check network connectivity
  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected) {
    console.log('No network connection, skipping sync');
    return { synced: 0, failed: 0 };
  }

  // Get queue
  const queue = await getQueue();
  if (queue.length === 0) {
    console.log('Sync queue is empty');
    return { synced: 0, failed: 0 };
  }

  // Start syncing
  updateSyncStatus({ isSyncing: true });

  let syncedCount = 0;
  let failedCount = 0;

  console.log(`Processing ${queue.length} queued items...`);

  for (const item of queue) {
    // Skip items that have exceeded max retries
    if (item.retries >= MAX_RETRIES) {
      console.log(`Skipping item (max retries): ${item.id}`);
      failedCount++;
      continue;
    }

    // Exponential backoff delay
    if (item.lastAttempt) {
      const timeSinceLastAttempt = Date.now() - item.lastAttempt;
      const requiredDelay = BASE_RETRY_DELAY * Math.pow(2, item.retries);

      if (timeSinceLastAttempt < requiredDelay) {
        console.log(`Skipping item (backoff): ${item.id}`);
        continue;
      }
    }

    // Update retry info
    item.retries++;
    item.lastAttempt = Date.now();

    // Try to sync
    const success = await processSyncItem(item);

    if (success) {
      await removeFromQueue(item.id);
      syncedCount++;
      console.log(`Synced successfully: ${item.id}`);
    } else {
      failedCount++;
      item.error = 'Sync failed';
      console.log(`Sync failed: ${item.id} (retry ${item.retries}/${MAX_RETRIES})`);
    }

    // Save updated queue after each item
    await saveQueue(queue);
  }

  // Update status
  updateSyncStatus({
    isSyncing: false,
    lastSyncTime: Date.now(),
  });

  console.log(`Sync complete: ${syncedCount} synced, ${failedCount} failed`);

  return { synced: syncedCount, failed: failedCount };
}

/**
 * Start background sync listener
 * Automatically syncs when network is restored
 */
export function startBackgroundSync(): () => void {
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected && !syncStatus.isSyncing) {
      console.log('Network restored, starting sync...');
      processSyncQueue().catch((error) => {
        console.error('Background sync failed:', error);
      });
    }
  });

  // Initial sync attempt
  processSyncQueue().catch((error) => {
    console.error('Initial sync failed:', error);
  });

  return unsubscribe;
}

/**
 * Get sync queue statistics
 */
export async function getSyncStats(): Promise<{
  total: number;
  pending: number;
  failed: number;
  oldestTimestamp?: number;
}> {
  const queue = await getQueue();

  const failed = queue.filter((item) => item.retries >= MAX_RETRIES);
  const pending = queue.filter((item) => item.retries < MAX_RETRIES);

  const oldestItem = queue.reduce((oldest, item) => {
    if (!oldest || item.timestamp < oldest.timestamp) {
      return item;
    }
    return oldest;
  }, null as SyncQueueItem | null);

  return {
    total: queue.length,
    pending: pending.length,
    failed: failed.length,
    oldestTimestamp: oldestItem?.timestamp,
  };
}

/**
 * Clear failed items from queue
 */
export async function clearFailedItems(): Promise<number> {
  const queue = await getQueue();
  const failedItems = queue.filter((item) => item.retries >= MAX_RETRIES);
  const remaining = queue.filter((item) => item.retries < MAX_RETRIES);

  await saveQueue(remaining);
  return failedItems.length;
}

/**
 * Get current sync status
 */
export function getSyncStatus(): SyncStatus {
  return syncStatus;
}

/**
 * Force sync now (manual trigger)
 */
export async function forceSyncNow(): Promise<{
  synced: number;
  failed: number;
}> {
  console.log('Manual sync triggered');
  return processSyncQueue();
}
