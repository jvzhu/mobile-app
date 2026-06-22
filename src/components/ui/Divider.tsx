import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface DividerProps {
  style?: ViewStyle;
  color?: string;
  thickness?: number;
  vertical?: boolean;
}

export const Divider: React.FC<DividerProps> = ({
  style,
  color,
  thickness = 1,
  vertical = false,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        {
          backgroundColor: color ?? theme.colors.divider,
          ...(vertical ? { width: thickness } : { height: thickness }),
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
});
