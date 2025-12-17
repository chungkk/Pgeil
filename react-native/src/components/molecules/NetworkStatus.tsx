/**
 * NetworkStatus - Shows offline/online indicator
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useOffline } from '../../context/OfflineContext';

interface NetworkStatusProps {
  style?: any;
}

export default function NetworkStatus({ style }: NetworkStatusProps) {
  const { isOnline, isConnected } = useOffline();

  // Don't show anything if online
  if (isOnline && isConnected) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Icon name="cloud-off" size={16} color="#fff" />
      <Text style={styles.text}>
        {!isConnected ? 'No Internet Connection' : 'Limited Connectivity'}
      </Text>
    </View>
  );
}

export function NetworkStatusBanner() {
  const { isOnline, isConnected, isSyncing, queuedItems } = useOffline();

  if (isOnline && isConnected && !isSyncing && queuedItems === 0) {
    return null;
  }

  return (
    <View style={styles.banner}>
      {!isConnected ? (
        <>
          <Icon name="cloud-off" size={20} color="#fff" />
          <Text style={styles.bannerText}>
            You're offline. Changes will sync when connected.
          </Text>
        </>
      ) : isSyncing ? (
        <>
          <Icon name="sync" size={20} color="#fff" />
          <Text style={styles.bannerText}>Syncing your progress...</Text>
        </>
      ) : queuedItems > 0 ? (
        <>
          <Icon name="cloud-queue" size={20} color="#fff" />
          <Text style={styles.bannerText}>
            {queuedItems} {queuedItems === 1 ? 'change' : 'changes'} waiting to sync
          </Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  bannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
