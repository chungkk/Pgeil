/**
 * Download Manager Service
 * Handles lesson downloads with progress tracking, queue management, and 10-lesson limit
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { Download } from '../../types/models';
import api from '../api/client';

const DOWNLOADS_KEY = '@downloads';
const MAX_DOWNLOADS = 10;
const DOWNLOAD_DIR = `${RNFS.DocumentDirectoryPath}/lessons`;

export interface DownloadProgress {
  lessonId: string;
  progress: number; // 0-100
  bytesDownloaded: number;
  totalBytes: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed' | 'paused';
}

interface ActiveDownload {
  lessonId: string;
  jobId: number;
  downloadUrl: string;
}

// In-memory state for active downloads
const activeDownloads = new Map<string, ActiveDownload>();
const progressCallbacks = new Map<string, (progress: DownloadProgress) => void>();

/**
 * Initialize download directory
 */
export async function initializeDownloadManager(): Promise<void> {
  try {
    const dirExists = await RNFS.exists(DOWNLOAD_DIR);
    if (!dirExists) {
      await RNFS.mkdir(DOWNLOAD_DIR);
    }
  } catch (error) {
    console.error('Failed to initialize download directory:', error);
  }
}

/**
 * Get all downloads from storage
 */
export async function getDownloads(): Promise<Download[]> {
  try {
    const data = await AsyncStorage.getItem(DOWNLOADS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get downloads:', error);
    return [];
  }
}

/**
 * Save downloads to storage
 */
async function saveDownloads(downloads: Download[]): Promise<void> {
  try {
    await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
  } catch (error) {
    console.error('Failed to save downloads:', error);
  }
}

/**
 * Check if lesson is downloaded
 */
export async function isLessonDownloaded(lessonId: string): Promise<boolean> {
  const downloads = await getDownloads();
  return downloads.some(
    (d) => d.lessonId === lessonId && d.status === 'completed'
  );
}

/**
 * Get download info for a lesson
 */
export async function getDownloadInfo(
  lessonId: string
): Promise<Download | null> {
  const downloads = await getDownloads();
  return downloads.find((d) => d.lessonId === lessonId) || null;
}

/**
 * Check if download limit is reached
 */
export async function canDownload(): Promise<{
  allowed: boolean;
  reason?: string;
  currentCount: number;
}> {
  const downloads = await getDownloads();
  const completedCount = downloads.filter((d) => d.status === 'completed')
    .length;

  if (completedCount >= MAX_DOWNLOADS) {
    return {
      allowed: false,
      reason: `Maximum ${MAX_DOWNLOADS} lessons already downloaded. Delete some to download more.`,
      currentCount: completedCount,
    };
  }

  // Check available storage space (minimum 100MB required)
  const freeSpace = await RNFS.getFSInfo();
  const freeSpaceMB = freeSpace.freeSpace / (1024 * 1024);

  if (freeSpaceMB < 100) {
    return {
      allowed: false,
      reason: `Insufficient storage space. At least 100MB required, ${freeSpaceMB.toFixed(0)}MB available.`,
      currentCount: completedCount,
    };
  }

  return {
    allowed: true,
    currentCount: completedCount,
  };
}

/**
 * Start lesson download
 */
export async function startDownload(
  lessonId: string,
  onProgress?: (progress: DownloadProgress) => void
): Promise<void> {
  // Check if download is allowed
  const checkResult = await canDownload();
  if (!checkResult.allowed) {
    throw new Error(checkResult.reason);
  }

  // Check if already downloaded
  if (await isLessonDownloaded(lessonId)) {
    throw new Error('Lesson already downloaded');
  }

  // Check if already downloading
  if (activeDownloads.has(lessonId)) {
    throw new Error('Lesson download already in progress');
  }

  try {
    // Register progress callback
    if (onProgress) {
      progressCallbacks.set(lessonId, onProgress);
    }

    // Get download URLs from backend
    const response = await api.get(`/lessons/${lessonId}/download`);
    const { videoUrl, audioUrl, transcript, fileSize } = response.data;

    // Create download record
    const download: Download = {
      id: `download_${lessonId}_${Date.now()}`,
      userId: '', // Will be set from auth context
      lessonId,
      downloadedAt: new Date().toISOString(),
      fileSize,
      storageLocation: `${DOWNLOAD_DIR}/${lessonId}`,
      status: 'pending',
      progress: 0,
      lastAccessedAt: new Date().toISOString(),
    };

    // Save download record
    const downloads = await getDownloads();
    downloads.push(download);
    await saveDownloads(downloads);

    // Update status to downloading
    await updateDownloadStatus(lessonId, 'in-progress', 0);

    // Download video file
    const videoPath = `${DOWNLOAD_DIR}/${lessonId}/video.mp4`;
    await downloadFile(videoUrl, videoPath, lessonId, 0.6); // 60% of progress

    // Download audio file
    const audioPath = `${DOWNLOAD_DIR}/${lessonId}/audio.m4a`;
    await downloadFile(audioUrl, audioPath, lessonId, 0.3); // 30% of progress

    // Save transcript
    const transcriptPath = `${DOWNLOAD_DIR}/${lessonId}/transcript.json`;
    await RNFS.writeFile(transcriptPath, JSON.stringify(transcript), 'utf8');

    // Mark as completed
    await updateDownloadStatus(lessonId, 'completed', 100);

    // Clean up
    activeDownloads.delete(lessonId);
    progressCallbacks.delete(lessonId);
  } catch (error: any) {
    console.error('Download failed:', error);
    await updateDownloadStatus(lessonId, 'failed', 0);
    activeDownloads.delete(lessonId);
    progressCallbacks.delete(lessonId);
    throw error;
  }
}

/**
 * Download a file with progress tracking
 */
async function downloadFile(
  url: string,
  localPath: string,
  lessonId: string,
  progressWeight: number
): Promise<void> {
  // Ensure directory exists
  const dir = localPath.substring(0, localPath.lastIndexOf('/'));
  const dirExists = await RNFS.exists(dir);
  if (!dirExists) {
    await RNFS.mkdir(dir);
  }

  // Start download
  const downloadTask = RNFS.downloadFile({
    fromUrl: url,
    toFile: localPath,
    progressDivider: 10,
    begin: (res) => {
      console.log('Download started:', res.jobId);
    },
    progress: (res) => {
      const fileProgress = (res.bytesWritten / res.contentLength) * 100;
      const callback = progressCallbacks.get(lessonId);
      if (callback) {
        callback({
          lessonId,
          progress: fileProgress * progressWeight,
          bytesDownloaded: res.bytesWritten,
          totalBytes: res.contentLength,
          status: 'downloading',
        });
      }
    },
  });

  // Store active download
  activeDownloads.set(lessonId, {
    lessonId,
    jobId: downloadTask.jobId,
    downloadUrl: url,
  });

  // Wait for completion
  const result = await downloadTask.promise;
  if (result.statusCode !== 200) {
    throw new Error(`Download failed with status ${result.statusCode}`);
  }
}

/**
 * Update download status
 */
async function updateDownloadStatus(
  lessonId: string,
  status: Download['status'],
  progress: number
): Promise<void> {
  const downloads = await getDownloads();
  const index = downloads.findIndex((d) => d.lessonId === lessonId);

  if (index !== -1) {
    downloads[index].status = status;
    downloads[index].progress = progress;
    downloads[index].lastAccessedAt = new Date().toISOString();
    await saveDownloads(downloads);
  }
}

/**
 * Pause download
 */
export async function pauseDownload(lessonId: string): Promise<void> {
  const active = activeDownloads.get(lessonId);
  if (active) {
    RNFS.stopDownload(active.jobId);
    await updateDownloadStatus(lessonId, 'paused', 0);
    activeDownloads.delete(lessonId);
  }
}

/**
 * Resume download
 */
export async function resumeDownload(lessonId: string): Promise<void> {
  const download = await getDownloadInfo(lessonId);
  if (download && download.status === 'paused') {
    // Restart download from beginning (resume not fully supported)
    await deleteDownload(lessonId);
    await startDownload(lessonId);
  }
}

/**
 * Cancel download
 */
export async function cancelDownload(lessonId: string): Promise<void> {
  await pauseDownload(lessonId);
  await deleteDownload(lessonId);
}

/**
 * Delete downloaded lesson
 */
export async function deleteDownload(lessonId: string): Promise<void> {
  try {
    // Remove files
    const lessonDir = `${DOWNLOAD_DIR}/${lessonId}`;
    const exists = await RNFS.exists(lessonDir);
    if (exists) {
      await RNFS.unlink(lessonDir);
    }

    // Remove from storage
    const downloads = await getDownloads();
    const filtered = downloads.filter((d) => d.lessonId !== lessonId);
    await saveDownloads(filtered);
  } catch (error) {
    console.error('Failed to delete download:', error);
    throw error;
  }
}

/**
 * Get total storage used by downloads
 */
export async function getStorageUsage(): Promise<{
  totalBytes: number;
  totalMB: number;
  downloadCount: number;
}> {
  const downloads = await getDownloads();
  const completedDownloads = downloads.filter((d) => d.status === 'completed');

  const totalBytes = completedDownloads.reduce(
    (sum, d) => sum + (d.fileSize || 0),
    0
  );

  return {
    totalBytes,
    totalMB: totalBytes / (1024 * 1024),
    downloadCount: completedDownloads.length,
  };
}

/**
 * Get local file path for offline playback
 */
export async function getOfflineMediaPath(
  lessonId: string,
  type: 'video' | 'audio'
): Promise<string | null> {
  if (!(await isLessonDownloaded(lessonId))) {
    return null;
  }

  const extension = type === 'video' ? 'mp4' : 'm4a';
  const path = `${DOWNLOAD_DIR}/${lessonId}/${type}.${extension}`;
  const exists = await RNFS.exists(path);

  return exists ? `file://${path}` : null;
}

/**
 * Get offline transcript
 */
export async function getOfflineTranscript(
  lessonId: string
): Promise<any | null> {
  if (!(await isLessonDownloaded(lessonId))) {
    return null;
  }

  const path = `${DOWNLOAD_DIR}/${lessonId}/transcript.json`;
  const exists = await RNFS.exists(path);

  if (!exists) {
    return null;
  }

  try {
    const content = await RNFS.readFile(path, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read offline transcript:', error);
    return null;
  }
}
