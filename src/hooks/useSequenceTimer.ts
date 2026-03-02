import { useState, useEffect, useRef, useCallback } from "react";
import { Sequence } from "@/types/timer";
import {
  playPomodoroEnd,
  playShortBreakEnd,
  playLongBreakEnd,
  playSequenceEnd,
} from "@/lib/sounds";

export type SequencePhase = "pomodoro" | "shortBreak" | "longBreak";

function getNextPhase(current: SequencePhase, sequence: Sequence): SequencePhase {
  if (current === "pomodoro") return "shortBreak";
  if (current === "shortBreak") return sequence.longBreak > 0 ? "longBreak" : "pomodoro";
  return "pomodoro";
}

function getPhaseDurationSeconds(phase: SequencePhase, sequence: Sequence): number {
  return sequence[phase] * 60;
}

interface UseSequenceTimerReturn {
  isActive: boolean;
  currentPhase: SequencePhase;
  phaseTimeLeft: number;
  phaseTotalTime: number;
  totalElapsedSeconds: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSequenceTimer(
  sequence: Sequence | null,
  totalSequenceTimeMinutes: number,
  soundEnabled: boolean
): UseSequenceTimerReturn {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<SequencePhase>("pomodoro");
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [phaseTotalTime, setPhaseTotalTime] = useState(0);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);

  // Mutable refs for interval callback to avoid stale closures
  const phaseTimeLeftRef = useRef(0);
  const currentPhaseRef = useRef<SequencePhase>("pomodoro");
  const totalElapsedRef = useRef(0);
  const sequenceRef = useRef(sequence);
  const soundEnabledRef = useRef(soundEnabled);
  const totalLimitRef = useRef(totalSequenceTimeMinutes * 60);
  const isActiveRef = useRef(false);

  // Keep refs in sync with props
  sequenceRef.current = sequence;
  soundEnabledRef.current = soundEnabled;
  totalLimitRef.current = totalSequenceTimeMinutes * 60;

  // When the active sequence changes while not running, reset display
  useEffect(() => {
    if (isActive) return;
    if (sequence) {
      const duration = sequence.pomodoro * 60;
      currentPhaseRef.current = "pomodoro";
      phaseTimeLeftRef.current = duration;
      totalElapsedRef.current = 0;
      setCurrentPhase("pomodoro");
      setPhaseTimeLeft(duration);
      setPhaseTotalTime(duration);
      setTotalElapsedSeconds(0);
    } else {
      setPhaseTimeLeft(0);
      setPhaseTotalTime(0);
    }
  }, [sequence, isActive]);

  useEffect(() => {
    if (!isActive || !sequenceRef.current) return;

    isActiveRef.current = true;

    const interval = setInterval(() => {
      if (!isActiveRef.current || !sequenceRef.current) return;

      // Tick: decrement phase time and increment total elapsed
      phaseTimeLeftRef.current -= 1;
      totalElapsedRef.current += 1;

      const newPhaseTime = phaseTimeLeftRef.current;
      const newTotalElapsed = totalElapsedRef.current;

      setPhaseTimeLeft(newPhaseTime);
      setTotalElapsedSeconds(newTotalElapsed);

      // Check total sequence time limit
      const limit = totalLimitRef.current;
      if (limit > 0 && newTotalElapsed >= limit) {
        if (soundEnabledRef.current) playSequenceEnd();
        isActiveRef.current = false;
        setIsActive(false);
        return;
      }

      // Check if current phase is done
      if (newPhaseTime <= 0) {
        const seq = sequenceRef.current;
        if (!seq) return;

        const curPhase = currentPhaseRef.current;

        // Play phase-end sound
        if (soundEnabledRef.current) {
          if (curPhase === "pomodoro") playPomodoroEnd();
          else if (curPhase === "shortBreak") playShortBreakEnd();
          else playLongBreakEnd();
        }

        // Advance to next phase
        const nextPhase = getNextPhase(curPhase, seq);
        const nextDuration = getPhaseDurationSeconds(nextPhase, seq);

        currentPhaseRef.current = nextPhase;
        phaseTimeLeftRef.current = nextDuration;

        setCurrentPhase(nextPhase);
        setPhaseTimeLeft(nextDuration);
        setPhaseTotalTime(nextDuration);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      isActiveRef.current = false;
    };
  }, [isActive]);

  const start = useCallback(() => {
    const seq = sequenceRef.current;
    if (!seq) return;

    const duration = seq.pomodoro * 60;
    currentPhaseRef.current = "pomodoro";
    phaseTimeLeftRef.current = duration;
    totalElapsedRef.current = 0;

    setCurrentPhase("pomodoro");
    setPhaseTimeLeft(duration);
    setPhaseTotalTime(duration);
    setTotalElapsedSeconds(0);
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    const seq = sequenceRef.current;
    if (seq) {
      const duration = seq.pomodoro * 60;
      currentPhaseRef.current = "pomodoro";
      phaseTimeLeftRef.current = duration;
      totalElapsedRef.current = 0;

      setCurrentPhase("pomodoro");
      setPhaseTimeLeft(duration);
      setPhaseTotalTime(duration);
      setTotalElapsedSeconds(0);
    }
  }, []);

  return {
    isActive,
    currentPhase,
    phaseTimeLeft,
    phaseTotalTime,
    totalElapsedSeconds,
    start,
    stop,
    reset,
  };
}
