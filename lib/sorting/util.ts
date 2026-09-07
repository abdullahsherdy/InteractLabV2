// Sorting — shared pure helpers. No React, no DOM: everything here is a pure
// function so the step-engines and comparison math can be unit-tested against
// independent reference implementations.

export const MIN_VAL = 1;
export const MAX_VAL = 99;
export const MAX_LEN = 12;

/**
 * Parse a free-text list ("5, 3, 8 1") into whole numbers in [1, 99], capped at
 * MAX_LEN elements. Anything out of range or non-numeric is dropped rather than
 * clamped, so the array a learner sees is exactly the valid values they typed.
 */
export function parseArray(input: string): number[] {
  const out: number[] = [];
  for (const tok of input.split(/\D+/)) {
    if (!tok) continue;
    const n = Number.parseInt(tok, 10);
    if (Number.isFinite(n) && n >= MIN_VAL && n <= MAX_VAL) out.push(n);
    if (out.length >= MAX_LEN) break;
  }
  return out;
}

/** True when `arr` is sorted ascending. */
export function isSorted(arr: readonly number[]): boolean {
  for (let i = 1; i < arr.length; i++) if (arr[i - 1] > arr[i]) return false;
  return true;
}

export const PRESETS: { label: string; value: number[] }[] = [
  { label: "Small — [5, 3, 8, 1]", value: [5, 3, 8, 1] },
  { label: "Classic — [64, 25, 12, 22, 11]", value: [64, 25, 12, 22, 11] },
  { label: "Mixed — [7, 2, 5, 1, 8]", value: [7, 2, 5, 1, 8] },
  { label: "Already sorted — [1, 2, 3, 4, 5]", value: [1, 2, 3, 4, 5] },
  { label: "Reversed — [5, 4, 3, 2, 1]", value: [5, 4, 3, 2, 1] },
  { label: "Bigger — [9, 3, 7, 1, 5, 8, 2, 6]", value: [9, 3, 7, 1, 5, 8, 2, 6] },
];

export type Tone = "slow" | "ok" | "fast";

export interface CompareRow {
  algo: string;
  complexity: string;
  ops: number;
  tone: Tone;
}

/**
 * Operation counts for the growth comparison chart at a given input size `n`.
 * n² sorts cost ~n² ops; the divide-and-conquer sorts cost ~n·log₂n; a dict
 * lookup is the O(1) baseline. `nlogn` is floored at `n` so the bar never dips
 * below the linear term for tiny n (log₂1 = 0).
 */
export function compareOps(n: number): CompareRow[] {
  const n2 = n * n;
  const nlogn = Math.max(n, Math.round(n * Math.log2(n)));
  return [
    { algo: "Bubble", complexity: "O(n²)", ops: n2, tone: "slow" },
    { algo: "Selection", complexity: "O(n²)", ops: n2, tone: "slow" },
    { algo: "Insertion", complexity: "O(n²)", ops: n2, tone: "slow" },
    { algo: "Merge", complexity: "O(n log n)", ops: nlogn, tone: "ok" },
    { algo: "Quick (avg)", complexity: "O(n log n)", ops: nlogn, tone: "ok" },
    { algo: "Dict lookup", complexity: "O(1)", ops: 1, tone: "fast" },
  ];
}
