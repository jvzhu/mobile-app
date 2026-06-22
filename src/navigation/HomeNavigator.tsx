import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { HomeStackParamList } from '@app-types/navigation';
import { HomeScreen } from '@screens/home/HomeScreen';
import { NotificationsScreen } from '@screens/home/NotificationsScreen';
import { useTheme } from '@hooks/useTheme';
import { getDefaultScreenOptions } from './options';

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator screenOptions={getDefaultScreenOptions(theme)}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};
