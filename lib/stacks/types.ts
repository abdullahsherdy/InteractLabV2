// Pure data model for the Stacks & Queues visualiser.
//
// A stack and a queue are both just an ordered row of cells; what differs is
// *which end* each operation touches and how the canvas draws them. We keep the
// array in Python order so the code snippets on the page line up exactly with
// the model:
//   • stack  — cells[0] is the bottom, cells[last] is the top (stack[-1]).
//               push = append to the end, pop = remove the end.
//   • queue  — cells[0] is the front (leaves first, popleft), cells[last] is
//               the back (joins via append).
//
// Operations are pure functions that return an array of Step snapshots; the
// canvas renders one Step at a time and animates between them (see operations.ts).

export type CellValue = number | string;

/** One value in the structure, with a stable id so the canvas can animate it. */
export interface Cell {
  id: string;
  value: CellValue;
}

export type Structure = "stack" | "queue";

/** A snapshot of a stack or queue at a single animation step. */
export interface StructState {
  kind: Structure;
  /** Python-ordered: index 0 is bottom/front, last index is top/back. */
  cells: Cell[];
  /** id of the cell to spotlight (being read, just added, or about to leave). */
  activeId?: string | null;
  /** value a pop / dequeue / peek yielded, shown in the returned-value badge. */
  returned?: CellValue | null;
}

/** One frame of an operation: the state to draw plus the narration caption. */
export interface Step {
  state: StructState;
  caption: string;
}
