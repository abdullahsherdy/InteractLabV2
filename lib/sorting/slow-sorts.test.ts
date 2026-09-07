import { describe, expect, it } from "vitest";
import {
  bubbleSort,
  insertionSort,
  selectionSort,
  SLOW_SORTS,
  type SlowAlgo,
  type SlowStep,
} from "./slow-sorts";

const ALGOS: SlowAlgo[] = ["bubble", "selection", "insertion"];
const sortedCopy = (a: number[]) => [...a].sort((x, y) => x - y);

// Deterministic PRNG (mulberry32) so the property sweep is reproducible.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const randomArray = (rand: () => number, len: number) =>
  Array.from({ length: len }, () => 1 + Math.floor(rand() * 99));

const sameMultiset = (a: number[], target: number[]) => {
  if (a.length !== target.length) return false;
  const s = sortedCopy(a);
  return s.every((v, i) => v === target[i]);
};

// A single sweep can produce hundreds of thousands of steps; firing an
// `expect` per step would drown in Vitest's per-assertion overhead. Instead we
// fold each invariant into an accumulated boolean and assert it once per run,
// which keeps the coverage identical but the runtime flat.
function checkInvariants(input: number[], steps: SlowStep[]) {
  const n = input.length;
  const target = sortedCopy(input);
  let prevSorted: number[] = [];
  let prevCmp = 0;
  let prevSwap = 0;

  let permutationOk = true;
  let boundsOk = true;
  let sortedGrowsOk = true;
  let countersOk = true;

  for (const s of steps) {
    // The array is always a permutation of the input — never loses or dupes a value.
    if (!sameMultiset(s.array, target)) permutationOk = false;
    // Highlighted indices are in bounds.
    for (const idx of [...s.comparing, ...s.swapping, ...s.sorted]) {
      if (idx < 0 || idx >= n) boundsOk = false;
    }
    if (s.key >= n || s.min >= n) boundsOk = false;
    // The "sorted" (locked) set only ever grows.
    if (!prevSorted.every((x) => s.sorted.includes(x))) sortedGrowsOk = false;
    prevSorted = s.sorted;
    // Counters are monotonic non-decreasing.
    if (s.comparisons < prevCmp || s.swaps < prevSwap) countersOk = false;
    prevCmp = s.comparisons;
    prevSwap = s.swaps;
  }

  expect(permutationOk, "array stays a permutation of the input at every step").toBe(true);
  expect(boundsOk, "every highlighted index stays within bounds").toBe(true);
  expect(sortedGrowsOk, "the locked (sorted) set only ever grows").toBe(true);
  expect(countersOk, "comparison and swap counters never decrease").toBe(true);

  const last = steps[steps.length - 1];
  expect(last.done).toBe(true);
  expect(last.array).toEqual(target);
  expect(last.sorted).toHaveLength(n);
}

describe("slow sorts — correctness & invariants (property sweep)", () => {
  it("sorts every random input correctly while holding all step invariants", () => {
    const rand = rng(0x51ee7);
    for (let t = 0; t < 200; t++) {
      const input = randomArray(rand, 1 + Math.floor(rand() * 10));
      for (const algo of ALGOS) {
        checkInvariants(input, SLOW_SORTS[algo](input));
      }
    }
  });

  it("handles trivial and duplicate-heavy inputs", () => {
    for (const input of [[1], [2, 1], [7, 7, 7], [3, 1, 3, 1, 2]]) {
      for (const algo of ALGOS) {
        const steps = SLOW_SORTS[algo](input);
        checkInvariants(input, steps);
        expect(steps[steps.length - 1].array).toEqual(sortedCopy(input));
      }
    }
  });
});

describe("bubble sort — best/worst case counters", () => {
  it("exits early on already-sorted input: n-1 comparisons, 0 swaps", () => {
    const last = bubbleSort([1, 2, 3, 4, 5]).at(-1)!;
    expect(last.comparisons).toBe(4);
    expect(last.swaps).toBe(0);
  });

  it("hits the worst case on reversed input: n(n-1)/2 comparisons and swaps", () => {
    const last = bubbleSort([5, 4, 3, 2, 1]).at(-1)!;
    expect(last.comparisons).toBe(10);
    expect(last.swaps).toBe(10);
  });
});

describe("selection sort — fixed comparison count", () => {
  it("always does exactly n(n-1)/2 comparisons and at most n-1 swaps", () => {
    for (const input of [
      [1, 2, 3, 4, 5],
      [5, 4, 3, 2, 1],
      [3, 1, 4, 1, 5, 9, 2, 6],
    ]) {
      const n = input.length;
      const last = selectionSort(input).at(-1)!;
      expect(last.comparisons).toBe((n * (n - 1)) / 2);
      expect(last.swaps).toBeLessThanOrEqual(n - 1);
    }
  });
});

describe("insertion sort — adaptive behaviour", () => {
  it("is O(n) on sorted input: n-1 comparisons, 0 swaps", () => {
    const last = insertionSort([1, 2, 3, 4, 5]).at(-1)!;
    expect(last.comparisons).toBe(4);
    expect(last.swaps).toBe(0);
  });

  it("hits the worst case on reversed input: n(n-1)/2 comparisons and swaps", () => {
    const last = insertionSort([5, 4, 3, 2, 1]).at(-1)!;
    expect(last.comparisons).toBe(10);
    expect(last.swaps).toBe(10);
  });
});
