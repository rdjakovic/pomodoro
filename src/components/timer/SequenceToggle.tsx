import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SequenceToggleProps {
  isEnabled: boolean;
  hasActiveSequence: boolean;
  onToggle: () => void;
}

export function SequenceToggle({
  isEnabled,
  hasActiveSequence,
  onToggle,
}: SequenceToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">Sequence</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onToggle}
            disabled={!hasActiveSequence}
            aria-label={isEnabled ? "Disable sequence mode" : "Enable sequence mode"}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed ${
              isEnabled ? "bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-600"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                isEnabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {hasActiveSequence
              ? isEnabled
                ? "Switch to manual mode"
                : "Switch to sequence mode"
              : "Add a sequence in Settings first"}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
