import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '@theme/index';
import type { Theme } from '@theme/lightTheme';
import type { RootState } from '@store/index';
import { setTheme } from '@store/slices/uiSlice';
import type { ThemeMode } from '@store/slices/uiSlice';
import { storageGet, storageSet } from '@utils/storage';
import { STORAGE_KEYS } from '@constants/storage';

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const systemColorScheme = useColorScheme();
  const themeMode = useSelector((state: RootState) => state.ui.theme);

  const resolvedDark =
    themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';

  const theme = resolvedDark ? darkTheme : lightTheme;
  const isDark = resolvedDark;

  useEffect(() => {
    storageGet<ThemeMode>(STORAGE_KEYS.THEME).then(saved => {
      if (saved) dispatch(setTheme(saved));
    });
  }, [dispatch]);

  const handleSetThemeMode = async (mode: ThemeMode) => {
    dispatch(setTheme(mode));
    await storageSet(STORAGE_KEYS.THEME, mode);
  };

  const toggleTheme = () => {
    handleSetThemeMode(isDark ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider
      value={{ theme, isDark, themeMode, toggleTheme, setThemeMode: handleSetThemeMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within ThemeProvider');
  return context;
};
