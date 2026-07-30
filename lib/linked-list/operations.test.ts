import { beforeEach, describe, expect, it } from "vitest";
import {
  appendDoublySteps,
  appendSteps,
  chainFromHead,
  deleteValueSteps,
  floydSteps,
  insertAtHeadBuggySteps,
  insertAtHeadSteps,
  makeDoubly,
  makePlaylist,
  makeSingly,
  playNextSteps,
  playPreviousSteps,
  removeNodeDoublySteps,
  resetIds,
} from "./operations";
import type { ListState } from "./types";

beforeEach(resetIds);

function values(state: ListState): (string | number)[] {
  return chainFromHead(state).map(
    (id) => state.nodes.find((n) => n.id === id)!.value
  );
}

describe("append", () => {
  it("appends to an empty list", () => {
    const steps = appendSteps(makeSingly([]), 5);
    expect(values(steps.at(-1)!.state)).toEqual([5]);
  });

  it("walks the chain and links at the end", () => {
    const steps = appendSteps(makeSingly([1, 2, 3]), 4);
    expect(steps.length).toBeGreaterThan(3);
    expect(values(steps.at(-1)!.state)).toEqual([1, 2, 3, 4]);
  });
});

describe("insertAtHead", () => {
  it("puts the new node at the front", () => {
    const steps = insertAtHeadSteps(makeSingly([2, 3]), 1);
    expect(values(steps.at(-1)!.state)).toEqual([1, 2, 3]);
  });

  it("buggy variant orphans the rest of the chain", () => {
    const steps = insertAtHeadBuggySteps(makeSingly([2, 3]), 1);
    const final = steps.at(-1)!.state;
    expect(values(final)).toEqual([1]); // only new node reachable
    expect(final.nodes.length).toBe(3); // orphans still exist in memory
  });
});

describe("deleteValue", () => {
  it("deletes the head", () => {
    const steps = deleteValueSteps(makeSingly([1, 2, 3]), 1);
    expect(values(steps.at(-1)!.state)).toEqual([2, 3]);
  });

  it("deletes a middle node by skipping over it", () => {
    const steps = deleteValueSteps(makeSingly([1, 2, 3]), 2);
    expect(values(steps.at(-1)!.state)).toEqual([1, 3]);
  });

  it("leaves the list unchanged when target is missing", () => {
    const steps = deleteValueSteps(makeSingly([1, 2]), 9);
    expect(values(steps.at(-1)!.state)).toEqual([1, 2]);
    expect(steps.at(-1)!.caption).toMatch(/never found/);
  });
});

describe("doubly linked list", () => {
  it("append links both directions", () => {
    const steps = appendDoublySteps(makeDoubly(["A"]), "B");
    const final = steps.at(-1)!.state;
    expect(values(final)).toEqual(["A", "B"]);
    const prevLink = final.links.find(
      (l) => l.kind === "prev" && l.from === final.tail
    );
    expect(prevLink?.to).toBe(final.head);
  });

  it("remove_node updates both neighbors", () => {
    const state = makeDoubly(["A", "B", "C"]);
    const mid = chainFromHead(state)[1];
    const steps = removeNodeDoublySteps(state, mid);
    const final = steps.at(-1)!.state;
    expect(values(final)).toEqual(["A", "C"]);
    const backLink = final.links.find(
      (l) => l.kind === "prev" && l.from === final.tail
    );
    expect(backLink?.to).toBe(final.head);
  });

  it("removing the head moves head right", () => {
    const state = makeDoubly(["A", "B"]);
    const steps = removeNodeDoublySteps(state, state.head!);
    expect(values(steps.at(-1)!.state)).toEqual(["B"]);
  });
});

describe("floyd cycle detection", () => {
  it("detects a cycle", () => {
    const { steps, hasCycle } = floydSteps([1, 2, 3, 4, 5], 2);
    expect(hasCycle).toBe(true);
    expect(steps.some((s) => s.flash)).toBe(true);
  });

  it("terminates with no cycle", () => {
    const { steps, hasCycle } = floydSteps([1, 2, 3, 4], null);
    expect(hasCycle).toBe(false);
    expect(steps.at(-1)!.caption).toMatch(/No cycle/);
  });

  it("phase 2 finds the cycle start", () => {
    const { steps, hasCycle } = floydSteps([1, 2, 3, 4, 5, 6], 2, true);
    expect(hasCycle).toBe(true);
    const last = steps.at(-1)!;
    expect(last.caption).toMatch(/cycle starts/);
    const startId = last.highlightNodes?.[0];
    const state = last.state;
    const idx = chainFromHead(state).indexOf(startId!);
    expect(idx).toBe(2);
  });
});

describe("playlist", () => {
  it("play_next moves the cursor forward", () => {
    const pl = makePlaylist(["S1", "S2", "S3"]);
    const steps = playNextSteps(pl);
    const final = steps.at(-1)!.state;
    const cursorValue = final.nodes.find((n) => n.id === final.cursor)?.value;
    expect(cursorValue).toBe("S2");
  });

  it("play_previous at the first song does nothing", () => {
    const pl = makePlaylist(["S1", "S2"]);
    const steps = playPreviousSteps(pl);
    expect(steps.at(-1)!.caption).toMatch(/first song/);
  });
});
