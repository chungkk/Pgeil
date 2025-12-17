import RNSecureStorage, { ACCESSIBLE } from 'react-native-secure-storage';

const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * SecureStorage wrapper for sensitive data (tokens, credentials)
 * Uses iOS Keychain / Android Keystore
 */

export const secureStorage = {
  /**
   * Store refresh token securely
   */
  async setRefreshToken(token: string): Promise<void> {
    try {
      await RNSecureStorage.setItem(REFRESH_TOKEN_KEY, token, {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      });
    } catch (error) {
      console.error('Error storing refresh token:', error);
      throw error;
    }
  },

  /**
   * Get stored refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      const token = await RNSecureStorage.getItem(REFRESH_TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('Error retrieving refresh token:', error);
      return null;
    }
  },

  /**
   * Remove refresh token (logout)
   */
  async removeRefreshToken(): Promise<void> {
    try {
      await RNSecureStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error removing refresh token:', error);
    }
  },

  /**
   * Clear all secure storage
   */
  async clear(): Promise<void> {
    try {
      await RNSecureStorage.removeItem(REFRESH_TOKEN_KEY);
      // Add other secure keys here if needed
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  },
};
