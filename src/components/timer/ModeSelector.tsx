import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../constants/theme';
import { TimerMode } from '../../hooks/useTimer';

interface Props {
  mode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

export const ModeSelector = ({ mode, onModeChange }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.tab, mode === 'stopwatch' && styles.tabActive]}
        onPress={() => onModeChange('stopwatch')}
      >
        <Text style={[styles.text, mode === 'stopwatch' && styles.textActive]}>Cronómetro</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, mode === 'timer' && styles.tabActive]}
        onPress={() => onModeChange('timer')}
      >
        <Text style={[styles.text, mode === 'timer' && styles.textActive]}>Temporizador</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: COLORS.border, borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: COLORS.surface, ...SHADOWS.small },
  text: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  textActive: { color: COLORS.text, fontWeight: '700' },
});