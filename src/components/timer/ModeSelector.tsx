import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TimerSettings } from "@/types/timer";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface ModeSelectorProps {
  timerMode: TimerMode;
  timerSettings: TimerSettings;
  onModeChange: (mode: TimerMode) => void;
}

export function ModeSelector({
  timerMode,
  timerSettings,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <div className="flex gap-2">
      {[
        {
          mode: "pomodoro" as const,
          label: "Pomodoro",
          duration: timerSettings.pomodoro,
        },
        {
          mode: "shortBreak" as const,
          label: "Short Break",
          duration: timerSettings.shortBreak,
        },
        {
          mode: "longBreak" as const,
          label: "Long Break",
          duration: timerSettings.longBreak,
        },
      ].map(({ mode, label, duration }) => (
        <Tooltip key={mode}>
          <TooltipTrigger asChild>
            <Button
              variant={timerMode === mode ? "default" : "ghost"}
              className={`${
                timerMode === mode
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                  : "text-zinc-600 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
              }`}
              onClick={() => onModeChange(mode)}
            >
              {label}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {mode === "pomodoro"
                ? "Focus session"
                : mode === "shortBreak"
                ? "Short break"
                : "Long break"}{" "}
              ({duration} minutes)
            </p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
