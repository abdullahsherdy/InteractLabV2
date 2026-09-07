// The two O(n log n) divide-and-conquer sorts as op-tracers. Rather than
// snapshots of a single array, these emit a linear trace of the recursion:
// split/base/merge for merge sort, partition/base/combine for quick sort. The
// trace is a depth-first walk (a node's combine/merge op is emitted only after
// both of its children have fully resolved), so the stepper can play it back
// one op at a time. Every op carries its recursion `depth` for colour-coding.

export type MergeOp =
  | { kind: "split"; depth: number; input: number[]; left: number[]; right: number[]; note: string }
  | { kind: "base"; depth: number; run: number[]; note: string }
  | { kind: "merge"; depth: number; left: number[]; right: number[]; result: number[]; note: string };

export interface MergeTrace {
  ops: MergeOp[];
  result: number[];
  maxDepth: number;
}

/** Stable merge of two already-sorted runs (`<=` keeps equal values in order). */
function mergeTwo(left: number[], right: number[]): number[] {
  const out: number[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);
    else out.push(right[j++]);
  }
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}

export function mergeSort(input: number[]): MergeTrace {
  const ops: MergeOp[] = [];
  let maxDepth = 0;

  function ms(arr: number[], depth: number): number[] {
    maxDepth = Math.max(maxDepth, depth);
    if (arr.length <= 1) {
      ops.push({
        kind: "base",
        depth,
        run: [...arr],
        note:
          arr.length === 0
            ? "Empty run — nothing to sort."
            : `A single value [${arr[0]}] is already sorted — hand it back.`,
      });
      return arr;
    }
    const mid = Math.floor(arr.length / 2);
    const leftIn = arr.slice(0, mid);
    const rightIn = arr.slice(mid);
    ops.push({
      kind: "split",
      depth,
      input: [...arr],
      left: [...leftIn],
      right: [...rightIn],
      note: `Split [${arr.join(", ")}] down the middle into [${leftIn.join(", ")}] and [${rightIn.join(", ")}].`,
    });
    const left = ms(leftIn, depth + 1);
    const right = ms(rightIn, depth + 1);
    const result = mergeTwo(left, right);
    ops.push({
      kind: "merge",
      depth,
      left: [...left],
      right: [...right],
      result: [...result],
      note: `Merge [${left.join(", ")}] and [${right.join(", ")}] into [${result.join(", ")}].`,
    });
    return result;
  }

  const result = ms([...input], 0);
  return { ops, result, maxDepth };
}

export type QuickOp =
  | { kind: "partition"; depth: number; input: number[]; pivot: number; left: number[]; right: number[]; note: string }
  | { kind: "base"; depth: number; run: number[]; note: string }
  | { kind: "combine"; depth: number; left: number[]; pivot: number; right: number[]; result: number[]; note: string };

export interface QuickTrace {
  ops: QuickOp[];
  result: number[];
  maxDepth: number;
}

/**
 * Quick sort with a last-element pivot. Values ≤ pivot go left, values > pivot
 * go right. This makes the worst case (already-sorted input) visible: the
 * partitions become maximally lopsided and the recursion depth reaches n-1.
 */
export function quickSort(input: number[]): QuickTrace {
  const ops: QuickOp[] = [];
  let maxDepth = 0;

  function qs(arr: number[], depth: number): number[] {
    maxDepth = Math.max(maxDepth, depth);
    if (arr.length <= 1) {
      ops.push({
        kind: "base",
        depth,
        run: [...arr],
        note:
          arr.length === 0
            ? "Empty partition — nothing to sort."
            : `[${arr[0]}] on its own is already sorted.`,
      });
      return arr;
    }
    const pivot = arr[arr.length - 1];
    const rest = arr.slice(0, -1);
    const left = rest.filter((x) => x <= pivot);
    const right = rest.filter((x) => x > pivot);
    ops.push({
      kind: "partition",
      depth,
      input: [...arr],
      pivot,
      left: [...left],
      right: [...right],
      note: `Pivot = ${pivot} (last value). Smaller-or-equal → [${left.join(", ")}], bigger → [${right.join(", ")}].`,
    });
    const sortedLeft = qs(left, depth + 1);
    const sortedRight = qs(right, depth + 1);
    const result = [...sortedLeft, pivot, ...sortedRight];
    ops.push({
      kind: "combine",
      depth,
      left: [...sortedLeft],
      pivot,
      right: [...sortedRight],
      result: [...result],
      note: `Combine: [${sortedLeft.join(", ")}] + ${pivot} + [${sortedRight.join(", ")}] → [${result.join(", ")}].`,
    });
    return result;
  }

  const result = qs([...input], 0);
  return { ops, result, maxDepth };
}
