import { describe, expect, it } from "vitest";
import {
  buildFibTree,
  clampFibN,
  fibColor,
  FIB_COLORS,
  fibStats,
  layoutFibTree,
  walkFib,
  type FibNode,
} from "./fib-tree";

// Independent references the module is checked against.
function refFib(n: number): number {
  return n <= 1 ? n : refFib(n - 1) + refFib(n - 2);
}
function refCalls(n: number): number {
  return n <= 1 ? 1 : 1 + refCalls(n - 1) + refCalls(n - 2);
}

describe("clampFibN", () => {
  it("bounds n to 1–7 and truncates", () => {
    expect(clampFibN(1)).toBe(1);
    expect(clampFibN(7)).toBe(7);
    expect(clampFibN(0)).toBe(1);
    expect(clampFibN(99)).toBe(7);
    expect(clampFibN(4.8)).toBe(4);
    expect(clampFibN(NaN)).toBe(1);
  });
});

describe("buildFibTree", () => {
  it("roots the tree at fib(n)", () => {
    const root = buildFibTree(6);
    expect(root.v).toBe(6);
    expect(root.depth).toBe(0);
    expect(root.isBase).toBe(false);
  });

  it("clamps out-of-range n", () => {
    expect(buildFibTree(50).v).toBe(7);
    expect(buildFibTree(0).v).toBe(1);
  });

  it("gives every non-base node exactly two children: fib(v-1) and fib(v-2)", () => {
    walkFib(buildFibTree(7), (nd) => {
      if (nd.v <= 1) {
        expect(nd.isBase).toBe(true);
        expect(nd.children).toHaveLength(0);
      } else {
        expect(nd.isBase).toBe(false);
        expect(nd.children.map((c) => c.v)).toEqual([nd.v - 1, nd.v - 2]);
        expect(nd.children.every((c) => c.depth === nd.depth + 1)).toBe(true);
      }
    });
  });

  it("assigns unique ids in pre-order (root first, left subtree before right)", () => {
    const root = buildFibTree(5);
    const ids: number[] = [];
    walkFib(root, (nd) => ids.push(nd.id));
    expect(ids[0]).toBe(0);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort((a, b) => a - b)).toEqual(ids); // pre-order === ascending here
  });
});

describe("fibStats", () => {
  it("counts total calls per the naive recurrence T(n)=1+T(n-1)+T(n-2)", () => {
    for (let n = 1; n <= 7; n++) {
      expect(fibStats(buildFibTree(n)).totalCalls).toBe(refCalls(n));
    }
  });

  it("per-value call counts sum back to the total", () => {
    const stats = fibStats(buildFibTree(7));
    const sum = [...stats.callCount.values()].reduce((a, b) => a + b, 0);
    expect(sum).toBe(stats.totalCalls);
  });

  it("computes the real Fibonacci number as the result", () => {
    for (let n = 1; n <= 7; n++) {
      expect(fibStats(buildFibTree(n)).result).toBe(refFib(n));
    }
  });

  it("lists only values computed more than once, most-significant first", () => {
    const { repeated } = fibStats(buildFibTree(6));
    expect(repeated.every((r) => r.count > 1)).toBe(true);
    const vs = repeated.map((r) => r.v);
    expect([...vs].sort((a, b) => b - a)).toEqual(vs);
    // fib(6) recomputes fib(4), fib(3), fib(2), fib(1), fib(0) — not fib(5)/fib(6).
    expect(vs).toEqual([4, 3, 2, 1, 0]);
  });

  it("has no repeats for the smallest trees", () => {
    expect(fibStats(buildFibTree(1)).repeated).toEqual([]);
    expect(fibStats(buildFibTree(2)).repeated).toEqual([]);
  });
});

describe("fibColor", () => {
  it("maps a value into the palette by index", () => {
    expect(fibColor(0)).toBe(FIB_COLORS[0]);
    expect(fibColor(7)).toBe(FIB_COLORS[7]);
    expect(fibColor(FIB_COLORS.length)).toBe(FIB_COLORS[0]); // wraps
  });
});

describe("layoutFibTree", () => {
  it("places every node once and centres the root at the top", () => {
    const root = buildFibTree(6);
    const nodeCount = fibStats(root).totalCalls;
    const layout = layoutFibTree(root);
    expect(layout.placed).toHaveLength(nodeCount);
    const rootPlaced = layout.placed.find((p) => p.id === root.id)!;
    expect(rootPlaced.x).toBeCloseTo(layout.width / 2);
    expect(rootPlaced.y).toBe(30);
    expect(layout.width).toBeGreaterThan(0);
    expect(layout.height).toBeGreaterThan(0);
  });

  it("pushes deeper nodes further down the canvas", () => {
    const root = buildFibTree(5);
    const layout = layoutFibTree(root);
    const byId = new Map(layout.placed.map((p) => [p.id, p]));
    walkFib(root, (nd) => {
      for (const child of nd.children) {
        expect(byId.get(child.id)!.y).toBeGreaterThan(byId.get(nd.id)!.y);
      }
    });
  });
});
