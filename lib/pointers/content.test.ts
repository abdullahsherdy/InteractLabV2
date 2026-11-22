import { describe, it, expect } from "vitest";
import { LEVELS } from "./content";
import { replay } from "./engine";
describe("pointer curriculum", () => {
  it("offers all nine levels in prerequisite order with complete shipped lessons", () => {
    expect(LEVELS.map((l) => l.level)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    const ids = LEVELS.flatMap((l) => l.lessons.map((s) => s.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const level of LEVELS)
      for (const lesson of level.lessons) {
        expect(lesson.frames.length, lesson.id).toBeGreaterThanOrEqual(6);
        expect(
          lesson.frames.some((f) => f.prediction),
          lesson.id,
        ).toBe(true);
        expect(lesson.checks.map((c) => c.type)).toEqual([
          "trace",
          "bug",
          "draw",
        ]);
        for (const f of lesson.frames)
          expect(f.line).toBeLessThan(lesson.code.length);
        const final = replay(lesson.frames, lesson.frames.length - 1);
        for (const cell of Object.values(final)) expect(cell.id).toBeTruthy();
      }
  });
});

it("uses valid operations and distinct illustrative live addresses in every lesson frame", () => {
  for (const level of LEVELS)
    for (const lesson of level.lessons) {
      for (let i = 0; i < lesson.frames.length; i++) {
        const state = replay(lesson.frames, i);
        const addresses = Object.values(state)
          .filter((c) => !c.freed)
          .map((c) => c.address);
        expect(
          new Set(addresses).size,
          `${lesson.id} frame ${i}: overlapping live cells`,
        ).toBe(addresses.length);
        for (const cell of Object.values(state)) {
          expect(
            ["value", "pointer", "reference"],
            `${lesson.id}: invalid mutation target`,
          ).toContain(cell.kind);
          expect(
            Number.isFinite(cell.address),
            `${lesson.id}: missing address`,
          ).toBe(true);
        }
      }
    }
});
