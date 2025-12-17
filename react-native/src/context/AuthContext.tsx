/**
 * AuthContext - Global authentication state management
 * Handles login, logout, registration, token refresh
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/models';
import { secureStorage } from '@/services/storage/secureStorage';
import { asyncStorage, StorageKeys } from '@/services/storage/asyncStorage';
import { 
  setAccessToken,
  getAccessToken,
  refreshAccessToken,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  loginWithGoogle as apiLoginWithGoogle
} from '@/services/api/auth';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app launch
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);

      // Check if we have a refresh token
      const refreshToken = await secureStorage.getRefreshToken();
      
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      // Try to refresh access token
      const newAccessToken = await refreshAccessToken();
      
      if (newAccessToken) {
        // Load user data from storage
        const storedUser = await asyncStorage.getItem<User>(StorageKeys.USER_DATA);
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      await secureStorage.removeRefreshToken();
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password);
      
      // Store tokens
      setAccessToken(response.accessToken);
      await secureStorage.setRefreshToken(response.refreshToken);
      
      // Store user data
      await asyncStorage.setItem(StorageKeys.USER_DATA, response.user);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await apiRegister(email, password, name);
      
      // Store tokens
      setAccessToken(response.accessToken);
      await secureStorage.setRefreshToken(response.refreshToken);
      
      // Store user data
      await asyncStorage.setItem(StorageKeys.USER_DATA, response.user);
      setUser(response.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      const response = await apiLoginWithGoogle(idToken);
      
      // Store tokens
      setAccessToken(response.accessToken);
      await secureStorage.setRefreshToken(response.refreshToken);
      
      // Store user data
      await asyncStorage.setItem(StorageKeys.USER_DATA, response.user);
      setUser(response.user);
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = await secureStorage.getRefreshToken();
      
      if (refreshToken) {
        await apiLogout(refreshToken);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local data, even if API call fails
      setAccessToken(null);
      await secureStorage.removeRefreshToken();
      await asyncStorage.removeItem(StorageKeys.USER_DATA);
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      asyncStorage.setItem(StorageKeys.USER_DATA, updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
