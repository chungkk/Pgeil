/**
 * Leaderboard API Service
 * Handles leaderboard fetching, achievement management, and user statistics
 */

import api from './client';
import { LeaderboardEntry, Achievement } from '../../types/models';

export interface LeaderboardParams {
  period?: 'weekly' | 'monthly' | 'all-time';
  limit?: number;
  offset?: number;
}

/**
 * Get leaderboard rankings
 * @param params - Filter parameters (period, limit, offset)
 * @returns Leaderboard entries with rankings
 */
export async function getLeaderboard(
  params: LeaderboardParams = {}
): Promise<{ entries: LeaderboardEntry[]; total: number; userRank?: number }> {
  try {
    const response = await api.get('/leaderboard/list', {
      params: {
        period: params.period || 'weekly',
        limit: params.limit || 50,
        offset: params.offset || 0,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Get leaderboard error:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch leaderboard'
    );
  }
}

/**
 * Get all available achievements
 * @returns List of achievements
 */
export async function getAchievements(): Promise<Achievement[]> {
  try {
    const response = await api.get('/achievements/list');
    return response.data.achievements || [];
  } catch (error: any) {
    console.error('Get achievements error:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch achievements'
    );
  }
}

/**
 * Get user's earned achievements
 * @param userId - User ID (optional, defaults to current user)
 * @returns List of user's achievements with earned dates
 */
export async function getUserAchievements(userId?: string): Promise<
  Array<Achievement & { earnedAt: string }>
> {
  try {
    const endpoint = userId
      ? `/users/${userId}/achievements`
      : '/users/me/achievements';

    const response = await api.get(endpoint);
    return response.data.achievements || [];
  } catch (error: any) {
    console.error('Get user achievements error:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch user achievements'
    );
  }
}

/**
 * Get user statistics
 * @param userId - User ID (optional, defaults to current user)
 * @returns User statistics including lessons, time, accuracy, streaks
 */
export async function getUserStats(userId?: string): Promise<{
  totalLessonsCompleted: number;
  totalPracticeTime: number; // seconds
  averageAccuracyScore: number; // 0-100
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  achievementCount: number;
  lastPracticeDate: string | null;
}> {
  try {
    const endpoint = userId ? `/users/${userId}/stats` : '/users/me/stats';
    const response = await api.get(endpoint);
    return response.data;
  } catch (error: any) {
    console.error('Get user stats error:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch user stats'
    );
  }
}

/**
 * Check for new achievements
 * Called after completing lessons or other milestone events
 * @returns Newly earned achievements
 */
export async function checkNewAchievements(): Promise<Achievement[]> {
  try {
    const response = await api.post('/achievements/check');
    return response.data.newAchievements || [];
  } catch (error: any) {
    console.error('Check achievements error:', error);
    // Non-critical error, return empty array
    return [];
  }
}
