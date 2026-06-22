import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import type { DrawerParamList, ProfileStackParamList } from '@app-types/navigation';
import { MainNavigator } from './MainNavigator';
import { ProfileScreen } from '@screens/profile/ProfileScreen';
import { EditProfileScreen } from '@screens/profile/EditProfileScreen';
import { SettingsScreen } from '@screens/settings/SettingsScreen';
import { useTheme } from '@hooks/useTheme';
import { getDefaultScreenOptions } from './options';

const Drawer = createDrawerNavigator<DrawerParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ProfileStack.Navigator screenOptions={getDefaultScreenOptions(theme)}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    </ProfileStack.Navigator>
  );
};

export const DrawerNavigator: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.surface,
          width: 280,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: { fontSize: 15, fontWeight: '500' },
      }}
    >
      <Drawer.Screen name="MainTabs" component={MainNavigator} options={{ title: 'Home' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Drawer.Navigator>
  );
};
