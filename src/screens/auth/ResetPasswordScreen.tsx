import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Screen } from '@components/layout/Screen';
import { FormInput } from '@components/forms/FormInput';
import { FormButton } from '@components/forms/FormButton';
import { useTheme } from '@hooks/useTheme';
import { authService } from '@services/auth.service';
import { resetPasswordSchema } from '@utils/validation';
import type { AuthStackParamList } from '@app-types/navigation';
import type { ResetPasswordData } from '@app-types/auth';

type RoutePropType = RouteProp<AuthStackParamList, 'ResetPassword'>;

interface FormData {
  password: string;
  confirmPassword: string;
}

export const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RoutePropType>();
  const { theme } = useTheme();
  const { colors } = theme;
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const resetData: ResetPasswordData = {
        token: route.params.token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      await authService.resetPassword(resetData);
      Alert.alert('Success', 'Your password has been reset.', [
        { text: 'Login', onPress: () => navigation.navigate('Login' as never) },
      ]);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen scrollable keyboardAvoiding padded>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Reset Password 🔑</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Enter your new password below
        </Text>
      </View>

      <FormInput<FormData>
        name="password"
        control={control}
        label="New Password"
        placeholder="Min. 8 characters"
        isPassword
      />
      <FormInput<FormData>
        name="confirmPassword"
        control={control}
        label="Confirm New Password"
        placeholder="Repeat new password"
        isPassword
      />

      <FormButton title="Reset Password" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { marginTop: 48, marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 15 },
});
