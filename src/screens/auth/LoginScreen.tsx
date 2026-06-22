import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '@types/navigation';
import type { LoginCredentials } from '@types/auth';
import { Screen } from '@components/layout/Screen';
import { FormInput } from '@components/forms/FormInput';
import { FormButton } from '@components/forms/FormButton';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';
import { loginSchema } from '@utils/validation';

type NavProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { login, isLoading } = useAuth();
  const { theme } = useTheme();
  const { colors } = theme;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <Screen scrollable keyboardAvoiding padded>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome Back 👋</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sign in to your account
        </Text>
      </View>

      <View style={styles.form}>
        <FormInput<LoginCredentials>
          name="email"
          control={control}
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <FormInput<LoginCredentials>
          name="password"
          control={control}
          label="Password"
          placeholder="Your password"
          isPassword
        />

        <FormButton
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
        />

        <FormButton
          title="Forgot Password?"
          onPress={() => navigation.navigate('ForgotPassword')}
          variant="ghost"
        />
      </View>

      <View style={styles.footer}>
        <Text style={{ color: colors.textSecondary }}>Don't have an account? </Text>
        <Text
          style={{ color: colors.primary, fontWeight: '600' }}
          onPress={() => navigation.navigate('Register')}
        >
          Sign Up
        </Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 48,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gap: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    paddingBottom: 16,
  },
});
