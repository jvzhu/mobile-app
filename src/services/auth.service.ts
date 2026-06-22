import { api } from './api';
import { storageService } from './storage.service';
import { API_ENDPOINTS } from '@constants/api';
import { STORAGE_KEYS } from '@constants/storage';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  RefreshTokenResponse,
  User,
} from '@types/auth';
import type { ApiResponse } from '@types/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    const { user, tokens } = response.data.data;
    await storageService.saveTokens(tokens.accessToken, tokens.refreshToken);
    await storageService.setSecureItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return { user, tokens };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.REGISTER,
      data
    );
    const { user, tokens } = response.data.data;
    await storageService.saveTokens(tokens.accessToken, tokens.refreshToken);
    await storageService.setSecureItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return { user, tokens };
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = await storageService.getRefreshToken();
      await api.post(API_ENDPOINTS.LOGOUT, { refreshToken });
    } finally {
      await storageService.clearTokens();
    }
  },

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await api.post(API_ENDPOINTS.FORGOT_PASSWORD, data);
  },

  async resetPassword(data: ResetPasswordData): Promise<void> {
    await api.post(API_ENDPOINTS.RESET_PASSWORD, data);
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = await storageService.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await api.post<ApiResponse<RefreshTokenResponse>>(
      API_ENDPOINTS.REFRESH_TOKEN,
      { refreshToken }
    );

    const tokens = response.data.data;
    await storageService.saveTokens(tokens.accessToken, tokens.refreshToken);
    return tokens;
  },

  async getStoredUser(): Promise<User | null> {
    const userJson = await storageService.getSecureItem(STORAGE_KEYS.USER);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  },

  async saveUser(user: User): Promise<void> {
    await storageService.setSecureItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  async clearUser(): Promise<void> {
    await storageService.deleteSecureItem(STORAGE_KEYS.USER);
  },
};
