// src/hooks/useTimer.ts
import { useState, useRef, useCallback } from 'react';

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

  const start = useCallback(() => {
    if (isRunning) return;
    // Evitar que el temporizador inicie si está en 0
    if (mode === 'timer' && time <= 0) return; 

    setIsRunning(true);
    startTimeRef.current = Date.now();

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
          // Aquí en el futuro podemos disparar un sonido o vibración
        } else {
          setTime(remaining);
        }
      }
    }, 30);
  }, [isRunning, mode, initialTime, time]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    accumulatedTimeRef.current += Date.now() - startTimeRef.current;
  }, [isRunning]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(mode === 'timer' ? initialTime : 0);
    setMarks([]);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
    markIdCounterRef.current = 1;
  }, [mode, initialTime]);

  // Cambiar entre cronómetro y temporizador
  const switchMode = useCallback((newMode: TimerMode) => {
    if (isRunning) pause();
    setMode(newMode);
    setTime(0);
    setInitialTime(0);
    setMarks([]);
    accumulatedTimeRef.current = 0;
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
    setMarks(prev => [{ id: markIdCounterRef.current++, time }, ...prev]);
  }, [time, mode]);

  const toggle = useCallback(() => {
    isRunning ? pause() : start();
  }, [isRunning, start, pause]);

  return {
    time,
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