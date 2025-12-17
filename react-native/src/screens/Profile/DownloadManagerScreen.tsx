/**
 * DownloadManagerScreen - Manage downloaded lessons
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useOffline } from '../../context/OfflineContext';
import StorageCard from '../../components/molecules/StorageCard';
import { deleteDownload } from '../../services/storage/downloadManager';
import { Download } from '../../types/models';

export default function DownloadManagerScreen() {
  const { downloads, storageUsage, refreshDownloads } = useOffline();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    refreshDownloads();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await refreshDownloads();
    setRefreshing(false);
  }

  async function handleDeleteDownload(lessonId: string, lessonTitle?: string) {
    Alert.alert(
      'Delete Download',
      `Remove "${lessonTitle || 'this lesson'}" from offline storage?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDownload(lessonId);
              await refreshDownloads();
              Alert.alert('Success', 'Download deleted');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  }

  function renderDownloadItem({ item }: { item: Download }) {
    const sizeMB = (item.fileSize || 0) / (1024 * 1024);
    const statusColor =
      item.status === 'completed'
        ? '#4CAF50'
        : item.status === 'failed'
        ? '#f44336'
        : '#FF9800';

    return (
      <View style={styles.downloadCard}>
        <View style={styles.downloadInfo}>
          <View style={styles.downloadHeader}>
            <Icon
              name="movie"
              size={24}
              color={statusColor}
              style={styles.downloadIcon}
            />
            <View style={styles.downloadText}>
              <Text style={styles.lessonTitle} numberOfLines={1}>
                Lesson {item.lessonId.substring(0, 8)}...
              </Text>
              <View style={styles.downloadMeta}>
                <Text style={styles.downloadSize}>{sizeMB.toFixed(1)} MB</Text>
                <Text style={styles.dot}>•</Text>
                <Text
                  style={[styles.downloadStatus, { color: statusColor }]}
                >
                  {item.status === 'completed'
                    ? 'Downloaded'
                    : item.status === 'failed'
                    ? 'Failed'
                    : `${item.progress}%`}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.downloadDate}>
            {new Date(item.downloadedAt).toLocaleDateString()}
          </Text>
        </View>

        {item.status === 'completed' && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteDownload(item.lessonId)}
          >
            <Icon name="delete-outline" size={24} color="#f44336" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="cloud-off" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Downloads Yet</Text>
        <Text style={styles.emptyText}>
          Download lessons from the lesson list to access them offline.
        </Text>
        <Text style={styles.emptyHint}>
          You can download up to 10 lessons at a time.
        </Text>
      </View>
    );
  }

  const completedDownloads = downloads.filter((d) => d.status === 'completed');
  const inProgressDownloads = downloads.filter(
    (d) => d.status === 'in-progress' || d.status === 'pending'
  );
  const failedDownloads = downloads.filter((d) => d.status === 'failed');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Downloads</Text>
        <Text style={styles.subtitle}>
          {completedDownloads.length} of 10 lessons downloaded
        </Text>
      </View>

      <View style={styles.storageSection}>
        <StorageCard
          usedMB={storageUsage.totalMB}
          downloadCount={completedDownloads.length}
          maxDownloads={10}
        />
      </View>

      {inProgressDownloads.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>In Progress</Text>
          <FlatList
            data={inProgressDownloads}
            keyExtractor={(item) => item.id}
            renderItem={renderDownloadItem}
            scrollEnabled={false}
          />
        </View>
      )}

      {failedDownloads.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Failed</Text>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Retry Downloads',
                  'Feature coming soon: Retry failed downloads'
                );
              }}
            >
              <Text style={styles.retryButton}>Retry All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={failedDownloads}
            keyExtractor={(item) => item.id}
            renderItem={renderDownloadItem}
            scrollEnabled={false}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Completed ({completedDownloads.length})
        </Text>
        <FlatList
          data={completedDownloads}
          keyExtractor={(item) => item.id}
          renderItem={renderDownloadItem}
          ListEmptyComponent={renderEmpty()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={
            completedDownloads.length === 0 && styles.emptyList
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  storageSection: {
    padding: 16,
    paddingTop: 8,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  retryButton: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  downloadCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  downloadInfo: {
    flex: 1,
  },
  downloadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  downloadIcon: {
    marginRight: 12,
  },
  downloadText: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  downloadMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadSize: {
    fontSize: 12,
    color: '#666',
  },
  dot: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 6,
  },
  downloadStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  downloadDate: {
    fontSize: 11,
    color: '#999',
    marginLeft: 36,
  },
  deleteButton: {
    padding: 8,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
