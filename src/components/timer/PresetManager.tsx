import React, { useState, memo } from 'react';
import {
  View, Text, TouchableOpacity, Modal, TextInput,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

interface Props {
  onSelectTime: (ms: number) => void;
  isDisabled: boolean;
  activeTime?: number;
}

// ─── Filas del grid ───────────────────────────────────────────────────────────
const GRID = [
  [
    { label: '10s', ms: 10_000 },
    { label: '30s', ms: 30_000 },
    { label: '45s', ms: 45_000 },
  ],
  [
    { label: '1m',  ms: 60_000 },
    { label: '5m',  ms: 300_000 },
    { label: '10m', ms: 600_000 },
  ],
  [
    { label: '30m', ms: 1_800_000 },
    { label: '1h',  ms: 3_600_000 },
    { label: '+',   ms: -1 },
  ],
];

// ─── PresetManager ────────────────────────────────────────────────────────────
export const PresetManager = memo(({ onSelectTime, isDisabled, activeTime }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customMin, setCustomMin] = useState('');
  const [customSec, setCustomSec] = useState('');

  const handleCustomSubmit = () => {
    const total = ((parseInt(customMin) || 0) * 60 + (parseInt(customSec) || 0)) * 1000;
    if (total > 0) onSelectTime(total);
    setCustomMin('');
    setCustomSec('');
    setIsModalVisible(false);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>Tiempo rápido</Text>

      {/* ── Grid 3×3 ───────────────────────────────────────────── */}
      <View style={styles.grid}>
        {GRID.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((cell) => {
              const isCustom  = cell.ms === -1;
              const isActive  = !isCustom && activeTime === cell.ms;
              const disabled  = isDisabled;

              return (
                <TouchableOpacity
                  key={cell.label}
                  activeOpacity={0.7}
                  disabled={disabled}
                  style={[
                    styles.cell,
                    isActive  && styles.cellActive,
                    isCustom  && styles.cellCustom,
                    disabled  && styles.cellDisabled,
                  ]}
                  onPress={() => isCustom ? setIsModalVisible(true) : onSelectTime(cell.ms)}
                >
                  {isCustom ? (
                    <Ionicons
                      name="add"
                      size={24}
                      color={isDisabled ? COLORS.border : COLORS.danger}
                    />
                  ) : (
                    <>
                      {isActive && (
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color={COLORS.surface}
                          style={styles.check}
                        />
                      )}
                      <Text style={[styles.cellLabel, isActive && styles.cellLabelActive]}>
                        {cell.label}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* ── Modal personalizado ─────────────────────────────────── */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.overlay}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={() => setIsModalVisible(false)}
            activeOpacity={1}
          />
          <View style={[styles.sheet, SHADOWS.card]}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Tiempo personalizado</Text>
            <Text style={styles.sheetSub}>Ingresa minutos y segundos</Text>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={[styles.input, { width: 120 }]} // Un poco más ancho para 3 dígitos
                  keyboardType="number-pad"
                  maxLength={3}
                  value={customMin}
                  onChangeText={t => setCustomMin(t.replace(/\D/g, ''))}
                  placeholder="00"
                  placeholderTextColor={COLORS.textTertiary}
                  selectionColor={COLORS.primary}
                />
                <Text style={styles.inputLabel}>min</Text>
              </View>
              <Text style={styles.colon}>:</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={customSec}
                  onChangeText={t => setCustomSec(t.replace(/\D/g, ''))}
                  placeholder="00"
                  placeholderTextColor={COLORS.textTertiary}
                  selectionColor={COLORS.primary}
                />
                <Text style={styles.inputLabel}>seg</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.btnCancelTxt}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnApply, SHADOWS.button]} onPress={handleCustomSubmit}>
                <Text style={styles.btnApplyTxt}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
});

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: SPACING.m,
  },
  heading: {
    color: COLORS.textTertiary,
    fontSize: 12, fontWeight: '700',
    letterSpacing: 0.8, textTransform: 'uppercase',
    marginBottom: SPACING.m,
  },

  // Grid
  grid: {
    flex: 1,
    gap: SPACING.s,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.s,
  },
  cell: {
    flex: 1,
    borderRadius: RADIUS.l,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  cellActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  cellCustom: {
    borderColor: COLORS.danger,
    borderStyle: 'dashed',
    backgroundColor: COLORS.surface,
  },
  cellDisabled: {
    opacity: 0.4,
  },
  check: {
    // inline checkmark cuando la celda está activa
  },
  cellLabel: {
    fontSize: 17, fontWeight: '600',
    color: COLORS.text,
  },
  cellLabelActive: {
    color: COLORS.surface,
    fontWeight: '700',
  },

  // Modal / Bottom sheet
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.xxl,
    alignItems: 'center',
  },
  handle: {
    width: 36, height: 4,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.l,
  },
  sheetTitle: {
    color: COLORS.text, fontSize: 20, fontWeight: '800', marginBottom: 4,
  },
  sheetSub: {
    color: COLORS.textSecondary, fontSize: 14, marginBottom: SPACING.xl,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: SPACING.m, marginBottom: SPACING.xl,
  },
  inputGroup: { alignItems: 'center', gap: SPACING.s },
  input: {
    backgroundColor: COLORS.background,
    color: COLORS.text,
    fontSize: 44, fontWeight: '300',
    borderRadius: RADIUS.l,
    width: 100, height: 90,
    textAlign: 'center',
    borderWidth: 1.5, borderColor: COLORS.border,
    fontVariant: ['tabular-nums'],
  },
  inputLabel: {
    color: COLORS.textSecondary, fontSize: 13,
    fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5,
  },
  colon: {
    fontSize: 44, color: COLORS.textTertiary,
    fontWeight: '200', marginBottom: 28,
  },
  actions: {
    flexDirection: 'row', width: '100%', gap: SPACING.m,
  },
  btnCancel: {
    flex: 1, paddingVertical: SPACING.m, borderRadius: RADIUS.l,
    alignItems: 'center', backgroundColor: COLORS.background,
    borderWidth: 1, borderColor: COLORS.border,
  },
  btnCancelTxt: {
    color: COLORS.textSecondary, fontSize: 16, fontWeight: '600',
  },
  btnApply: {
    flex: 2, paddingVertical: SPACING.m, borderRadius: RADIUS.l,
    alignItems: 'center', backgroundColor: COLORS.primary,
  },
  btnApplyTxt: {
    color: COLORS.surface, fontSize: 16, fontWeight: '700',
  },
});