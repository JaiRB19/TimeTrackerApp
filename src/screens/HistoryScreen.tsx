import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';
import { useHistory } from '../hooks/useHistory';
import { formatTime } from '../utils/timeFormat';
import { useSettings } from '../hooks/useSettings';

export default function HistoryScreen() {
  const { sessions, clearHistory } = useHistory();
  const { showMs } = useSettings();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-MX', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  if (sessions.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.title}>HISTORY</Text>
        <Text style={styles.emptyText}>No hay sesiones registradas aún.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>HISTORY</Text>
          <Text style={styles.subtitle}>Tus registros de tiempo</Text>
        </View>
        <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING.xl }}
        renderItem={({ item }) => (
          <View style={[styles.card, SHADOWS.small]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardType}>
                {item.mode === 'stopwatch' ? '⏱️ Cronómetro' : '⏳ Temporizador'}
              </Text>
              <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
            </View>
            
            <View style={styles.cardBody}>
              <Text style={styles.cardTime}>{formatTime(item.duration, showMs)}</Text>
              {item.marks.length > 0 && (
                <Text style={styles.cardMarks}>{item.marks.length} marcas registradas</Text>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.l },
  emptyContainer: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.xl * 2, marginBottom: SPACING.xl },
  title: { color: COLORS.primary, fontSize: 20, fontWeight: '800', letterSpacing: 1.5 },
  subtitle: { color: COLORS.textSecondary, fontSize: 14, textTransform: 'uppercase', marginTop: 4 },
  clearButton: { paddingVertical: SPACING.s, paddingHorizontal: SPACING.m, backgroundColor: COLORS.surface, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  clearButtonText: { color: COLORS.danger, fontSize: 14, fontWeight: '600' },
  emptyText: { color: COLORS.textSecondary, fontSize: 16, marginTop: SPACING.m },
  card: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.m, marginBottom: SPACING.m, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.s },
  cardType: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '700', textTransform: 'uppercase' },
  cardDate: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '500' },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardTime: { color: COLORS.text, fontSize: 32, fontWeight: '300', fontVariant: ['tabular-nums'] },
  cardMarks: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
});