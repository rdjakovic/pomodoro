import { Sequence } from "@/types/timer";
import { formatTime } from "@/lib/format";

interface SequenceInfoProps {
  sequence: Sequence;
  sequenceIndex: number;
  totalSequenceTime: number;
  elapsedSeconds: number;
}

export function SequenceInfo({
  sequence,
  sequenceIndex,
  totalSequenceTime,
  elapsedSeconds,
}: SequenceInfoProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-sm text-zinc-400 dark:text-zinc-500">
        Sequence #{sequenceIndex}:{" "}
        <span className="text-zinc-600 dark:text-zinc-400">
          {sequence.pomodoro}m / {sequence.shortBreak}m
          {sequence.longBreak > 0 && ` / ${sequence.longBreak}m`}
        </span>
      </p>
      {totalSequenceTime > 0 && (
        <p className="text-lg text-zinc-400 dark:text-zinc-500">
          Elapsed:{" "}
          <span className="text-green-400 font-semibold">
            {formatTime(elapsedSeconds)}
          </span>{" "}
          / {totalSequenceTime}m
        </p>
      )}
    </div>
  );
}
