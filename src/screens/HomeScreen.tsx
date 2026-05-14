import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useTimer } from '../hooks/useTimer';
import { formatTime } from '../utils/timeFormat';
import { useSettings } from '../hooks/useSettings';
import { ModeSelector } from '../components/timer/ModeSelector';
import { MarksList } from '../components/timer/MarksList';
import { PresetManager } from '../components/timer/PresetManager';
import { useHistory } from '../hooks/useHistory';

// Altura fija del dock interno (botón Comenzar/Detener)
const INNER_DOCK_HEIGHT = 68;

export default function HomeScreen() {
  const {
    time, elapsedTime, realDuration, isRunning, marks, mode, switchMode,
    setCountdownTime, addMark, toggle, reset, initialTime
  } = useTimer();

  const isTimerZero = mode === 'timer' && time === 0;
  const { showMs } = useSettings();
  const { saveSession } = useHistory();
  const insets = useSafeAreaInsets();

  const isIOS = Platform.OS === 'ios';
  
  // Mismo cálculo que en AppNavigator
  const dockPadding = isIOS 
    ? Math.max(insets.bottom - 10, 10) 
    : Math.max(insets.bottom, 12) + 8;
    
  // dockPadding + altura aproximada de la cápsula (≈72px)
  const tabBarSpace = dockPadding + 72;
  const scrollPadding = tabBarSpace + INNER_DOCK_HEIGHT + SPACING.m;

  // Posición del dock anclado encima del floating tab
  const dockBottom = tabBarSpace + SPACING.s;

  return (
    <View style={styles.container}>
      {/* ── HEADER Y DISPLAY (Fijos) ────────────────────────── */}
      <View style={styles.fixedTopArea}>
        {/* ── HEADER ─────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>Time Tracker</Text>
            <Text style={styles.appTagline}>
              {isRunning
                ? mode === 'stopwatch' ? 'En marcha…' : 'Contando…'
                : 'Listo para comenzar'}
            </Text>
          </View>
          {isRunning && <View style={styles.liveDot} />}
        </View>

        {/* ── DISPLAY CARD ───────────────────────────────────── */}
        <View style={[styles.displayCard, SHADOWS.card]}>
          <ModeSelector mode={mode} onModeChange={switchMode} />

          <View style={styles.timeRow}>
            <Text style={styles.timeText} numberOfLines={1} adjustsFontSizeToFit>
              {formatTime(time, showMs)}
            </Text>
          </View>

          {/* Controles de sesión (solo cuando está pausado con tiempo trackeado) */}
          {!isRunning && elapsedTime > 0 && (
            <View style={styles.sessionControls}>
              <TouchableOpacity style={styles.resetBtn} onPress={reset} activeOpacity={0.7}>
                <Ionicons name="refresh" size={15} color={COLORS.textSecondary} />
                <Text style={styles.resetText}>Reiniciar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, SHADOWS.soft]}
                onPress={() => { saveSession(mode, elapsedTime, realDuration, marks); reset(); }}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={15} color={COLORS.success} />
                <Text style={styles.saveText}>Guardar sesión</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

      </View>

      {/* ── ÁREA DINÁMICA (Scroll interno) ───────────────── */}
      {/* paddingBottom asegura que el contenido no se esconda detrás del dock */}
      <View style={[styles.dynamicArea, { paddingBottom: scrollPadding }]}>
        {mode === 'stopwatch' || marks.length > 0
          ? <MarksList marks={marks} />
          : <PresetManager
              onSelectTime={setCountdownTime}
              isDisabled={isRunning}
              activeTime={initialTime || undefined}
            />}
      </View>

      {/* ── DOCK ANCLADO (absoluto, siempre visible) ────────── */}
      <View style={[styles.dock, { bottom: dockBottom, height: INNER_DOCK_HEIGHT }]}>
        {/* Botón de Marca (activo en cualquier modo corriendo) */}
        {isRunning && (
          <TouchableOpacity
            style={[styles.markBtn, SHADOWS.soft]}
            onPress={addMark}
            activeOpacity={0.75}
          >
            <Ionicons name="flag" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {/* Botón principal: Start / Stop */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.mainBtn,
            isRunning ? styles.mainBtnStop : styles.mainBtnStart,
            isRunning ? SHADOWS.buttonDanger : SHADOWS.button,
            isTimerZero && styles.mainBtnDisabled,
          ]}
          onPress={toggle}
          disabled={isTimerZero}
        >
          <Ionicons
            name={isRunning ? 'stop' : 'play'}
            size={26}
            color={COLORS.surface}
          />
          <Text style={styles.mainBtnText}>
            {isRunning ? 'Detener' : 'Comenzar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  fixedTopArea: {
    paddingHorizontal: SPACING.l,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xl * 1.5,
    marginBottom: SPACING.m,
  },
  appName: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  appTagline: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },

  // Display Card
  displayCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.l,
  },
  timeText: {
    color: COLORS.text,
    fontSize: 68,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },

  // Session controls
  sessionControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.m,
    paddingTop: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resetText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderRadius: RADIUS.full,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  saveText: { color: COLORS.success, fontSize: 14, fontWeight: '700' },

  // Área dinámica – vuelve a usar flex:1 para tomar el espacio restante
  dynamicArea: {
    flex: 1,
    paddingHorizontal: SPACING.l,
  },

  // Dock — posición absoluta anclada al fondo
  dock: {
    position: 'absolute',
    left: SPACING.l,
    right: SPACING.l,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  markBtn: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mainBtn: {
    flex: 1,
    height: 60,
    borderRadius: RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
  },
  mainBtnStart: { backgroundColor: COLORS.primary },
  mainBtnStop: { backgroundColor: COLORS.danger },
  mainBtnDisabled: { backgroundColor: COLORS.border },
  mainBtnText: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});