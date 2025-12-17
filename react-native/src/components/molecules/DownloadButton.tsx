/**
 * DownloadButton - Download button with progress indicator
 */

import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  startDownload,
  isLessonDownloaded,
  deleteDownload,
  getDownloadInfo,
  DownloadProgress,
} from '../../services/storage/downloadManager';
import { useOffline } from '../../context/OfflineContext';

interface DownloadButtonProps {
  lessonId: string;
  size?: 'small' | 'medium' | 'large';
  onDownloadComplete?: () => void;
}

export default function DownloadButton({
  lessonId,
  size = 'medium',
  onDownloadComplete,
}: DownloadButtonProps) {
  const { refreshDownloads } = useOffline();
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    checkDownloadStatus();
  }, [lessonId]);

  async function checkDownloadStatus() {
    const isDownloaded = await isLessonDownloaded(lessonId);
    setDownloaded(isDownloaded);

    if (!isDownloaded) {
      // Check if download is in progress
      const info = await getDownloadInfo(lessonId);
      if (info && info.status === 'in-progress') {
        setDownloading(true);
        setProgress(info.progress);
      }
    }
  }

  async function handlePress() {
    if (downloaded) {
      // Already downloaded - show delete option
      Alert.alert(
        'Delete Download',
        'Remove this lesson from offline storage?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: handleDelete,
          },
        ]
      );
    } else if (downloading) {
      // Cancel download
      Alert.alert(
        'Cancel Download',
        'Stop downloading this lesson?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
            onPress: handleCancel,
          },
        ]
      );
    } else {
      // Start download
      handleDownload();
    }
  }

  async function handleDownload() {
    try {
      setDownloading(true);
      setProgress(0);

      await startDownload(lessonId, (prog: DownloadProgress) => {
        setProgress(prog.progress);
      });

      setDownloaded(true);
      setDownloading(false);
      await refreshDownloads();
      onDownloadComplete?.();

      Alert.alert('Success', 'Lesson downloaded successfully!');
    } catch (error: any) {
      setDownloading(false);
      setProgress(0);
      Alert.alert('Download Failed', error.message);
    }
  }

  async function handleDelete() {
    try {
      await deleteDownload(lessonId);
      setDownloaded(false);
      await refreshDownloads();
      Alert.alert('Success', 'Download deleted');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }

  async function handleCancel() {
    setDownloading(false);
    setProgress(0);
    await deleteDownload(lessonId);
    await refreshDownloads();
  }

  const iconSize = size === 'small' ? 20 : size === 'medium' ? 24 : 28;
  const containerSize = size === 'small' ? 32 : size === 'medium' ? 40 : 48;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: containerSize, height: containerSize },
        downloaded && styles.containerDownloaded,
      ]}
      onPress={handlePress}
      disabled={downloading}
    >
      {downloading ? (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="small" color="#2196F3" />
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      ) : (
        <Icon
          name={downloaded ? 'cloud-done' : 'cloud-download'}
          size={iconSize}
          color={downloaded ? '#4CAF50' : '#2196F3'}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  containerDownloaded: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 10,
    color: '#2196F3',
    marginTop: 2,
    fontWeight: '600',
  },
});
