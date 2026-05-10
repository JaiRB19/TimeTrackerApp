import React, { useState, memo } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../../constants/theme';

interface Props {
  onSelectTime: (ms: number) => void;
  isDisabled: boolean;
}

// 1. Quitamos el de 5m para que el Custom ocupe su lugar perfecto
const PRESETS = [
  { label: '30s', value: 30000 },
  { label: '1m', value: 60000 },
];

export const PresetManager = memo(({ onSelectTime, isDisabled }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customMin, setCustomMin] = useState('');
  const [customSec, setCustomSec] = useState('');

  const handleCustomSubmit = () => {
    const m = parseInt(customMin) || 0;
    const s = parseInt(customSec) || 0;
    const totalMs = (m * 60 + s) * 1000;
    
    if (totalMs > 0) onSelectTime(totalMs);
    
    setCustomMin(''); 
    setCustomSec(''); 
    setIsModalVisible(false);
  };

  // 2. Funciones para filtrar solo números reales
  const handleMinChange = (text: string) => {
    // Reemplaza cualquier carácter que no sea del 0 al 9 por un string vacío
    setCustomMin(text.replace(/[^0-9]/g, ''));
  };

  const handleSecChange = (text: string) => {
    setCustomSec(text.replace(/[^0-9]/g, ''));
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Tiempos Predefinidos</Text>
      <View style={styles.container}>
        {PRESETS.map((p) => (
          <TouchableOpacity 
            key={p.label} 
            style={[styles.btn, SHADOWS.small]} 
            onPress={() => onSelectTime(p.value)} 
            disabled={isDisabled}
          >
            <Text style={styles.btnText}>{p.label}</Text>
          </TouchableOpacity>
        ))}
        
        {/* El botón Custom ahora es el tercero en la fila */}
        <TouchableOpacity 
          style={[styles.btn, styles.customBtn, SHADOWS.small]} 
          onPress={() => setIsModalVisible(true)} 
          disabled={isDisabled}
        >
          <Text style={[styles.btnText, { color: COLORS.primary }]}>+ Custom</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent animationType="fade" onRequestClose={() => setIsModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
          <View style={[styles.content, SHADOWS.medium]}>
            <Text style={styles.modalTitle}>Tiempo Personalizado</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <TextInput 
                  style={styles.input} 
                  keyboardType="number-pad" 
                  maxLength={2} 
                  value={customMin} 
                  onChangeText={handleMinChange} // Usamos el filtro
                  placeholder="00" 
                  placeholderTextColor={COLORS.border} 
                />
                <Text style={styles.label}>Min</Text>
              </View>
              <Text style={styles.divider}>:</Text>
              <View style={styles.inputGroup}>
                <TextInput 
                  style={styles.input} 
                  keyboardType="number-pad" 
                  maxLength={2} 
                  value={customSec} 
                  onChangeText={handleSecChange} // Usamos el filtro
                  placeholder="00" 
                  placeholderTextColor={COLORS.border} 
                />
                <Text style={styles.label}>Seg</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={handleCustomSubmit}>
                <Text style={styles.apply}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { flex: 1, alignItems: 'center', paddingTop: SPACING.l },
  title: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600', textTransform: 'uppercase', marginBottom: SPACING.m },
  container: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.m },
  btn: { backgroundColor: COLORS.surface, paddingVertical: SPACING.m, paddingHorizontal: SPACING.l, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
  customBtn: { borderColor: COLORS.primary, borderWidth: 1.5 },
  btnText: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: SPACING.l },
  content: { backgroundColor: COLORS.surface, borderRadius: 24, padding: SPACING.xl, width: '100%', maxWidth: 340, alignItems: 'center' },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginBottom: SPACING.l },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xl },
  inputGroup: { alignItems: 'center' },
  input: { backgroundColor: COLORS.background, color: COLORS.text, fontSize: 40, fontWeight: '300', borderRadius: 16, width: 80, height: 80, textAlign: 'center', borderWidth: 1, borderColor: COLORS.border },
  label: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600', marginTop: SPACING.s },
  divider: { fontSize: 40, color: COLORS.textSecondary, fontWeight: '200', marginHorizontal: SPACING.m, marginBottom: 24 },
  actions: { flexDirection: 'row', width: '100%', justifyContent: 'flex-end', gap: SPACING.l, alignItems: 'center' },
  cancel: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
  applyBtn: { backgroundColor: COLORS.primary, paddingVertical: SPACING.s, paddingHorizontal: SPACING.l, borderRadius: 12 },
  apply: { color: COLORS.surface, fontSize: 16, fontWeight: '700' }
});