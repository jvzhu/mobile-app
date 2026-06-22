import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { store, persistor } from '@store/index';
import { ThemeProvider } from '@contexts/ThemeContext';
import { AuthProvider } from '@contexts/AuthContext';
import { RootNavigator } from '@navigation/index';
import { Toast } from '@components/ui/Toast';
import { LoadingOverlay } from '@components/common/LoadingOverlay';
import { NetworkBanner } from '@components/common/NetworkBanner';
import { ErrorBoundary } from '@components/layout/ErrorBoundary';
import '@i18n/index';

const AppContent: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={styles.root}>
            <NetworkBanner />
            <RootNavigator />
            <Toast />
            <LoadingOverlay />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContent />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
