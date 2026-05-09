// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  FlatList, Modal, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';
import { useTimer } from '../hooks/useTimer';
import { formatTime } from '../utils/timeFormat';

export default function HomeScreen() {
  const { 
    time, isRunning, marks, mode, switchMode, 
    setCountdownTime, addMark, toggle, reset 
  } = useTimer();
  
  const [isAscending, setIsAscending] = useState(false);
  
  // --- Nuevos estados para el Modal Custom ---
  const [isCustomModalVisible, setIsCustomModalVisible] = useState(false);
  const [customMin, setCustomMin] = useState('');
  const [customSec, setCustomSec] = useState('');

  const displayedMarks = isAscending ? [...marks].reverse() : marks;

  const PRESETS = [
    { label: '30s', value: 30000 },
    { label: '1m', value: 60000 },
    { label: '5m', value: 300000 },
  ];

  // Función para procesar el tiempo custom ingresado
  const handleCustomSubmit = () => {
    const m = parseInt(customMin) || 0;
    const s = parseInt(customSec) || 0;
    const totalMs = (m * 60 + s) * 1000;

    if (totalMs > 0) {
      setCountdownTime(totalMs);
    }
    
    // Limpiamos y cerramos
    setCustomMin('');
    setCustomSec('');
    setIsCustomModalVisible(false);
  };

  return (
    <View style={styles.container}>
      
      {/* 1. Header & Selector de Modo */}
      <View style={styles.header}>
        <Text style={styles.title}>TIME TRACKER</Text>
        <View style={styles.modeSelector}>
          <TouchableOpacity 
            style={[styles.modeTab, mode === 'stopwatch' && styles.modeTabActive]}
            onPress={() => switchMode('stopwatch')}
          >
            <Text style={[styles.modeText, mode === 'stopwatch' && styles.modeTextActive]}>Cronómetro</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeTab, mode === 'timer' && styles.modeTabActive]}
            onPress={() => switchMode('timer')}
          >
            <Text style={[styles.modeText, mode === 'timer' && styles.modeTextActive]}>Temporizador</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Display Principal */}
      <View style={styles.timerContainer}>
        <Text style={styles.timeText}>{formatTime(time)}</Text>
      </View>

      {/* 3. Área Dinámica */}
      <View style={styles.dynamicContainer}>
        {mode === 'stopwatch' ? (
          <>
            {marks.length > 0 && (
              <View style={styles.marksHeader}>
                <Text style={styles.marksTitle}>Registro de marcas</Text>
                <TouchableOpacity onPress={() => setIsAscending(!isAscending)} style={styles.sortButton}>
                  <Text style={styles.sortButtonText}>
                    {isAscending ? '↓ Más antiguas' : '↑ Más recientes'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <FlatList
              data={displayedMarks}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.markItem}>
                  <Text style={styles.markLabel}>Marca {item.id}</Text>
                  <Text style={styles.markTime}>{formatTime(item.time)}</Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View style={styles.presetsWrapper}>
            <Text style={styles.marksTitle}>Tiempos Predefinidos</Text>
            <View style={styles.presetsContainer}>
              {PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.label}
                  style={[styles.presetButton, SHADOWS.small]}
                  onPress={() => setCountdownTime(preset.value)}
                  disabled={isRunning}
                >
                  <Text style={styles.presetText}>{preset.label}</Text>
                </TouchableOpacity>
              ))}
              
              {/* Nuevo Botón Custom */}
              <TouchableOpacity
                style={[styles.presetButton, styles.customButton, SHADOWS.small]}
                onPress={() => setIsCustomModalVisible(true)}
                disabled={isRunning}
              >
                <Text style={[styles.presetText, { color: COLORS.primary }]}>+ Custom</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* 4. Controles */}
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
              (mode === 'timer' && time === 0) && styles.buttonDisabled,
              SHADOWS.medium,
              { flex: 1 }
            ]}
            onPress={toggle}
            disabled={mode === 'timer' && time === 0}
          >
            <Text style={styles.buttonText}>
              {isRunning ? 'Parar' : 'Empezar'}
            </Text>
          </TouchableOpacity>
        </View>

        {!isRunning && time > 0 && (
          <TouchableOpacity style={styles.resetButton} onPress={reset}>
            <Text style={styles.resetText}>Reiniciar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 5. Modal Custom Time */}
      <Modal
        visible={isCustomModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCustomModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, SHADOWS.medium]}>
            <Text style={styles.modalTitle}>Tiempo Personalizado</Text>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={customMin}
                  onChangeText={setCustomMin}
                  placeholder="00"
                  placeholderTextColor={COLORS.border}
                />
                <Text style={styles.inputLabel}>Min</Text>
              </View>
              <Text style={styles.inputDivider}>:</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={customSec}
                  onChangeText={setCustomSec}
                  placeholder="00"
                  placeholderTextColor={COLORS.border}
                />
                <Text style={styles.inputLabel}>Seg</Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalButtonText} 
                onPress={() => setIsCustomModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonPrimary} 
                onPress={handleCustomSubmit}
              >
                <Text style={styles.modalApplyText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.l },
  header: { alignItems: 'center', marginTop: SPACING.xl * 2, height: 100 },
  title: { color: COLORS.primary, fontSize: 20, fontWeight: '800', letterSpacing: 1.5, marginBottom: SPACING.m },
  
  modeSelector: { flexDirection: 'row', backgroundColor: COLORS.border, borderRadius: 12, padding: 4 },
  modeTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  modeTabActive: { backgroundColor: COLORS.surface, ...SHADOWS.small },
  modeText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  modeTextActive: { color: COLORS.text, fontWeight: '700' },
  
  timerContainer: { height: 150, alignItems: 'center', justifyContent: 'center' },
  timeText: { color: COLORS.text, fontSize: 72, fontWeight: '200', fontVariant: ['tabular-nums'] },
  dynamicContainer: { flex: 1, marginVertical: SPACING.m },
  
  marksHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: SPACING.s, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: SPACING.s },
  marksTitle: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600', textTransform: 'uppercase', marginBottom: SPACING.m },
  sortButton: { paddingVertical: 4, paddingHorizontal: 8, backgroundColor: COLORS.surface, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  sortButtonText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  markItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.m, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  markLabel: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '500' },
  markTime: { color: COLORS.text, fontSize: 16, fontWeight: '700', fontVariant: ['tabular-nums'] },
  
  presetsWrapper: { flex: 1, alignItems: 'center', paddingTop: SPACING.l },
  presetsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.m },
  presetButton: { backgroundColor: COLORS.surface, paddingVertical: SPACING.m, paddingHorizontal: SPACING.l, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
  customButton: { borderColor: COLORS.primary, borderWidth: 1.5 },
  presetText: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  
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

  // Estilos del Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center', padding: SPACING.l },
  modalContent: { backgroundColor: COLORS.surface, borderRadius: 24, padding: SPACING.xl, width: '100%', maxWidth: 340, alignItems: 'center' },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginBottom: SPACING.l },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xl },
  inputGroup: { alignItems: 'center' },
  timeInput: { backgroundColor: COLORS.background, color: COLORS.text, fontSize: 40, fontWeight: '300', borderRadius: 16, width: 80, height: 80, textAlign: 'center', borderWidth: 1, borderColor: COLORS.border },
  inputLabel: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600', marginTop: SPACING.s },
  inputDivider: { fontSize: 40, color: COLORS.textSecondary, fontWeight: '200', marginHorizontal: SPACING.m, marginBottom: 24 }, // marginBottom para alinear con el input saltando el label
  modalActions: { flexDirection: 'row', width: '100%', justifyContent: 'flex-end', gap: SPACING.m },
  modalButtonText: { paddingVertical: SPACING.s, paddingHorizontal: SPACING.m, justifyContent: 'center' },
  modalCancelText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
  modalButtonPrimary: { backgroundColor: COLORS.primary, paddingVertical: SPACING.s, paddingHorizontal: SPACING.l, borderRadius: 12, justifyContent: 'center' },
  modalApplyText: { color: COLORS.surface, fontSize: 16, fontWeight: '700' }
});