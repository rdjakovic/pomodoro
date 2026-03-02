import * as React from "react";
import { Button } from "@/components/ui/button";
import { Settings, RotateCcw } from "lucide-react";
import SettingsComponent from "@/components/Settings";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSequenceTimer } from "@/hooks/useSequenceTimer";
import { TimerSettings, Sequence, SequenceSettings } from "@/types/timer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TimerDisplay } from "./timer/TimerDisplay";
import { TimerHistory } from "./timer/TimerHistory";
import { ModeSelector } from "./timer/ModeSelector";
import timerDoneSound from "@/assets/timer-done.mp3";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const PHASE_LABELS: Record<string, string> = {
  pomodoro: "Pomodoro",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

const DEFAULT_SEQUENCE_SETTINGS: SequenceSettings = {
  sequences: [],
  activeSequenceId: null,
  sequenceModeEnabled: false,
  totalSequenceTime: 0,
};

const DEFAULT_SETTINGS: TimerSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  theme: "dark",
  soundEnabled: true,
  sequenceSettings: DEFAULT_SEQUENCE_SETTINGS,
};

export default function PomodoroTimer() {
  const [timerSettings, setTimerSettings] = useLocalStorage(
    "pomodoroSettings",
    DEFAULT_SETTINGS
  );
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Initialize audio element for manual mode
  React.useEffect(() => {
    audioRef.current = new Audio(timerDoneSound);
  }, []);

  // Apply theme to document
  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(timerSettings.theme);
  }, [timerSettings.theme]);

  // --- Manual mode state ---
  const [timerMode, setTimerMode] = React.useState<TimerMode>("pomodoro");
  const [isActive, setIsActive] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(timerSettings.pomodoro * 60);
  const [totalTime, setTotalTime] = React.useState(timerSettings.pomodoro * 60);
  const [timerHistory, setTimerHistory] = useLocalStorage("pomodoroHistory", [0, 0, 0]);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  // --- Sequence mode state ---
  const sequenceSettings = timerSettings.sequenceSettings ?? DEFAULT_SEQUENCE_SETTINGS;
  const isSequenceMode = sequenceSettings.sequenceModeEnabled;
  const activeSequence: Sequence | null =
    sequenceSettings.sequences.find((s) => s.id === sequenceSettings.activeSequenceId) ?? null;

  const sequenceTimer = useSequenceTimer(
    activeSequence,
    sequenceSettings.totalSequenceTime,
    timerSettings.soundEnabled ?? true
  );

  const activeSequenceIndex = activeSequence
    ? sequenceSettings.sequences.findIndex((s) => s.id === activeSequence.id) + 1
    : null;

  // --- Sequence mode toggle ---
  const toggleSequenceMode = () => {
    if (!activeSequence) return; // can't enable without a sequence
    setTimerSettings((prev) => ({
      ...prev,
      sequenceSettings: {
        ...(prev.sequenceSettings ?? DEFAULT_SEQUENCE_SETTINGS),
        sequenceModeEnabled: !isSequenceMode,
      },
    }));
    // Stop whichever mode is running
    if (isSequenceMode) {
      sequenceTimer.reset();
    } else {
      setIsActive(false);
    }
  };

  // --- Manual mode timer ---
  const playNotificationSound = () => {
    if (audioRef.current && timerSettings.soundEnabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.warn("Audio playback failed:", error);
      });
    }
  };

  const handleModeChange = (mode: TimerMode) => {
    setTimerMode(mode);
    setIsActive(false);
    const newTime = timerSettings[mode] * 60;
    setTimeLeft(newTime);
    setTotalTime(newTime);
  };

  const handleSettingsApply = (newSettings: TimerSettings) => {
    setTimerSettings(newSettings);
    const newTime = newSettings[timerMode] * 60;
    setTimeLeft(newTime);
    setTotalTime(newTime);
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            playNotificationSound();
            setIsActive(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleStop = () => {
    setIsActive(false);
    setTimerHistory((prev) => {
      const newHistory = [timeLeft, ...prev.slice(0, 2)];
      return newHistory;
    });
  };

  const handleReset = () => {
    setIsActive(false);
    const newTime = timerSettings[timerMode] * 60;
    setTimeLeft(newTime);
    setTotalTime(newTime);
  };

  const handleRun = () => {
    setIsActive(true);
  };

  // Derived booleans for the current active state (sequence or manual)
  const anyTimerActive = isSequenceMode ? sequenceTimer.isActive : isActive;

  return (
    <TooltipProvider delayDuration={600}>
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-8">

          {/* Sequence mode toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Sequence</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSequenceMode}
                  disabled={!activeSequence}
                  aria-label={isSequenceMode ? "Disable sequence mode" : "Enable sequence mode"}
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed ${
                    isSequenceMode ? "bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-600"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                      isSequenceMode ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {activeSequence
                    ? isSequenceMode
                      ? "Switch to manual mode"
                      : "Switch to sequence mode"
                    : "Add a sequence in Settings first"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Mode selector (manual only) */}
          {!isSequenceMode && (
            <ModeSelector
              timerMode={timerMode}
              timerSettings={timerSettings}
              onModeChange={handleModeChange}
            />
          )}

          {/* Phase label (sequence mode only) */}
          {isSequenceMode && (
            <div className="text-sm font-medium text-indigo-500">
              {PHASE_LABELS[sequenceTimer.currentPhase]}
            </div>
          )}

          <TimerDisplay
            timeLeft={isSequenceMode ? sequenceTimer.phaseTimeLeft : timeLeft}
            totalTime={isSequenceMode ? sequenceTimer.phaseTotalTime : totalTime}
            setTimeLeft={setTimeLeft}
            formatTime={formatTime}
            readonly={isSequenceMode}
          />

          <TimerHistory
            timerHistory={timerHistory}
            setTimerHistory={setTimerHistory}
            formatTime={formatTime}
          />

          {/* Controls */}
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300"
                  onClick={isSequenceMode ? sequenceTimer.reset : handleReset}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset timer</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-24 bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={
                    isSequenceMode
                      ? anyTimerActive
                        ? sequenceTimer.stop
                        : sequenceTimer.start
                      : anyTimerActive
                      ? handleStop
                      : handleRun
                  }
                >
                  {anyTimerActive ? "Stop" : "Start"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{anyTimerActive ? "Stop the timer" : "Start the timer"}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open settings</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Active sequence info */}
          {isSequenceMode && activeSequence && (
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Sequence #{activeSequenceIndex}:{" "}
                <span className="text-zinc-600 dark:text-zinc-400">
                  {activeSequence.pomodoro}m / {activeSequence.shortBreak}m
                  {activeSequence.longBreak > 0 && ` / ${activeSequence.longBreak}m`}
                </span>
              </p>
              {sequenceSettings.totalSequenceTime > 0 && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Elapsed:{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {formatTime(sequenceTimer.totalElapsedSeconds)}
                  </span>{" "}
                  / {sequenceSettings.totalSequenceTime}m
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <SettingsComponent
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialValues={timerSettings}
        onApply={handleSettingsApply}
      />
    </TooltipProvider>
  );
}
