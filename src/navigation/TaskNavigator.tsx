import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { TaskStackParamList } from '@types/navigation';
import { TaskListScreen } from '@screens/tasks/TaskListScreen';
import { TaskDetailScreen } from '@screens/tasks/TaskDetailScreen';
import { CreateTaskScreen } from '@screens/tasks/CreateTaskScreen';
import { EditTaskScreen } from '@screens/tasks/EditTaskScreen';
import { useTheme } from '@hooks/useTheme';
import { getDefaultScreenOptions, getModalScreenOptions } from './options';

const Stack = createStackNavigator<TaskStackParamList>();

export const TaskNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator screenOptions={getDefaultScreenOptions(theme)}>
      <Stack.Screen name="TaskList" component={TaskListScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} options={getModalScreenOptions()} />
      <Stack.Screen name="EditTask" component={EditTaskScreen} options={getModalScreenOptions()} />
    </Stack.Navigator>
  );
};
