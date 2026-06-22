import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { hideToast } from '@store/slices/uiSlice';
import { APP_CONFIG } from '@constants/config';

export const Toast: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toastMessage, toastType } = useAppSelector(state => state.ui);
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toastMessage) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(APP_CONFIG.TOAST_DURATION),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => dispatch(hideToast()));
    }
  }, [toastMessage, opacity, dispatch]);

  if (!toastMessage) return null;

  const bgColors: Record<string, string> = {
    success: theme.colors.success,
    error: theme.colors.error,
    warning: theme.colors.warning,
    info: theme.colors.info,
  };

  const backgroundColor = bgColors[toastType ?? 'info'];

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor }]}>
      <TouchableOpacity onPress={() => dispatch(hideToast())} style={styles.inner}>
        <Text style={styles.text}>{toastMessage}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    borderRadius: 12,
    zIndex: 999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  } as ViewStyle,
  inner: {
    padding: 16,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
