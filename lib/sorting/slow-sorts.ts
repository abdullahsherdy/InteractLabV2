// The three O(n²) sorts as step-engines. Each returns an array of immutable
// snapshots; a snapshot records the array state, which indices are being
// compared / swapped / are locked in place, the running counters, and a plain
// English note. The React layer just renders whichever snapshot is current —
// all the algorithmic truth lives here where it can be tested.

export type SlowAlgo = "bubble" | "selection" | "insertion";

export interface SlowStep {
  /** Array contents at this moment. */
  array: number[];
  /** Indices being compared this step. */
  comparing: number[];
  /** Indices being swapped / shifted this step. */
  swapping: number[];
  /** Indices now locked in their final sorted position. */
  sorted: number[];
  /** Insertion: index of the value being inserted, else -1. */
  key: number;
  /** Selection: index of the running minimum, else -1. */
  min: number;
  /** 1-based outer-loop pass, or 0 before the first pass. */
  pass: number;
  /** Cumulative comparisons so far. */
  comparisons: number;
  /** Cumulative swaps (insertion counts shifts). */
  swaps: number;
  /** Plain-text narration for the caption. */
  note: string;
  /** True on the terminal "all sorted" step. */
  done: boolean;
}

interface Counters {
  comparisons: number;
  swaps: number;
}

function snapshot(
  array: number[],
  counters: Counters,
  sorted: Set<number>,
  partial: Partial<SlowStep> & { note: string },
): SlowStep {
  return {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [...sorted].sort((a, b) => a - b),
    key: -1,
    min: -1,
    pass: 0,
    comparisons: counters.comparisons,
    swaps: counters.swaps,
    done: false,
    ...partial,
  };
}

/**
 * Bubble sort — repeatedly swap adjacent out-of-order pairs so the largest
 * remaining value "bubbles" to the end each pass. Short-circuits when a whole
 * pass makes no swaps (best case O(n) on already-sorted input).
 */
export function bubbleSort(input: number[]): SlowStep[] {
  const a = [...input];
  const n = a.length;
  const c: Counters = { comparisons: 0, swaps: 0 };
  const sorted = new Set<number>();
  const steps: SlowStep[] = [];
  const push = (p: Partial<SlowStep> & { note: string }) =>
    steps.push(snapshot(a, c, sorted, p));

  push({
    note:
      n <= 1
        ? "Only one element — it is already sorted."
        : "Start: compare each neighbouring pair and let the largest value bubble to the right.",
  });

  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;
    for (let i = 0; i < n - 1 - pass; i++) {
      c.comparisons++;
      push({ comparing: [i, i + 1], pass: pass + 1, note: `Pass ${pass + 1}: is ${a[i]} > ${a[i + 1]}?` });
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        c.swaps++;
        swapped = true;
        push({ swapping: [i, i + 1], pass: pass + 1, note: `Yes — swap them so the bigger value moves right.` });
      }
    }
    sorted.add(n - 1 - pass);
    if (!swapped) {
      for (let k = 0; k < n; k++) sorted.add(k);
      push({ pass: pass + 1, note: `A full pass with no swaps — the list is already in order, so bubble sort stops early.` });
      break;
    }
  }

  for (let k = 0; k < n; k++) sorted.add(k);
  push({ done: true, note: `Sorted in ${c.comparisons} comparisons and ${c.swaps} swaps.` });
  return steps;
}

/**
 * Selection sort — each pass scans the unsorted region for the minimum and
 * swaps it into place. Always does the same n(n-1)/2 comparisons, so there is
 * no "best case" speed-up, but it makes at most n-1 swaps.
 */
export function selectionSort(input: number[]): SlowStep[] {
  const a = [...input];
  const n = a.length;
  const c: Counters = { comparisons: 0, swaps: 0 };
  const sorted = new Set<number>();
  const steps: SlowStep[] = [];
  const push = (p: Partial<SlowStep> & { note: string }) =>
    steps.push(snapshot(a, c, sorted, p));

  push({
    note:
      n <= 1
        ? "Only one element — it is already sorted."
        : "Start: find the smallest value in the unsorted part and move it to the front, then repeat.",
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    push({ min: minIdx, pass: i + 1, note: `Pass ${i + 1}: assume ${a[i]} (position ${i}) is the smallest.` });
    for (let j = i + 1; j < n; j++) {
      c.comparisons++;
      push({ min: minIdx, comparing: [j], pass: i + 1, note: `Is ${a[j]} < ${a[minIdx]} (the smallest so far)?` });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        push({ min: minIdx, comparing: [j], pass: i + 1, note: `Yes — ${a[j]} is the new smallest.` });
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      c.swaps++;
      push({ swapping: [i, minIdx], min: i, pass: i + 1, note: `Swap the smallest value into position ${i}.` });
    } else {
      push({ min: i, pass: i + 1, note: `${a[i]} was already the smallest — no swap needed.` });
    }
    sorted.add(i);
  }

  for (let k = 0; k < n; k++) sorted.add(k);
  push({ done: true, note: `Sorted in ${c.comparisons} comparisons and ${c.swaps} swaps.` });
  return steps;
}

/**
 * Insertion sort — grow a sorted prefix one card at a time, sliding each new
 * value left past everything larger. Implemented as adjacent swaps (rather than
 * the classic hole-and-shift) so the array stays a true permutation at every
 * step, which is both easier to animate and easier to reason about. Same
 * comparison and move counts as the shift form; best case O(n) on sorted input.
 */
export function insertionSort(input: number[]): SlowStep[] {
  const a = [...input];
  const n = a.length;
  const c: Counters = { comparisons: 0, swaps: 0 };
  const sorted = new Set<number>(n > 0 ? [0] : []);
  const steps: SlowStep[] = [];
  const push = (p: Partial<SlowStep> & { note: string }) =>
    steps.push(snapshot(a, c, sorted, p));

  push({
    note:
      n <= 1
        ? "Only one element — it is already sorted."
        : "Start: the first card is a sorted pile of one. Insert each following card into its place.",
  });

  for (let i = 1; i < n; i++) {
    push({ key: i, pass: i, note: `Pick up ${a[i]} and slide it left past anything larger.` });
    let j = i;
    while (j > 0) {
      c.comparisons++;
      push({ key: j, comparing: [j - 1, j], pass: i, note: `Is ${a[j - 1]} > ${a[j]}?` });
      if (a[j - 1] > a[j]) {
        const moved = a[j];
        const bigger = a[j - 1];
        [a[j - 1], a[j]] = [a[j], a[j - 1]];
        c.swaps++;
        push({ key: j - 1, swapping: [j - 1, j], pass: i, note: `Yes — swap so ${moved} moves left past ${bigger}.` });
        j--;
      } else {
        push({ key: j, comparing: [j - 1, j], pass: i, note: `No — ${a[j - 1]} ≤ ${a[j]}, so it has found its place.` });
        break;
      }
    }
    for (let k = 0; k <= i; k++) sorted.add(k);
    push({ key: j, pass: i, note: `${a[j]} is now in the right spot. The left part stays sorted.` });
  }

  for (let k = 0; k < n; k++) sorted.add(k);
  push({ done: true, note: `Sorted in ${c.comparisons} comparisons and ${c.swaps} swaps.` });
  return steps;
}

export const SLOW_SORTS: Record<SlowAlgo, (input: number[]) => SlowStep[]> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
};
