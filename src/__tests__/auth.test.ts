import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  loginThunk,
  logoutThunk,
  clearError,
  updateUser,
} from '@store/slices/authSlice';
import type { AuthState } from '@app-types/auth';

jest.mock('@services/auth.service', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getStoredUser: jest.fn(),
    saveUser: jest.fn(),
    clearUser: jest.fn(),
  },
}));

jest.mock('@services/storage.service', () => ({
  storageService: {
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    saveTokens: jest.fn(),
    clearTokens: jest.fn(),
  },
}));

const { authService } = require('@services/auth.service');

const createTestStore = () =>
  configureStore({ reducer: { auth: authReducer } });

const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user' as const,
  isEmailVerified: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  preferences: {
    theme: 'system' as const,
    language: 'en',
    notificationsEnabled: true,
    biometricEnabled: false,
  },
};

const mockTokens = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  expiresIn: 3600,
};

describe('authSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  it('should have correct initial state', () => {
    const state = store.getState().auth as AuthState;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set loading true when login is pending', () => {
    authService.login.mockImplementation(() => new Promise(() => {}));
    store.dispatch(loginThunk({ email: 'test@example.com', password: 'password' }));
    const state = store.getState().auth as AuthState;
    expect(state.isLoading).toBe(true);
  });

  it('should set user and tokens on login success', async () => {
    authService.login.mockResolvedValue({ user: mockUser, tokens: mockTokens });
    await store.dispatch(
      loginThunk({ email: 'test@example.com', password: 'Password1' })
    );
    const state = store.getState().auth as AuthState;
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe('access-token');
    expect(state.isLoading).toBe(false);
  });

  it('should set error on login failure', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'));
    await store.dispatch(loginThunk({ email: 'test@example.com', password: 'wrong' }));
    const state = store.getState().auth as AuthState;
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe('Invalid credentials');
    expect(state.isLoading).toBe(false);
  });

  it('should clear error', () => {
    store.dispatch(loginThunk({ email: 'bad', password: 'bad' })).catch(() => {});
    store.dispatch(clearError());
    expect(store.getState().auth.error).toBeNull();
  });

  it('should update user', async () => {
    authService.login.mockResolvedValue({ user: mockUser, tokens: mockTokens });
    await store.dispatch(loginThunk({ email: 'test@example.com', password: 'Password1' }));
    store.dispatch(updateUser({ firstName: 'Jane' }));
    expect(store.getState().auth.user?.firstName).toBe('Jane');
  });

  it('should reset state on logout', async () => {
    authService.login.mockResolvedValue({ user: mockUser, tokens: mockTokens });
    authService.logout.mockResolvedValue(undefined);
    await store.dispatch(loginThunk({ email: 'test@example.com', password: 'Password1' }));
    await store.dispatch(logoutThunk());
    const state = store.getState().auth as AuthState;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
