import React, { forwardRef, useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerStyle,
      isPassword = false,
      style,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const { colors } = theme;
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const borderColor = error
      ? colors.error
      : isFocused
      ? colors.primary
      : colors.border;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        )}
        <View
          style={[
            styles.inputWrapper,
            { borderColor, backgroundColor: colors.surface },
          ]}
        >
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              { color: colors.text },
              leftIcon ? styles.inputWithLeftIcon : null,
              (rightIcon || isPassword) ? styles.inputWithRightIcon : null,
              style,
            ]}
            placeholderTextColor={colors.placeholder}
            secureTextEntry={isPassword && !showPassword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {isPassword ? (
            <TouchableOpacity
              style={styles.iconRight}
              onPress={() => setShowPassword(v => !v)}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          ) : rightIcon ? (
            <View style={styles.iconRight}>{rightIcon}</View>
          ) : null}
        </View>
        {(error || helperText) && (
          <Text
            style={[
              styles.helperText,
              { color: error ? colors.error : colors.textSecondary },
            ]}
          >
            {error ?? helperText}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  iconLeft: {
    paddingLeft: 12,
  },
  iconRight: {
    paddingRight: 12,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
});
