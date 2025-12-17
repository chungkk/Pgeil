/**
 * ThemeContext - Dark/Light mode management
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { asyncStorage, StorageKeys } from '@/services/storage/asyncStorage';
import { lightTheme, darkTheme, Theme } from '@/styles/theme';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextData {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [isDark, setIsDark] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update theme when mode or system preference changes
  useEffect(() => {
    updateTheme();
  }, [themeMode, systemColorScheme]);

  const loadThemePreference = async () => {
    try {
      const savedMode = await asyncStorage.getItem<ThemeMode>(StorageKeys.APP_THEME);
      if (savedMode) {
        setThemeModeState(savedMode);
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  const updateTheme = () => {
    let shouldBeDark = false;

    if (themeMode === 'dark') {
      shouldBeDark = true;
    } else if (themeMode === 'light') {
      shouldBeDark = false;
    } else {
      // Auto mode: follow system
      shouldBeDark = systemColorScheme === 'dark';
    }

    setIsDark(shouldBeDark);
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await asyncStorage.setItem(StorageKeys.APP_THEME, mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        isDark,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
