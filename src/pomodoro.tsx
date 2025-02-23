import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Settings } from "lucide-react";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const MINUTES_INC_DEC = 5;

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [isActive, setIsActive] = React.useState(true);
  const [timerHistory, setTimerHistory] = React.useState<number[]>([0, 0, 0]);
  const [timerMode, setTimerMode] = React.useState<TimerMode>("pomodoro");

  const handleModeChange = (mode: TimerMode) => {
    setTimerMode(mode);
    setIsActive(false);
    switch (mode) {
      case "pomodoro":
        setTimeLeft(25 * 60);
        break;
      case "shortBreak":
        setTimeLeft(5 * 60);
        break;
      case "longBreak":
        setTimeLeft(15 * 60);
        break;
    }
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

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;
  const handleStop = () => {
    setIsActive(false);
    setTimerHistory((prev) => {
      const newHistory = [timeLeft, ...prev.slice(0, 2)];
      return newHistory;
    });
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const handleRun = () => {
    setIsActive(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900">
      <div className="flex flex-col items-center gap-8">
        {/* Mode selection buttons */}
        <div className="flex gap-2">
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
                <Button
                  variant="ghost"
                  className="text-zinc-400 hover:text-zinc-300 text-2xl font-bold h-8 w-8 p-0"
                  onClick={() =>
                    setTimeLeft((prev) =>
                      Math.max(60, prev - MINUTES_INC_DEC * 60)
                    )
                  }
                >
                  -
                </Button>
                <span className="text-5xl font-medium text-white">
                  {formatTime(timeLeft)}
                </span>
                <Button
                  variant="ghost"
                  className="text-zinc-400 hover:text-zinc-300 text-2xl font-bold h-8 w-8 p-0"
                  onClick={() =>
                    setTimeLeft((prev) =>
                      Math.min(3600, prev + MINUTES_INC_DEC * 60)
                    )
                  }
                >
                  +
                </Button>
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
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-zinc-300 w-full flex items-center justify-center"
              onClick={() => setTimerHistory([0, 0, 0])}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-300"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            className="w-24 bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={isActive ? handleStop : handleRun}
          >
            {isActive ? "Stop" : "Start"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-300"
            onClick={() => {
              /* Add your settings logic here */
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
