// Pure Fibonacci call-tree builder for the recursion tool.
//
// Naive fib(n) = fib(n-1) + fib(n-2) branches into two calls at every level, so
// the same values get recomputed over and over — that repeated work is the
// whole point of the visual. This module builds the tree, tallies the calls,
// and lays the nodes out for SVG. No framework, fully unit-tested.

import { clampInt } from "./util";

export interface FibNode {
  /** unique id in call order (pre-order) */
  id: number;
  /** the argument — this node is the call fib(v) */
  v: number;
  /** distance from the root (root = 0) */
  depth: number;
  children: FibNode[];
  /** v <= 1, i.e. a leaf / base case */
  isBase: boolean;
}

/** Bound n to the range the tree can draw without overflowing. */
export function clampFibN(n: number): number {
  return clampInt(n, 1, 7);
}

/** Build the full naive-Fibonacci call tree for fib(n). n is clamped to 1–7. */
export function buildFibTree(nRaw: number): FibNode {
  const n = clampFibN(nRaw);
  let id = 0;
  const build = (v: number, depth: number): FibNode => {
    const node: FibNode = { id: id++, v, depth, children: [], isBase: v <= 1 };
    if (v > 1) {
      node.children = [build(v - 1, depth + 1), build(v - 2, depth + 1)];
    }
    return node;
  };
  return build(n, 0);
}

/** Visit every node of the tree in pre-order. */
export function walkFib(node: FibNode, visit: (n: FibNode) => void): void {
  visit(node);
  for (const child of node.children) walkFib(child, visit);
}

export interface FibStats {
  /** total number of function calls (nodes) */
  totalCalls: number;
  /** how many times each argument value is computed */
  callCount: Map<number, number>;
  /** values computed more than once — the wasted work, most-significant first */
  repeated: { v: number; count: number }[];
  /** the n the tree was built for */
  n: number;
  /** the actual Fibonacci number fib(n) */
  result: number;
}

/**
 * Tally the tree: total calls, per-value call counts, repeated values, and the
 * real fib(n) (which equals the number of fib(1) leaves = the sum of all leaf
 * values, since fib(0)=0 and fib(1)=1).
 */
export function fibStats(root: FibNode): FibStats {
  const callCount = new Map<number, number>();
  let totalCalls = 0;
  let result = 0;

  walkFib(root, (nd) => {
    totalCalls += 1;
    callCount.set(nd.v, (callCount.get(nd.v) ?? 0) + 1);
    if (nd.isBase) result += nd.v;
  });

  const repeated = [...callCount.entries()]
    .filter(([, count]) => count > 1)
    .map(([v, count]) => ({ v, count }))
    .sort((a, b) => b.v - a.v);

  return { totalCalls, callCount, repeated, n: root.v, result };
}

/** A palette indexed by fib value so equal values share a colour. */
export const FIB_COLORS = [
  "#94a3b8", // 0
  "#22c55e", // 1
  "#3b82f6", // 2
  "#ec4899", // 3
  "#f97316", // 4
  "#8b5cf6", // 5
  "#14b8a6", // 6
  "#eab308", // 7
];

export function fibColor(v: number): string {
  return FIB_COLORS[v % FIB_COLORS.length];
}

export interface FibPlacedNode {
  id: number;
  x: number;
  y: number;
  node: FibNode;
}

export interface FibLayout {
  placed: FibPlacedNode[];
  width: number;
  height: number;
}

const LEVEL_H = 62;

/**
 * Assign an (x, y) to every node for SVG rendering. The root sits centred at
 * the top; each pair of children splits left/right and the horizontal spread
 * halves at every level so deep subtrees don't collide.
 */
export function layoutFibTree(root: FibNode): FibLayout {
  const n = root.v;
  const width = Math.max(420, Math.min(760, 60 * 2 ** Math.min(n, 5)));
  const height = (n + 1) * LEVEL_H + 28;
  const placed: FibPlacedNode[] = [];

  const assign = (nd: FibNode, x: number, y: number, spread: number) => {
    placed.push({ id: nd.id, x, y, node: nd });
    if (nd.children.length === 2) {
      assign(nd.children[0], x - spread / 2, y + LEVEL_H, spread / 2);
      assign(nd.children[1], x + spread / 2, y + LEVEL_H, spread / 2);
    }
  };
  assign(root, width / 2, 30, width * 0.42);

  return { placed, width, height };
}
