/**
 * Dictionary API Service
 * Handles word lookup with online/offline caching
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './client';
import { DictionaryEntry } from '../../types/models';

const CACHE_PREFIX = 'dict:';
const CACHE_EXPIRY_DAYS = 90;

/**
 * Look up a word in the dictionary
 * - First checks AsyncStorage cache
 * - Falls back to API call if not cached or expired
 * - Caches API response for offline use
 */
export async function lookupWord(
  word: string,
  targetLanguage: 'vi' | 'en' = 'vi'
): Promise<DictionaryEntry> {
  const cacheKey = `${CACHE_PREFIX}${word.toLowerCase()}_${targetLanguage}`;

  try {
    // 1. Check local cache
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // 2. Fetch from backend API
    const response = await api.get('/dictionary/lookup', {
      params: { word, targetLanguage },
    });

    const entry: DictionaryEntry = response.data;

    // 3. Cache for offline use
    await saveToCache(cacheKey, entry);

    return entry;
  } catch (error: any) {
    // If API fails and we have expired cache, return it anyway
    const cached = await getFromCache(cacheKey, true);
    if (cached) {
      return cached;
    }
    throw new Error(error.response?.data?.message || 'Word lookup failed');
  }
}

/**
 * Get entry from AsyncStorage cache
 * @param ignoreExpiry - If true, returns even expired entries (for offline fallback)
 */
async function getFromCache(
  cacheKey: string,
  ignoreExpiry = false
): Promise<DictionaryEntry | null> {
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (!cached) return null;

    const { entry, cachedAt } = JSON.parse(cached);
    const age = Date.now() - cachedAt;
    const maxAge = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    if (!ignoreExpiry && age > maxAge) {
      // Expired - remove from cache
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }

    return entry;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

/**
 * Save dictionary entry to AsyncStorage cache
 */
async function saveToCache(
  cacheKey: string,
  entry: DictionaryEntry
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      cacheKey,
      JSON.stringify({
        entry,
        cachedAt: Date.now(),
      })
    );
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

/**
 * Clear all dictionary cache (for settings/cleanup)
 */
export async function clearDictionaryCache(): Promise<void> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const dictKeys = allKeys.filter((key) => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(dictKeys);
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

/**
 * Get cache statistics (for debugging/UI)
 */
export async function getCacheStats(): Promise<{
  totalEntries: number;
  totalSize: number;
}> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const dictKeys = allKeys.filter((key) => key.startsWith(CACHE_PREFIX));

    let totalSize = 0;
    for (const key of dictKeys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += new Blob([value]).size;
      }
    }

    return {
      totalEntries: dictKeys.length,
      totalSize,
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return { totalEntries: 0, totalSize: 0 };
  }
}
