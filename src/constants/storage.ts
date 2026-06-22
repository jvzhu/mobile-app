export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@mobileapp/access_token',
  REFRESH_TOKEN: '@mobileapp/refresh_token',
  USER: '@mobileapp/user',
  THEME: '@mobileapp/theme',
  LANGUAGE: '@mobileapp/language',
  ONBOARDING_COMPLETED: '@mobileapp/onboarding_completed',
  PUSH_TOKEN: '@mobileapp/push_token',
  BIOMETRIC_ENABLED: '@mobileapp/biometric_enabled',
  REMEMBER_ME: '@mobileapp/remember_me',
  LAST_SYNC: '@mobileapp/last_sync',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
