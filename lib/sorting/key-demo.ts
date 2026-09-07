// The Python `sorted(key=...)` demo. Each variant sorts the same fixed data a
// different way; the results are computed here (mirroring Python's stable sort)
// so the component only renders them, and so the exact orderings are pinned by
// tests. JS `Array.prototype.sort` is stable (V8), matching Python's `sorted`.

export type KeyDemoKind = "len" | "last" | "grade_desc" | "multi" | "stability";

export interface Student {
  name: string;
  grade: number;
}

export interface KeyDemoResult {
  kind: KeyDemoKind;
  title: string;
  code: string;
  /** Input rendered as display tokens, in original order. */
  before: string[];
  /** Sorted output rendered as display tokens. */
  after: string[];
  note: string;
}

// Words for the length / last-letter demos.
export const WORDS = ["banana", "fig", "cherry", "apple", "kiwi"];

// Students — deliberately NOT in alphabetical order, so the multi-key sort
// reorders tied grades differently from the plain (stable) grade sort.
export const STUDENTS: Student[] = [
  { name: "Sara", grade: 85 },
  { name: "Omar", grade: 92 },
  { name: "Lina", grade: 78 },
  { name: "Adam", grade: 85 },
  { name: "Nour", grade: 92 },
];

const student = (s: Student) => `${s.name} (${s.grade})`;

export const KEY_DEMO_KINDS: { value: KeyDemoKind; label: string }[] = [
  { value: "len", label: "Sort words by length" },
  { value: "last", label: "Sort words by last letter" },
  { value: "grade_desc", label: "Students by grade, highest first" },
  { value: "multi", label: "By grade (desc), then name (A→Z)" },
  { value: "stability", label: "Stability — equal grades keep order" },
];

export function runKeyDemo(kind: KeyDemoKind): KeyDemoResult {
  switch (kind) {
    case "len": {
      const after = [...WORDS].sort((a, b) => a.length - b.length);
      return {
        kind,
        title: "key=len",
        code: "sorted(words, key=len)",
        before: WORDS,
        after,
        note: "Sorts by word length, shortest first. banana stays before cherry — both are 6 letters, so the original order is kept (stable).",
      };
    }
    case "last": {
      const lastCh = (w: string) => w[w.length - 1];
      const after = [...WORDS].sort((a, b) => lastCh(a).localeCompare(lastCh(b)));
      return {
        kind,
        title: "key=lambda w: w[-1]",
        code: "sorted(words, key=lambda w: w[-1])",
        before: WORDS,
        after,
        note: "The key can be any function. Here each word is compared by its last letter: banana→a, apple→e, fig→g, kiwi→i, cherry→y.",
      };
    }
    case "grade_desc": {
      const after = [...STUDENTS].sort((a, b) => b.grade - a.grade);
      return {
        kind,
        title: "key=..., reverse=True",
        code: "sorted(students, key=lambda s: s.grade, reverse=True)",
        before: STUDENTS.map(student),
        after: after.map(student),
        note: "Highest grade first. Omar stays before Nour — equal grades keep their original order even when reversed (stable).",
      };
    }
    case "multi": {
      const after = [...STUDENTS].sort((a, b) => b.grade - a.grade || a.name.localeCompare(b.name));
      return {
        kind,
        title: "tuple key: (-grade, name)",
        code: "sorted(students, key=lambda s: (-s.grade, s.name))",
        before: STUDENTS.map(student),
        after: after.map(student),
        note: "A tuple key sorts by grade descending, then breaks ties by name A→Z. Now Nour comes before Omar and Adam before Sara — different from the plain grade sort.",
      };
    }
    case "stability": {
      const after = [...STUDENTS].sort((a, b) => a.grade - b.grade);
      return {
        kind,
        title: "stable sort",
        code: "sorted(students, key=lambda s: s.grade)",
        before: STUDENTS.map(student),
        after: after.map(student),
        note: "Lowest grade first. Among the 85s, Sara stays before Adam because she came first in the input — a stable sort never reorders equal keys.",
      };
    }
  }
}
