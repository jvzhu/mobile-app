import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '@hooks/useTheme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  fullWidth = false,
  disabled,
  ...props
}) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const containerStyle: ViewStyle = {
    ...styles.base,
    ...sizeStyles[size],
    ...(fullWidth && styles.fullWidth),
    ...variantContainerStyles(variant, colors),
    ...(disabled || isLoading ? styles.disabled : {}),
    ...style,
  };

  const labelStyle: TextStyle = {
    ...styles.text,
    ...sizeTextStyles[size],
    ...variantTextStyles(variant, colors),
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={labelStyle}>{title}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const variantContainerStyles = (
  variant: ButtonVariant,
  colors: Record<string, string>
): ViewStyle => {
  switch (variant) {
    case 'primary':
      return { backgroundColor: colors.primary };
    case 'secondary':
      return { backgroundColor: colors.secondary };
    case 'outline':
      return { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary };
    case 'danger':
      return { backgroundColor: colors.error };
    case 'ghost':
      return { backgroundColor: 'transparent' };
  }
};

const variantTextStyles = (
  variant: ButtonVariant,
  colors: Record<string, string>
): TextStyle => {
  switch (variant) {
    case 'outline':
      return { color: colors.primary };
    case 'ghost':
      return { color: colors.primary };
    default:
      return { color: colors.white };
  }
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  md: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  lg: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 14 },
};

const sizeTextStyles: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: 13 },
  md: { fontSize: 15 },
  lg: { fontSize: 17 },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
