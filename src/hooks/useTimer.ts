// src/hooks/useTimer.ts
import { useState, useRef, useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';

export interface Mark {
  id: number;
  time: number;
}

export type TimerMode = 'stopwatch' | 'timer';

export const useTimer = () => {
  const [mode, setMode] = useState<TimerMode>('stopwatch');
  const [time, setTime] = useState(0); 
  const [initialTime, setInitialTime] = useState(0); // Tiempo desde el que arranca la bajada
  const [isRunning, setIsRunning] = useState(false);
  const [marks, setMarks] = useState<Mark[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const markIdCounterRef = useRef<number>(1);
  const appState = useRef(AppState.currentState);
  const notificationIdRef = useRef<string | null>(null);

  const cancelNotification = async () => {
    const id = notificationIdRef.current;
    if (id) {
      notificationIdRef.current = null; // Limpiar antes de cancelar para evitar race conditions
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch (e) { }
    }
  };

  const scheduleNotification = async (delayMs: number) => {
    await cancelNotification();
    
    // Solo programar si el delay es mayor a 0
    if (delayMs > 0) {
      // Android maneja mejor los enteros para los triggers de tiempo
      const seconds = Math.max(1, Math.round(delayMs / 1000));
      
      try {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: "¡Tiempo terminado! ⏱️",
            body: "Tu temporizador ha llegado a cero.",
            sound: true,
            // Vinculamos explícitamente el canal que creamos en App.tsx
            //@ts-ignore
            android: { channelId: 'default' },
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds },
        });
        // Asegurarnos de que no hayamos cancelado mientras se programaba
        if (id) {
          notificationIdRef.current = id;
        }
      } catch (e) {
        console.warn("Error scheduling notification", e);
      }
    }
  };

  const start = useCallback(() => {
    if (isRunning) return;
    // Evitar que el temporizador inicie si está en 0
    if (mode === 'timer' && time <= 0) return; 

    // Feedback táctil al iniciar
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setIsRunning(true);
    startTimeRef.current = Date.now();

    if (mode === 'timer') {
      const remaining = initialTime - accumulatedTimeRef.current;
      scheduleNotification(remaining);
    }

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const timePassedThisSession = now - startTimeRef.current;
      const totalElapsed = accumulatedTimeRef.current + timePassedThisSession;

      if (mode === 'stopwatch') {
        setTime(totalElapsed);
      } else {
        // Modo Temporizador (Bajada)
        const remaining = initialTime - totalElapsed;
        if (remaining <= 0) {
          setTime(0);
          setIsRunning(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          accumulatedTimeRef.current = initialTime;
          // Vibración fuerte cuando el temporizador llega a cero
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          setTime(remaining);
        }
      }
    }, 30);
  }, [isRunning, mode, initialTime, time]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    
    // Feedback táctil al pausar
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    accumulatedTimeRef.current += Date.now() - startTimeRef.current;
    
    if (mode === 'timer') cancelNotification();
  }, [isRunning, mode]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
    setInitialTime(0);
    setMarks([]);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
    markIdCounterRef.current = 1;
    cancelNotification();
  }, []);

  // Cambiar entre cronómetro y temporizador
  const switchMode = useCallback((newMode: TimerMode) => {
    if (isRunning) pause();
    setMode(newMode);
    setTime(0);
    setInitialTime(0);
    setMarks([]);
    accumulatedTimeRef.current = 0;
    cancelNotification();
  }, [isRunning, pause]);

  // Establecer un tiempo para el temporizador (ej. 30000 para 30s)
  const setCountdownTime = useCallback((ms: number) => {
    if (isRunning) pause();
    setInitialTime(ms);
    setTime(ms);
    accumulatedTimeRef.current = 0;
  }, [isRunning, pause]);

  const addMark = useCallback(() => {
    if (mode === 'timer') return; // Normalmente no se usan marcas en cuenta regresiva
    
    // Feedback táctil al registrar una marca
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setMarks(prev => [{ id: markIdCounterRef.current++, time }, ...prev]);
  }, [time, mode]);

  const toggle = useCallback(() => {
    isRunning ? pause() : start();
  }, [isRunning, start, pause]);

  // Sincronización con el sistema (Resiliencia)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App volvió al primer plano. Si estaba corriendo, forzamos actualización inmediata.
        if (isRunning) {
          const now = Date.now();
          const timePassedThisSession = now - startTimeRef.current;
          const totalElapsed = accumulatedTimeRef.current + timePassedThisSession;

          if (mode === 'stopwatch') {
            setTime(totalElapsed);
          } else {
            const remaining = initialTime - totalElapsed;
            if (remaining <= 0) {
              setTime(0);
              setIsRunning(false);
              if (intervalRef.current) clearInterval(intervalRef.current);
              accumulatedTimeRef.current = initialTime;
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
              setTime(remaining);
            }
          }
        }
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [isRunning, mode, initialTime]);

  // Variable derivada para ocultar la complejidad del cálculo a la UI
  const elapsedTime = mode === 'stopwatch' ? time : initialTime - time;

  return {
    time,
    elapsedTime,
    initialTime,
    mode,
    isRunning,
    marks,
    switchMode,
    setCountdownTime,
    addMark,
    reset,
    toggle
  };
};