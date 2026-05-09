// src/hooks/useTimer.ts
import { useState, useRef, useCallback } from 'react';

// Definimos la interfaz para nuestras marcas
export interface Mark {
  id: number;
  time: number;
}

export const useTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [marks, setMarks] = useState<Mark[]>([]); // Ahora es un arreglo de objetos

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const markIdCounterRef = useRef<number>(1); // Contador para los IDs de las marcas

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const timePassedThisSession = now - startTimeRef.current;
      setTime(accumulatedTimeRef.current + timePassedThisSession);
    }, 30);
  }, [isRunning]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    accumulatedTimeRef.current += Date.now() - startTimeRef.current;
  }, [isRunning]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
    setMarks([]);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
    markIdCounterRef.current = 1; // Reiniciamos el contador de IDs
  }, []);

  const addMark = useCallback(() => {
    // Agregamos un objeto con su ID único
    setMarks(prev => [
      { id: markIdCounterRef.current++, time }, 
      ...prev
    ]);
  }, [time]);

  const toggle = useCallback(() => {
    isRunning ? pause() : start();
  }, [isRunning, start, pause]);

  return {
    time,
    isRunning,
    marks,
    addMark,
    reset,
    toggle
  };
};