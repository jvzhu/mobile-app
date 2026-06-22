import axios from 'axios';
import { api } from '@services/api';

jest.mock('axios', () => {
  const actual = jest.requireActual('axios');
  return {
    ...actual,
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    })),
    isAxiosError: actual.isAxiosError,
    post: jest.fn(),
  };
});

jest.mock('@services/storage.service', () => ({
  storageService: {
    getAccessToken: jest.fn(() => Promise.resolve('test-token')),
    getRefreshToken: jest.fn(() => Promise.resolve('test-refresh-token')),
    saveTokens: jest.fn(),
    clearTokens: jest.fn(),
  },
}));

describe('API Service', () => {
  it('should export api with correct methods', () => {
    expect(api).toBeDefined();
    expect(typeof api.get).toBe('function');
    expect(typeof api.post).toBe('function');
    expect(typeof api.put).toBe('function');
    expect(typeof api.patch).toBe('function');
    expect(typeof api.delete).toBe('function');
  });
});
