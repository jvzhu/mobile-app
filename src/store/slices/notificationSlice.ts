import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { notificationService } from '@services/notification.service';
import type { NotificationState, AppNotification } from '@app-types/notification';

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  pushToken: null,
  isLoading: false,
  error: null,
  permissionsGranted: false,
};

export const registerPushNotificationsThunk = createAsyncThunk(
  'notifications/register',
  async (_, { rejectWithValue }) => {
    try {
      const token = await notificationService.registerForPushNotifications();
      if (token) {
        await notificationService.savePushToken(token);
      }
      return { token, permissionsGranted: token !== null };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to register push notifications'
      );
    }
  }
);

export const fetchNotificationsThunk = createAsyncThunk(
  'notifications/fetchAll',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      return await notificationService.getNotifications(page);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch notifications'
      );
    }
  }
);

export const markNotificationReadThunk = createAsyncThunk(
  'notifications/markRead',
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to mark notification as read'
      );
    }
  }
);

export const markAllNotificationsReadThunk = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
      return;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to mark all notifications as read'
      );
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<AppNotification>) {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerPushNotificationsThunk.fulfilled, (state, action) => {
        state.pushToken = action.payload.token;
        state.permissionsGranted = action.payload.permissionsGranted;
      });

    builder
      .addCase(fetchNotificationsThunk.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data } = action.payload;
        if (action.meta.arg === 1) {
          state.notifications = data;
        } else {
          state.notifications = [...state.notifications, ...data];
        }
        state.unreadCount = state.notifications.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(markNotificationReadThunk.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });

    builder
      .addCase(markAllNotificationsReadThunk.fulfilled, state => {
        state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      });
  },
});

export const { addNotification, clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
