// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';
import { useTimer } from '../hooks/useTimer';
import { formatTime } from '../utils/timeFormat';

export default function HomeScreen() {
  const { time, isRunning, marks, addMark, toggle, reset } = useTimer();
  
  // Estado para controlar el orden (descendente por defecto: más recientes arriba)
  const [isAscending, setIsAscending] = useState(false);

  // Derivamos la lista a mostrar basándonos en el filtro
  const displayedMarks = isAscending ? [...marks].reverse() : marks;

  return (
    <View style={styles.container}>
      
      {/* 1. Header */}
      <View style={styles.header}>
        <Text style={styles.title}>TIME TRACKER</Text>
        <Text style={styles.subtitle}>
          {isRunning ? 'Sesión Activa' : time > 0 ? 'Pausado' : 'Listo para empezar'}
        </Text>
      </View>

      {/* 2. Display Principal */}
      <View style={styles.timerContainer}>
        <Text style={styles.timeText}>{formatTime(time)}</Text>
      </View>

      {/* 3. Contenedor de Marcas */}
      <View style={styles.marksContainer}>
        
        {/* Encabezado de la lista con el Filtro (Solo aparece si hay marcas) */}
        {marks.length > 0 && (
          <View style={styles.marksHeader}>
            <Text style={styles.marksTitle}>Registro de marcas</Text>
            <TouchableOpacity 
              onPress={() => setIsAscending(!isAscending)}
              style={styles.sortButton}
            >
              <Text style={styles.sortButtonText}>
                {isAscending ? '↓ Más antiguas' : '↑ Más recientes'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de Marcas */}
        <FlatList
          data={displayedMarks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.markItem}>
              {/* Ahora usamos directamente el ID del objeto */}
              <Text style={styles.markLabel}>Marca {item.id}</Text>
              <Text style={styles.markTime}>{formatTime(item.time)}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: SPACING.m }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* 4. Controles */}
      <View style={styles.controlsContainer}>
        <View style={styles.mainButtonsRow}>
          {isRunning && (
            <TouchableOpacity 
              style={[styles.secondaryButton, SHADOWS.small]} 
              onPress={addMark}
            >
              <Text style={styles.secondaryButtonText}>Marca</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            activeOpacity={0.8}
            style={[
              styles.button, 
              isRunning ? styles.buttonDanger : styles.buttonPrimary,
              SHADOWS.medium,
              { flex: 1 }
            ]}
            onPress={toggle}
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.l,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.xl * 2,
    height: 80,
  },
  title: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  timerContainer: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    color: COLORS.text,
    fontSize: 72,
    fontWeight: '200',
    fontVariant: ['tabular-nums'], 
  },
  marksContainer: {
    flex: 1,
    marginVertical: SPACING.m,
  },
  marksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.s,
  },
  marksTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sortButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortButtonText: {
    color: COLORS.primary, // Usamos el Magenta para indicar que es interactuable
    fontSize: 12,
    fontWeight: '600',
  },
  markItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  markLabel: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  markTime: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  controlsContainer: {
    paddingBottom: SPACING.xl,
  },
  mainButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  button: {
    paddingVertical: SPACING.m,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: { backgroundColor: COLORS.primary },
  buttonDanger: { backgroundColor: COLORS.danger },
  buttonText: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.l,
    borderRadius: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    marginTop: SPACING.l,
    alignSelf: 'center',
  },
  resetText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  }
});