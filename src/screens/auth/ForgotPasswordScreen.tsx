import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@components/layout/Screen';
import { FormInput } from '@components/forms/FormInput';
import { FormButton } from '@components/forms/FormButton';
import { useTheme } from '@hooks/useTheme';
import { authService } from '@services/auth.service';
import { forgotPasswordSchema } from '@utils/validation';
import type { ForgotPasswordData } from '@types/auth';

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { colors } = theme;
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { control, handleSubmit } = useForm<ForgotPasswordData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      setIsLoading(true);
      await authService.forgotPassword(data);
      setSent(true);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <Screen padded>
        <View style={styles.center}>
          <Text style={styles.successEmoji}>📬</Text>
          <Text style={[styles.title, { color: colors.text }]}>Check your email</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            We've sent a password reset link to your email address.
          </Text>
          <FormButton title="Back to Login" onPress={() => navigation.goBack()} variant="outline" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable keyboardAvoiding padded>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Forgot Password 🔒</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Enter your email and we'll send you a reset link
        </Text>
      </View>

      <FormInput<ForgotPasswordData>
        name="email"
        control={control}
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <FormButton title="Send Reset Link" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
      <FormButton title="Back to Login" onPress={() => navigation.goBack()} variant="ghost" />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { marginTop: 48, marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 15 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  successEmoji: { fontSize: 64 },
  message: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
