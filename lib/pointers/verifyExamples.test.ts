import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { it, expect } from "vitest";
import { LEVELS } from "./content";
import { replay, pointerState } from "./engine";
import type { Lesson } from "./types";

// Cross-check the drawn final state against actual C++ values, in addition
// to checking the explicitly authored output claims. Only nameable live
// scalar locals and live scalar targets are asserted; dead objects are never read.
function memoryAssertions(lesson: Lesson): string {
  const memory = replay(lesson.frames, lesson.frames.length - 1);
  const body = lesson.code.join("\n");
  const result: string[] = [];
  for (const cell of Object.values(memory)) {
    if (cell.freed) continue;
    if (
      cell.kind === "value" &&
      cell.zone === "stack" &&
      /^(?:-?\d+|true|false)$/.test(cell.value ?? "") &&
      body.includes(cell.id)
    ) {
      const expression = cell.group === cell.id ? cell.id + ".value" : cell.id;
      result.push(`assert((${expression}) == (${cell.value}));`);
    }
    if (
      cell.kind === "pointer" &&
      cell.zone === "stack" &&
      pointerState(cell, memory) === "valid"
    ) {
      const target = memory[cell.target!];
      if (
        target?.zone === "heap" &&
        target.kind === "value" &&
        /^(?:-?\d+|true|false)$/.test(target.value ?? "")
      ) {
        const expression =
          target.group === target.id ? `(${cell.id})->value` : `*(${cell.id})`;
        result.push(`assert((${expression}) == (${target.value}));`);
      }
    }
  }
  return result.join("\n");
}

// Opt-in so the site's normal JavaScript test command needs no C++ toolchain.
// PowerShell: $env:VERIFY_POINTER_CPP='1'; npm test -- lib/pointers/verifyExamples.test.ts
it.skipIf(process.env.VERIFY_POINTER_CPP !== "1")(
  "compiles and runs every published example as C++17",
  () => {
    const dir = mkdtempSync(join(tmpdir(), "interactlab-pointers-"));
    try {
      const lessons = LEVELS.flatMap((l) => l.lessons);
      const source =
        "#include <iostream>\n#include <memory>\n#include <cassert>\n" +
        lessons
          .map(
            (l, i) =>
              `namespace lesson_${i} {\n${l.prelude ?? ""}\nvoid run() {\n${l.code.join("\n")}\n${memoryAssertions(l)}\n${l.verify}\n}\n}`,
          )
          .join("\n") +
        "\nint main() {\n" +
        lessons
          .map((_, i) => `lesson_${i}::run(); std::cout << "\\n";`)
          .join("\n") +
        "\n}";
      const cpp = join(dir, "examples.cpp");
      const exe = join(
        dir,
        process.platform === "win32" ? "examples.exe" : "examples",
      );
      writeFileSync(cpp, source);
      const compile = spawnSync(
        process.env.CXX ?? "g++",
        ["-std=c++17", "-Wall", "-Wextra", cpp, "-o", exe],
        { encoding: "utf8", timeout: 60000 },
      );
      expect(
        compile.error,
        "Compiler must be installed and on PATH",
      ).toBeUndefined();
      expect(compile.status, compile.stderr).toBe(0);
      const run = spawnSync(exe, [], { encoding: "utf8", timeout: 10000 });
      expect(run.status, run.stderr).toBe(0);
      expect(run.stdout.replace(/\r/g, "")).toBe(
        lessons.map((l) => l.expected + "\n").join(""),
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  },
  90000,
);
