/**
 * OfflineContext - Manages offline/online state and sync status
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';
import {
  startBackgroundSync,
  getSyncStatus,
  onSyncStatusChange,
  forceSyncNow,
  getSyncStats,
} from '../services/storage/syncQueue';
import {
  getDownloads,
  getStorageUsage,
  initializeDownloadManager,
} from '../services/storage/downloadManager';
import { Download } from '../types/models';

interface OfflineContextType {
  // Network state
  isOnline: boolean;
  isConnected: boolean;

  // Sync state
  isSyncing: boolean;
  queuedItems: number;
  failedItems: number;
  lastSyncTime?: number;

  // Downloads
  downloads: Download[];
  storageUsage: {
    totalMB: number;
    downloadCount: number;
  };

  // Actions
  refreshDownloads: () => Promise<void>;
  refreshSyncStatus: () => Promise<void>;
  manualSync: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [queuedItems, setQueuedItems] = useState(0);
  const [failedItems, setFailedItems] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<number | undefined>();
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [storageUsage, setStorageUsage] = useState({
    totalMB: 0,
    downloadCount: 0,
  });

  // Initialize download manager
  useEffect(() => {
    initializeDownloadManager().catch((error) => {
      console.error('Failed to initialize download manager:', error);
    });
  }, []);

  // Monitor network state
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isInternetReachable ?? true);
      setIsConnected(state.isConnected ?? true);
    });

    // Get initial state
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isInternetReachable ?? true);
      setIsConnected(state.isConnected ?? true);
    });

    return unsubscribe;
  }, []);

  // Monitor sync status
  useEffect(() => {
    const unsubscribe = onSyncStatusChange((status) => {
      setIsSyncing(status.isSyncing);
      setQueuedItems(status.queuedItems);
      setFailedItems(status.failedItems);
      setLastSyncTime(status.lastSyncTime);
    });

    return unsubscribe;
  }, []);

  // Start background sync
  useEffect(() => {
    const unsubscribe = startBackgroundSync();
    return unsubscribe;
  }, []);

  // Load initial data
  useEffect(() => {
    refreshDownloads();
    refreshSyncStatus();
  }, []);

  const refreshDownloads = async () => {
    try {
      const downloadsData = await getDownloads();
      setDownloads(downloadsData);

      const usage = await getStorageUsage();
      setStorageUsage({
        totalMB: usage.totalMB,
        downloadCount: usage.downloadCount,
      });
    } catch (error) {
      console.error('Failed to refresh downloads:', error);
    }
  };

  const refreshSyncStatus = async () => {
    try {
      const stats = await getSyncStats();
      setQueuedItems(stats.pending);
      setFailedItems(stats.failed);
    } catch (error) {
      console.error('Failed to refresh sync status:', error);
    }
  };

  const manualSync = async () => {
    try {
      await forceSyncNow();
      await refreshSyncStatus();
    } catch (error) {
      console.error('Manual sync failed:', error);
      throw error;
    }
  };

  const value: OfflineContextType = {
    isOnline,
    isConnected,
    isSyncing,
    queuedItems,
    failedItems,
    lastSyncTime,
    downloads,
    storageUsage,
    refreshDownloads,
    refreshSyncStatus,
    manualSync,
  };

  return (
    <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
  );
}

export function useOffline(): OfflineContextType {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
