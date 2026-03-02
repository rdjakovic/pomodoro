let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (!audioCtx || audioCtx.state === "closed") {
    try {
      audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3,
  delay = 0
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
  gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  oscillator.start(ctx.currentTime + delay);
  oscillator.stop(ctx.currentTime + delay + duration + 0.05);
}

// Pomodoro done: single resonant bell (focus session complete)
export function playPomodoroEnd(): void {
  playTone(880, 1.0, "sine", 0.3);
  playTone(1760, 0.5, "sine", 0.12, 0.6);
}

// Short break done: two quick ascending tones (light, informational)
export function playShortBreakEnd(): void {
  playTone(660, 0.4, "sine", 0.25);
  playTone(880, 0.45, "sine", 0.25, 0.5);
}

// Long break done: three ascending tones (refreshing, ready to work)
export function playLongBreakEnd(): void {
  playTone(523, 0.3, "sine", 0.28);
  playTone(659, 0.3, "sine", 0.28, 0.4);
  playTone(784, 0.65, "sine", 0.28, 0.8);
}

// Sequence done: celebratory fanfare (all done!)
export function playSequenceEnd(): void {
  playTone(523, 0.2, "sine", 0.3);
  playTone(659, 0.2, "sine", 0.3, 0.25);
  playTone(784, 0.2, "sine", 0.3, 0.5);
  playTone(1047, 0.85, "sine", 0.35, 0.75);
}
