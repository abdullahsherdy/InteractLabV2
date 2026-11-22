import { describe, expect, it } from "vitest";
import {
  replay,
  pointerState,
  unreachableHeap,
  checkpointLimit,
} from "./engine";
import type { Frame } from "./types";
const frames: Frame[] = [
  {
    line: 0,
    narration: "Allocate",
    ops: [
      {
        kind: "value",
        id: "x",
        name: "x",
        zone: "heap",
        address: 2000,
        value: "7",
      },
      {
        kind: "pointer",
        id: "p",
        name: "p",
        zone: "stack",
        address: 1000,
        target: "x",
      },
      {
        kind: "pointer",
        id: "q",
        name: "q",
        zone: "stack",
        address: 1004,
        target: "p",
      },
    ],
  },
  {
    line: 1,
    narration: "Delete",
    ops: [{ kind: "free", id: "x" }],
    prediction: {
      q: "Is p null?",
      answer: "No",
      why: "Deleting an object does not clear pointers.",
    },
  },
  {
    line: 2,
    narration: "Clear",
    ops: [{ kind: "point", id: "p", target: null }],
  },
];
describe("pointer replay", () => {
  it("rebuilds previous frames without mutation", () => {
    expect(pointerState(replay(frames, 2).p, replay(frames, 2))).toBe("null");
    const before = replay(frames, 0);
    expect(pointerState(before.p, before)).toBe("valid");
    expect(before.x.freed).toBeFalsy();
  });
  it("recognizes dangling targets and valid pointer-to-pointer cells", () => {
    const state = replay(frames, 1);
    expect(pointerState(state.p, state)).toBe("dangling");
    expect(pointerState(state.q, state)).toBe("valid");
  });
  it("finds unreachable heap cycles from stack roots", () => {
    const state = replay(
      [
        {
          line: 0,
          narration: "Cycle",
          ops: [
            {
              kind: "pointer",
              id: "a",
              name: "a.next",
              zone: "heap",
              address: 2000,
              target: "b",
            },
            {
              kind: "pointer",
              id: "b",
              name: "b.next",
              zone: "heap",
              address: 2004,
              target: "a",
            },
          ],
        },
      ],
      0,
    );
    expect(unreachableHeap(state)).toEqual(["a", "b"]);
  });
  it("blocks forward jumps at unanswered predictions, but allows rewind", () => {
    expect(checkpointLimit(frames, 0, 2, [])).toBe(1);
    expect(checkpointLimit(frames, 1, 2, [])).toBe(1);
    expect(checkpointLimit(frames, 1, 2, [1])).toBe(2);
    expect(checkpointLimit(frames, 2, 0, [])).toBe(0);
  });
});

it("releases an entire allocation group without releasing neighboring allocations", () => {
  const state = replay(
    [
      {
        line: 0,
        narration: "Two arrays",
        ops: [
          {
            kind: "value",
            id: "a0",
            name: "a[0]",
            zone: "heap",
            address: 2000,
            value: "1",
            group: "a",
          },
          {
            kind: "value",
            id: "a1",
            name: "a[1]",
            zone: "heap",
            address: 2004,
            value: "2",
            group: "a",
          },
          {
            kind: "value",
            id: "b0",
            name: "b[0]",
            zone: "heap",
            address: 2008,
            value: "3",
            group: "b",
          },
          {
            kind: "pointer",
            id: "p",
            name: "p",
            zone: "stack",
            address: 1000,
            target: "a0",
          },
        ],
      },
      { line: 1, narration: "Release a", ops: [{ kind: "free", id: "a0" }] },
    ],
    1,
  );
  expect(state.a0.freed).toBe(true);
  expect(state.a1.freed).toBe(true);
  expect(state.b0.freed).toBeFalsy();
  expect(pointerState(state.p, state)).toBe("dangling");
  expect(unreachableHeap(state)).toEqual(["b0"]);
});
it("follows pointer chains and grouped fields from a live root", () => {
  const state = replay(
    [
      {
        line: 0,
        narration: "Root reaches a grouped node and its successor",
        ops: [
          {
            kind: "value",
            id: "node",
            name: "node.value",
            zone: "heap",
            address: 2000,
            value: "7",
            group: "node",
          },
          {
            kind: "pointer",
            id: "link",
            name: "node.next",
            zone: "heap",
            address: 2016,
            target: "last",
            group: "node",
          },
          {
            kind: "value",
            id: "last",
            name: "last.value",
            zone: "heap",
            address: 2100,
            value: "9",
          },
          {
            kind: "pointer",
            id: "p",
            name: "p",
            zone: "stack",
            address: 1000,
            target: "node",
          },
          {
            kind: "pointer",
            id: "pp",
            name: "pp",
            zone: "stack",
            address: 1016,
            target: "p",
          },
        ],
      },
    ],
    0,
  );
  expect(unreachableHeap(state)).toEqual([]);
});
it("keeps a dangling address when an automatic target leaves scope", () => {
  const state = replay(
    [
      {
        line: 0,
        narration: "Borrow local",
        ops: [
          {
            kind: "value",
            id: "local",
            name: "local",
            zone: "stack",
            address: 1000,
            value: "7",
          },
          {
            kind: "pointer",
            id: "p",
            name: "p",
            zone: "stack",
            address: 1016,
            target: "local",
          },
        ],
      },
      {
        line: 1,
        narration: "Scope ends",
        ops: [{ kind: "remove", id: "local" }],
      },
    ],
    1,
  );
  expect(pointerState(state.p, state)).toBe("dangling");
  expect(state.p.target).toBe("local");
});
