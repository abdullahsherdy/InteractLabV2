import { describe, expect, it } from "vitest";
import {
  clearSteps,
  clone,
  dequeueSteps,
  enqueueSteps,
  makeQueue,
  makeStack,
  peekQueueSteps,
  peekStackSteps,
  popSteps,
  pushSteps,
  resetIds,
} from "./operations";
import type { StructState } from "./types";

/** Values of a state's cells, in array order, for terse assertions. */
function values(state: StructState) {
  return state.cells.map((c) => c.value);
}

/** The final snapshot an operation produced. */
function final(steps: { state: StructState }[]) {
  return steps[steps.length - 1].state;
}

describe("seeding", () => {
  it("makeStack builds cells in Python order (index 0 = bottom, last = top)", () => {
    const s = makeStack([9, 1, 7, 3]);
    expect(s.kind).toBe("stack");
    expect(values(s)).toEqual([9, 1, 7, 3]);
    expect(s.cells[s.cells.length - 1].value).toBe(3); // top = stack[-1]
    expect(s.activeId).toBeNull();
    expect(s.returned).toBeNull();
  });

  it("makeQueue builds cells front-to-back (index 0 = front)", () => {
    const q = makeQueue([5, 2, 8]);
    expect(q.kind).toBe("queue");
    expect(values(q)).toEqual([5, 2, 8]);
    expect(q.cells[0].value).toBe(5); // front
  });

  it("resetIds makes ids deterministic across builds", () => {
    resetIds();
    const a = makeStack([1, 2]);
    const b = makeStack([1, 2]);
    expect(a.cells.map((c) => c.id)).toEqual(b.cells.map((c) => c.id));
    expect(a.cells[0].id).toBe("c1");
  });

  it("assigns unique ids within one structure", () => {
    const s = makeStack([1, 2, 3, 4]);
    const ids = new Set(s.cells.map((c) => c.id));
    expect(ids.size).toBe(4);
  });
});

describe("clone", () => {
  it("produces an independent deep copy", () => {
    const s = makeStack([1, 2]);
    const c = clone(s);
    c.cells[0].value = 99;
    c.cells.push({ id: "x", value: 7 });
    expect(values(s)).toEqual([1, 2]); // original untouched
  });
});

describe("stack — push", () => {
  it("adds the value on top and reports it as the new top", () => {
    const s = makeStack([9, 1, 7]);
    const steps = pushSteps(s, 3);
    expect(steps.length).toBeGreaterThan(1);
    const out = final(steps);
    expect(values(out)).toEqual([9, 1, 7, 3]);
    expect(out.cells[out.cells.length - 1].value).toBe(3);
    expect(out.activeId).toBeNull();
  });

  it("does not mutate the input state", () => {
    const s = makeStack([9, 1, 7]);
    pushSteps(s, 3);
    expect(values(s)).toEqual([9, 1, 7]);
  });

  it("gives the pushed cell a fresh id (no collision with seeded ids)", () => {
    const s = makeStack([9, 1, 7]);
    const out = final(pushSteps(s, 3));
    const ids = new Set(out.cells.map((c) => c.id));
    expect(ids.size).toBe(4);
  });

  it("supports string values", () => {
    const out = final(pushSteps(makeStack([]), "task"));
    expect(values(out)).toEqual(["task"]);
  });
});

describe("stack — pop", () => {
  it("removes the top and returns its value (LIFO)", () => {
    const s = makeStack([9, 1, 7, 3]);
    const steps = popSteps(s);
    const out = final(steps);
    expect(values(out)).toEqual([9, 1, 7]);
    expect(out.returned).toBe(3);
  });

  it("does not mutate the input state", () => {
    const s = makeStack([9, 1, 7, 3]);
    popSteps(s);
    expect(values(s)).toEqual([9, 1, 7, 3]);
  });

  it("handles an empty stack without throwing", () => {
    const s = makeStack([]);
    const steps = popSteps(s);
    expect(steps).toHaveLength(1);
    expect(values(final(steps))).toEqual([]);
    expect(final(steps).returned).toBeNull();
  });
});

describe("stack — peek", () => {
  it("reads the top without removing it", () => {
    const s = makeStack([9, 1, 7]);
    const out = final(peekStackSteps(s));
    expect(values(out)).toEqual([9, 1, 7]); // unchanged
    expect(out.returned).toBe(7);
    expect(out.activeId).toBe(s.cells[s.cells.length - 1].id);
  });

  it("handles an empty stack", () => {
    const out = final(peekStackSteps(makeStack([])));
    expect(out.returned).toBeNull();
  });
});

describe("queue — enqueue", () => {
  it("adds the value at the back and keeps the front", () => {
    const q = makeQueue([5, 2, 8]);
    const out = final(enqueueSteps(q, 4));
    expect(values(out)).toEqual([5, 2, 8, 4]);
    expect(out.cells[0].value).toBe(5); // front unchanged
    expect(out.cells[out.cells.length - 1].value).toBe(4); // new back
  });

  it("does not mutate the input state", () => {
    const q = makeQueue([5, 2, 8]);
    enqueueSteps(q, 4);
    expect(values(q)).toEqual([5, 2, 8]);
  });
});

describe("queue — dequeue", () => {
  it("removes the front and returns it (FIFO)", () => {
    const q = makeQueue([5, 2, 8]);
    const out = final(dequeueSteps(q));
    expect(values(out)).toEqual([2, 8]);
    expect(out.returned).toBe(5);
    expect(out.cells[0].value).toBe(2); // new front
  });

  it("does not mutate the input state", () => {
    const q = makeQueue([5, 2, 8]);
    dequeueSteps(q);
    expect(values(q)).toEqual([5, 2, 8]);
  });

  it("handles an empty queue without throwing", () => {
    const steps = dequeueSteps(makeQueue([]));
    expect(steps).toHaveLength(1);
    expect(final(steps).returned).toBeNull();
  });
});

describe("queue — peek", () => {
  it("reads the front without removing it", () => {
    const q = makeQueue([5, 2, 8]);
    const out = final(peekQueueSteps(q));
    expect(values(out)).toEqual([5, 2, 8]);
    expect(out.returned).toBe(5);
    expect(out.activeId).toBe(q.cells[0].id);
  });
});

describe("clear", () => {
  it("empties a stack", () => {
    const out = final(clearSteps(makeStack([9, 1, 7, 3])));
    expect(values(out)).toEqual([]);
  });

  it("empties a queue", () => {
    const out = final(clearSteps(makeQueue([5, 2, 8])));
    expect(values(out)).toEqual([]);
  });

  it("is a no-op (single step) on an already-empty structure", () => {
    const steps = clearSteps(makeStack([]));
    expect(steps).toHaveLength(1);
  });

  it("does not mutate the input state", () => {
    const s = makeStack([9, 1, 7, 3]);
    clearSteps(s);
    expect(values(s)).toEqual([9, 1, 7, 3]);
  });
});

describe("snapshots are independent", () => {
  it("each Step owns its own cloned state", () => {
    const steps = pushSteps(makeStack([1, 2]), 3);
    // Mutating one frame must not bleed into another.
    steps[0].state.cells.push({ id: "z", value: 0 });
    expect(steps[steps.length - 1].state.cells.some((c) => c.id === "z")).toBe(false);
  });
});
