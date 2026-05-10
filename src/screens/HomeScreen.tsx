import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';
import { useTimer } from '../hooks/useTimer';
import { formatTime } from '../utils/timeFormat';
import { useSettings } from '../hooks/useSettings';

// Importamos nuestros nuevos módulos limpios
import { ModeSelector } from '../components/timer/ModeSelector';
import { MarksList } from '../components/timer/MarksList';
import { PresetManager } from '../components/timer/PresetManager';
import { useHistory } from '../hooks/useHistory';

export default function HomeScreen() {
  const { 
    time, elapsedTime, isRunning, marks, mode, switchMode, 
    setCountdownTime, addMark, toggle, reset 
  } = useTimer();

  const isTimerZero = mode === 'timer' && time === 0;
  const { showMs } = useSettings();
  const { saveSession } = useHistory();

  return (
    <View style={styles.container}>
      
      {/* 1. HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>TIME TRACKER</Text>
        <ModeSelector mode={mode} onModeChange={switchMode} />
      </View>

      {/* 2. DISPLAY */}
      <View style={styles.timerContainer}>
        <Text style={styles.timeText}>{formatTime(time, showMs)}</Text>
      </View>

      {/* 3. ÁREA DINÁMICA (Marcas o Presets) */}
      <View style={styles.dynamicContainer}>
        {mode === 'stopwatch' 
          ? <MarksList marks={marks} /> 
          : <PresetManager onSelectTime={setCountdownTime} isDisabled={isRunning} />
        }
      </View>

      {/* 4. CONTROLES */}
      <View style={styles.controlsContainer}>
        <View style={styles.mainButtonsRow}>
          {mode === 'stopwatch' && isRunning && (
            <TouchableOpacity style={[styles.secondaryButton, SHADOWS.small]} onPress={addMark}>
              <Text style={styles.secondaryButtonText}>Marca</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            activeOpacity={0.8}
            style={[
              styles.button, 
              isRunning ? styles.buttonDanger : styles.buttonPrimary,
              isTimerZero && styles.buttonDisabled,
              SHADOWS.medium,
              { flex: 1 }
            ]}
            onPress={toggle}
            disabled={isTimerZero}
          >
            <Text style={styles.buttonText}>{isRunning ? 'Parar' : 'Empezar'}</Text>
          </TouchableOpacity>
        </View>

        {/* CONTROLES DE PAUSA / FIN DE SESIÓN */}
        {!isRunning && time > 0 && (
          <View style={styles.pausedControlsRow}>
            <TouchableOpacity style={styles.resetButton} onPress={reset}>
              <Text style={styles.resetText}>Reiniciar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={() => {
                saveSession(mode, elapsedTime, marks);
                reset(); // Reinicia automáticamente después de guardar
              }}
            >
              <Text style={styles.saveText}>Guardar Sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.l },
  header: { alignItems: 'center', marginTop: SPACING.xl * 2, height: 100 },
  title: { color: COLORS.primary, fontSize: 20, fontWeight: '800', letterSpacing: 1.5, marginBottom: SPACING.m },
  timerContainer: { height: 150, alignItems: 'center', justifyContent: 'center' },
  timeText: { color: COLORS.text, fontSize: 72, fontWeight: '200', fontVariant: ['tabular-nums'] },
  dynamicContainer: { flex: 1, marginVertical: SPACING.m },
  controlsContainer: { paddingBottom: SPACING.xl },
  mainButtonsRow: { flexDirection: 'row', gap: SPACING.m },
  button: { paddingVertical: SPACING.m, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  buttonPrimary: { backgroundColor: COLORS.primary },
  buttonDanger: { backgroundColor: COLORS.danger },
  buttonDisabled: { backgroundColor: COLORS.border },
  buttonText: { color: COLORS.surface, fontSize: 18, fontWeight: '700' },
  secondaryButton: { backgroundColor: COLORS.surface, paddingHorizontal: SPACING.l, borderRadius: 16, justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  secondaryButtonText: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
  resetButton: { marginTop: SPACING.l, alignSelf: 'center' },
  resetText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
  pausedControlsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.xl, marginTop: SPACING.l },
  saveButton: { backgroundColor: COLORS.surface, paddingVertical: SPACING.s, paddingHorizontal: SPACING.l, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small },
  saveText: { color: COLORS.primary, fontSize: 16, fontWeight: '700' },
});