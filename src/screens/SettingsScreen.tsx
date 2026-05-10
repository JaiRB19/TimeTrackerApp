// src/screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useSettings } from '../hooks/useSettings';

export default function SettingsScreen() {
  // Consumimos el estado global
  const { keepAwake, toggleKeepAwake, showMs, toggleShowMs } = useSettings();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SETTINGS</Text>
        <Text style={styles.subtitle}>Configura tu experiencia</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GENERAL</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Mantener pantalla encendida</Text>
            <Text style={styles.settingDescription}>Evita que el dispositivo se bloquee durante sesiones activas</Text>
          </View>
          <Switch
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.surface}
            value={keepAwake}
            onValueChange={toggleKeepAwake} // Llama a la función global
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Mostrar milisegundos</Text>
            <Text style={styles.settingDescription}>Muestra las centésimas de segundo en el reloj principal</Text>
          </View>
          <Switch
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.surface}
            value={showMs}
            onValueChange={toggleShowMs} // Llama a la función global
          />
        </View>
      </View>
    </View>
  );
}

// ... Mantén exactamente los mismos estilos que ya tenías en la parte de abajo
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.l },
  header: { marginTop: SPACING.xl * 2, marginBottom: SPACING.xl },
  title: { color: COLORS.primary, fontSize: 20, fontWeight: '800', letterSpacing: 1.5 },
  subtitle: { color: COLORS.textSecondary, fontSize: 14, textTransform: 'uppercase', marginTop: 4 },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: SPACING.m },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.m, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingTextContainer: { flex: 1, paddingRight: SPACING.m },
  settingLabel: { color: COLORS.text, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  settingDescription: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 16 },
});