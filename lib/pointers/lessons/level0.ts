import type { Level } from "../types";
import { lesson, v, set } from "../authoring";

export const level0: Level = {
  level: 0,
  slug: "memory-first",
  title: "Memory first",
  description: "Separate the name, value, address, and lifetime of a variable.",
  prerequisite: "Variables and assignment",
  lessons: [
    lesson({
      id: "0.1",
      title: "Variables are numbered houses",
      hook: "If x changes from 7 to 9, does its house number change?",
      steps: [
        [
          "int x = 7;",
          "Create x. Its name is x, its current value is 7, and our drawing gives it address 1000.",
          [v("x", "7")],
        ],
        [
          "x = 9;",
          "Replace the value in the same house. The variable stays in the same place during its lifetime.",
          [set("x", "9")],
        ],
      ],
      predict: [
        "What changes on the next line?",
        "The value becomes 9; the address stays the same.",
        "Assignment changes the contents of an existing variable.",
      ],
      trace: [
        "What is the final value of x?",
        "9",
        "The second line replaces 7 with 9.",
      ],
      bug: [
        "A student says x is its address. What is confused?",
        "The name, contents, and address are different things.",
        "x names an object; its stored integer is not its location.",
      ],
      draw: [
        "Draw x after assignment.",
        "One house labelled x, address 1000, containing 9.",
        "No second house is created.",
      ],
      takeaway:
        "A variable has a name, a value, and a location; assignment changes its value.",
      verify: "std::cout << x;",
      expected: "9",
    }),
    lesson({
      id: "0.2",
      title: "A local variable has a lifetime",
      hook: "Does a variable inside a block still exist after the block ends?",
      steps: [
        [
          "int x = 7;",
          "The outer local variable x begins its lifetime.",
          [v("x", "7")],
        ],
        [
          "{ int y = 4;",
          "The inner block creates a separate local variable y.",
          [v("y", "4", "stack", 1016)],
        ],
        [
          "  x = y;",
          "Copy 4 into x. The two variables still occupy different houses.",
          [set("x", "4")],
        ],
        [
          "}",
          "Leaving the block ends the lifetime of y. The outer x is still alive.",
          [{ kind: "remove", id: "y" }],
        ],
      ],
      predict: [
        "Which variable survives the closing brace?",
        "x survives; y does not.",
        "A local object with automatic storage duration ends its lifetime when its block exits.",
      ],
      trace: [
        "What value remains in x?",
        "4",
        "Copying y’s value does not tie x’s lifetime to y.",
      ],
      bug: [
        "Can the next line read y here?",
        "No; y is out of scope.",
        "Using that name here is a compilation error.",
      ],
      draw: [
        "Draw the live objects after the brace.",
        "Only x, containing 4.",
        "y no longer denotes a live object.",
      ],
      takeaway:
        "Block-local objects have lifetimes; leaving their block ends those lifetimes.",
      note: "“Stack” is a useful implementation picture for automatic local storage, not a C++ requirement about physical placement.",
      verify: "std::cout << x;",
      expected: "4",
    }),
  ].sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true })),
};
