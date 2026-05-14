import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useHistory, TimerSession } from '../hooks/useHistory';
import { formatTime } from '../utils/timeFormat';
import { useSettings } from '../hooks/useSettings';

const SessionDetailModal = React.memo(({ 
  session, 
  visible, 
  onClose, 
  onDelete,
  showMs 
}: { 
  session: TimerSession | null, 
  visible: boolean, 
  onClose: () => void,
  onDelete: (id: string) => void,
  showMs: boolean 
}) => {
  if (!session) return null;

  const isStopwatch = session.mode === 'stopwatch';
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Copiamos y ordenamos según el estado
  // Por defecto, 'desc' es el original (recientes primero). 'asc' es invertido.
  const sortedMarks = React.useMemo(() => {
    if (!session.marks) return [];
    return sortOrder === 'desc' 
      ? session.marks 
      : [...session.marks].reverse();
  }, [session.marks, sortOrder]);

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent={true} 
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={[styles.modeChip, isStopwatch ? styles.chipBlue : styles.chipMagenta]}>
              <Text style={[styles.modeChipText, isStopwatch ? styles.chipTextBlue : styles.chipTextMagenta]}>
                {isStopwatch ? 'Cronómetro' : 'Temporizador'}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => onDelete(session.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── FIJO: Fecha + Stats ─────────────────────────── */}
          <Text style={styles.modalDate}>{new Date(session.date).toLocaleString()}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Tiempo Trackeado</Text>
              <Text style={styles.statValue}>{formatTime(session.duration, showMs)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Tiempo Real</Text>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>
                {formatTime(session.realDuration || 0, showMs)}
              </Text>
            </View>
          </View>

          {/* ── DINÁMICO: Solo la lista de marcas scrollea ──── */}
          {session.marks && session.marks.length > 0 && (
            <View style={styles.marksSection}>
              <View style={styles.marksHeaderRow}>
                <Text style={styles.sectionTitle}>Marcas ({session.marks.length})</Text>
                <TouchableOpacity 
                  style={styles.sortBtn} 
                  onPress={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                >
                  <Text style={styles.sortBtnText}>
                    {sortOrder === 'desc' ? 'Recientes' : 'Antiguas'}
                  </Text>
                  <Ionicons 
                    name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'} 
                    size={14} 
                    color={COLORS.primary} 
                  />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                {sortedMarks.map((mark) => (
                  <View key={mark.id} style={styles.markItem}>
                    <Text style={styles.markIndex}>#{mark.id}</Text>
                    <Text style={styles.markTime}>{formatTime(mark.time, showMs)}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <TouchableOpacity style={styles.bottomCloseBtn} onPress={onClose}>
            <Text style={styles.bottomCloseText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export default function HistoryScreen() {
  const { sessions, clearHistory, deleteSession } = useHistory();
  const { showMs } = useSettings();
  const insets = useSafeAreaInsets();
  
  const [selectedSession, setSelectedSession] = useState<TimerSession | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openDetails = useCallback((session: TimerSession) => {
    setSelectedSession(session);
    setModalVisible(true);
  }, []);

  const closeDetails = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleDeleteSession = useCallback((id: string) => {
    Alert.alert(
      'Eliminar sesión',
      '¿Estás seguro de que quieres eliminar esta sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: () => {
            deleteSession(id);
            setModalVisible(false);
          } 
        },
      ]
    );
  }, [deleteSession]);

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
              <TouchableOpacity activeOpacity={0.7} onPress={() => openDetails(item)}>
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
              </TouchableOpacity>
            );
          }}
        />
      )}

      <SessionDetailModal 
        session={selectedSession} 
        visible={modalVisible} 
        onClose={closeDetails}
        onDelete={handleDeleteSession}
        showMs={showMs}
      />
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
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    maxHeight: '80%',
    minHeight: '40%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  deleteBtn: {
    padding: SPACING.s,
    backgroundColor: COLORS.dangerLight,
    borderRadius: RADIUS.full,
  },
  closeBtn: {
    padding: SPACING.s,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
  },
  modalDate: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: SPACING.l,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginBottom: SPACING.l,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.m,
    borderRadius: RADIUS.l,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '600',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  marksSection: {
    maxHeight: 220,
    marginTop: SPACING.m,
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  marksHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.m,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  markItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  markIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  markTime: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  bottomCloseBtn: {
    backgroundColor: COLORS.background,
    padding: SPACING.m,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.m,
  },
  bottomCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
});