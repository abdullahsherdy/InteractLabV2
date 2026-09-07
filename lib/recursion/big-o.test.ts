import { describe, expect, it } from "vitest";
import { bigOValue, clampBigON, growthBars, type Complexity } from "./big-o";

describe("clampBigON", () => {
  it("keeps in-range values, clamps the rest to 1–20", () => {
    expect(clampBigON(1)).toBe(1);
    expect(clampBigON(20)).toBe(20);
    expect(clampBigON(0)).toBe(1);
    expect(clampBigON(999)).toBe(20);
  });

  it("truncates fractions and treats non-finite input as the floor (clampInt contract)", () => {
    expect(clampBigON(7.9)).toBe(7);
    expect(clampBigON(NaN)).toBe(1);
    expect(clampBigON(Infinity)).toBe(1); // non-finite falls back to min, never the slider itself sends this
  });
});

describe("bigOValue", () => {
  it("matches the textbook formulas", () => {
    expect(bigOValue("o1", 12)).toBe(1);
    expect(bigOValue("on", 12)).toBe(12);
    expect(bigOValue("on2", 12)).toBe(144);
    expect(bigOValue("olog", 8)).toBeCloseTo(3); // log2(8)
    expect(bigOValue("onlogn", 8)).toBeCloseTo(24); // 8 * log2(8)
  });

  it("keeps the log families flat at n <= 1 instead of going negative", () => {
    expect(bigOValue("olog", 1)).toBe(0);
    expect(bigOValue("olog", 0)).toBe(0);
    expect(bigOValue("onlogn", 1)).toBe(1);
    expect(bigOValue("onlogn", 0)).toBe(0);
  });

  it("O(1) ignores n entirely", () => {
    for (const n of [1, 5, 20]) expect(bigOValue("o1", n)).toBe(1);
  });
});

describe("growthBars", () => {
  it("returns the four bars in growth order", () => {
    const kinds = growthBars(10).map((b) => b.kind);
    expect(kinds).toEqual<Complexity[]>(["o1", "olog", "on", "on2"]);
  });

  it("clamps n before evaluating", () => {
    expect(growthBars(999).map((b) => b.value)).toEqual(growthBars(20).map((b) => b.value));
    expect(growthBars(-3).map((b) => b.value)).toEqual(growthBars(1).map((b) => b.value));
  });

  it("stays monotonically non-decreasing across the four bars for n >= 2", () => {
    // At n=1 the log bar is 0 (log2(1)=0) which dips below O(1)=1 — expected.
    // From n=2 up, 1 <= log2(n) <= n <= n^2 holds, so the bars only ever climb.
    for (let n = 2; n <= 20; n++) {
      const values = growthBars(n).map((b) => b.value);
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
      }
    }
  });

  it("formats O(log n) to one decimal and the rest as rounded integers", () => {
    const bars = growthBars(10);
    const log = bars.find((b) => b.kind === "olog")!;
    const quad = bars.find((b) => b.kind === "on2")!;
    expect(log.display).toBe(Math.log2(10).toFixed(1));
    expect(quad.display).toBe("100");
    expect(log.display).toContain(".");
    expect(quad.display).not.toContain(".");
  });
});
