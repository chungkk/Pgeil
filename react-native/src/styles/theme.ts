/**
 * Theme Configuration
 * Combines colors, typography, spacing
 */

import { colors } from './colors';
import { typography, textStyles } from './typography';
import { spacing, borderRadius, shadows } from './spacing';

export const lightTheme = {
  colors: {
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    primaryLight: colors.primaryLight,
    secondary: colors.secondary,
    accent: colors.accent,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    pass: colors.pass,
    fail: colors.fail,
    ...colors.light,
  },
  typography,
  textStyles,
  spacing,
  borderRadius,
  shadows,
  isDark: false,
};

export const darkTheme = {
  colors: {
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    primaryLight: colors.primaryLight,
    secondary: colors.secondary,
    accent: colors.accent,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    pass: colors.pass,
    fail: colors.fail,
    ...colors.dark,
  },
  typography,
  textStyles,
  spacing,
  borderRadius,
  shadows,
  isDark: true,
};

export type Theme = typeof lightTheme;

export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
};
