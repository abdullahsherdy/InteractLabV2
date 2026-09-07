import { describe, expect, it } from "vitest";
import { KEY_DEMO_KINDS, runKeyDemo, STUDENTS, WORDS } from "./key-demo";

describe("runKeyDemo", () => {
  it("sorts words by length, keeping equal lengths in original order (stable)", () => {
    const { before, after } = runKeyDemo("len");
    expect(before).toEqual(WORDS);
    expect(after).toEqual(["fig", "kiwi", "apple", "banana", "cherry"]);
  });

  it("sorts words by their last letter", () => {
    const { after } = runKeyDemo("last");
    expect(after).toEqual(["banana", "apple", "fig", "kiwi", "cherry"]);
  });

  it("sorts students by grade, highest first, stably", () => {
    const { after } = runKeyDemo("grade_desc");
    // Omar (92) stays before Nour (92): equal grades keep input order.
    expect(after).toEqual(["Omar (92)", "Nour (92)", "Sara (85)", "Adam (85)", "Lina (78)"]);
  });

  it("breaks grade ties by name with a tuple key — visibly different from the plain sort", () => {
    const desc = runKeyDemo("grade_desc").after;
    const multi = runKeyDemo("multi").after;
    expect(multi).toEqual(["Nour (92)", "Omar (92)", "Adam (85)", "Sara (85)", "Lina (78)"]);
    expect(multi).not.toEqual(desc);
  });

  it("demonstrates stability: equal grades keep their original order ascending", () => {
    const { after } = runKeyDemo("stability");
    expect(after).toEqual(["Lina (78)", "Sara (85)", "Adam (85)", "Omar (92)", "Nour (92)"]);
    // Sara appears before Adam because Sara comes first in the input.
    expect(after.indexOf("Sara (85)")).toBeLessThan(after.indexOf("Adam (85)"));
  });

  it("never mutates the shared input data", () => {
    const namesBefore = STUDENTS.map((s) => s.name);
    const wordsBefore = [...WORDS];
    for (const { value } of KEY_DEMO_KINDS) runKeyDemo(value);
    expect(STUDENTS.map((s) => s.name)).toEqual(namesBefore);
    expect(WORDS).toEqual(wordsBefore);
  });

  it("exposes every advertised demo kind", () => {
    for (const { value } of KEY_DEMO_KINDS) {
      const r = runKeyDemo(value);
      expect(r.code).toContain("sorted(");
      expect(r.after).toHaveLength(r.before.length);
    }
  });
});
