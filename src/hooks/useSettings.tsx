import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface SettingsContextData {
  keepAwake: boolean;
  toggleKeepAwake: (value: boolean) => void;
  showMs: boolean;
  toggleShowMs: (value: boolean) => void;
  isLoading: boolean; // Útil para no mostrar la UI hasta que carguen los ajustes
}

const STORAGE_KEY = '@time_tracker_settings';
const SettingsContext = createContext<SettingsContextData>({} as SettingsContextData);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [keepAwake, setKeepAwake] = useState(false); // Desactivado por defecto
  const [showMs, setShowMs] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Cargar ajustes al montar el componente
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedSettings) {
          const { keepAwake: savedKeepAwake, showMs: savedShowMs } = JSON.parse(savedSettings);
          setKeepAwake(savedKeepAwake);
          setShowMs(savedShowMs);
        }
      } catch (e) {
        console.error("Error cargando ajustes", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // 2. Guardar ajustes cada vez que cambien
  useEffect(() => {
    const saveSettings = async () => {
      if (isLoading) return; // No guardar mientras se está cargando el estado inicial
      try {
        const settings = JSON.stringify({ keepAwake, showMs });
        await AsyncStorage.setItem(STORAGE_KEY, settings);
      } catch (e) {
        console.error("Error guardando ajustes", e);
      }
    };

    saveSettings();
  }, [keepAwake, showMs, isLoading]);

  // 3. Manejo del hardware (Keep Awake) - CORREGIDO PARA WEB
  useEffect(() => {
    const handleKeepAwake = async () => {
      try {
        if (keepAwake) {
          await activateKeepAwakeAsync();
        } else {
          await deactivateKeepAwake();
        }
      } catch (error) {
        // Silenciamos el error en Web para que no rompa la app
        if (Platform.OS !== 'web') {
          console.warn("KeepAwake no disponible:", error);
        }
      }
    };

    handleKeepAwake();
  }, [keepAwake]);

  const toggleKeepAwake = (value: boolean) => setKeepAwake(value);
  const toggleShowMs = (value: boolean) => setShowMs(value);

  return (
    <SettingsContext.Provider value={{ keepAwake, toggleKeepAwake, showMs, toggleShowMs, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);