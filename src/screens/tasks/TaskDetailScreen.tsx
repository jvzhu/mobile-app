import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { TaskStackParamList } from '@app-types/navigation';
import { Header } from '@components/layout/Header';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Divider } from '@components/ui/Divider';
import { Button } from '@components/ui/Button';
import { Spinner } from '@components/ui/Spinner';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { fetchTaskThunk, deleteTaskThunk } from '@store/slices/taskSlice';
import { useTheme } from '@hooks/useTheme';
import { formatDate, formatRelativeTime } from '@utils/format';

type RoutePropType = RouteProp<TaskStackParamList, 'TaskDetail'>;
type NavProp = StackNavigationProp<TaskStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const dispatch = useAppDispatch();
  const { selectedTask: task, isLoading } = useAppSelector(state => state.tasks);
  const { theme } = useTheme();
  const { colors } = theme;

  useEffect(() => {
    dispatch(fetchTaskThunk(route.params.taskId));
  }, [route.params.taskId, dispatch]);

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await dispatch(deleteTaskThunk(route.params.taskId));
          navigation.goBack();
        },
      },
    ]);
  };

  if (isLoading || !task) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background }}>
        <Spinner size="large" />
      </View>
    );
  }

  const priorityVariant = {
    low: 'success',
    medium: 'warning',
    high: 'error',
    urgent: 'error',
  } as const;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Task Detail"
        showBack
        rightComponent={
          <TouchableOpacity onPress={() => navigation.navigate('EditTask', { task })}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Edit</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>

          <View style={styles.badges}>
            <Badge label={task.priority} variant={priorityVariant[task.priority]} />
            <Badge
              label={task.status.replace('_', ' ')}
              variant={task.status === 'done' ? 'success' : 'info'}
            />
            <Badge label={task.category} variant="default" />
          </View>

          {task.description && (
            <>
              <Divider style={styles.divider} />
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Description</Text>
              <Text style={[styles.description, { color: colors.text }]}>{task.description}</Text>
            </>
          )}

          <Divider style={styles.divider} />

          <View style={styles.metaGrid}>
            {task.dueDate && (
              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Due Date</Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>
                  📅 {formatDate(task.dueDate)}
                </Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Created</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {formatRelativeTime(task.createdAt)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Updated</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {formatRelativeTime(task.updatedAt)}
              </Text>
            </View>
          </View>

          {task.tags.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Tags</Text>
              <View style={styles.tags}>
                {task.tags.map(tag => (
                  <Badge key={tag} label={`#${tag}`} variant="info" size="sm" />
                ))}
              </View>
            </>
          )}

          {task.subtasks.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
              </Text>
              {task.subtasks.map(subtask => (
                <View key={subtask.id} style={styles.subtask}>
                  <Text style={{ fontSize: 16 }}>{subtask.completed ? '✅' : '⬜'}</Text>
                  <Text
                    style={[
                      styles.subtaskTitle,
                      { color: subtask.completed ? colors.textSecondary : colors.text },
                      subtask.completed && styles.strikethrough,
                    ]}
                  >
                    {subtask.title}
                  </Text>
                </View>
              ))}
            </>
          )}
        </Card>

        <Button
          title="Delete Task"
          variant="danger"
          onPress={handleDelete}
          style={styles.deleteBtn}
          fullWidth
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  badges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  divider: { marginVertical: 16 },
  sectionLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 },
  description: { fontSize: 15, lineHeight: 22 },
  metaGrid: { gap: 12 },
  metaItem: {},
  metaLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  metaValue: { fontSize: 14 },
  tags: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  subtask: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  subtaskTitle: { fontSize: 14, flex: 1 },
  strikethrough: { textDecorationLine: 'line-through' },
  deleteBtn: { marginTop: 8, marginBottom: 32 },
});
