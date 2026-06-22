import { api } from './api';
import { API_ENDPOINTS } from '@constants/api';
import type { User, UpdateProfileData } from '@types/auth';
import type { ApiResponse } from '@types/api';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.PROFILE);
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.patch<ApiResponse<User>>(
      API_ENDPOINTS.UPDATE_PROFILE,
      data
    );
    return response.data.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post(API_ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
  },

  async uploadAvatar(formData: FormData): Promise<{ avatarUrl: string }> {
    const response = await api.post<ApiResponse<{ avatarUrl: string }>>(
      `${API_ENDPOINTS.PROFILE}/avatar`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.data;
  },

  async deleteAccount(): Promise<void> {
    await api.delete(API_ENDPOINTS.DELETE_ACCOUNT);
  },
};
