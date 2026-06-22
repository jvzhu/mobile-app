export const APP_CONFIG = {
  APP_NAME: 'MobileApp',
  APP_VERSION: '1.0.0',
  APP_ENV: (process.env.APP_ENV ?? 'development') as 'development' | 'staging' | 'production',
  IS_DEV: process.env.APP_ENV === 'development' || __DEV__,

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Cache
  CACHE_TTL_SHORT: 5 * 60 * 1000,    // 5 minutes
  CACHE_TTL_MEDIUM: 30 * 60 * 1000,  // 30 minutes
  CACHE_TTL_LONG: 24 * 60 * 60 * 1000, // 24 hours

  // Auth
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes

  // UI
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,

  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],

  // Search
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_RESULTS: 50,
} as const;
