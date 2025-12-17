import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage wrapper for non-sensitive data (cache, preferences, etc.)
 */

export const asyncStorage = {
  /**
   * Store a value
   */
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      throw error;
    }
  },

  /**
   * Get a value
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  },

  /**
   * Remove a value
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  },

  /**
   * Get multiple items
   */
  async multiGet(keys: string[]): Promise<Record<string, any>> {
    try {
      const values = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};
      
      values.forEach(([key, value]) => {
        if (value) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error in multiGet:', error);
      return {};
    }
  },

  /**
   * Set multiple items
   */
  async multiSet(pairs: Array<[string, any]>): Promise<void> {
    try {
      const stringPairs: Array<[string, string]> = pairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(stringPairs);
    } catch (error) {
      console.error('Error in multiSet:', error);
      throw error;
    }
  },
};

// Common storage keys
export const StorageKeys = {
  USER_DATA: 'user_data',
  APP_THEME: 'app_theme',
  APP_LANGUAGE: 'app_language',
  DICTIONARY_CACHE: 'dictionary_cache',
  OFFLINE_QUEUE: 'offline_queue',
  DOWNLOADS: 'downloads',
  LESSON_PROGRESS: 'lesson_progress',
  PLAYBACK_SPEED: 'playback_speed',
};
