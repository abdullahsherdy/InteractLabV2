// Pure step-transition logic shared by the unified step engine (useStepEngine).
//
// The three shipped players (useStepper / useStepPlayer / useWalkPlayer) each
// re-implemented the same index arithmetic — clamp, next/prev with floors, the
// "jump back to 0 when you press play at the end" rule, and the auto-advance
// tick that stops at the last step. That arithmetic is the off-by-one surface,
// so it lives here as pure functions with unit tests; the React hook is a thin
// wrapper around these. No React, no timers — just numbers in, numbers out.

/** Clamp an index into the valid range for a list of `total` steps. */
export function clampIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  if (index < 0) return 0;
  if (index > total - 1) return total - 1;
  return index;
}

/** Index after "next" — advance one, never past the last step. */
export function nextIndex(index: number, total: number): number {
  return clampIndex(index + 1, total);
}

/** Index after "prev" — step back one, never before the first step. */
export function prevIndex(index: number, total: number): number {
  return clampIndex(index - 1, total);
}

export function isAtStart(index: number): boolean {
  return index <= 0;
}

export function isAtEnd(index: number, total: number): boolean {
  return index >= total - 1;
}

/**
 * Where "play" should start from. Pressing play while parked on the last step
 * replays from the beginning; otherwise it resumes from the current step.
 */
export function playFrom(index: number, total: number): number {
  return isAtEnd(index, total) ? 0 : clampIndex(index, total);
}

/**
 * One auto-play tick. Returns the next index and whether playback should stop
 * (reached the end). At the end we hold on the last step and signal `done`.
 */
export function advanceOnTick(
  index: number,
  total: number,
): { index: number; done: boolean } {
  if (isAtEnd(index, total)) return { index: clampIndex(index, total), done: true };
  return { index: index + 1, done: false };
}

/** Timer delay in ms for a given base interval and speed multiplier. */
export function intervalFor(baseInterval: number, speed: number): number {
  return baseInterval / speed;
}
