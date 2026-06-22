import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Header } from '@components/layout/Header';
import { Screen } from '@components/layout/Screen';
import { Avatar } from '@components/ui/Avatar';
import { Button } from '@components/ui/Button';
import { FormInput } from '@components/forms/FormInput';
import { FormButton } from '@components/forms/FormButton';
import { useAuth } from '@hooks/useAuth';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { updateUser } from '@store/slices/authSlice';
import { userService } from '@services/user.service';
import { useTheme } from '@hooks/useTheme';
import { editProfileSchema } from '@utils/validation';

interface FormData {
  firstName: string;
  lastName: string;
}

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { colors } = theme;
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatar ?? null);

  const { control, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(editProfileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    },
  });

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const updatedUser = await userService.updateProfile(data);
      dispatch(updateUser(updatedUser));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Edit Profile" showBack />
      <Screen scrollable keyboardAvoiding padded>
        <View style={styles.avatarSection}>
          <Avatar
            uri={avatarUri}
            firstName={user?.firstName ?? ''}
            lastName={user?.lastName ?? ''}
            size="xl"
          />
          <Button
            title="Change Photo"
            variant="ghost"
            size="sm"
            onPress={handlePickImage}
            style={{ marginTop: 8 }}
          />
        </View>

        <FormInput<FormData>
          name="firstName"
          control={control}
          label="First Name"
          placeholder="Your first name"
          autoCapitalize="words"
        />
        <FormInput<FormData>
          name="lastName"
          control={control}
          label="Last Name"
          placeholder="Your last name"
          autoCapitalize="words"
        />

        <FormButton title="Save Changes" onPress={handleSubmit(onSubmit)} isLoading={isLoading} />
      </Screen>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarSection: { alignItems: 'center', marginBottom: 32 },
});
