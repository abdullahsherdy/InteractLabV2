// Pure call-stack step engine for the Recursion & Big-O tool.
//
// All four demo functions are *linear* recursion (one self-call), so the call
// stack grows to the base case and then unwinds. `traceLinear` owns that
// push/pop sequencing once; each function only supplies the per-frame labels
// and narration. Everything here is framework-agnostic and unit-tested — the
// React component just renders the CallStackStep[] this returns.

import { clampInt } from "./util";

/** The demo functions the visualiser can trace. */
export type RecFn = "factorial" | "countdown" | "list_sum" | "reverse";

export const REC_FNS: { value: RecFn; label: string; blurb: string }[] = [
  { value: "factorial", label: "factorial(n)", blurb: "returns a number: n × (n−1) × … × 1" },
  { value: "countdown", label: "countdown(n)", blurb: "prints n … 1 then \"Done!\" — no return value" },
  { value: "list_sum", label: "list_sum(n items)", blurb: "adds up [1, 2, … n] one item at a time" },
  { value: "reverse", label: "reverse(n chars)", blurb: "reverses the first n letters of \"hello\"" },
];

/** Visual state of a single frame in the stack. */
export type FrameState = "active" | "waiting" | "base" | "returning";

export interface Frame {
  /** e.g. "factorial(4)" */
  label: string;
  /** stable position key: 0 = outermost call, larger = deeper */
  depth: number;
  state: FrameState;
  /** the value this frame returns, once known (null while still waiting) */
  retVal: string | null;
}

/** What kind of step this is — drives log colouring. */
export type StepTone = "call" | "base" | "return" | "done";

export interface CallStackStep {
  /** the live stack, outermost (depth 0) first → deepest last */
  frames: Frame[];
  /** plain-English narration for this step */
  caption: string;
  /** one execution-log line */
  log: string;
  tone: StepTone;
  /** the final answer, present only on the closing steps */
  answer: string | null;
}

/** Bound n to the range the visualiser can draw comfortably. */
export function clampCallN(n: number): number {
  return clampInt(n, 1, 7);
}

/** Internal per-frame description handed to the generic tracer. */
interface FrameSpec {
  label: string;
  isBase: boolean;
  /** display of the returned value ("" for a void function like countdown) */
  ret: string;
  callCaption: string;
  callLog: string;
  retCaption: string;
  retLog: string;
}

interface FnTrace {
  /** frames from the outermost call down to the base case */
  frames: FrameSpec[];
  /** final answer display */
  answer: string;
}

/**
 * Turn a linear-recursion description into the full push → unwind → done step
 * list. The stack grows one frame per step, then each frame returns in reverse
 * order, then a final empty-stack step shows the answer.
 */
function traceLinear(trace: FnTrace): CallStackStep[] {
  const specs = trace.frames;
  const steps: CallStackStep[] = [];

  // PUSH — grow the stack one frame at a time.
  for (let top = 0; top < specs.length; top++) {
    const frames: Frame[] = specs.slice(0, top + 1).map((s, idx) => ({
      label: s.label,
      depth: idx,
      state: idx === top ? (s.isBase ? "base" : "active") : "waiting",
      retVal: null,
    }));
    steps.push({
      frames,
      caption: specs[top].callCaption,
      log: specs[top].callLog,
      tone: specs[top].isBase ? "base" : "call",
      answer: null,
    });
  }

  // POP — unwind from the deepest frame back to the outermost.
  for (let top = specs.length - 1; top >= 0; top--) {
    const frames: Frame[] = specs.slice(0, top + 1).map((s, idx) => ({
      label: s.label,
      depth: idx,
      state: idx === top ? "returning" : idx === top - 1 ? "active" : "waiting",
      retVal: idx === top ? (s.ret === "" ? null : s.ret) : null,
    }));
    steps.push({
      frames,
      caption: specs[top].retCaption,
      log: specs[top].retLog,
      tone: "return",
      answer: top === 0 ? trace.answer : null,
    });
  }

  // DONE — empty stack, answer in hand.
  steps.push({
    frames: [],
    caption: `The stack is empty. Final answer: ${trace.answer}.`,
    log: `✓ done — answer = ${trace.answer}`,
    tone: "done",
    answer: trace.answer,
  });

  return steps;
}

function factorialTrace(n: number): FnTrace {
  const fact: number[] = [1];
  for (let i = 1; i <= n; i++) fact[i] = i * fact[i - 1];

  const frames: FrameSpec[] = [];
  for (let k = n; k >= 0; k--) {
    const isBase = k === 0;
    frames.push({
      label: `factorial(${k})`,
      isBase,
      ret: String(fact[k]),
      callCaption: isBase
        ? `Base case reached: factorial(0) = 1. Now Python works back up the stack.`
        : `Call factorial(${k}). It cannot finish until factorial(${k - 1}) comes back, so it waits.`,
      callLog: isBase ? `base: factorial(0) = 1` : `call factorial(${k})`,
      retCaption:
        k === n
          ? `factorial(${n}) returns ${fact[n]} — the final answer.`
          : `factorial(${k}) returns ${fact[k]}. factorial(${k + 1}) now computes ${k + 1} × ${fact[k]} = ${fact[k + 1]}.`,
      retLog: `return factorial(${k}) = ${fact[k]}`,
    });
  }
  return { frames, answer: String(fact[n]) };
}

function countdownTrace(n: number): FnTrace {
  const frames: FrameSpec[] = [];
  for (let k = n; k >= 0; k--) {
    const isBase = k === 0;
    frames.push({
      label: `countdown(${k})`,
      isBase,
      ret: "", // void — nothing to hand back
      callCaption: isBase
        ? `Base case: n = 0. Print "Done!" and return.`
        : `countdown(${k}) prints ${k}, then calls countdown(${k - 1}).`,
      callLog: isBase ? `base: print "Done!"` : `call countdown(${k}) — prints ${k}`,
      retCaption:
        k === n
          ? `countdown(${n}) returns. Every number has been printed.`
          : `countdown(${k}) finishes and hands control back to countdown(${k + 1}).`,
      retLog: `return countdown(${k})`,
    });
  }
  return { frames, answer: "printed ✓" };
}

function listSumTrace(n: number): FnTrace {
  const items = Array.from({ length: n }, (_, i) => i + 1);
  const partial = (from: number) => items.slice(from).reduce((a, b) => a + b, 0);

  const frames: FrameSpec[] = [];
  for (let d = 0; d <= n; d++) {
    const rem = items.slice(d);
    const isBase = rem.length === 0;
    const sum = partial(d);
    frames.push({
      label: `list_sum([${rem.join(", ")}])`,
      isBase,
      ret: String(sum),
      callCaption: isBase
        ? `Base case: the list is empty → return 0.`
        : `list_sum([${rem.join(", ")}]) takes ${rem[0]} + list_sum([${rem.slice(1).join(", ")}]).`,
      callLog: isBase ? `base: list_sum([]) = 0` : `call list_sum([${rem.join(", ")}])`,
      retCaption:
        d === 0
          ? `list_sum([${items.join(", ")}]) returns ${sum} — the final answer.`
          : `list_sum([${rem.join(", ")}]) returns ${sum}.`,
      retLog: `return list_sum([${rem.join(", ")}]) = ${sum}`,
    });
  }
  return { frames, answer: String(partial(0)) };
}

function reverseTrace(n: number): FnTrace {
  const word = "hello".slice(0, n);
  const rev = (s: string) => s.split("").reverse().join("");

  const frames: FrameSpec[] = [];
  for (let d = 0; d <= n; d++) {
    const rem = word.slice(d);
    const isBase = rem === "";
    const r = rev(rem);
    frames.push({
      label: `reverse("${rem}")`,
      isBase,
      ret: `"${r}"`,
      callCaption: isBase
        ? `Base case: the string is empty → return "".`
        : `reverse("${rem}") calls reverse("${rem.slice(1)}"), then adds "${rem[0]}" on the end.`,
      callLog: isBase ? `base: reverse("") = ""` : `call reverse("${rem}")`,
      retCaption:
        d === 0
          ? `reverse("${word}") returns "${r}" — the final answer.`
          : `reverse("${rem}") returns "${r}".`,
      retLog: `return reverse("${rem}") = "${r}"`,
    });
  }
  return { frames, answer: `"${rev(word)}"` };
}

/**
 * Build the full step list for a function and input size. n is clamped to 1–7.
 * Every trace has exactly 2·n + 3 steps: (n+1) pushes, (n+1) pops, 1 done.
 */
export function buildSteps(fn: RecFn, nRaw: number): CallStackStep[] {
  const n = clampCallN(nRaw);
  switch (fn) {
    case "factorial":
      return traceLinear(factorialTrace(n));
    case "countdown":
      return traceLinear(countdownTrace(n));
    case "list_sum":
      return traceLinear(listSumTrace(n));
    case "reverse":
      return traceLinear(reverseTrace(n));
  }
}
