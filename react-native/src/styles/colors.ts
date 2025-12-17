/**
 * Color Palette
 */

export const colors = {
  // Primary brand colors
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  primaryLight: '#7FB3E8',
  
  // Secondary colors
  secondary: '#50C878',
  secondaryDark: '#3DA75F',
  secondaryLight: '#7DD89A',
  
  // Accent colors
  accent: '#FFB84D',
  accentDark: '#E69A2E',
  accentLight: '#FFC972',
  
  // Feedback colors
  success: '#50C878',
  warning: '#FFB84D',
  error: '#E74C3C',
  info: '#4A90E2',
  
  // Neutral colors - Light theme
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    card: '#FFFFFF',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    textTertiary: '#BDC3C7',
    border: '#E0E0E0',
    divider: '#ECEFF1',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Neutral colors - Dark theme
  dark: {
    background: '#1A1A1A',
    surface: '#2C2C2C',
    card: '#333333',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    border: '#404040',
    divider: '#2C2C2C',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Semantic colors
  pass: '#50C878', // >80% pronunciation score
  fail: '#E74C3C', // <=80% pronunciation score
  
  // Transparent
  transparent: 'transparent',
};

export type ColorKey = keyof typeof colors;
export type ThemeColors = typeof colors.light | typeof colors.dark;
