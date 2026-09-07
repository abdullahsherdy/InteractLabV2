import { describe, expect, it } from "vitest";
import { compareOps, isSorted, MAX_LEN, parseArray } from "./util";

describe("parseArray", () => {
  it("parses a comma-separated list", () => {
    expect(parseArray("5, 3, 8, 1")).toEqual([5, 3, 8, 1]);
  });

  it("accepts arbitrary non-digit separators", () => {
    expect(parseArray("5 3\t8\n1")).toEqual([5, 3, 8, 1]);
    expect(parseArray("64;25 | 12")).toEqual([64, 25, 12]);
  });

  it("drops values outside 1..99 rather than clamping", () => {
    expect(parseArray("0, 5, 100, 42, 99, 150")).toEqual([5, 42, 99]);
  });

  it("ignores non-numeric junk and empty input", () => {
    expect(parseArray("abc")).toEqual([]);
    expect(parseArray("")).toEqual([]);
    expect(parseArray("   ")).toEqual([]);
  });

  it("caps the array at MAX_LEN elements", () => {
    const many = Array.from({ length: 30 }, (_, i) => (i % 9) + 1).join(",");
    expect(parseArray(many)).toHaveLength(MAX_LEN);
  });
});

describe("isSorted", () => {
  it("recognises sorted and unsorted arrays", () => {
    expect(isSorted([])).toBe(true);
    expect(isSorted([1])).toBe(true);
    expect(isSorted([1, 2, 2, 3])).toBe(true);
    expect(isSorted([1, 3, 2])).toBe(false);
  });
});

describe("compareOps", () => {
  it("orders the six algorithms with the O(1) baseline smallest", () => {
    const rows = compareOps(20);
    expect(rows.map((r) => r.algo)).toEqual([
      "Bubble",
      "Selection",
      "Insertion",
      "Merge",
      "Quick (avg)",
      "Dict lookup",
    ]);
    const dict = rows.find((r) => r.algo === "Dict lookup")!;
    expect(dict.ops).toBe(1);
  });

  it("makes the n² term dwarf the n log n term as n grows", () => {
    const rows = compareOps(30);
    const bubble = rows.find((r) => r.algo === "Bubble")!;
    const merge = rows.find((r) => r.algo === "Merge")!;
    expect(bubble.ops).toBe(900);
    expect(merge.ops).toBeLessThan(bubble.ops);
    expect(merge.ops).toBeGreaterThan(0);
  });

  it("never lets the n log n term drop below n for tiny inputs", () => {
    // log2(1) = 0 would zero the bar; the floor keeps it at n.
    const rows = compareOps(1);
    const merge = rows.find((r) => r.algo === "Merge")!;
    expect(merge.ops).toBeGreaterThanOrEqual(1);
  });

  it("tags tones consistently with complexity class", () => {
    for (const r of compareOps(10)) {
      if (r.complexity === "O(n²)") expect(r.tone).toBe("slow");
      if (r.complexity === "O(1)") expect(r.tone).toBe("fast");
    }
  });
});
