export type Target = string | null;
export type Zone = "stack" | "heap";
export interface Cell {
  id: string;
  name: string;
  zone: Zone;
  address: number;
  kind: "value" | "pointer" | "reference";
  value?: string;
  target?: Target;
  freed?: boolean;
  group?: string;
}
export type Op =
  | Cell
  | { kind: "set"; id: string; value: string }
  | { kind: "point"; id: string; target: Target }
  | { kind: "free" | "remove"; id: string };
export interface Question {
  q: string;
  answer: string;
  why: string;
}
export interface Check extends Question {
  type: "trace" | "bug" | "draw";
}
export interface Frame {
  line: number;
  narration: string;
  ops: Op[];
  highlight?: string[];
  prediction?: Question;
}
export interface Lesson {
  id: string;
  title: string;
  hook: string;
  code: string[];
  prelude?: string;
  frames: Frame[];
  checks: Check[];
  takeaway: string;
  note?: string;
  verify: string;
  expected: string;
  savitch: string;
  optional?: boolean;
  beyond?: boolean;
}
export interface Level {
  level: number;
  slug: string;
  title: string;
  description: string;
  prerequisite: string;
  lessons: Lesson[];
}
