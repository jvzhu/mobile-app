import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { HomeStackParamList } from '@app-types/navigation';
import { Screen } from '@components/layout/Screen';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Avatar } from '@components/ui/Avatar';
import { useTheme } from '@hooks/useTheme';
import { useAuth } from '@hooks/useAuth';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { fetchTasksThunk } from '@store/slices/taskSlice';
import { formatRelativeTime } from '@utils/format';
import type { Task } from '@app-types/task';

type NavProp = StackNavigationProp<HomeStackParamList, 'Home'>;

const TaskCard: React.FC<{ task: Task; onPress: () => void }> = ({ task, onPress }) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const priorityVariant = {
    low: 'success',
    medium: 'warning',
    high: 'error',
    urgent: 'error',
  } as const;

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, { color: colors.text }]} numberOfLines={1}>
            {task.title}
          </Text>
          <Badge label={task.priority} variant={priorityVariant[task.priority]} size="sm" />
        </View>
        {task.description ? (
          <Text style={[styles.taskDesc, { color: colors.textSecondary }]} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
        <Text style={[styles.taskTime, { color: colors.textSecondary }]}>
          {formatRelativeTime(task.updatedAt)}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { colors } = theme;
  const dispatch = useAppDispatch();
  const { tasks, isLoading } = useAppSelector(state => state.tasks);

  useEffect(() => {
    dispatch(fetchTasksThunk({ page: 1 }));
  }, [dispatch]);

  const stats = [
    { label: 'Total', value: tasks.length, emoji: '📋' },
    { label: 'Done', value: tasks.filter(t => t.status === 'done').length, emoji: '✅' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, emoji: '⚡' },
    { label: 'Overdue', value: tasks.filter(t => t.status === 'todo' && t.dueDate && new Date(t.dueDate) < new Date()).length, emoji: '⏰' },
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <Screen
      scrollable
      isRefreshing={isLoading}
      onRefresh={() => dispatch(fetchTasksThunk({ page: 1 }))}
    >
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: 16, paddingTop: 16 }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good day,</Text>
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.firstName ?? 'User'} 👋
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Avatar
            uri={user?.avatar}
            firstName={user?.firstName ?? ''}
            lastName={user?.lastName ?? ''}
            size="md"
          />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {stats.map(s => (
          <Card key={s.label} style={styles.statCard} padded={false}>
            <Text style={styles.statEmoji}>{s.emoji}</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
          </Card>
        ))}
      </View>

      {/* Recent Tasks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Tasks</Text>
          <TouchableOpacity onPress={() => navigation.getParent()?.navigate('TasksTab')}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentTasks.length === 0 ? (
          <Text style={[styles.emptyMsg, { color: colors.textSecondary }]}>
            No tasks yet. Create your first task!
          </Text>
        ) : (
          <FlatList
            data={recentTasks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                onPress={() =>
                  navigation.getParent()?.navigate('TasksTab', {
                    screen: 'TaskDetail',
                    params: { taskId: item.id },
                  })
                }
              />
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  greeting: { fontSize: 14 },
  name: { fontSize: 22, fontWeight: '800' },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2 },
  section: { paddingHorizontal: 16, paddingBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  taskCard: { padding: 12 },
  taskHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  taskTitle: { fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 },
  taskDesc: { fontSize: 13, marginBottom: 4, lineHeight: 18 },
  taskTime: { fontSize: 11 },
  emptyMsg: { textAlign: 'center', fontSize: 14, paddingVertical: 32 },
});
