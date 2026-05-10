import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { SettingsProvider, useSettings } from './src/hooks/useSettings';
import { COLORS } from './src/constants/theme';
import { HistoryProvider } from './src/hooks/useHistory';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
]);


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
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };
    requestPermissions();
  }, []);

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