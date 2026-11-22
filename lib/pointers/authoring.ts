import type { Cell, Check, Frame, Lesson, Op, Question, Zone } from "./types";
export const v = (
  id: string,
  value: string,
  zone: Zone = "stack",
  address = 1000,
  group?: string,
): Cell => ({ kind: "value", id, name: id, value, zone, address, group });
export const p = (
  id: string,
  target: string | null,
  zone: Zone = "stack",
  address = 1040,
  group?: string,
): Cell => ({ kind: "pointer", id, name: id, target, zone, address, group });
export const set = (id: string, value: string): Op => ({
  kind: "set",
  id,
  value,
});
export const point = (id: string, target: string | null): Op => ({
  kind: "point",
  id,
  target,
});
export const free = (id: string): Op => ({ kind: "free", id });
type QA = [string, string, string];
type Step = [string, string, Op[]?];
interface Draft {
  id: string;
  title: string;
  hook: string;
  steps: Step[];
  predict: QA;
  trace: QA;
  bug: QA;
  draw: QA;
  takeaway: string;
  verify: string;
  expected: string;
  note?: string;
  prelude?: string;
  optional?: boolean;
  beyond?: boolean;
}
const refs: Record<number, string> = {
  0: "Prerequisite: variables and block scope",
  1: "Savitch 10th ed. §9.1, p. 542",
  2: "Savitch 10th ed. §9.1, p. 542",
  3: "Savitch 10th ed. §5.2, p. 291; §9.1, p. 542",
  4: "Savitch 10th ed. §9.1, p. 542",
  5: "Savitch 10th ed. §9.2, p. 555; §7.2, p. 423",
  6: "Savitch 10th ed. §13.1, p. 774",
  7: "Savitch 10th ed. §9.2, p. 564 (optional)",
  8: "Practice built on earlier lessons; no additional page claim",
};
function question([q, answer, why]: QA): Question {
  return { q, answer, why };
}
export function lesson(d: Draft): Lesson {
  const code = d.steps.map((s) => s[0]);
  const frames: Frame[] = [
    { line: -1, narration: d.hook, ops: [] },
    {
      line: -1,
      narration:
        "Memory is a street of numbered houses. A value belongs inside a house; its address identifies the house. Addresses here are illustrative, not actual program addresses.",
      ops: [],
    },
  ];
  d.steps.forEach(([_, narration, ops], line) => {
    if (line === d.steps.length - 1)
      frames.push({
        line: -1,
        narration: "Before the next line runs, predict what changes.",
        ops: [],
        prediction: question(d.predict),
      });
    frames.push({
      line,
      narration,
      ops: ops ?? [],
      highlight: (ops ?? []).map((o) => o.id),
    });
  });
  frames.push({ line: -1, narration: d.takeaway, ops: [] });
  const checks: Check[] = [
    { type: "trace", ...question(d.trace) },
    { type: "bug", ...question(d.bug) },
    { type: "draw", ...question(d.draw) },
  ];
  return {
    id: d.id,
    title: d.title,
    hook: d.hook,
    code,
    frames,
    checks,
    takeaway: d.takeaway,
    note: d.note,
    prelude: d.prelude,
    optional: d.optional,
    beyond: d.beyond,
    verify: d.verify,
    expected: d.expected,
    savitch: d.id.startsWith("8.5")
      ? "Savitch 10th ed. §11.4, p. 701"
      : refs[Number(d.id[0])],
  };
}

export const nodeDefinition = "struct Node { int value; Node* next; };";
export const node = (
  name: string,
  value: string,
  next: string | null,
  zone: Zone,
  address: number,
): Op[] => [
  v(name, value, zone, address, name),
  { ...p(`${name}.next`, next, zone, address + 8, name), name: `${name}.next` },
];
