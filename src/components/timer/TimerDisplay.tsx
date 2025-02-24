import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
  setTimeLeft: (value: React.SetStateAction<number>) => void;
  formatTime: (seconds: number) => string;
}

const MINUTES_INC_DEC = 5;

const getTimeAdjustment = (currentTime: number) => {
  const timeLeftMinutes = Math.floor(currentTime / 60);
  return timeLeftMinutes > 10 ? MINUTES_INC_DEC * 60 : 60;
};

export function TimerDisplay({
  timeLeft,
  totalTime,
  setTimeLeft,
  formatTime,
}: TimerDisplayProps) {
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="relative size-64">
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_270deg,rgba(38,38,38,0.4)_0%,rgba(38,38,38,0.1)_100%)] dark:bg-[conic-gradient(from_270deg,rgba(250,250,250,0.4)_0%,rgba(250,250,250,0.1)_100%)]" />
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
      <div className="absolute inset-2 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 text-2xl font-bold h-8 w-8 p-0"
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
                Decrease time by {timeLeft > 600 ? MINUTES_INC_DEC : 1} minute
                {timeLeft > 600 ? "s" : ""}
              </p>
            </TooltipContent>
          </Tooltip>
          <span className="text-5xl font-medium text-zinc-900 dark:text-white">
            {formatTime(timeLeft)}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 text-2xl font-bold h-8 w-8 p-0"
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
                Increase time by {timeLeft > 600 ? MINUTES_INC_DEC : 1} minute
                {timeLeft > 600 ? "s" : ""}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
