/**
 * Theme constants for ExpenseeApp
 * This file defines the design system variables including colors, typography, and spacing
 */

export const colors = {
  // Primary palette
  primary: {
    light: '#6B8FF8',
    main: '#3366FF',
    dark: '#254EDB',
    contrast: '#FFFFFF',
  },

  // Secondary palette
  secondary: {
    light: '#79F2C0',
    main: '#00D68F',
    dark: '#00B377',
    contrast: '#FFFFFF',
  },

  // UI States
  success: {
    light: '#79F2C0',
    main: '#00D68F',
    dark: '#00B377',
  },
  warning: {
    light: '#FFE591',
    main: '#FFCF5C',
    dark: '#F2BE45',
  },
  error: {
    light: '#FF9D9D',
    main: '#FF5252',
    dark: '#DB3E3E',
  },
  info: {
    light: '#CAF0F8',
    main: '#90E0EF',
    dark: '#00B4D8',
  },

  // Neutrals
  neutral: {
    white: '#FFFFFF',
    background: '#F9FAFC',
    backgroundAlt: '#F0F2F5',
    border: '#E0E4EC',
    borderDark: '#CDD5E0',
    textLight: '#8D96A8',
    text: '#4E5968',
    textDark: '#2D3748',
    black: '#222222',
  },

  // Gradients
  gradients: {
    primary: ['#3366FF', '#7755FF'],
    success: ['#00D68F', '#4CAF50'],
    warning: ['#FFCF5C', '#FF9800'],
    error: ['#FF5252', '#F44336'],
  },
};

export const typography = {
  fontFamily: {
    base: 'System', // This will use San Francisco on iOS and Roboto on Android
    heading: 'System',
    mono: 'Courier',
  },

  // Font sizes following an 8pt scale
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.7,
  },

  // Font weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const spacing = {
  // Base spacing unit: 4px
  '0': 0,
  '0.5': 2,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
  '20': 80,
  '24': 96,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.neutral.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.neutral.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: colors.neutral.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Theme object that brings all tokens together
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};
