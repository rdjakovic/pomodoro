export type Sequence = {
  id: string;
  pomodoro: number;   // minutes
  shortBreak: number; // minutes
  longBreak: number;  // minutes, 0 = skip long break
};

export type SequenceSettings = {
  sequences: Sequence[];
  activeSequenceId: string | null;
  sequenceModeEnabled: boolean;
  totalSequenceTime: number; // minutes, 0 = unlimited
};

export type TimerSettings = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  theme: "light" | "dark";
  soundEnabled?: boolean;
  sequenceSettings?: SequenceSettings; // optional for backward-compatibility with existing localStorage
};
