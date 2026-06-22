import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '@app-types/navigation';
import type { RegisterData } from '@app-types/auth';
import { Screen } from '@components/layout/Screen';
import { FormInput } from '@components/forms/FormInput';
import { FormButton } from '@components/forms/FormButton';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';
import { registerSchema } from '@utils/validation';

type NavProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { register, isLoading } = useAuth();
  const { theme } = useTheme();
  const { colors } = theme;

  const { control, handleSubmit } = useForm<RegisterData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      await register(data);
    } catch (error) {
      Alert.alert('Registration Failed', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <Screen scrollable keyboardAvoiding padded>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Create Account 🚀</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Join us today</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <FormInput<RegisterData>
            name="firstName"
            control={control}
            label="First Name"
            placeholder="John"
            autoCapitalize="words"
          />
        </View>
        <View style={styles.halfField}>
          <FormInput<RegisterData>
            name="lastName"
            control={control}
            label="Last Name"
            placeholder="Doe"
            autoCapitalize="words"
          />
        </View>
      </View>

      <FormInput<RegisterData>
        name="email"
        control={control}
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormInput<RegisterData>
        name="password"
        control={control}
        label="Password"
        placeholder="Min. 8 characters"
        isPassword
      />
      <FormInput<RegisterData>
        name="confirmPassword"
        control={control}
        label="Confirm Password"
        placeholder="Repeat your password"
        isPassword
      />

      <FormButton title="Create Account" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />

      <View style={styles.footer}>
        <Text style={{ color: colors.textSecondary }}>Already have an account? </Text>
        <Text
          style={{ color: colors.primary, fontWeight: '600' }}
          onPress={() => navigation.navigate('Login')}
        >
          Sign In
        </Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 48,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    paddingBottom: 16,
  },
});
