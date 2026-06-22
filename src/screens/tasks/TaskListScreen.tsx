import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { TaskStackParamList } from '@types/navigation';
import { Header } from '@components/layout/Header';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { EmptyState } from '@components/layout/EmptyState';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { fetchTasksThunk, setFilters } from '@store/slices/taskSlice';
import { useTheme } from '@hooks/useTheme';
import { useDebounce } from '@hooks/useDebounce';
import { formatDate } from '@utils/format';
import type { Task, TaskStatus } from '@types/task';

type NavProp = StackNavigationProp<TaskStackParamList, 'TaskList'>;

const STATUS_FILTERS: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Review', value: 'review' },
  { label: 'Done', value: 'done' },
];

const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error',
  urgent: 'error',
} as const;

const TaskRow: React.FC<{ task: Task; onPress: () => void }> = ({ task, onPress }) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.taskCard}>
        <View style={styles.row}>
          <View style={styles.taskInfo}>
            <Text style={[styles.taskTitle, { color: colors.text }]} numberOfLines={1}>
              {task.title}
            </Text>
            <View style={styles.meta}>
              <Badge label={task.priority} variant={priorityColors[task.priority]} size="sm" />
              <Text style={[styles.category, { color: colors.textSecondary }]}>
                {task.category}
              </Text>
              {task.dueDate && (
                <Text style={[styles.dueDate, { color: colors.textSecondary }]}>
                  📅 {formatDate(task.dueDate)}
                </Text>
              )}
            </View>
          </View>
          <Badge
            label={task.status.replace('_', ' ')}
            variant={task.status === 'done' ? 'success' : task.status === 'in_progress' ? 'info' : 'default'}
            size="sm"
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export const TaskListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();
  const { tasks, isLoading, filters } = useAppSelector(state => state.tasks);
  const { theme } = useTheme();
  const { colors } = theme;

  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState<TaskStatus | 'all'>('all');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const taskFilters = {
      ...(activeStatus !== 'all' && { status: activeStatus }),
      ...(debouncedSearch && { search: debouncedSearch }),
    };
    dispatch(setFilters(taskFilters));
    dispatch(fetchTasksThunk({ page: 1, ...taskFilters }));
  }, [debouncedSearch, activeStatus, dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Tasks"
        rightComponent={
          <TouchableOpacity onPress={() => navigation.navigate('CreateTask')} style={styles.addBtn}>
            <Text style={{ color: colors.primary, fontSize: 28, lineHeight: 32 }}>+</Text>
          </TouchableOpacity>
        }
      />

      {/* Search */}
      <View style={[styles.searchWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search tasks..."
          placeholderTextColor={colors.placeholder}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Status Filters */}
      <FlatList
        horizontal
        data={STATUS_FILTERS}
        keyExtractor={item => item.value}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setActiveStatus(item.value)}
            style={[
              styles.filterChip,
              {
                backgroundColor: activeStatus === item.value ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={{
                color: activeStatus === item.value ? colors.white : colors.text,
                fontSize: 13,
                fontWeight: '500',
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskRow task={item} onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={() => dispatch(fetchTasksThunk({ page: 1, ...filters }))}
        ListEmptyComponent={
          <EmptyState
            title="No tasks found"
            message={search ? 'Try a different search term' : 'Create your first task!'}
            actionLabel="Create Task"
            onAction={() => navigation.navigate('CreateTask')}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15 },
  filterRow: { paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
  },
  list: { padding: 16, paddingTop: 8, flexGrow: 1 },
  taskCard: { padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  taskInfo: { flex: 1, marginRight: 8 },
  taskTitle: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  category: { fontSize: 12, textTransform: 'capitalize' },
  dueDate: { fontSize: 12 },
  addBtn: { paddingHorizontal: 4 },
});
