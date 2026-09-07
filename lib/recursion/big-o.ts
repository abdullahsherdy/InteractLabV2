// Pure Big-O growth maths for the recursion tool's visualiser.
// Each function returns an operation count for a given n so the chart can draw
// bars purely from data. Framework-agnostic and unit-tested.

import { clampInt } from "./util";

export type Complexity = "o1" | "olog" | "on" | "onlogn" | "on2";

/** Operation count for a complexity class at size n. */
export function bigOValue(kind: Complexity, n: number): number {
  switch (kind) {
    case "o1":
      return 1;
    case "olog":
      return n <= 1 ? 0 : Math.log2(n);
    case "on":
      return n;
    case "onlogn":
      return n <= 1 ? n : n * Math.log2(n);
    case "on2":
      return n * n;
  }
}

export interface GrowthBar {
  kind: Complexity;
  label: string;
  /** css class suffix used for the bar colour (rec-bar-<cls>) */
  cls: string;
  /** raw operation count */
  value: number;
  /** formatted for display */
  display: string;
}

/** Bound n to the visualiser's slider range. */
export function clampBigON(n: number): number {
  return clampInt(n, 1, 20);
}

/**
 * The four bars the chart draws — O(1), O(log n), O(n), O(n²) — evaluated at n.
 * Returned in growth order so the chart reads left (flat) to right (steep).
 */
export function growthBars(nRaw: number): GrowthBar[] {
  const n = clampBigON(nRaw);
  const defs: Pick<GrowthBar, "kind" | "label" | "cls">[] = [
    { kind: "o1", label: "O(1)", cls: "o1" },
    { kind: "olog", label: "O(log n)", cls: "olog" },
    { kind: "on", label: "O(n)", cls: "on" },
    { kind: "on2", label: "O(n²)", cls: "on2" },
  ];
  return defs.map((d) => {
    const value = bigOValue(d.kind, n);
    return {
      ...d,
      value,
      display: d.kind === "olog" ? value.toFixed(1) : String(Math.round(value)),
    };
  });
}
