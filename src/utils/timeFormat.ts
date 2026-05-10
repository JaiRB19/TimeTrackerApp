export const formatTime = (timeInMs: number, showMs: boolean = true): string => {
  const totalSeconds = Math.floor(timeInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((timeInMs % 1000) / 10);

  const pad = (num: number) => num.toString().padStart(2, '0');

  if (!showMs) {
    return `${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
};