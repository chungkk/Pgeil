/**
 * Lessons API Service
 * Handles lesson fetching, streaming, progress, and pronunciation scoring
 */

import apiClient from './client';
import { ApiResponse, PaginatedResponse, LessonListResponse, LessonDetailResponse, StreamUrlsResponse, ProgressUpdateResponse, LessonCompleteResponse, PronunciationScoreResponse } from '@/types/api';
import { Lesson, Progress } from '@/types/models';

/**
 * Get paginated list of lessons with optional filters
 */
export const getLessons = async (params: {
  page?: number;
  limit?: number;
  difficulty?: string;
  category?: string;
  search?: string;
}): Promise<LessonListResponse> => {
  try {
    const response = await apiClient.get<LessonListResponse>('/api/lessons', { params });
    return response.data;
  } catch (error: any) {
    console.error('Get lessons error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch lessons');
  }
};

/**
 * Get lesson detail with transcript and user progress
 */
export const getLessonDetail = async (lessonId: string): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(`/api/lessons/${lessonId}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch lesson details');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('Get lesson detail error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch lesson details');
  }
};

/**
 * Get streaming URLs for video and audio
 */
export const getStreamUrls = async (lessonId: string): Promise<StreamUrlsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<StreamUrlsResponse>>(
      `/api/lessons/${lessonId}/stream`
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to get stream URLs');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('Get stream URLs error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to get stream URLs');
  }
};

/**
 * Update lesson progress
 */
export const updateProgress = async (
  lessonId: string,
  progressData: {
    completionPercentage?: number;
    timeSpent?: number;
    lastWatchedPosition?: number;
    shadowingAttempts?: number;
    shadowingScore?: number;
    dictationAttempts?: number;
    dictationAccuracy?: number;
  }
): Promise<Progress> => {
  try {
    const response = await apiClient.post<ApiResponse<Progress>>(
      `/api/lessons/${lessonId}/progress`,
      progressData
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update progress');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('Update progress error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to update progress');
  }
};

/**
 * Mark lesson as complete
 */
export const completeLesson = async (lessonId: string): Promise<LessonCompleteResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<LessonCompleteResponse>>(
      `/api/lessons/${lessonId}/complete`
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to complete lesson');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('Complete lesson error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to complete lesson');
  }
};

/**
 * Upload recording and get pronunciation score
 */
export const scorePronunciation = async (
  lessonId: string,
  segmentId: string,
  audioBlob: Blob | string
): Promise<PronunciationScoreResponse> => {
  try {
    const formData = new FormData();
    formData.append('lessonId', lessonId);
    formData.append('segmentId', segmentId);
    formData.append('audio', audioBlob as any);

    const response = await apiClient.post<ApiResponse<PronunciationScoreResponse>>(
      '/api/pronunciation/score',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to score pronunciation');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('Score pronunciation error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to score pronunciation');
  }
};

/**
 * Get user's lesson history
 */
export const getLessonHistory = async (): Promise<Progress[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{ data: Progress[] }>>('/api/lessons/history');
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch lesson history');
    }
    
    return response.data.data.data;
  } catch (error: any) {
    console.error('Get lesson history error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch lesson history');
  }
};

/**
 * Submit dictation answer and get accuracy feedback
 */
export const submitDictationAnswer = async (
  lessonId: string,
  exerciseId: string,
  userAnswer: string
): Promise<{ accuracy: number; feedback: string; correctAnswer: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      `/api/lessons/${lessonId}/dictation`,
      { exerciseId, userAnswer }
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to submit dictation answer');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('Submit dictation error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to submit dictation answer');
  }
};

/**
 * Calculate accuracy percentage between user answer and correct answer
 */
export const calculateAccuracy = (userAnswer: string, correctAnswer: string): number => {
  const user = userAnswer.toLowerCase().trim();
  const correct = correctAnswer.toLowerCase().trim();
  
  if (user === correct) return 100;
  
  // Levenshtein distance algorithm for similarity
  const matrix: number[][] = [];
  
  for (let i = 0; i <= correct.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= user.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= correct.length; i++) {
    for (let j = 1; j <= user.length; j++) {
      if (correct[i - 1] === user[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  const distance = matrix[correct.length][user.length];
  const maxLength = Math.max(correct.length, user.length);
  const accuracy = ((maxLength - distance) / maxLength) * 100;
  
  return Math.round(accuracy);
};
