import * as React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Timer } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function StopWatch() {
  const [isActive, setIsActive] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [laps, setLaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
    setLaps((prev) => [time, ...prev.slice(0, 2)]);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps((prev) => [time, ...prev]);
  };

  return (
    <TooltipProvider delayDuration={600}>
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            StopWatch
          </h2>

          <div className="relative size-64">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_270deg,rgba(38,38,38,0.4)_0%,rgba(38,38,38,0.1)_100%)] dark:bg-[conic-gradient(from_270deg,rgba(250,250,250,0.4)_0%,rgba(250,250,250,0.1)_100%)]" />
            <div className="absolute inset-2 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-4">
                <span
                  className="text-5xl font-medium text-zinc-900 dark:text-white"
                  data-testid="stopwatch-display"
                >
                  {formatTime(time)}
                </span>
              </div>
            </div>
          </div>

          {laps.length > 0 && (
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                Laps
              </h3>
              <div className="flex gap-4">
                {laps.slice(0, 3).map((lap, index) => (
                  <div
                    key={index}
                    className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800"
                  >
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">
                      {formatTime(lap)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300"
                  onClick={handleReset}
                  data-testid="reset-button"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset stopwatch</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-24 bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={isActive ? handleStop : handleStart}
                  data-testid="start-stop-button"
                >
                  {isActive ? "Stop" : "Start"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isActive ? "Stop the stopwatch" : "Start the stopwatch"}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300"
                  onClick={handleLap}
                  disabled={!isActive}
                  data-testid="lap-button"
                >
                  <Timer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Record lap</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
