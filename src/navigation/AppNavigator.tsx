// src/navigation/AppNavigator.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// ── Los tabs en orden ─────────────────────────────────────────────────────────
const TABS = [
  {
    name: 'Timer',
    label: 'Cronómetro',
    icon: 'timer' as const,
    iconOutline: 'timer-outline' as const,
  },
  {
    name: 'History',
    label: 'Historial',
    icon: 'list' as const,
    iconOutline: 'list-outline' as const,
  },
  {
    name: 'Settings',
    label: 'Ajustes',
    icon: 'settings' as const,
    iconOutline: 'settings-outline' as const,
  },
];

// ── Floating Dock personalizado ───────────────────────────────────────────────
function FloatingDock({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === 'ios';
  
  // En iOS, el insets.bottom es ~34px, lo que dejaba el dock muy alto. Le restamos un poco.
  // En Android, mantenemos el cálculo original que quedó perfecto.
  const dockPadding = isIOS 
    ? Math.max(insets.bottom - 10, 10) 
    : Math.max(insets.bottom, 12) + 8;

  return (
    // El paddingBottom define la distancia desde el fondo del dispositivo
    <View style={[styles.dockWrapper, { paddingBottom: dockPadding }]}>
      <View style={[styles.dockCapsule, SHADOWS.card]}>
        {state.routes.map((route, index) => {
          const tab = TABS[index];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tabItem}
            >
              {/* Pill highlight del tab activo */}
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <Ionicons
                  name={isFocused ? tab.icon : tab.iconOutline}
                  size={22}
                  color={isFocused ? COLORS.primary : COLORS.textTertiary}
                />
              </View>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ── Navegador principal ───────────────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingDock {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Timer" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  // Wrapper externo – proporciona el margen lateral y el clearance del Safe Area
  dockWrapper: {
    position: 'absolute',
    bottom: 0,
    left: SPACING.l,
    right: SPACING.l,
    alignItems: 'center',
  },

  // La cápsula flotante en sí
  dockCapsule: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    width: '100%',
    paddingVertical: SPACING.s + 2,
    paddingHorizontal: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
    // Sobreescribimos la sombra del SHADOWS.card para que apunte hacia abajo
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 16,
  },

  // Cada ítem de tab ocupa espacio igualitario
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  // Contenedor del icono – se convierte en pill cuando está activo
  iconWrap: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
  },
  iconWrapActive: {
    backgroundColor: COLORS.primaryLight,
  },

  // Label del tab
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textTertiary,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});