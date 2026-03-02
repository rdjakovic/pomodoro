import { useState, useEffect, useCallback } from "react";
import { TimerSettings } from "@/types/timer";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface UseManualTimerProps {
  timerSettings: TimerSettings;
  onTimerDone?: () => void;
  onStopped?: (timeLeft: number) => void;
}

interface UseManualTimerReturn {
  isActive: boolean;
  timerMode: TimerMode;
  timeLeft: number;
  totalTime: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
  changeMode: (mode: TimerMode) => void;
}

export function useManualTimer({
  timerSettings,
  onTimerDone,
  onStopped,
}: UseManualTimerProps): UseManualTimerReturn {
  const [timerMode, setTimerMode] = useState<TimerMode>("pomodoro");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerSettings.pomodoro * 60);
  const [totalTime, setTotalTime] = useState(timerSettings.pomodoro * 60);

  // Update timer when settings change (if not actively running)
  useEffect(() => {
    if (!isActive) {
      const newTime = timerSettings[timerMode] * 60;
      setTimeLeft(newTime);
      setTotalTime(newTime);
    }
  }, [timerSettings, timerMode, isActive]);

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            onTimerDone?.();
            setIsActive(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimerDone]);

  const changeMode = useCallback(
    (mode: TimerMode) => {
      setTimerMode(mode);
      setIsActive(false);
      const newTime = timerSettings[mode] * 60;
      setTimeLeft(newTime);
      setTotalTime(newTime);
    },
    [timerSettings]
  );

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    setTimeLeft((current) => {
      onStopped?.(current);
      return current;
    });
  }, [onStopped]);

  const reset = useCallback(() => {
    setIsActive(false);
    const newTime = timerSettings[timerMode] * 60;
    setTimeLeft(newTime);
    setTotalTime(newTime);
  }, [timerSettings, timerMode]);

  return {
    isActive,
    timerMode,
    timeLeft,
    totalTime,
    start,
    stop,
    reset,
    changeMode,
  };
}
