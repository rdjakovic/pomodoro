import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Settings } from "lucide-react";
import SettingsComponent from "@/components/Settings";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TimerSettings } from "@/types/timer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const MINUTES_INC_DEC = 5;

const DEFAULT_SETTINGS: TimerSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
};

const getTimeAdjustment = (currentTime: number) => {
  // Convert current time from seconds to minutes
  const timeLeftMinutes = Math.floor(currentTime / 60);
  // Return adjustment in seconds
  return timeLeftMinutes > 10 ? MINUTES_INC_DEC * 60 : 60;
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
    // Update current timer if needed
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

  const progress = ((totalTime - timeLeft) / totalTime) * 100;
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
    <TooltipProvider delayDuration={500}>
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <div className="flex flex-col items-center gap-8">
          {/* Mode selection buttons */}
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={timerMode === "pomodoro" ? "default" : "ghost"}
                  className={`${
                    timerMode === "pomodoro"
                      ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                      : "text-zinc-400 hover:text-zinc-300"
                  }`}
                  onClick={() => handleModeChange("pomodoro")}
                >
                  Pomodoro
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Focus session ({timerSettings.pomodoro} minutes)</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={timerMode === "shortBreak" ? "default" : "ghost"}
                  className={`${
                    timerMode === "shortBreak"
                      ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                      : "text-zinc-400 hover:text-zinc-300"
                  }`}
                  onClick={() => handleModeChange("shortBreak")}
                >
                  Short Break
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Short break ({timerSettings.shortBreak} minutes)</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={timerMode === "longBreak" ? "default" : "ghost"}
                  className={`${
                    timerMode === "longBreak"
                      ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                      : "text-zinc-400 hover:text-zinc-300"
                  }`}
                  onClick={() => handleModeChange("longBreak")}
                >
                  Long Break
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Long break ({timerSettings.longBreak} minutes)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative size-64">
              {/* Background gradient circle */}
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_270deg,rgba(38,38,38,0.4)_0%,rgba(38,38,38,0.1)_100%)]" />
              {/* Progress circle */}
              <motion.div
                className="absolute inset-0 origin-center rounded-full"
                style={{
                  background: `conic-gradient(from 0deg,
                    rgba(99, 102, 241, 0) 0%,
                    rgba(99, 102, 241, 0.8) ${progress * 0.9}%,
                    rgb(99, 102, 241) ${progress}%,
                    transparent ${progress}%,
                    transparent 100%)`,
                }}
                initial={false}
                animate={{ rotate: 270 }}
                transition={{ duration: 0.5, type: "spring" }}
              />
              {/* Center content */}
              <div className="absolute inset-2 flex items-center justify-center rounded-full bg-zinc-900">
                <div className="flex items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-zinc-400 hover:text-zinc-300 text-2xl font-bold h-8 w-8 p-0"
                        onClick={() =>
                          setTimeLeft((prev) => {
                            const adjustment = getTimeAdjustment(prev);
                            return Math.max(60, prev - adjustment);
                          })
                        }
                      >
                        -
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Decrease time by {timeLeft > 600 ? MINUTES_INC_DEC : 1}{" "}
                        minute
                        {timeLeft > 600 ? "s" : ""}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-5xl font-medium text-white">
                    {formatTime(timeLeft)}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-zinc-400 hover:text-zinc-300 text-2xl font-bold h-8 w-8 p-0"
                        onClick={() =>
                          setTimeLeft((prev) => {
                            const adjustment = getTimeAdjustment(prev);
                            return Math.min(3600, prev + adjustment);
                          })
                        }
                      >
                        +
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Increase time by {timeLeft > 600 ? MINUTES_INC_DEC : 1}{" "}
                        minute
                        {timeLeft > 600 ? "s" : ""}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full max-w-md px-4">
            <div className="w-24 flex items-center"></div>
            <div className="flex flex-col items-center">
              {timerHistory.map((time, index) => (
                <motion.div
                  key={`${time}-${index}`}
                  className={`text-lg font-medium ${
                    index === 0 ? "text-green-400" : "text-zinc-400"
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 1,
                  }}
                >
                  {formatTime(time) + `.${String(time % 100).padStart(2, "0")}`}
                </motion.div>
              ))}
            </div>
            <div className="w-24 flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-zinc-400 hover:text-zinc-300 w-full flex items-center justify-center"
                    onClick={() => setTimerHistory([0, 0, 0])}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear timer history</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

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
