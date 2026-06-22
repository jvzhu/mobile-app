import React from 'react';
import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { useAppSelector } from '@hooks/useAppSelector';

export const LoadingOverlay: React.FC = () => {
  const { isLoading, loadingMessage } = useAppSelector(state => state.ui);
  const { theme } = useTheme();

  if (!isLoading) return null;

  return (
    <Modal transparent animationType="fade" visible={isLoading}>
      <View style={styles.backdrop}>
        <View
          style={[styles.container, { backgroundColor: theme.colors.surface }]}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
          {loadingMessage && (
            <Text style={[styles.message, { color: theme.colors.text }]}>
              {loadingMessage}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
    minWidth: 150,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
