// Tiny shared helpers for the Recursion & Big-O tool.

/** Clamp to an integer within [min, max]; non-finite input falls back to min. */
export function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}
