import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ProfileStackParamList } from '@types/navigation';
import { Screen } from '@components/layout/Screen';
import { Header } from '@components/layout/Header';
import { Card } from '@components/ui/Card';
import { Avatar } from '@components/ui/Avatar';
import { Divider } from '@components/ui/Divider';
import { Button } from '@components/ui/Button';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';
import { formatDate, formatFullName } from '@utils/format';

type NavProp = StackNavigationProp<ProfileStackParamList, 'Profile'>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { colors } = theme;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  if (!user) return null;

  const infoRows = [
    { label: 'Email', value: user.email },
    { label: 'Role', value: user.role },
    { label: 'Joined', value: formatDate(user.createdAt) },
    { label: 'Email Verified', value: user.isEmailVerified ? '✅ Yes' : '❌ No' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Profile"
        rightComponent={
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={{ fontSize: 20 }}>⚙️</Text>
          </TouchableOpacity>
        }
      />
      <Screen scrollable padded>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Avatar
            uri={user.avatar}
            firstName={user.firstName}
            lastName={user.lastName}
            size="xl"
          />
          <Text style={[styles.name, { color: colors.text }]}>
            {formatFullName(user.firstName, user.lastName)}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user.email}</Text>
          <Button
            title="Edit Profile"
            variant="outline"
            size="sm"
            onPress={() => navigation.navigate('EditProfile')}
            style={{ marginTop: 12 }}
          />
        </View>

        {/* Info Card */}
        <Card style={styles.infoCard}>
          {infoRows.map((row, idx) => (
            <View key={row.label}>
              {idx > 0 && <Divider style={{ marginVertical: 12 }} />}
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{row.label}</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{row.value}</Text>
              </View>
            </View>
          ))}
        </Card>

        <Button
          title="Logout"
          variant="danger"
          fullWidth
          onPress={handleLogout}
          style={{ marginTop: 8 }}
        />
      </Screen>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  name: { fontSize: 22, fontWeight: '800', marginTop: 12 },
  email: { fontSize: 14, marginTop: 4 },
  infoCard: { marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '500' },
});
