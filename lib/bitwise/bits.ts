// Pure bit-math helpers for the Bitwise & Number Systems tool.
// Everything is framework-agnostic and unit-tested — the UI components only
// render what these functions return. All numbers are treated as 8-bit
// unsigned (0–255), matching how the tool teaches "a byte = 8 bits".

/** The operators the playground supports. */
export type BitOp = "and" | "or" | "xor" | "not" | "shl" | "shr";

/** NOT / left-shift / right-shift act on A alone (B is a shift amount, if any). */
export const UNARY_OPS: readonly BitOp[] = ["not", "shl", "shr"];

export function isUnary(op: BitOp): boolean {
  return UNARY_OPS.includes(op);
}

/** Clamp any input into the 0–255 byte range. */
export function clampByte(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(255, Math.max(0, Math.trunc(n)));
}

/** 8-bit binary string, always padded to 8 chars. Handles negatives via mod. */
export function toBin8(n: number): string {
  return (((n % 256) + 256) % 256).toString(2).padStart(8, "0");
}

/**
 * Bit positions, most-significant first: [7, 6, 5, 4, 3, 2, 1, 0].
 * Position i is worth 2^i.
 */
export function bitPositions(): number[] {
  return Array.from({ length: 8 }, (_, i) => 7 - i);
}

/** The place values, most-significant first: [128, 64, 32, 16, 8, 4, 2, 1]. */
export function placeValues(): number[] {
  return bitPositions().map((p) => 2 ** p);
}

/** One row of the "divide by 2" conversion trace. */
export interface DivStep {
  /** the number being divided at this step */
  value: number;
  /** value ÷ 2, floored */
  quotient: number;
  /** value % 2 — this is the bit, read bottom-to-top */
  remainder: number;
}

/**
 * The classic decimal→binary trace: keep dividing by 2, the remainders read
 * bottom-to-top spell the binary number. Returns one DivStep per division.
 */
export function decimalToBinarySteps(n: number): DivStep[] {
  const value = clampByte(n);
  const steps: DivStep[] = [];
  if (value === 0) {
    return [{ value: 0, quotient: 0, remainder: 0 }];
  }
  let tmp = value;
  while (tmp > 0) {
    steps.push({ value: tmp, quotient: Math.floor(tmp / 2), remainder: tmp % 2 });
    tmp = Math.floor(tmp / 2);
  }
  return steps;
}

/**
 * The "verify" line for a conversion: the set-bit place values that sum to n,
 * e.g. 42 → [32, 8, 2]. Most-significant first.
 */
export function binaryContributions(n: number): number[] {
  const bin = toBin8(clampByte(n));
  const out: number[] = [];
  for (let i = 0; i < 8; i++) {
    if (bin[i] === "1") out.push(2 ** (7 - i));
  }
  return out;
}

/** The full result of applying an operator, everything the UI needs to render. */
export interface OpResult {
  op: BitOp;
  /** the mathematical operator symbol shown to the user */
  symbol: string;
  isUnary: boolean;
  a: number;
  b: number;
  /** shift amount actually used (b & 7), only meaningful for shl/shr */
  shift: number;
  result: number;
  binA: string;
  binB: string;
  binR: string;
  /** plain-English what-this-op-does line */
  explanation: string;
  /** column-level "how to read the result row" hint */
  colExpl: string;
}

/**
 * Apply a bitwise operator to two bytes. Result is always masked to 8 bits so
 * the UI never has to reason about anything wider than a byte.
 */
export function applyOp(aRaw: number, bRaw: number, op: BitOp): OpResult {
  const a = clampByte(aRaw);
  const b = clampByte(bRaw);
  const shift = b & 7;
  const unary = isUnary(op);

  let result: number;
  let symbol: string;
  let explanation: string;
  let colExpl: string;

  switch (op) {
    case "and":
      result = a & b;
      symbol = "&";
      explanation = "keeps a bit only when BOTH A and B have 1 in that position";
      colExpl = "keep only the 1s that appear in BOTH rows above";
      break;
    case "or":
      result = a | b;
      symbol = "|";
      explanation = "keeps a bit when EITHER A or B has 1 in that position";
      colExpl = "keep any 1 from either row above";
      break;
    case "xor":
      result = a ^ b;
      symbol = "^";
      explanation = "keeps a bit only when A and B DIFFER in that position";
      colExpl = "keep 1s only where the two rows DISAGREE";
      break;
    case "not":
      result = ~a & 0xff;
      symbol = "~";
      explanation = "flips every bit: 0→1 and 1→0 (shown as 8-bit unsigned)";
      colExpl = "all bits flipped";
      break;
    case "shl":
      result = (a << shift) & 0xff;
      symbol = "<<";
      explanation = `shifts A's bits ${shift} position(s) left — multiplies by ${2 ** shift}`;
      colExpl = `bits moved left ${shift} place(s), zeros fill from right`;
      break;
    case "shr":
      result = a >> shift;
      symbol = ">>";
      explanation = `shifts A's bits ${shift} position(s) right — divides by ${2 ** shift}`;
      colExpl = `bits moved right ${shift} place(s), zeros fill from left`;
      break;
  }

  return {
    op,
    symbol,
    isUnary: unary,
    a,
    b,
    shift,
    result,
    binA: toBin8(a),
    binB: toBin8(b),
    binR: toBin8(result),
    explanation,
    colExpl,
  };
}
