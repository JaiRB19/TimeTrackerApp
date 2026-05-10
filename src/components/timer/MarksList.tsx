import React, { useState, memo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
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
        <View style={styles.headerLeft}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{marks.length}</Text>
          </View>
          <Text style={styles.title}>Marcas</Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsAscending(!isAscending)}
          style={styles.sortButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isAscending ? 'arrow-up' : 'arrow-down'}
            size={13}
            color={COLORS.primary}
          />
          <Text style={styles.sortText}>
            {isAscending ? 'Antiguas' : 'Recientes'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedMarks}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <View style={[styles.avatar, index === 0 && !isAscending && styles.avatarLatest]}>
              <Text style={[styles.avatarText, index === 0 && !isAscending && styles.avatarTextLatest]}>
                {item.id}
              </Text>
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.label}>Marca {item.id}</Text>
            </View>
            <Text style={[styles.time, index === 0 && !isAscending && styles.timeLatest]}>
              {formatTime(item.time, showMs)}
            </Text>
          </View>
        )}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  countBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { color: COLORS.primary, fontSize: 12, fontWeight: '800' },
  title: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: SPACING.m,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
  },
  sortText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  separator: {
    height: 1,
    backgroundColor: COLORS.borderSubtle,
    marginLeft: 52,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    gap: SPACING.m,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLatest: { backgroundColor: COLORS.primaryLight },
  avatarText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '700' },
  avatarTextLatest: { color: COLORS.primary },
  itemContent: { flex: 1 },
  label: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '500' },
  time: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  timeLatest: { color: COLORS.primary, fontSize: 17 },
});