/**
 * Authentication API Service
 * Token management and auth endpoints
 * Full implementation in Phase 3 (US6)
 */

import apiClient from './client';
import { secureStorage } from '@/services/storage/secureStorage';
import type { LoginResponse, RefreshTokenResponse, RegisterResponse, ApiResponse } from '@/types/api';

// In-memory access token storage (cleared on app close)
let accessToken: string | null = null;

/**
 * Get current access token from memory
 */
export const getAccessToken = async (): Promise<string | null> => {
  return accessToken;
};

/**
 * Set access token in memory
 */
export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await secureStorage.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      '/api/auth/mobile/refresh',
      { refreshToken }
    );

    if (response.data.success && response.data.data) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
      
      // Store new tokens
      setAccessToken(newAccessToken);
      await secureStorage.setRefreshToken(newRefreshToken);
      
      return newAccessToken;
    }

    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear tokens on refresh failure
    setAccessToken(null);
    await secureStorage.removeRefreshToken();
    return null;
  }
};

/**
 * Login with email and password
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/api/auth/mobile/login',
      { email, password }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Login failed');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.error?.message || 'Login failed');
  }
};

/**
 * Register new user
 */
export const register = async (
  email: string,
  password: string,
  name: string
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/api/auth/mobile/register',
      { email, password, name }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Registration failed');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.response?.data?.error?.message || 'Registration failed');
  }
};

/**
 * Logout user
 */
export const logout = async (refreshToken: string): Promise<void> => {
  try {
    await apiClient.post('/api/auth/mobile/logout', { refreshToken });
  } catch (error: any) {
    console.error('Logout error:', error);
    // Don't throw - logout should always succeed locally even if API fails
  }
};

/**
 * Login with Google OAuth
 */
export const loginWithGoogle = async (idToken: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/api/auth/mobile/google-oauth',
      { idToken }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error?.message || 'Google login failed');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Google login error:', error);
    throw new Error(error.response?.data?.error?.message || 'Google login failed');
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>(
      '/api/auth/mobile/password/reset/request',
      { email }
    );

    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Password reset request failed');
    }
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.response?.data?.error?.message || 'Password reset request failed');
  }
};
