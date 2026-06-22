import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Header } from '@components/layout/Header';
import { Screen } from '@components/layout/Screen';
import { FormInput } from '@components/forms/FormInput';
import { FormButton } from '@components/forms/FormButton';
import { Button } from '@components/ui/Button';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { updateTaskThunk } from '@store/slices/taskSlice';
import { useTheme } from '@hooks/useTheme';
import { taskSchema } from '@utils/validation';
import type { TaskStackParamList } from '@types/navigation';
import type { CreateTaskData, TaskPriority, TaskCategory, TaskStatus } from '@types/task';

type RoutePropType = RouteProp<TaskStackParamList, 'EditTask'>;

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
const CATEGORIES: TaskCategory[] = ['work', 'personal', 'health', 'finance', 'education', 'other'];
const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'review', 'done', 'cancelled'];

export const EditTaskScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RoutePropType>();
  const dispatch = useAppDispatch();
  const { task } = route.params;
  const { theme } = useTheme();
  const { colors } = theme;

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<CreateTaskData>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      category: task.category,
      tags: task.tags,
    },
  });

  const onSubmit = async (data: CreateTaskData) => {
    try {
      await dispatch(updateTaskThunk({ id: task.id, data })).unwrap();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update task');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Edit Task" showBack />
      <Screen scrollable keyboardAvoiding padded={false}>
        <View style={styles.form}>
          <FormInput<CreateTaskData>
            name="title"
            control={control}
            label="Title *"
            placeholder="Task title..."
          />
          <FormInput<CreateTaskData>
            name="description"
            control={control}
            label="Description"
            placeholder="Add a description..."
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
          />

          <Text style={[styles.label, { color: colors.text }]}>Priority *</Text>
          <Controller
            name="priority"
            control={control}
            render={({ field: { value, onChange } }) => (
              <View style={styles.optionRow}>
                {PRIORITIES.map(p => (
                  <Button
                    key={p}
                    title={p}
                    variant={value === p ? 'primary' : 'outline'}
                    size="sm"
                    onPress={() => onChange(p)}
                    style={{ flex: 1 }}
                  />
                ))}
              </View>
            )}
          />

          <Text style={[styles.label, { color: colors.text }]}>Category *</Text>
          <Controller
            name="category"
            control={control}
            render={({ field: { value, onChange } }) => (
              <View style={styles.categoryGrid}>
                {CATEGORIES.map(c => (
                  <Button
                    key={c}
                    title={c}
                    variant={value === c ? 'primary' : 'outline'}
                    size="sm"
                    onPress={() => onChange(c)}
                    style={{ flex: 1, minWidth: '30%' }}
                  />
                ))}
              </View>
            )}
          />

          <FormButton
            title="Save Changes"
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            style={styles.submitBtn}
          />
        </View>
      </Screen>
    </View>
  );
};

const styles = StyleSheet.create({
  form: { padding: 16, gap: 4 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8, marginTop: 8 },
  optionRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  submitBtn: { marginTop: 16 },
});
