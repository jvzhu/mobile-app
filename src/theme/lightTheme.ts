import { lightColors } from './colors';
import { spacing, borderRadius } from './spacing';
import { typography } from './typography';

export const lightTheme = {
  dark: false,
  colors: lightColors,
  spacing,
  borderRadius,
  typography,
} as const;

export type Theme = typeof lightTheme;
