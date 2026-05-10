import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerMode, Mark } from './useTimer';

export interface TimerSession {
  id: string;
  date: number; // Fecha en milisegundos (Date.now())
  mode: TimerMode;
  duration: number; // Tiempo total registrado
  marks: Mark[];
}

interface HistoryContextData {
  sessions: TimerSession[];
  saveSession: (mode: TimerMode, duration: number, marks: Mark[]) => void;
  clearHistory: () => void;
}

const HISTORY_KEY = '@time_tracker_history';
const HistoryContext = createContext<HistoryContextData>({} as HistoryContextData);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<TimerSession[]>([]);

  // Cargar historial al iniciar
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(HISTORY_KEY);
        if (storedHistory) setSessions(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Error cargando historial", e);
      }
    };
    loadHistory();
  }, []);

  // Guardar nueva sesión
  const saveSession = async (mode: TimerMode, duration: number, marks: Mark[]) => {
    const newSession: TimerSession = {
      id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      date: Date.now(),
      mode,
      duration,
      marks,
    };

    // Agregamos la nueva sesión al principio del arreglo
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);

    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedSessions));
    } catch (e) {
      console.error("Error guardando sesión", e);
    }
  };

  // Limpiar historial
  const clearHistory = async () => {
    setSessions([]);
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error("Error limpiando historial", e);
    }
  };

  return (
    <HistoryContext.Provider value={{ sessions, saveSession, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);