import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL, API_TIMEOUT, HTTP_STATUS } from '@constants/api';
import { storageService } from './storage.service';
import { logger } from '@utils/logger';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null): void => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const apiInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await storageService.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = ['Bearer', token].join(' ');
    }
    logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
    });
    return config;
  },
  (error: unknown) => {
    logger.error('Request interceptor error', error);
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.debug(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = ['Bearer', token].join(' ');
            }
            return apiInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await storageService.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = data;
        await storageService.saveTokens(accessToken, newRefreshToken);

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = ['Bearer', accessToken].join(' ');
        }
        return apiInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await storageService.clearTokens();
        logger.warn('Token refresh failed, user needs to re-authenticate');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    logger.error(`API Error: ${error.response?.status}`, {
      url: error.config?.url,
      message: error.response?.data?.message ?? error.message,
    });

    return Promise.reject(error);
  }
);

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiInstance.get<T>(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiInstance.post<T>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiInstance.put<T>(url, data, config),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiInstance.patch<T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiInstance.delete<T>(url, config),
};

export default apiInstance;
