// Pure, tested operations for the Stacks & Queues visualiser.
//
// Mirrors the lib/linked-list pattern: a module-level id counter (resetIds /
// nextId), a clone() for immutable snapshots, and a small StepBuilder whose
// snap() pushes a deep-cloned frame. Every exported op takes the current state
// and returns Step[] — it never mutates its input, so a component can hold the
// committed state in useState and swap in a fresh steps array per operation.

import type { Cell, CellValue, Step, StructState, Structure } from "./types";

let idCounter = 0;

/** Reset the id counter — call once when seeding a fresh structure. */
export function resetIds(): void {
  idCounter = 0;
}

function nextId(): string {
  idCounter += 1;
  return `c${idCounter}`;
}

/** Deep-clone a state so each Step owns an independent snapshot. */
export function clone(state: StructState): StructState {
  return {
    kind: state.kind,
    cells: state.cells.map((c) => ({ ...c })),
    activeId: state.activeId ?? null,
    returned: state.returned ?? null,
  };
}

function seed(kind: Structure, values: CellValue[]): StructState {
  resetIds();
  return {
    kind,
    cells: values.map((v) => ({ id: nextId(), value: v })),
    activeId: null,
    returned: null,
  };
}

/** Build a fresh stack (index 0 = bottom, last = top). */
export function makeStack(values: CellValue[]): StructState {
  return seed("stack", values);
}

/** Build a fresh queue (index 0 = front, last = back). */
export function makeQueue(values: CellValue[]): StructState {
  return seed("queue", values);
}

/** Format a value for captions — strings get quotes so they read clearly. */
function fmt(v: CellValue): string {
  return typeof v === "string" ? `"${v}"` : String(v);
}

class StepBuilder {
  steps: Step[] = [];
  state: StructState;

  constructor(initial: StructState) {
    this.state = clone(initial);
  }

  snap(caption: string): void {
    this.steps.push({ state: clone(this.state), caption });
  }
}

// ── Stack operations ────────────────────────────────────────────────────────

/** Push a value onto the top of the stack. */
export function pushSteps(initial: StructState, value: CellValue): Step[] {
  const b = new StepBuilder(initial);
  b.state.returned = null;
  b.state.activeId = null;
  b.snap(`push(${fmt(value)}) — add ${fmt(value)} to the top of the stack`);

  const cell: Cell = { id: nextId(), value };
  b.state.cells.push(cell);
  b.state.activeId = cell.id;
  b.snap(`${fmt(value)} sits on top now — stack.append(${fmt(value)}), O(1)`);

  b.state.activeId = null;
  b.snap(`the top is stack[-1] = ${fmt(value)}`);
  return b.steps;
}

/** Pop the top value off the stack (LIFO — last in, first out). */
export function popSteps(initial: StructState): Step[] {
  const b = new StepBuilder(initial);
  b.state.returned = null;
  b.state.activeId = null;

  if (b.state.cells.length === 0) {
    b.snap("pop() on an empty stack — nothing to remove (Python raises IndexError)");
    return b.steps;
  }

  const top = b.state.cells[b.state.cells.length - 1];
  b.state.activeId = top.id;
  b.snap(`pop() — take the most recent item off the top: ${fmt(top.value)}`);

  b.state.cells.pop();
  b.state.activeId = null;
  b.state.returned = top.value;
  b.snap(`removed ${fmt(top.value)} — stack.pop() returns it, O(1)`);
  return b.steps;
}

/** Peek at the top value without removing it. */
export function peekStackSteps(initial: StructState): Step[] {
  const b = new StepBuilder(initial);
  b.state.returned = null;
  b.state.activeId = null;

  if (b.state.cells.length === 0) {
    b.snap("peek on an empty stack — nothing on top yet");
    return b.steps;
  }

  const top = b.state.cells[b.state.cells.length - 1];
  b.state.activeId = top.id;
  b.state.returned = top.value;
  b.snap(`peek — read the top without removing it: stack[-1] = ${fmt(top.value)}`);
  return b.steps;
}

// ── Queue operations ────────────────────────────────────────────────────────

/** Enqueue a value at the back of the queue. */
export function enqueueSteps(initial: StructState, value: CellValue): Step[] {
  const b = new StepBuilder(initial);
  b.state.returned = null;
  b.state.activeId = null;
  b.snap(`enqueue(${fmt(value)}) — ${fmt(value)} joins at the back of the line`);

  const cell: Cell = { id: nextId(), value };
  b.state.cells.push(cell);
  b.state.activeId = cell.id;
  b.snap(`${fmt(value)} waits at the back — q.append(${fmt(value)}), O(1)`);

  b.state.activeId = null;
  const front = b.state.cells[0];
  b.snap(`the front is still ${fmt(front.value)} — first in line, first out`);
  return b.steps;
}

/** Dequeue the front value (FIFO — first in, first out). */
export function dequeueSteps(initial: StructState): Step[] {
  const b = new StepBuilder(initial);
  b.state.returned = null;
  b.state.activeId = null;

  if (b.state.cells.length === 0) {
    b.snap("dequeue on an empty queue — no one is waiting");
    return b.steps;
  }

  const front = b.state.cells[0];
  b.state.activeId = front.id;
  b.snap(`dequeue — whoever arrived first goes first: ${fmt(front.value)}`);

  b.state.cells.shift();
  b.state.activeId = null;
  b.state.returned = front.value;
  b.snap(`served ${fmt(front.value)} — q.popleft(), O(1); everyone shifts forward`);
  return b.steps;
}

/** Peek at the front value without removing it. */
export function peekQueueSteps(initial: StructState): Step[] {
  const b = new StepBuilder(initial);
  b.state.returned = null;
  b.state.activeId = null;

  if (b.state.cells.length === 0) {
    b.snap("peek on an empty queue — no front yet");
    return b.steps;
  }

  const front = b.state.cells[0];
  b.state.activeId = front.id;
  b.state.returned = front.value;
  b.snap(`peek — read the front without removing it: q[0] = ${fmt(front.value)}`);
  return b.steps;
}

// ── Shared ──────────────────────────────────────────────────────────────────

/** Clear every cell (works for either structure). */
export function clearSteps(initial: StructState): Step[] {
  const b = new StepBuilder(initial);
  b.state.returned = null;
  b.state.activeId = null;

  if (b.state.cells.length === 0) {
    b.snap("already empty — nothing to clear");
    return b.steps;
  }

  b.snap("clear — remove everything at once");
  b.state.cells = [];
  b.snap("empty — length is 0");
  return b.steps;
}
