import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { TimerMode } from '../../hooks/useTimer';

interface Props {
  mode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

export const ModeSelector = memo(({ mode, onModeChange }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, mode === 'stopwatch' && styles.tabActive]}
        onPress={() => onModeChange('stopwatch')}
        activeOpacity={0.8}
      >
        <Text style={[styles.text, mode === 'stopwatch' && styles.textActive]}>
          Cronómetro
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, mode === 'timer' && styles.tabActive]}
        onPress={() => onModeChange('timer')}
        activeOpacity={0.8}
      >
        <Text style={[styles.text, mode === 'timer' && styles.textActive]}>
          Temporizador
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.borderSubtle,
    borderRadius: RADIUS.full,
    padding: 4,
    alignSelf: 'center',
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.s + 2,
    alignItems: 'center',
    borderRadius: RADIUS.full,
  },
  tabActive: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.soft,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  textActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});