import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { EmptyState } from '@components/layout/EmptyState';
import { Header } from '@components/layout/Header';
import { Card } from '@components/ui/Card';
import { useNotifications } from '@hooks/useNotifications';
import { useTheme } from '@hooks/useTheme';
import { formatRelativeTime } from '@utils/format';
import type { AppNotification } from '@types/notification';

const NotificationItem: React.FC<{
  notification: AppNotification;
  onPress: () => void;
}> = ({ notification, onPress }) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <TouchableOpacity onPress={onPress}>
      <Card
        style={[
          styles.item,
          !notification.isRead && { borderLeftWidth: 3, borderLeftColor: colors.primary },
        ]}
      >
        <Text style={[styles.itemTitle, { color: colors.text, fontWeight: notification.isRead ? '500' : '700' }]}>
          {notification.title}
        </Text>
        <Text style={[styles.itemBody, { color: colors.textSecondary }]} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={[styles.itemTime, { color: colors.textSecondary }]}>
          {formatRelativeTime(notification.createdAt)}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};

export const NotificationsScreen: React.FC = () => {
  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Notifications"
        showBack
        rightComponent={
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={{ color: colors.primary, fontSize: 13 }}>Mark all</Text>
          </TouchableOpacity>
        }
      />
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => !item.isRead && markAsRead(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={() => {}}
        ListEmptyComponent={
          <EmptyState
            title="No notifications"
            message="You're all caught up!"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: { padding: 16, flexGrow: 1 },
  item: { padding: 14 },
  itemTitle: { fontSize: 15, marginBottom: 4 },
  itemBody: { fontSize: 13, lineHeight: 18, marginBottom: 6 },
  itemTime: { fontSize: 11 },
});
