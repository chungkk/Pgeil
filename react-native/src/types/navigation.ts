/**
 * Navigation Types
 * Type-safe navigation for React Navigation
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabsParamList>;
  LessonStack: NavigatorScreenParams<LessonStackParamList>;
};

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Tabs
export type MainTabsParamList = {
  Home: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

// Lesson Stack
export type LessonStackParamList = {
  LessonDetail: { lessonId: string };
  Shadowing: { lessonId: string; segmentId?: string };
  Dictation: { lessonId: string; exerciseId?: string };
};

// Profile Stack
export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  VocabularyList: undefined;
  DownloadManager: undefined;
};

// Combined navigation params
export type NavigationParamList = RootStackParamList &
  AuthStackParamList &
  MainTabsParamList &
  LessonStackParamList &
  ProfileStackParamList;

// Navigation prop types
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

export type RootNavigationProp = StackNavigationProp<RootStackParamList>;
export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;
export type LessonNavigationProp = StackNavigationProp<LessonStackParamList>;
export type ProfileNavigationProp = StackNavigationProp<ProfileStackParamList>;

// Screen props helper
export type ScreenProps<
  T extends keyof NavigationParamList,
  NavProp = any
> = {
  navigation: NavProp;
  route: RouteProp<NavigationParamList, T>;
};
