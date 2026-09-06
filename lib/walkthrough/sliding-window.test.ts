import { describe, expect, it } from "vitest";
import { buildSlidingWindow } from "./sliding-window";
import type { WalkStep } from "./types";

// The reference algorithm — the animation trace must always agree with this.
function smallestWindow(nums: number[], target: number): number {
  let left = 0;
  let sum = 0;
  let min = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      min = Math.min(min, right - left + 1);
      sum -= nums[left];
      left += 1;
    }
  }
  return min;
}

/** Read the final min_len off the last step's variable board. */
function finalMinLen(steps: WalkStep[]): number {
  const binding = steps.at(-1)!.vars.find((v) => v.name === "min_len")!;
  return binding.value === "∞" ? Infinity : Number(binding.value);
}

describe("buildSlidingWindow", () => {
  it("matches the reference answer for the feature-file example", () => {
    const nums = [2, 1, 5, 2, 3, 2];
    const steps = buildSlidingWindow(nums, 7);
    expect(finalMinLen(steps)).toBe(smallestWindow(nums, 7));
    expect(finalMinLen(steps)).toBe(2);
  });

  it("handles a single element meeting the target (length 1)", () => {
    const nums = [3, 4, 1, 1, 6];
    const steps = buildSlidingWindow(nums, 6);
    expect(finalMinLen(steps)).toBe(smallestWindow(nums, 6));
    expect(finalMinLen(steps)).toBe(1);
  });

  it("reports infinity when no window reaches the target", () => {
    const nums = [1, 1, 1];
    const steps = buildSlidingWindow(nums, 9);
    expect(finalMinLen(steps)).toBe(Infinity);
    expect(steps.at(-1)!.narration).toMatch(/no valid window|infinity/i);
  });

  it("agrees with the reference across random inputs", () => {
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(Math.random() * 8);
      const nums = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 6));
      const target = 1 + Math.floor(Math.random() * 20);
      expect(finalMinLen(buildSlidingWindow(nums, target))).toBe(
        smallestWindow(nums, target)
      );
    }
  });

  it("every step points at a valid code line and has narration", () => {
    const steps = buildSlidingWindow([2, 1, 5, 2, 3, 2], 7);
    expect(steps.length).toBeGreaterThan(5);
    for (const s of steps) {
      expect(s.codeLine).toBeGreaterThanOrEqual(0);
      expect(s.codeLine).toBeLessThan(11);
      expect(s.narration.length).toBeGreaterThan(0);
      expect(s.viz.kind).toBe("array");
    }
  });

  it("never lets the window bracket go inverted", () => {
    const steps = buildSlidingWindow([2, 1, 5, 2, 3, 2], 7);
    for (const s of steps) {
      if (s.viz.window) {
        expect(s.viz.window.end).toBeGreaterThanOrEqual(s.viz.window.start);
      }
    }
  });
});
