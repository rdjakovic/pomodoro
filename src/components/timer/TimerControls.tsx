import { Button } from "@/components/ui/button";
import { Settings, RotateCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimerControlsProps {
  isActive: boolean;
  onReset: () => void;
  onStartStop: () => void;
  onSettings: () => void;
}

export function TimerControls({
  isActive,
  onReset,
  onStartStop,
  onSettings,
}: TimerControlsProps) {
  return (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={onReset}
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
            onClick={onStartStop}
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
            className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={onSettings}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Open settings</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
