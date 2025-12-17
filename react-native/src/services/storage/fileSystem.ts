import { Platform } from 'react-native';
// Note: react-native-fs will be installed when implementing offline downloads (Phase 7)
// For now, providing the interface

/**
 * File System service for downloaded lessons
 * Uses react-native-fs for file operations
 */

// Base directory for downloaded content
export const DOWNLOADS_DIR = Platform.select({
  ios: '', // Will be set to DocumentDirectoryPath
  android: '', // Will be set to DownloadDirectoryPath
  default: '',
});

export const fileSystem = {
  /**
   * Download a file from URL to local storage
   */
  async downloadFile(
    url: string,
    fileName: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // TODO: Implement using react-native-fs in Phase 7 (US5 - Offline)
    throw new Error('downloadFile not yet implemented - will be added in Phase 7');
  },

  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    // TODO: Implement using react-native-fs in Phase 7
    throw new Error('fileExists not yet implemented - will be added in Phase 7');
  },

  /**
   * Delete a file
   */
  async deleteFile(filePath: string): Promise<void> {
    // TODO: Implement using react-native-fs in Phase 7
    throw new Error('deleteFile not yet implemented - will be added in Phase 7');
  },

  /**
   * Get file size
   */
  async getFileSize(filePath: string): Promise<number> {
    // TODO: Implement using react-native-fs in Phase 7
    throw new Error('getFileSize not yet implemented - will be added in Phase 7');
  },

  /**
   * Get available storage space
   */
  async getAvailableSpace(): Promise<number> {
    // TODO: Implement using react-native-fs in Phase 7
    throw new Error('getAvailableSpace not yet implemented - will be added in Phase 7');
  },

  /**
   * List downloaded files
   */
  async listDownloads(): Promise<string[]> {
    // TODO: Implement using react-native-fs in Phase 7
    return [];
  },
};

// Download status enum
export enum DownloadStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
