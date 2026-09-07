import { describe, expect, it } from "vitest";
import { buildSteps, clampCallN, REC_FNS, type RecFn } from "./call-stack";

// Independent references for the four demo functions' final answers.
function refFactorial(n: number): string {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return String(f);
}
function refListSum(n: number): string {
  return String((n * (n + 1)) / 2); // sum of 1..n
}
function refReverse(n: number): string {
  const word = "hello".slice(0, n);
  return `"${word.split("").reverse().join("")}"`;
}

const ALL: RecFn[] = ["factorial", "countdown", "list_sum", "reverse"];

describe("REC_FNS", () => {
  it("offers the four demo functions with labels and blurbs", () => {
    expect(REC_FNS.map((f) => f.value)).toEqual(ALL);
    for (const f of REC_FNS) {
      expect(f.label.length).toBeGreaterThan(0);
      expect(f.blurb.length).toBeGreaterThan(0);
    }
  });
});

describe("clampCallN", () => {
  it("bounds n to 1–7 and truncates", () => {
    expect(clampCallN(0)).toBe(1);
    expect(clampCallN(7)).toBe(7);
    expect(clampCallN(50)).toBe(7);
    expect(clampCallN(3.9)).toBe(3);
    expect(clampCallN(NaN)).toBe(1);
  });
});

describe("buildSteps — shape", () => {
  it("produces exactly 2n+3 steps for every function and size", () => {
    for (const fn of ALL) {
      for (let n = 1; n <= 7; n++) {
        expect(buildSteps(fn, n)).toHaveLength(2 * n + 3);
      }
    }
  });

  it("clamps n before building", () => {
    for (const fn of ALL) {
      expect(buildSteps(fn, 99)).toHaveLength(buildSteps(fn, 7).length);
      expect(buildSteps(fn, 0)).toHaveLength(buildSteps(fn, 1).length);
    }
  });

  it("grows the stack 1..n+1, unwinds it n+1..1, then empties it", () => {
    const n = 4;
    const counts = buildSteps("factorial", n).map((s) => s.frames.length);
    const push = Array.from({ length: n + 1 }, (_, i) => i + 1); // 1..n+1
    const pop = [...push].reverse(); // n+1..1
    expect(counts).toEqual([...push, ...pop, 0]);
  });

  it("every step carries a caption and a log line", () => {
    for (const fn of ALL) {
      for (const step of buildSteps(fn, 5)) {
        expect(step.caption.length).toBeGreaterThan(0);
        expect(step.log.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("buildSteps — frame semantics", () => {
  it("keys frames by depth = index, outermost first", () => {
    const step = buildSteps("factorial", 5).find((s) => s.frames.length === 4)!;
    expect(step.frames.map((f) => f.depth)).toEqual([0, 1, 2, 3]);
  });

  it("shows exactly one base frame, reached at the bottom of the push phase", () => {
    for (const fn of ALL) {
      const steps = buildSteps(fn, 4);
      const withBase = steps.filter((s) => s.frames.some((f) => f.state === "base"));
      expect(withBase).toHaveLength(1);
      // it is the deepest push step (full stack, base tone)
      expect(withBase[0].frames).toHaveLength(5); // n+1
      expect(withBase[0].tone).toBe("base");
      expect(withBase[0].frames.at(-1)!.state).toBe("base");
    }
  });

  it("marks the top frame returning while the caller becomes active during unwind", () => {
    const steps = buildSteps("factorial", 4);
    // first pop step: full stack, top returning, the frame below it active
    const firstPop = steps[5]; // 0..4 are pushes (n+1=5), index 5 is first pop
    expect(firstPop.tone).toBe("return");
    expect(firstPop.frames.at(-1)!.state).toBe("returning");
    expect(firstPop.frames.at(-2)!.state).toBe("active");
  });

  it("ends with an empty stack and the answer in hand", () => {
    for (const fn of ALL) {
      const last = buildSteps(fn, 3).at(-1)!;
      expect(last.frames).toEqual([]);
      expect(last.tone).toBe("done");
      expect(last.answer).not.toBeNull();
    }
  });
});

describe("buildSteps — answers match reference implementations", () => {
  it("factorial(n) = n!", () => {
    for (let n = 1; n <= 7; n++) {
      expect(buildSteps("factorial", n).at(-1)!.answer).toBe(refFactorial(n));
    }
  });

  it("list_sum([1..n]) = n(n+1)/2", () => {
    for (let n = 1; n <= 7; n++) {
      expect(buildSteps("list_sum", n).at(-1)!.answer).toBe(refListSum(n));
    }
  });

  it("reverse reverses the first n letters of \"hello\"", () => {
    for (let n = 1; n <= 5; n++) {
      expect(buildSteps("reverse", n).at(-1)!.answer).toBe(refReverse(n));
    }
  });

  it("countdown reports it printed (void function)", () => {
    expect(buildSteps("countdown", 4).at(-1)!.answer).toBe("printed ✓");
  });

  it("surfaces the answer only on the two closing steps (final return + done)", () => {
    const steps = buildSteps("factorial", 4);
    const withAnswer = steps.filter((s) => s.answer !== null);
    expect(withAnswer).toHaveLength(2);
    expect(withAnswer[0]).toBe(steps.at(-2)); // final return
    expect(withAnswer[1]).toBe(steps.at(-1)); // done
  });
});
