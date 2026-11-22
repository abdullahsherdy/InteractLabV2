import type { Cell, Frame } from "./types";
export type Memory = Record<string, Cell>;
export function replay(frames: Frame[], index: number): Memory {
  const state: Memory = {};
  for (const frame of frames.slice(0, index + 1)) {
    for (const op of frame.ops) {
      switch (op.kind) {
        case "set":
          state[op.id] = { ...state[op.id], value: op.value };
          break;
        case "point":
          state[op.id] = { ...state[op.id], target: op.target };
          break;
        case "free":
          for (const cell of Object.values(state)) {
            if (
              cell.id === op.id ||
              (state[op.id]?.group && cell.group === state[op.id].group)
            )
              state[cell.id] = { ...cell, freed: true };
          }
          break;
        case "remove":
          delete state[op.id];
          break;
        default:
          state[op.id] = { ...op };
      }
    }
  }
  return state;
}
export function pointerState(
  cell: Cell,
  state: Memory,
): "valid" | "null" | "wild" | "dangling" {
  if (cell.target === null) return "null";
  if (cell.target === undefined || cell.target === "wild") return "wild";
  return !state[cell.target] || state[cell.target].freed ? "dangling" : "valid";
}
// Reachability is a teaching model, not a general C++ ownership analyzer.
// Follow all stack roots, aggregate members, and pointer chains, including cycles.
export function unreachableHeap(state: Memory): string[] {
  const reached = new Set<string>();
  function visit(id: string) {
    const cell = state[id];
    if (!cell || cell.freed || reached.has(id)) return;
    reached.add(id);
    if (cell.group)
      for (const sibling of Object.values(state))
        if (sibling.group === cell.group) visit(sibling.id);
    if (cell.target) visit(cell.target);
  }
  for (const cell of Object.values(state))
    if (cell.zone === "stack") visit(cell.id);
  return Object.values(state)
    .filter((c) => c.zone === "heap" && !c.freed && !reached.has(c.id))
    .map((c) => c.id);
}
export function checkpointLimit(
  frames: Frame[],
  from: number,
  requested: number,
  revealed: number[],
): number {
  if (requested <= from) return Math.max(0, requested);
  const stop = frames.findIndex(
    (f, i) =>
      i >= from && i <= requested && f.prediction && !revealed.includes(i),
  );
  return Math.min(stop < 0 ? requested : stop, frames.length - 1);
}
export function dwellTime(narration: string, speed: number): number {
  return Math.max(2200, narration.length * 62) / speed;
}
