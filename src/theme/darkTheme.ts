import { darkColors } from './colors';
import { spacing, borderRadius } from './spacing';
import { typography } from './typography';

export const darkTheme = {
  dark: true,
  colors: darkColors,
  spacing,
  borderRadius,
  typography,
} as const;
