import { StackNavigationOptions } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';
import type { Theme } from '@theme/lightTheme';

export const getDefaultScreenOptions = (theme: Theme): StackNavigationOptions => ({
  headerShown: false,
  gestureEnabled: true,
  ...TransitionPresets.SlideFromRightIOS,
  cardStyle: { backgroundColor: theme.colors.background },
});

export const getModalScreenOptions = (): StackNavigationOptions => ({
  headerShown: false,
  gestureEnabled: true,
  ...TransitionPresets.ModalSlideFromBottomIOS,
  presentation: 'modal',
});
