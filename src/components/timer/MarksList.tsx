import React, { useState, memo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { Mark } from '../../hooks/useTimer';
import { formatTime } from '../../utils/timeFormat';
import { useSettings } from '../../hooks/useSettings';

interface Props {
  marks: Mark[];
}

export const MarksList = memo(({ marks }: Props) => {
  const [isAscending, setIsAscending] = useState(false);
  const { showMs } = useSettings();
  const displayedMarks = isAscending ? [...marks].reverse() : marks;

  if (marks.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Registro de marcas</Text>
        <TouchableOpacity onPress={() => setIsAscending(!isAscending)} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>
            {isAscending ? '↓ Más antiguas' : '↑ Más recientes'}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={displayedMarks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.label}>Marca {item.id}</Text>
            <Text style={styles.time}>{formatTime(item.time, showMs)}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: SPACING.s, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: SPACING.s },
  title: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600', textTransform: 'uppercase' },
  sortButton: { paddingVertical: 4, paddingHorizontal: 8, backgroundColor: COLORS.surface, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  sortButtonText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  item: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.m, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  label: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '500' },
  time: { color: COLORS.text, fontSize: 16, fontWeight: '700', fontVariant: ['tabular-nums'] },
});