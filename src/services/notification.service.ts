import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { api } from './api';
import { API_ENDPOINTS } from '@constants/api';
import type { AppNotification, PushNotificationPayload } from '@types/notification';
import type { ApiResponse, PaginatedResponse } from '@types/api';
import { logger } from '@utils/logger';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  },

  async registerForPushNotifications(): Promise<string | null> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      logger.warn('Push notification permissions not granted');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });

    return tokenData.data;
  },

  async savePushToken(token: string): Promise<void> {
    await api.post(API_ENDPOINTS.PUSH_TOKEN, { token, platform: Platform.OS });
  },

  async getNotifications(page = 1, limit = 20): Promise<PaginatedResponse<AppNotification>> {
    const response = await api.get<PaginatedResponse<AppNotification>>(
      API_ENDPOINTS.NOTIFICATIONS,
      { params: { page, limit } }
    );
    return response.data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await api.patch(API_ENDPOINTS.NOTIFICATION(notificationId), { isRead: true });
  },

  async markAllAsRead(): Promise<void> {
    await api.post(API_ENDPOINTS.MARK_ALL_READ);
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(API_ENDPOINTS.NOTIFICATION(notificationId));
  },

  async scheduleLocalNotification(
    payload: Omit<PushNotificationPayload, 'to'>,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload.data,
        sound: payload.sound ?? 'default',
      },
      trigger: trigger ?? null,
    });
  },

  async cancelAllScheduledNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  addNotificationListener(
    callback: (notification: Notifications.Notification) => void
  ): Notifications.EventSubscription {
    return Notifications.addNotificationReceivedListener(callback);
  },

  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.EventSubscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },
};
