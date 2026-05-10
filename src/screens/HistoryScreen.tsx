import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useHistory } from '../hooks/useHistory';
import { formatTime } from '../utils/timeFormat';
import { useSettings } from '../hooks/useSettings';

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export default function HistoryScreen() {
  const { sessions, clearHistory } = useHistory();
  const { showMs } = useSettings();
  const insets = useSafeAreaInsets();
  
  const isIOS = Platform.OS === 'ios';
  const dockPadding = isIOS 
    ? Math.max(insets.bottom - 10, 10) 
    : Math.max(insets.bottom, 12) + 8;
  const dockClearance = dockPadding + 88; // 72px capsula + 16px extra margen

  const handleClear = () => {
    Alert.alert(
      'Borrar historial',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar', style: 'destructive', onPress: clearHistory },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: dockClearance }]}>
      {/* ── HEADER ─────────────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Historial</Text>
          <Text style={styles.subtitle}>
            {sessions.length === 0
              ? 'Sin sesiones aún'
              : `${sessions.length} sesión${sessions.length !== 1 ? 'es' : ''} registrada${sessions.length !== 1 ? 's' : ''}`}
          </Text>
        </View>
        {sessions.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
            <Text style={styles.clearText}>Borrar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── EMPTY STATE ─────────────────────────────────────── */}
      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="time-outline" size={40} color={COLORS.textTertiary} />
          </View>
          <Text style={styles.emptyTitle}>Aún no hay sesiones</Text>
          <Text style={styles.emptySubtitle}>
            Completa tu primera sesión de cronómetro o temporizador para verla aquí.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: SPACING.xl }}
          ItemSeparatorComponent={() => <View style={{ height: SPACING.m }} />}
          renderItem={({ item }) => {
            const isStopwatch = item.mode === 'stopwatch';
            return (
              <View style={[styles.card, SHADOWS.card]}>
                {/* Franja izquierda de color según modo */}
                <View style={[styles.stripe, isStopwatch ? styles.stripeBlue : styles.stripeMagenta]} />

                <View style={styles.cardContent}>
                  {/* Header de la card */}
                  <View style={styles.cardHeader}>
                    <View style={[styles.modeChip, isStopwatch ? styles.chipBlue : styles.chipMagenta]}>
                      <Ionicons
                        name={isStopwatch ? 'stopwatch-outline' : 'hourglass-outline'}
                        size={12}
                        color={isStopwatch ? COLORS.primary : COLORS.danger}
                      />
                      <Text style={[styles.modeChipText, isStopwatch ? styles.chipTextBlue : styles.chipTextMagenta]}>
                        {isStopwatch ? 'Cronómetro' : 'Temporizador'}
                      </Text>
                    </View>
                    <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                  </View>

                  {/* Tiempo principal */}
                  <Text style={styles.durationText}>{formatTime(item.duration, showMs)}</Text>

                  {/* Footer con marcas */}
                  {item.marks.length > 0 && (
                    <View style={styles.marksRow}>
                      <Ionicons name="flag-outline" size={13} color={COLORS.textTertiary} />
                      <Text style={styles.marksText}>{item.marks.length} marcas registradas</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.l,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    backgroundColor: COLORS.dangerLight,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#F5D0FE',
  },
  clearText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '700',
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.m,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
    ...SHADOWS.soft,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Cards
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.l,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stripe: {
    width: 4,
  },
  stripeBlue: { backgroundColor: COLORS.primary },
  stripeMagenta: { backgroundColor: COLORS.danger },
  cardContent: {
    flex: 1,
    padding: SPACING.m,
    gap: SPACING.s,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: SPACING.s,
    borderRadius: RADIUS.full,
  },
  chipBlue: { backgroundColor: COLORS.primaryLight },
  chipMagenta: { backgroundColor: COLORS.dangerLight },
  modeChipText: { fontSize: 12, fontWeight: '700' },
  chipTextBlue: { color: COLORS.primary },
  chipTextMagenta: { color: COLORS.danger },
  dateText: {
    color: COLORS.textTertiary,
    fontSize: 12,
    fontWeight: '500',
  },
  durationText: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  marksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  marksText: {
    color: COLORS.textTertiary,
    fontSize: 12,
    fontWeight: '500',
  },
});