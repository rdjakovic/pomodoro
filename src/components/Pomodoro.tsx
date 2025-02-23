import * as React from "react";
import { Button } from "@/components/ui/button";
import { Settings, RotateCcw } from "lucide-react";
import SettingsComponent from "@/components/Settings";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TimerSettings } from "@/types/timer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TimerDisplay } from "./timer/TimerDisplay";
import { TimerHistory } from "./timer/TimerHistory";
import { ModeSelector } from "./timer/ModeSelector";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const DEFAULT_SETTINGS: TimerSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
};

export default function PomodoroTimer() {
  const [timerSettings, setTimerSettings] = useLocalStorage(
    "pomodoroSettings",
    DEFAULT_SETTINGS
  );
  const [timerMode, setTimerMode] = React.useState<TimerMode>("pomodoro");
  const [isActive, setIsActive] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(timerSettings.pomodoro * 60);
  const [totalTime, setTotalTime] = React.useState(timerSettings.pomodoro * 60);
  const [timerHistory, setTimerHistory] = useLocalStorage(
    "pomodoroHistory",
    [0, 0, 0]
  );
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const handleModeChange = (mode: TimerMode) => {
    setTimerMode(mode);
    setIsActive(false);
    const newTime = timerSettings[mode] * 60;
    setTimeLeft(newTime);
    setTotalTime(newTime);
  };

  const handleSettingsApply = (newSettings: typeof DEFAULT_SETTINGS) => {
    setTimerSettings(newSettings);
    const newTime = newSettings[timerMode] * 60;
    setTimeLeft(newTime);
    setTotalTime(newTime);
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
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

  return (
    <TooltipProvider delayDuration={600}>
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <div className="flex flex-col items-center gap-8">
          <ModeSelector
            timerMode={timerMode}
            timerSettings={timerSettings}
            onModeChange={handleModeChange}
          />

          <TimerDisplay
            timeLeft={timeLeft}
            totalTime={totalTime}
            setTimeLeft={setTimeLeft}
            formatTime={formatTime}
          />

          <TimerHistory
            timerHistory={timerHistory}
            setTimerHistory={setTimerHistory}
            formatTime={formatTime}
          />

          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-zinc-300"
                  onClick={handleReset}
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
                  onClick={isActive ? handleStop : handleRun}
                >
                  {isActive ? "Stop" : "Start"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isActive ? "Stop the timer" : "Start the timer"}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-zinc-300"
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
