import { describe, expect, it } from "vitest";
import {
  applyOp,
  binaryContributions,
  bitPositions,
  clampByte,
  decimalToBinarySteps,
  isUnary,
  placeValues,
  toBin8,
  type BitOp,
} from "./bits";

describe("clampByte", () => {
  it("keeps in-range values untouched", () => {
    expect(clampByte(0)).toBe(0);
    expect(clampByte(42)).toBe(42);
    expect(clampByte(255)).toBe(255);
  });

  it("clamps out-of-range values into 0–255", () => {
    expect(clampByte(-5)).toBe(0);
    expect(clampByte(999)).toBe(255);
  });

  it("truncates fractions and treats non-finite input as 0", () => {
    expect(clampByte(42.9)).toBe(42);
    expect(clampByte(NaN)).toBe(0);
    expect(clampByte(Infinity)).toBe(0);
    expect(clampByte(-Infinity)).toBe(0);
  });
});

describe("toBin8", () => {
  it("always returns 8 padded characters", () => {
    expect(toBin8(0)).toBe("00000000");
    expect(toBin8(255)).toBe("11111111");
    expect(toBin8(42)).toBe("00101010");
  });

  it("wraps values via mod 256 rather than throwing", () => {
    expect(toBin8(256)).toBe("00000000");
    expect(toBin8(-1)).toBe("11111111");
  });
});

describe("bitPositions / placeValues", () => {
  it("lists positions most-significant first", () => {
    expect(bitPositions()).toEqual([7, 6, 5, 4, 3, 2, 1, 0]);
  });

  it("lists place values most-significant first", () => {
    expect(placeValues()).toEqual([128, 64, 32, 16, 8, 4, 2, 1]);
  });
});

describe("decimalToBinarySteps", () => {
  it("returns a single zero row for 0", () => {
    expect(decimalToBinarySteps(0)).toEqual([{ value: 0, quotient: 0, remainder: 0 }]);
  });

  it("produces remainders that read bottom-to-top as the binary digits", () => {
    const steps = decimalToBinarySteps(42);
    const bottomToTop = steps
      .map((s) => s.remainder)
      .reverse()
      .join("");
    // 42 = 101010, and toBin8 pads to 00101010
    expect(bottomToTop).toBe("101010");
    expect(toBin8(42).replace(/^0+/, "")).toBe(bottomToTop);
  });

  it("has one step per division and each quotient halves the value", () => {
    const steps = decimalToBinarySteps(200);
    for (const s of steps) {
      expect(s.quotient).toBe(Math.floor(s.value / 2));
      expect(s.remainder).toBe(s.value % 2);
    }
    expect(steps.at(-1)!.quotient).toBe(0);
  });
});

describe("binaryContributions", () => {
  it("returns the set-bit place values, most-significant first", () => {
    expect(binaryContributions(42)).toEqual([32, 8, 2]);
    expect(binaryContributions(255)).toEqual([128, 64, 32, 16, 8, 4, 2, 1]);
    expect(binaryContributions(0)).toEqual([]);
  });

  it("always sums back to the original byte", () => {
    for (let n = 0; n <= 255; n++) {
      const sum = binaryContributions(n).reduce((a, b) => a + b, 0);
      expect(sum).toBe(n);
    }
  });
});

describe("applyOp", () => {
  it("marks the right operators as unary", () => {
    expect(isUnary("not")).toBe(true);
    expect(isUnary("shl")).toBe(true);
    expect(isUnary("shr")).toBe(true);
    expect(isUnary("and")).toBe(false);
  });

  it("agrees with native operators, masked to a byte", () => {
    const a = 12;
    const b = 10;
    expect(applyOp(a, b, "and").result).toBe(a & b);
    expect(applyOp(a, b, "or").result).toBe(a | b);
    expect(applyOp(a, b, "xor").result).toBe(a ^ b);
    expect(applyOp(a, b, "not").result).toBe(~a & 0xff);
  });

  it("uses shift = b & 7 and stays within a byte for left shift", () => {
    const r = applyOp(1, 9, "shl"); // 9 & 7 === 1
    expect(r.shift).toBe(1);
    expect(r.result).toBe(2);
    expect(applyOp(255, 4, "shl").result).toBe((255 << 4) & 0xff);
  });

  it("right shift divides by the power of two", () => {
    expect(applyOp(200, 1, "shr").result).toBe(100);
    expect(applyOp(200, 3, "shr").result).toBe(25);
  });

  it("returns 8-bit binary strings and populated explanation text for every op", () => {
    const ops: BitOp[] = ["and", "or", "xor", "not", "shl", "shr"];
    for (const op of ops) {
      const r = applyOp(170, 85, op);
      expect(r.binA).toHaveLength(8);
      expect(r.binB).toHaveLength(8);
      expect(r.binR).toHaveLength(8);
      expect(r.binR).toBe(toBin8(r.result));
      expect(r.explanation.length).toBeGreaterThan(0);
      expect(r.colExpl.length).toBeGreaterThan(0);
      expect(r.symbol.length).toBeGreaterThan(0);
    }
  });

  it("clamps operands before applying", () => {
    const r = applyOp(-1, 999, "and");
    expect(r.a).toBe(0);
    expect(r.b).toBe(255);
    expect(r.result).toBe(0);
  });
});
