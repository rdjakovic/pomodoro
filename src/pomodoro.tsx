import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [isActive, setIsActive] = React.useState(true);
  const [isPaused, setIsPaused] = React.useState(false);
  const [timerHistory, setTimerHistory] = React.useState<number[]>([]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    // Add current time to history before reset
    setTimerHistory((prev) => [timeLeft, ...prev.slice(0, 2)]);
    setTimeLeft(25 * 60);
  };

  const handleRun = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900">
      <div className="flex flex-col items-center gap-8">
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
            <span className="text-5xl font-medium text-white">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          {timerHistory.map((time, index) => (
            <div key={index} className="text-zinc-400 text-lg font-medium">
              {formatTime(time) + `.${String(time % 100).padStart(2, "0")}`}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            className="w-24 bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={isActive ? handleStop : handleRun}
          >
            {isActive ? "Reset" : "Run"}
          </Button>
          <Button
            className="w-24 bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={handlePause}
            disabled={!isActive}
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>
      </div>
    </div>
  );
}
