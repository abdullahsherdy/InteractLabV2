// Shared types for Problem Walkthroughs.
//
// A walkthrough is a list of WalkStep snapshots. Each step is produced by
// running the REAL algorithm and snapshotting its state at every meaningful
// transition (see the *Steps functions in each problem file). The trace is
// always generated, never hand-authored — that keeps the animation honest.

/** A pointer/marker sitting on (or past) an array cell. */
export interface Marker {
  /** Array index the marker points at. Use values.length to sit "past the end". */
  index: number;
  label: string;
  color: string;
  /** Draw above the cells (true) or below (false). */
  above?: boolean;
}

/** A contiguous highlighted range of cells, drawn as a whiteboard bracket. */
export interface WindowRange {
  start: number; // inclusive
  end: number; // inclusive
  color: string;
  label?: string;
}

/** Visual payload for an array-based walkthrough. */
export interface ArrayViz {
  kind: "array";
  values: (number | string)[];
  markers: Marker[];
  window: WindowRange | null;
  /** Cell indices to flash on this step. */
  flash: number[];
}

export type Viz = ArrayViz;

/** One entry on the "variables board" shown beside the animation. */
export interface VarBinding {
  name: string;
  value: string; // already display-formatted
  color?: string; // design token, e.g. "var(--purple)"
  /** Pulse this binding on the current step (it just changed). */
  changed?: boolean;
}

/** A single frame of a walkthrough. */
export interface WalkStep {
  viz: Viz;
  vars: VarBinding[];
  /** 0-indexed line into Problem.code that is "executing" now (-1 = none). */
  codeLine: number;
  /** Plain-English narration for this step. */
  narration: string;
  /** Optional grouping label, e.g. "Setup", "Expand", "Shrink". */
  phase?: string;
}

export interface WorkedExample {
  input: string;
  output: string;
  why: string;
}

export interface Problem {
  slug: string;
  title: string;
  emoji: string;
  iconClass: "teal" | "purple" | "amber" | "blue" | "green";
  tags: string[];
  difficulty: "easy" | "medium" | "medium-hard";
  /** Short one-liner for the card grid. */
  oneLiner: string;
  /** The big idea / analogy, shown up top. */
  intuition: string;
  /** Full problem statement (plain paragraphs, split on "\n\n"). */
  statement: string;
  examples: WorkedExample[];
  /** Language label for the code panel, e.g. "Python". */
  language: string;
  /** Pseudocode lines rendered in the code panel; codeLine indexes this. */
  code: string[];
  complexity: { time: string; space: string; note: string };
  /** Generates the animation trace by running the real algorithm. */
  build: () => WalkStep[];
  /** "Where this connects" footer. */
  connectsTo: string;
}
