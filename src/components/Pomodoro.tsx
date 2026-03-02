import * as React from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useManualTimer } from "@/hooks/useManualTimer";
import { useSequenceTimer } from "@/hooks/useSequenceTimer";
import { TimerSettings, Sequence, SequenceSettings } from "@/types/timer";
import { formatTime } from "@/lib/format";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import SettingsComponent from "@/components/Settings";
import { TimerDisplay } from "./timer/TimerDisplay";
import { TimerHistory } from "./timer/TimerHistory";
import { ModeSelector } from "./timer/ModeSelector";
import { SequenceToggle } from "./timer/SequenceToggle";
import { TimerControls } from "./timer/TimerControls";
import { SequenceInfo } from "./timer/SequenceInfo";
import timerDoneSound from "@/assets/timer-done.mp3";

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
  const [timerHistory, setTimerHistory] = useLocalStorage("pomodoroHistory", [0, 0, 0]);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  React.useEffect(() => {
    audioRef.current = new Audio(timerDoneSound);
  }, []);

  // Apply theme
  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(timerSettings.theme);
  }, [timerSettings.theme]);

  // Sequence mode state
  const sequenceSettings = timerSettings.sequenceSettings ?? DEFAULT_SEQUENCE_SETTINGS;
  const isSequenceMode = sequenceSettings.sequenceModeEnabled;
  const activeSequence: Sequence | null =
    sequenceSettings.sequences.find((s) => s.id === sequenceSettings.activeSequenceId) ?? null;
  const activeSequenceIndex = activeSequence
    ? sequenceSettings.sequences.findIndex((s) => s.id === activeSequence.id) + 1
    : null;

  // Manual timer
  const playNotificationSound = () => {
    if (audioRef.current && timerSettings.soundEnabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.warn("Audio playback failed:", error);
      });
    }
  };

  const manualTimer = useManualTimer({
    timerSettings,
    onTimerDone: playNotificationSound,
    onStopped: (timeLeft) => {
      setTimerHistory((prev) => [timeLeft, ...prev.slice(0, 2)]);
    },
  });

  // Sequence timer
  const sequenceTimer = useSequenceTimer(
    activeSequence,
    sequenceSettings.totalSequenceTime,
    timerSettings.soundEnabled ?? true
  );

  // Sequence mode toggle
  const toggleSequenceMode = () => {
    if (!activeSequence) return;
    setTimerSettings((prev) => ({
      ...prev,
      sequenceSettings: {
        ...(prev.sequenceSettings ?? DEFAULT_SEQUENCE_SETTINGS),
        sequenceModeEnabled: !isSequenceMode,
      },
    }));
    if (isSequenceMode) {
      sequenceTimer.reset();
    } else {
      manualTimer.stop();
    }
  };

  // Settings
  const handleSettingsApply = (newSettings: TimerSettings) => {
    setTimerSettings(newSettings);
    // The manual timer hook will auto-update its times when timerSettings changes
    // (via useEffect dependency) if the timer is not currently active
  };

  // Derived state
  const anyTimerActive = isSequenceMode ? sequenceTimer.isActive : manualTimer.isActive;

  const timeLeft = isSequenceMode ? sequenceTimer.phaseTimeLeft : manualTimer.timeLeft;
  const totalTime = isSequenceMode ? sequenceTimer.phaseTotalTime : manualTimer.totalTime;

  return (
    <TooltipProvider delayDuration={600}>
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-8">
          {/* Sequence toggle */}
          <SequenceToggle
            isEnabled={isSequenceMode}
            hasActiveSequence={!!activeSequence}
            onToggle={toggleSequenceMode}
          />

          {/* Mode selector (manual only) */}
          {!isSequenceMode && (
            <ModeSelector
              timerMode={manualTimer.timerMode}
              timerSettings={timerSettings}
              onModeChange={manualTimer.changeMode}
            />
          )}

          {/* Phase label (sequence only) */}
          {isSequenceMode && (
            <div className="text-sm font-medium text-indigo-500">
              {PHASE_LABELS[sequenceTimer.currentPhase]}
            </div>
          )}

          {/* Timer display */}
          <TimerDisplay
            timeLeft={timeLeft}
            totalTime={totalTime}
            setTimeLeft={() => {}} // no-op in sequence mode (readonly)
            formatTime={formatTime}
            readonly={isSequenceMode}
          />

          {/* Timer history (manual only) */}
          {!isSequenceMode && (
            <TimerHistory
              timerHistory={timerHistory}
              setTimerHistory={setTimerHistory}
              formatTime={formatTime}
            />
          )}

          {/* Controls */}
          <TimerControls
            isActive={anyTimerActive}
            onReset={isSequenceMode ? sequenceTimer.reset : manualTimer.reset}
            onStartStop={
              isSequenceMode
                ? anyTimerActive
                  ? sequenceTimer.stop
                  : sequenceTimer.start
                : anyTimerActive
                ? manualTimer.stop
                : manualTimer.start
            }
            onSettings={() => setIsSettingsOpen(true)}
          />

          {/* Sequence info (sequence only) */}
          {isSequenceMode && activeSequence && activeSequenceIndex && (
            <SequenceInfo
              sequence={activeSequence}
              sequenceIndex={activeSequenceIndex}
              totalSequenceTime={sequenceSettings.totalSequenceTime}
              elapsedSeconds={sequenceTimer.totalElapsedSeconds}
            />
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
