import { useEffect, useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import {
  registerPushNotificationsThunk,
  fetchNotificationsThunk,
  markNotificationReadThunk,
  markAllNotificationsReadThunk,
} from '@store/slices/notificationSlice';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, isLoading, error, permissionsGranted, pushToken } =
    useAppSelector(state => state.notifications);

  const requestPermissions = useCallback(async () => {
    return dispatch(registerPushNotificationsThunk()).unwrap();
  }, [dispatch]);

  const fetchNotifications = useCallback(
    async (page = 1) => {
      return dispatch(fetchNotificationsThunk(page)).unwrap();
    },
    [dispatch]
  );

  const markAsRead = useCallback(
    async (id: string) => {
      return dispatch(markNotificationReadThunk(id)).unwrap();
    },
    [dispatch]
  );

  const markAllAsRead = useCallback(async () => {
    return dispatch(markAllNotificationsReadThunk()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    permissionsGranted,
    pushToken,
    requestPermissions,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
