import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Platform, Linking, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useSettings } from '../hooks/useSettings';

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  description: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

const SettingRow = ({ icon, iconColor, label, description, value, onToggle }: SettingRowProps) => (
  <View style={settingStyles.row}>
    <View style={[settingStyles.iconBox, { backgroundColor: iconColor + '18' }]}>
      <Ionicons name={icon} size={20} color={iconColor} />
    </View>
    <View style={settingStyles.textBlock}>
      <Text style={settingStyles.label}>{label}</Text>
      <Text style={settingStyles.description}>{description}</Text>
    </View>
    <Switch
      trackColor={{ false: COLORS.border, true: COLORS.primary + '55' }}
      thumbColor={value ? COLORS.primary : COLORS.surface}
      ios_backgroundColor={COLORS.border}
      value={value}
      onValueChange={onToggle}
    />
  </View>
);

const settingStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    gap: SPACING.m,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { flex: 1 },
  label: { color: COLORS.text, fontSize: 15, fontWeight: '600', marginBottom: 2 },
  description: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 17 },
});

export default function SettingsScreen() {
  const { keepAwake, toggleKeepAwake, showMs, toggleShowMs } = useSettings();
  const insets = useSafeAreaInsets();
  
  const isIOS = Platform.OS === 'ios';
  const dockPadding = isIOS 
    ? Math.max(insets.bottom - 10, 10) 
    : Math.max(insets.bottom, 12) + 8;
  const dockClearance = dockPadding + 88; // 72px capsula + 16px extra margen

  const handleOpenPrivacy = async () => {
    const url = 'https://privacy-portal-rho.vercel.app/TimeTracker/index.html';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se puede abrir el enlace en este dispositivo.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema al intentar abrir la política de privacidad.');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: dockClearance }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── HEADER ─────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>Ajustes</Text>
        <Text style={styles.subtitle}>Configura tu experiencia</Text>
      </View>

      {/* ── SECCIÓN: DISPLAY ─────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Pantalla</Text>
        <View style={[styles.card, SHADOWS.card]}>
          <SettingRow
            icon="sunny-outline"
            iconColor={COLORS.primary}
            label="Mantener pantalla encendida"
            description="Evita el bloqueo automático durante sesiones activas"
            value={keepAwake}
            onToggle={toggleKeepAwake}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="timer-outline"
            iconColor={COLORS.danger}
            label="Mostrar milisegundos"
            description="Muestra las centésimas de segundo en el reloj principal"
            value={showMs}
            onToggle={toggleShowMs}
          />
        </View>
      </View>

      {/* ── SECCIÓN: APP ─────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Acerca de</Text>
        <View style={[styles.card, SHADOWS.card]}>
          <View style={styles.infoRow}>
            <Ionicons name="code-slash-outline" size={18} color={COLORS.textTertiary} />
            <Text style={styles.infoText}>Version 1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={18} color={COLORS.textTertiary} />
            <Text style={styles.infoText}>Desarrollado por Jai</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity 
            style={styles.infoRow} 
            onPress={handleOpenPrivacy}
            activeOpacity={0.6}
          >
            <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.primary} />
            <Text style={[styles.infoText, { color: COLORS.primary }]}>Política de Privacidad</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.primary} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.xl,
  },
  header: {
    marginTop: SPACING.xl * 1.5,
    marginBottom: SPACING.l,
  },
  title: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  section: { marginBottom: SPACING.l },
  sectionLabel: {
    color: COLORS.textTertiary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: SPACING.s,
    paddingLeft: SPACING.s,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.l,
    paddingHorizontal: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderSubtle,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
    paddingVertical: SPACING.m,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
});