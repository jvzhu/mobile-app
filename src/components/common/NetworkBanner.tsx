import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useNetwork } from '@hooks/useNetwork';
import { useTheme } from '@hooks/useTheme';

export const NetworkBanner: React.FC = () => {
  const { isOnline } = useNetwork();
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (!isOnline) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOnline, slideAnim]);

  if (isOnline) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        { backgroundColor: theme.colors.error, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.text}>📡 No internet connection</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
