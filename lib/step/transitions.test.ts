import { describe, expect, it } from "vitest";
import {
  advanceOnTick,
  clampIndex,
  intervalFor,
  isAtEnd,
  isAtStart,
  nextIndex,
  playFrom,
  prevIndex,
} from "./transitions";

describe("clampIndex", () => {
  it("keeps in-range indices unchanged", () => {
    expect(clampIndex(0, 6)).toBe(0);
    expect(clampIndex(3, 6)).toBe(3);
    expect(clampIndex(5, 6)).toBe(5);
  });

  it("floors below 0 and caps at the last step", () => {
    expect(clampIndex(-4, 6)).toBe(0);
    expect(clampIndex(99, 6)).toBe(5);
  });

  it("collapses to 0 for empty or degenerate lists", () => {
    expect(clampIndex(2, 0)).toBe(0);
    expect(clampIndex(-1, 0)).toBe(0);
  });
});

describe("nextIndex / prevIndex", () => {
  it("advances and retreats one step", () => {
    expect(nextIndex(2, 6)).toBe(3);
    expect(prevIndex(2, 6)).toBe(1);
  });

  it("does not run off either end", () => {
    expect(nextIndex(5, 6)).toBe(5);
    expect(prevIndex(0, 6)).toBe(0);
  });
});

describe("isAtStart / isAtEnd", () => {
  it("detects the boundaries", () => {
    expect(isAtStart(0)).toBe(true);
    expect(isAtStart(1)).toBe(false);
    expect(isAtEnd(5, 6)).toBe(true);
    expect(isAtEnd(4, 6)).toBe(false);
  });
});

describe("playFrom", () => {
  it("resumes from the current step mid-sequence", () => {
    expect(playFrom(2, 6)).toBe(2);
  });

  it("rewinds to 0 when parked on the last step", () => {
    expect(playFrom(5, 6)).toBe(0);
  });
});

describe("advanceOnTick", () => {
  it("advances one step while playing", () => {
    expect(advanceOnTick(2, 6)).toEqual({ index: 3, done: false });
  });

  it("holds on the last step and signals done", () => {
    expect(advanceOnTick(5, 6)).toEqual({ index: 5, done: true });
  });
});

describe("intervalFor", () => {
  it("scales the base interval by speed", () => {
    expect(intervalFor(1100, 1)).toBe(1100);
    expect(intervalFor(1400, 2)).toBe(700);
    expect(intervalFor(2000, 0.5)).toBe(4000);
  });
});
