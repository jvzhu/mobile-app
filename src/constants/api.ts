export const API_BASE_URL = process.env.API_BASE_URL ?? 'https://api.example.com/v1';
export const API_TIMEOUT = Number(process.env.API_TIMEOUT) || 30000;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',

  // User
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
  DELETE_ACCOUNT: '/user/account',

  // Tasks
  TASKS: '/tasks',
  TASK: (id: string) => `/tasks/${id}`,
  TASK_SUBTASKS: (id: string) => `/tasks/${id}/subtasks`,
  TASK_ATTACHMENTS: (id: string) => `/tasks/${id}/attachments`,

  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION: (id: string) => `/notifications/${id}`,
  MARK_ALL_READ: '/notifications/mark-all-read',
  PUSH_TOKEN: '/notifications/push-token',

  // Search
  SEARCH: '/search',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;
