import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@components/layout/Screen';
import { Header } from '@components/layout/Header';
import { Card } from '@components/ui/Card';
import { Divider } from '@components/ui/Divider';
import { useTheme } from '@hooks/useTheme';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { setLanguage } from '@store/slices/uiSlice';
import { useTranslation } from 'react-i18next';
import { storageSet } from '@utils/storage';
import { STORAGE_KEYS } from '@constants/storage';
import i18n from '@i18n/index';
import type { ThemeMode } from '@store/slices/uiSlice';

interface SettingRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  color?: string;
}

const SettingRow: React.FC<SettingRowProps> = ({ label, value, onPress, rightElement, color }) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !rightElement}
      style={styles.settingRow}
    >
      <Text style={[styles.settingLabel, { color: color ?? colors.text }]}>{label}</Text>
      {value ? (
        <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>
      ) : rightElement ? (
        rightElement
      ) : null}
    </TouchableOpacity>
  );
};

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const { colors } = theme;
  const dispatch = useAppDispatch();
  const { language } = useAppSelector(state => state.ui);
  const { t } = useTranslation();

  const themeCycle = (): void => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const next = modes[(modes.indexOf(themeMode) + 1) % modes.length];
    setThemeMode(next);
  };

  const toggleLanguage = async () => {
    const next = language === 'en' ? 'es' : 'en';
    dispatch(setLanguage(next));
    await i18n.changeLanguage(next);
    await storageSet(STORAGE_KEYS.LANGUAGE, next);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Settings" showBack />
      <Screen scrollable padded>
        {/* Appearance */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
        <Card style={{ marginBottom: 16 }}>
          <SettingRow
            label="Theme"
            value={themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
            onPress={themeCycle}
          />
          <Divider />
          <SettingRow
            label="Language"
            value={language === 'en' ? 'English' : 'Español'}
            onPress={toggleLanguage}
          />
        </Card>

        {/* Notifications */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>NOTIFICATIONS</Text>
        <Card style={{ marginBottom: 16 }}>
          <SettingRow
            label="Push Notifications"
            rightElement={
              <Switch value={true} onValueChange={() => {}} trackColor={{ true: colors.primary }} />
            }
          />
        </Card>

        {/* Security */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SECURITY</Text>
        <Card style={{ marginBottom: 16 }}>
          <SettingRow label="Change Password" onPress={() => {}} />
          <Divider />
          <SettingRow label="Biometric Login" rightElement={<Switch value={false} onValueChange={() => {}} trackColor={{ true: colors.primary }} />} />
        </Card>

        {/* About */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
        <Card style={{ marginBottom: 16 }}>
          <SettingRow label="Version" value="1.0.0" />
          <Divider />
          <SettingRow label="Terms of Service" onPress={() => {}} />
          <Divider />
          <SettingRow label="Privacy Policy" onPress={() => {}} />
        </Card>

        {/* Danger */}
        <Text style={[styles.sectionTitle, { color: colors.error }]}>DANGER ZONE</Text>
        <Card style={{ marginBottom: 32 }}>
          <SettingRow label="Delete Account" onPress={handleDeleteAccount} color={colors.error} />
        </Card>
      </Screen>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: { fontSize: 15 },
  settingValue: { fontSize: 14 },
});
