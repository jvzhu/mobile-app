import React from 'react';
import { Controller, Control, FieldValues, Path, FieldError } from 'react-hook-form';
import { Input } from '@components/ui/Input';
import { TextInputProps } from 'react-native';

interface FormInputProps<T extends FieldValues> extends Omit<TextInputProps, 'onChangeText'> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  helperText?: string;
  isPassword?: boolean;
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  helperText,
  isPassword,
  ...props
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <Input
          label={label}
          error={(error as FieldError | undefined)?.message}
          helperText={helperText}
          onChangeText={onChange}
          onBlur={onBlur}
          value={value as string}
          isPassword={isPassword}
          {...props}
        />
      )}
    />
  );
}
