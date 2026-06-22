import { useCallback } from 'react';
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { loginThunk, registerThunk, logoutThunk, clearError } from '@store/slices/authSlice';
import type { LoginCredentials, RegisterData } from '@app-types/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error, accessToken } = useAppSelector(
    state => state.auth
  );

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      return dispatch(loginThunk(credentials)).unwrap();
    },
    [dispatch]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      return dispatch(registerThunk(data)).unwrap();
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    return dispatch(logoutThunk()).unwrap();
  }, [dispatch]);

  const dismissError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    accessToken,
    login,
    register,
    logout,
    dismissError,
  };
};
