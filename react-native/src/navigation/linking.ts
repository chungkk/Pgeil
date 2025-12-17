/**
 * Deep Linking Configuration
 * Handles navigation from external URLs and notifications
 */

import { LinkingOptions } from '@react-navigation/native';

export const linking: LinkingOptions<any> = {
  prefixes: [
    'papageil://',
    'https://papageil.com',
    'https://*.papageil.com',
  ],
  config: {
    screens: {
      // Auth Stack
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },

      // Main App
      Main: {
        screens: {
          // Home Tab
          Home: {
            screens: {
              HomeScreen: 'home',
              LessonDetail: 'lessons/:lessonId',
              Shadowing: 'lessons/:lessonId/shadowing',
              Dictation: 'lessons/:lessonId/dictation',
            },
          },

          // Profile Tab
          Profile: {
            screens: {
              ProfileScreen: 'profile',
              Settings: 'settings',
              VocabularyList: 'vocabulary',
              DownloadManager: 'downloads',
            },
          },

          // Leaderboard Tab
          Leaderboard: {
            screens: {
              LeaderboardScreen: 'leaderboard',
              AchievementsScreen: 'achievements',
            },
          },
        },
      },

      // Modal screens
      NotFound: '*',
    },
  },
};

/**
 * Parse deep link URL and extract parameters
 * @param url - Deep link URL
 * @returns Parsed route and params
 */
export function parseDeepLink(url: string): {
  screen: string;
  params?: Record<string, any>;
} | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Lesson detail: /lessons/:lessonId
    const lessonMatch = pathname.match(/^\/lessons\/([^/]+)$/);
    if (lessonMatch) {
      return {
        screen: 'LessonDetail',
        params: { lessonId: lessonMatch[1] },
      };
    }

    // Shadowing: /lessons/:lessonId/shadowing
    const shadowingMatch = pathname.match(/^\/lessons\/([^/]+)\/shadowing$/);
    if (shadowingMatch) {
      return {
        screen: 'Shadowing',
        params: { lessonId: shadowingMatch[1] },
      };
    }

    // Profile
    if (pathname === '/profile') {
      return { screen: 'ProfileScreen' };
    }

    // Leaderboard
    if (pathname === '/leaderboard') {
      return { screen: 'LeaderboardScreen' };
    }

    // Achievements
    if (pathname === '/achievements') {
      return { screen: 'AchievementsScreen' };
    }

    return null;
  } catch (error) {
    console.error('Parse deep link error:', error);
    return null;
  }
}

/**
 * Generate deep link URL
 * @param screen - Screen name
 * @param params - Screen params
 * @returns Deep link URL
 */
export function generateDeepLink(
  screen: string,
  params?: Record<string, any>
): string {
  const base = 'papageil://';

  switch (screen) {
    case 'LessonDetail':
      return `${base}lessons/${params?.lessonId}`;
    case 'Shadowing':
      return `${base}lessons/${params?.lessonId}/shadowing`;
    case 'ProfileScreen':
      return `${base}profile`;
    case 'LeaderboardScreen':
      return `${base}leaderboard`;
    case 'AchievementsScreen':
      return `${base}achievements`;
    default:
      return base;
  }
}
