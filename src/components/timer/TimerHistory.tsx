import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimerHistoryProps {
  timerHistory: number[];
  setTimerHistory: (value: React.SetStateAction<number[]>) => void;
  formatTime: (seconds: number) => string;
}

export function TimerHistory({ timerHistory, setTimerHistory, formatTime }: TimerHistoryProps) {
  return (
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
  );
}