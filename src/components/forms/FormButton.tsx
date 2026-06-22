import React from 'react';
import { Button } from '@components/ui/Button';
import { ViewStyle } from 'react-native';

interface FormButtonProps {
  title: string;
  isLoading?: boolean;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  fullWidth?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
}

export const FormButton: React.FC<FormButtonProps> = ({
  title,
  isLoading,
  onPress,
  variant = 'primary',
  fullWidth = true,
  style,
  disabled,
}) => {
  return (
    <Button
      title={title}
      isLoading={isLoading}
      onPress={onPress}
      variant={variant}
      size="lg"
      fullWidth={fullWidth}
      style={style}
      disabled={disabled}
    />
  );
};
