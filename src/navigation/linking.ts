import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from '@types/navigation';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['mobileapp://', 'https://mobileapp.example.com'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
          ResetPassword: 'reset-password/:token',
        },
      },
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Home: 'home',
              Notifications: 'notifications',
            },
          },
          TasksTab: {
            screens: {
              TaskList: 'tasks',
              TaskDetail: 'tasks/:taskId',
              CreateTask: 'tasks/create',
              EditTask: 'tasks/:taskId/edit',
            },
          },
          SearchTab: {
            screens: {
              Search: 'search',
            },
          },
          ProfileTab: {
            screens: {
              Profile: 'profile',
              EditProfile: 'profile/edit',
              Settings: 'settings',
            },
          },
        },
      },
    },
  },
};
