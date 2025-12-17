/**
 * Vocabulary API Service
 * Handles saving, listing, and managing vocabulary items
 */

import api from './client';
import { VocabularyItem } from '../../types/models';

export interface SaveVocabularyParams {
  word: string;
  sourceLessonId?: string;
  sourceContext?: string;
}

export interface VocabularyListParams {
  isLearned?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Save a word to user's vocabulary
 */
export async function saveToVocabulary(
  params: SaveVocabularyParams
): Promise<VocabularyItem> {
  try {
    const response = await api.post('/vocabulary/save', params);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to save vocabulary'
    );
  }
}

/**
 * Get user's vocabulary list with optional filters
 */
export async function getVocabularyList(
  params: VocabularyListParams = {}
): Promise<{ items: VocabularyItem[]; total: number }> {
  try {
    const response = await api.get('/vocabulary/list', {
      params: {
        isLearned: params.isLearned,
        limit: params.limit || 50,
        offset: params.offset || 0,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch vocabulary'
    );
  }
}

/**
 * Mark a vocabulary item as learned/unlearned
 */
export async function markAsLearned(
  vocabularyId: string,
  isLearned: boolean
): Promise<VocabularyItem> {
  try {
    const response = await api.patch(`/vocabulary/${vocabularyId}/learned`, {
      isLearned,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to update vocabulary'
    );
  }
}

/**
 * Delete a vocabulary item
 */
export async function deleteVocabulary(
  vocabularyId: string
): Promise<void> {
  try {
    await api.delete(`/vocabulary/${vocabularyId}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to delete vocabulary'
    );
  }
}

/**
 * Get vocabulary statistics (for profile/achievements)
 */
export async function getVocabularyStats(): Promise<{
  total: number;
  learned: number;
  reviewCount: number;
}> {
  try {
    const response = await api.get('/vocabulary/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch vocabulary stats'
    );
  }
}
