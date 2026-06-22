import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es';

interface UIState {
  theme: ThemeMode;
  language: Language;
  isLoading: boolean;
  loadingMessage: string | null;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | 'warning' | null;
  isOnline: boolean;
}

const initialState: UIState = {
  theme: 'system',
  language: 'en',
  isLoading: false,
  loadingMessage: null,
  toastMessage: null,
  toastType: null,
  isOnline: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
    showLoading(state, action: PayloadAction<string | undefined>) {
      state.isLoading = true;
      state.loadingMessage = action.payload ?? null;
    },
    hideLoading(state) {
      state.isLoading = false;
      state.loadingMessage = null;
    },
    showToast(
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
      }>
    ) {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type;
    },
    hideToast(state) {
      state.toastMessage = null;
      state.toastType = null;
    },
    setOnlineStatus(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },
  },
});

export const {
  setTheme,
  setLanguage,
  showLoading,
  hideLoading,
  showToast,
  hideToast,
  setOnlineStatus,
} = uiSlice.actions;

export default uiSlice.reducer;
