import { api } from './api';
import { API_ENDPOINTS } from '@constants/api';
import type { Task, CreateTaskData, UpdateTaskData } from '@types/task';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@types/api';

export const taskService = {
  async getTasks(params?: PaginationParams & { status?: string; priority?: string }): Promise<PaginatedResponse<Task>> {
    const response = await api.get<PaginatedResponse<Task>>(API_ENDPOINTS.TASKS, { params });
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(API_ENDPOINTS.TASK(id));
    return response.data.data;
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>(API_ENDPOINTS.TASKS, data);
    return response.data.data;
  },

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    const response = await api.patch<ApiResponse<Task>>(API_ENDPOINTS.TASK(id), data);
    return response.data.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.TASK(id));
  },

  async addSubtask(taskId: string, title: string): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>(
      API_ENDPOINTS.TASK_SUBTASKS(taskId),
      { title }
    );
    return response.data.data;
  },

  async uploadAttachment(taskId: string, formData: FormData): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>(
      API_ENDPOINTS.TASK_ATTACHMENTS(taskId),
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data;
  },

  async searchTasks(query: string): Promise<Task[]> {
    const response = await api.get<ApiResponse<Task[]>>(API_ENDPOINTS.SEARCH, {
      params: { q: query, type: 'task' },
    });
    return response.data.data;
  },
};
