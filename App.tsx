import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { SettingsProvider, useSettings } from './src/hooks/useSettings';
import { COLORS } from './src/constants/theme';
import { HistoryProvider } from './src/hooks/useHistory';


function RootNavigation() {
  const { isLoading } = useSettings();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <SettingsProvider>
      <HistoryProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigation />
        </NavigationContainer>
      </HistoryProvider>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});