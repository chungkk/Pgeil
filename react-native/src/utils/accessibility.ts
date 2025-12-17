/**
 * Accessibility Utilities
 * Helpers for screen reader support and accessibility labels
 */

import { AccessibilityRole, Platform } from 'react-native';

/**
 * Accessibility roles for common UI elements
 */
export const A11yRoles = {
  button: 'button' as AccessibilityRole,
  link: 'link' as AccessibilityRole,
  header: 'header' as AccessibilityRole,
  text: 'text' as AccessibilityRole,
  image: 'image' as AccessibilityRole,
  imageButton: 'imagebutton' as AccessibilityRole,
  search: 'search' as AccessibilityRole,
  adjustable: 'adjustable' as AccessibilityRole,
  tab: 'tab' as AccessibilityRole,
  none: 'none' as AccessibilityRole,
};

/**
 * Generate accessible label for lesson item
 */
export function getLessonAccessibilityLabel(
  title: string,
  level: string,
  duration: number,
  completed: boolean
): string {
  const status = completed ? 'Completed' : 'Not completed';
  const minutes = Math.floor(duration / 60);
  return `${title}, ${level} level, ${minutes} minutes, ${status}`;
}

/**
 * Generate accessible label for vocabulary word
 */
export function getVocabularyAccessibilityLabel(
  word: string,
  translation: string,
  partOfSpeech: string,
  learned: boolean
): string {
  const status = learned ? 'Learned' : 'Not learned yet';
  return `${word}, ${partOfSpeech}, ${translation}, ${status}`;
}

/**
 * Generate accessible label for progress indicator
 */
export function getProgressAccessibilityLabel(
  current: number,
  total: number,
  unit: string = 'lessons'
): string {
  const percentage = Math.round((current / total) * 100);
  return `Progress: ${current} of ${total} ${unit} completed, ${percentage} percent`;
}

/**
 * Generate accessible label for button with loading state
 */
export function getButtonAccessibilityLabel(
  label: string,
  isLoading: boolean,
  disabled: boolean
): string {
  if (isLoading) return `${label}, loading`;
  if (disabled) return `${label}, disabled`;
  return label;
}

/**
 * Generate accessible hint for interactive elements
 */
export function getAccessibilityHint(action: string): string {
  return `Double tap to ${action}`;
}

/**
 * Platform-specific accessibility props
 */
export function getAccessibilityProps(
  label: string,
  role: AccessibilityRole,
  hint?: string,
  value?: string
) {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: role,
    accessibilityHint: hint,
    accessibilityValue: value ? { text: value } : undefined,
    // iOS specific
    ...(Platform.OS === 'ios' && {
      accessibilityLanguage: 'en-US',
    }),
  };
}

/**
 * Mark element as header for navigation
 */
export function getHeaderAccessibilityProps(level: number = 1) {
  return {
    accessible: true,
    accessibilityRole: 'header' as AccessibilityRole,
    ...( Platform.OS === 'ios' && {
      accessibilityTraits: ['header'],
    }),
  };
}

/**
 * Announce message to screen reader
 */
export function announceForAccessibility(message: string): void {
  if (Platform.OS === 'ios') {
    // iOS VoiceOver announcement
    const AccessibilityInfo = require('react-native').AccessibilityInfo;
    AccessibilityInfo.announceForAccessibility(message);
  }
}

/**
 * Check if screen reader is enabled
 */
export async function isScreenReaderEnabled(): Promise<boolean> {
  const AccessibilityInfo = require('react-native').AccessibilityInfo;
  return await AccessibilityInfo.isScreenReaderEnabled();
}

/**
 * Format time for accessibility
 */
export function formatTimeForAccessibility(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  if (secs > 0) parts.push(`${secs} ${secs === 1 ? 'second' : 'seconds'}`);

  return parts.join(', ');
}

/**
 * Format score for accessibility
 */
export function formatScoreForAccessibility(score: number, maxScore: number = 100): string {
  return `Score: ${score} out of ${maxScore}`;
}
