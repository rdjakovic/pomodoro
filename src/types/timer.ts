export type TimerSettings = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  theme: "light" | "dark";
  soundEnabled?: boolean; // Optional setting for enabling/disabling sound
};
