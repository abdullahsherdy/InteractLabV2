import { describe, expect, it } from "vitest";
import { mergeSort, quickSort } from "./fast-sorts";
import { isSorted } from "./util";

const sortedCopy = (a: number[]) => [...a].sort((x, y) => x - y);

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

describe("merge sort", () => {
  it("sorts correctly and preserves the multiset (property sweep)", () => {
    const rand = rng(0xabc123);
    for (let t = 0; t < 150; t++) {
      const input = randomArray(rand, 1 + Math.floor(rand() * 11));
      const { result } = mergeSort(input);
      expect(result).toEqual(sortedCopy(input));
    }
  });

  it("splits preserve order (left ++ right === input) and bases are length ≤ 1", () => {
    const { ops } = mergeSort([9, 3, 7, 1, 5, 8, 2]);
    for (const op of ops) {
      if (op.kind === "split") {
        expect([...op.left, ...op.right]).toEqual(op.input);
      }
      if (op.kind === "base") {
        expect(op.run.length).toBeLessThanOrEqual(1);
      }
      if (op.kind === "merge") {
        // Every merge produces a sorted run from two sorted runs.
        expect(isSorted(op.result)).toBe(true);
        expect(sortedCopy(op.result)).toEqual(sortedCopy([...op.left, ...op.right]));
      }
    }
  });

  it("recursion depth stays within ⌈log₂ n⌉", () => {
    const rand = rng(0xd3971);
    for (let t = 0; t < 40; t++) {
      const n = 1 + Math.floor(rand() * 12);
      const { maxDepth } = mergeSort(randomArray(rand, n));
      expect(maxDepth).toBeLessThanOrEqual(Math.ceil(Math.log2(Math.max(1, n))));
    }
  });
});

describe("quick sort", () => {
  it("sorts correctly and preserves the multiset (property sweep)", () => {
    const rand = rng(0x9c1c);
    for (let t = 0; t < 150; t++) {
      const input = randomArray(rand, 1 + Math.floor(rand() * 11));
      const { result } = quickSort(input);
      expect(result).toEqual(sortedCopy(input));
    }
  });

  it("partitions correctly: left ≤ pivot < right, and combine reassembles them", () => {
    const { ops } = quickSort([9, 3, 7, 1, 5, 8, 2, 6]);
    for (const op of ops) {
      if (op.kind === "partition") {
        for (const x of op.left) expect(x).toBeLessThanOrEqual(op.pivot);
        for (const x of op.right) expect(x).toBeGreaterThan(op.pivot);
        const rest = op.input.slice(0, -1);
        expect(sortedCopy([...op.left, ...op.right])).toEqual(sortedCopy(rest));
      }
      if (op.kind === "base") {
        expect(op.run.length).toBeLessThanOrEqual(1);
      }
      if (op.kind === "combine") {
        expect(op.result).toEqual([...op.left, op.pivot, ...op.right]);
        expect(isSorted(op.result)).toBe(true);
      }
    }
  });

  it("degrades to depth n-1 on already-sorted input (the O(n²) worst case)", () => {
    const input = [1, 2, 3, 4, 5, 6];
    const { maxDepth } = quickSort(input);
    expect(maxDepth).toBe(input.length - 1);
  });
});
