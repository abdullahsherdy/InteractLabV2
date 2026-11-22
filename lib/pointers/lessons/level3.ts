import type { Level } from "../types";
import { lesson, v, p, set, point } from "../authoring";

export const level3: Level = {
  level: 3,
  slug: "pointers-and-functions",
  title: "Pointers and functions",
  description:
    "See what is copied into a call, and what the caller can observe.",
  prerequisite: "Level 2 · pointer assignment and aliasing",
  lessons: [
    lesson({
      id: "3.1",
      title: "Value, reference, and pointer parameters",
      hook: "Which parameter lets a function change the caller’s integer?",
      prelude:
        "void byValue(int n) { n = 9; }\nvoid byReference(int& n) { n = 9; }\nvoid byPointer(int* n) { *n = 12; }",
      steps: [
        ["int x = 7;", "Start with the caller’s x equal to 7.", [v("x", "7")]],
        [
          "byValue(x);",
          "The value parameter is a separate integer. Changing that copy leaves the caller’s x at 7.",
          [],
        ],
        [
          "byReference(x);",
          "An int reference is another name for the caller’s object. Writing n changes x to 9.",
          [set("x", "9")],
        ],
        [
          "byPointer(&x);",
          "The function receives a copy of x’s address. Writing through that copy changes x to 12.",
          [set("x", "12")],
        ],
      ],
      predict: [
        "What is x after byPointer(&x)?",
        "12",
        "The pointer parameter is copied, but its target is the caller’s object.",
      ],
      trace: [
        "What is the final x?",
        "12",
        "The value call changes only its copy; the other two calls change x.",
      ],
      bug: [
        "Can byPointer(nullptr) call this function safely?",
        "No; this implementation dereferences its parameter unconditionally.",
        "Its contract requires a non-null pointer to a live integer.",
      ],
      draw: [
        "Draw the access paths during the pointer call.",
        "The parameter n points to the caller’s x; n itself is local to the call.",
        "Changing the target is different from changing the copied parameter.",
      ],
      takeaway:
        "Value copies an integer, reference aliases an object, and pointer copies an address.",
      note: "The board shows caller state between calls. Helper definitions appear above the trace.",
      verify: "std::cout << x;",
      expected: "12",
    }),
    lesson({
      id: "3.2",
      title: "Swap targets, not local pointer copies",
      hook: "Why does swapping two pointer parameters fail to swap the caller’s integers?",
      prelude:
        "void swapTargets(int* a, int* b) { int t = *a; *a = *b; *b = t; }\nvoid swapCopies(int* a, int* b) { int* t = a; a = b; b = t; }",
      steps: [
        [
          "int x = 3, y = 8;",
          "The caller owns two different integers.",
          [v("x", "3"), v("y", "8", "stack", 1016)],
        ],
        [
          "swapCopies(&x, &y);",
          "Only the local copies of the addresses exchange places. The caller’s integers do not change.",
          [],
        ],
        [
          "swapTargets(&x, &y);",
          "Read through each pointer and exchange the target values using a temporary integer.",
          [set("x", "8"), set("y", "3")],
        ],
      ],
      predict: [
        "What are x and y after swapTargets?",
        "8 and 3",
        "This function writes through the pointers rather than redirecting local copies.",
      ],
      trace: [
        "What remains after swapCopies alone?",
        "x = 3, y = 8",
        "Pointer parameters are passed by value.",
      ],
      bug: [
        "Why is int* t = a; a = b; b = t insufficient?",
        "It swaps only local pointer variables.",
        "The caller’s integer houses receive no writes.",
      ],
      draw: [
        "Draw the caller’s final objects.",
        "x contains 8; y contains 3.",
        "No local parameter survives the calls.",
      ],
      takeaway: "To swap the caller’s values through pointers, swap *a and *b.",
      verify: 'std::cout << x << " " << y;',
      expected: "8 3",
    }),
    lesson({
      id: "3.4",
      title: "An address cannot extend a lifetime",
      hook: "Does knowing a local variable’s old address keep the variable alive?",
      steps: [
        [
          "int* p = nullptr;",
          "Start with a pointer that deliberately has no target.",
          [p("p", null)],
        ],
        [
          "{ int local = 7;",
          "The inner block creates a live local integer.",
          [v("local", "7")],
        ],
        [
          "  p = &local;",
          "While local is alive, p can point to it.",
          [point("p", "local")],
        ],
        [
          "}",
          "Leaving the block destroys local. The old address in p no longer identifies a live integer.",
          [{ kind: "remove", id: "local" }],
        ],
      ],
      predict: [
        "Can p be dereferenced after the brace?",
        "No; its target’s lifetime has ended.",
        "Returning a pointer to a function-local integer creates the same lifetime problem.",
      ],
      trace: [
        "Is there a guaranteed integer output from *p after the block?",
        "No; dereferencing it would be undefined behavior.",
        "This example deliberately never evaluates *p after the block.",
      ],
      bug: [
        "What is wrong with int* bad() { int x = 7; return &x; }?",
        "The returned address refers to an object whose lifetime ends on return.",
        "Return the integer by value, or use a caller-owned object with sufficient lifetime.",
      ],
      draw: [
        "Draw the state after the block.",
        "p has an old address and a dangling label; local is gone.",
        "An address does not own or extend an object’s lifetime.",
      ],
      takeaway:
        "A pointer may outlive its target; never dereference it after the target’s lifetime ends.",
      verify: 'std::cout << "local lifetime ended";',
      expected: "local lifetime ended",
    }),
    lesson({
      id: "3.3",
      title: "Output parameters return several results",
      hook: "How can a function write both a minimum and a maximum back to its caller?",
      prelude:
        "void minMax(int a, int b, int* mn, int* mx) {\n  *mn = a < b ? a : b;\n  *mx = a > b ? a : b;\n}",
      steps: [
        [
          "int mn = 0, mx = 0;",
          "The caller creates storage for two results.",
          [v("mn", "0"), v("mx", "0", "stack", 1016)],
        ],
        [
          "minMax(8, 3, &mn, &mx);",
          "The function receives addresses of the result objects and writes 3 and 8 through them.",
          [set("mn", "3"), set("mx", "8")],
        ],
      ],
      predict: [
        "Which values return through the two addresses?",
        "mn becomes 3 and mx becomes 8.",
        "Each output pointer identifies a caller-owned result object.",
      ],
      trace: [
        "What are mn and mx?",
        "3 and 8",
        "The function selects the smaller and larger input.",
      ],
      bug: [
        "Why does minMax(8, 3, mn, mx) fail?",
        "The last parameters require addresses, not integer values.",
        "Pass &mn and &mx; this implementation requires valid, distinct output objects.",
      ],
      draw: [
        "Draw the access paths during the call.",
        "Parameter mn points to the caller’s mn; parameter mx points to the caller’s mx.",
        "The helper’s parameter names and the caller’s names have different scopes.",
      ],
      takeaway:
        "Output parameters identify caller-owned objects that a function can fill in.",
      verify: 'std::cout << mn << " " << mx;',
      expected: "3 8",
    }),
  ].sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true })),
};
