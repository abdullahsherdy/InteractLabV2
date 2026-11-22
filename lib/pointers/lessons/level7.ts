import type { Level } from "../types";
import {
  lesson,
  v,
  p,
  set,
  point,
  free,
  node,
  nodeDefinition,
} from "../authoring";

export const level7: Level = {
  level: 7,
  slug: "pointers-to-pointers",
  title: "Pointers to pointers and 2D",
  description:
    "Follow two address steps and manage rows as separate allocations.",
  prerequisite: "Level 6 · links; Level 5 · dynamic arrays",
  lessons: [
    lesson({
      id: "7.1",
      title: "An int** points to a pointer",
      hook: "If p points to x, what does &p identify?",
      optional: true,
      steps: [
        ["int x = 7;", "Create an integer x.", [v("x", "7")]],
        ["int* p = &x;", "p stores the address of x.", [p("p", "x")]],
        [
          "int** pp = &p;",
          "pp stores the address of the pointer object p. One dereference reaches p; a second reaches x.",
          [p("pp", "p", "stack", 1080)],
        ],
        [
          "**pp = 20;",
          "Follow both address steps and write the integer at the end.",
          [set("x", "20")],
        ],
      ],
      predict: [
        "Which object receives 20?",
        "x",
        "The first star reaches p, and the second reaches the integer p identifies.",
      ],
      trace: [
        "What are x and *p?",
        "Both read 20",
        "They access the same integer object.",
      ],
      bug: [
        "Can int** pp = &x initialize this pointer?",
        "No; &x is an int*, not an int**.",
        "The number of pointer levels must match the pointed-to object’s type.",
      ],
      draw: [
        "Draw the full chain.",
        "pp → p → x(20).",
        "p is itself an object with an address.",
      ],
      takeaway:
        "A pointer-to-pointer identifies a pointer object; each star follows one address step.",
      verify: "std::cout << x;",
      expected: "20",
    }),
    lesson({
      id: "7.2",
      title: "Dynamic rows: release children before parent",
      hook: "If each row is separately allocated, can deleting the row-pointer array release the rows too?",
      optional: true,
      steps: [
        [
          "int** rows = new int*[2]{};",
          "Allocate an array of two pointer slots, initialized to null.",
          [
            p("row[0]", null, "heap", 2000, "rows"),
            p("row[1]", null, "heap", 2016, "rows"),
            p("rows", "row[0]", "stack", 1104),
          ],
        ],
        [
          "rows[0] = new int[2]{1, 2};",
          "Allocate the first row and store its address in the first slot.",
          [
            v("r0[0]", "1", "heap", 2100, "r0"),
            v("r0[1]", "2", "heap", 2104, "r0"),
            point("row[0]", "r0[0]"),
          ],
        ],
        [
          "rows[1] = new int[2]{3, 4};",
          "Allocate the second row independently. An int** does not imply one contiguous 2D array.",
          [
            v("r1[0]", "3", "heap", 2200, "r1"),
            v("r1[1]", "4", "heap", 2204, "r1"),
            point("row[1]", "r1[0]"),
          ],
        ],
        [
          "int value = rows[1][0];",
          "Choose pointer slot 1, follow it, then select element 0: the integer 3.",
          [v("value", "3", "stack", 1140)],
        ],
        [
          "delete[] rows[0]; delete[] rows[1];",
          "Release both row allocations while the pointer slots are still available.",
          [free("r0[0]"), free("r1[0]")],
        ],
        [
          "delete[] rows; rows = nullptr;",
          "Finally release the pointer-slot array and clear its owner.",
          [free("row[0]"), point("rows", null)],
        ],
      ],
      predict: [
        "What remains allocated after the last line?",
        "Nothing from this row structure.",
        "Both rows were released before their parent array.",
      ],
      trace: ["What is the copied value?", "3", "The selected row was {3, 4}."],
      bug: [
        "Why is delete[] rows by itself incomplete?",
        "It releases only the pointer slots and leaks the separate row allocations.",
        "Deleting an array of raw pointers does not delete the objects they point to.",
      ],
      draw: [
        "Draw the allocations before cleanup.",
        "rows → two pointer slots; each slot points to a separate two-integer row.",
        "Rows need not be adjacent in memory.",
      ],
      takeaway:
        "For separately allocated rows, release each row before releasing the array of row pointers.",
      note: "This trace assumes allocations succeed. Robust production code should use RAII containers to handle partial allocation failures.",
      verify: "std::cout << value;",
      expected: "3",
    }),
    lesson({
      id: "7.3",
      title: "Node** can change the caller’s head",
      hook: "How can a function replace a caller’s pointer rather than only its local copy?",
      prelude:
        nodeDefinition +
        "\nvoid setHead(Node** slot, Node* replacement) { *slot = replacement; }",
      steps: [
        [
          "Node a{4, nullptr}; Node b{7, &a};",
          "Create two live local nodes.",
          [
            ...node("a", "4", null, "stack", 1000),
            ...node("b", "7", "a", "stack", 1032),
          ],
        ],
        [
          "Node* head = &a;",
          "The caller’s head pointer initially identifies a.",
          [p("head", "a", "stack", 1104)],
        ],
        [
          "setHead(&head, &b);",
          "The helper receives the address of the head pointer object. Assigning through that address changes the caller’s head to b.",
          [point("head", "b")],
        ],
      ],
      predict: [
        "What does the caller’s head identify after the call?",
        "b",
        "The parameter slot identifies the caller’s pointer object, not just its old target.",
      ],
      trace: [
        "What is head->value?",
        "7",
        "The caller’s pointer was replaced.",
      ],
      bug: [
        "Why does void setHead(Node* head, Node* value) { head = value; } fail to update the caller?",
        "It reassigns only a local copy of the pointer.",
        "Use a pointer-to-pointer, or an appropriate reference-to-pointer API.",
      ],
      draw: [
        "Draw slot during the call.",
        "slot → caller head → b after the assignment.",
        "One dereference selects the pointer object that needs updating.",
      ],
      takeaway:
        "Passing &head lets a Node** parameter write the caller’s head pointer.",
      optional: true,
      verify: "std::cout << head->value;",
      expected: "7",
    }),
    lesson({
      id: "7.4",
      title: "An array can contain pointer slots",
      hook: "Can two pointer elements refer to strings with different lengths?",
      steps: [
        [
          'char first[] = "hi"; char second[] = "yes";',
          "Create two local character arrays, each with its null terminator. The board summarizes each character array as one house.",
          [
            v("first", "hi + null", "stack", 1000),
            v("second", "yes + null", "stack", 1016),
          ],
        ],
        [
          "const char* words[2] = {first, second};",
          "The array has two pointer elements, each identifying the start of a character array.",
          [
            p("words[0]", "first", "stack", 1080, "words"),
            p("words[1]", "second", "stack", 1096, "words"),
          ],
        ],
        [
          "const char* chosen = words[1];",
          "Copy the second address. No characters are copied.",
          [p("chosen", "second", "stack", 1120)],
        ],
      ],
      predict: [
        "What string does chosen identify?",
        "yes",
        "Element 1 stores the address of the second character array.",
      ],
      trace: [
        "What text is chosen?",
        "yes",
        "A character pointer can identify the first character of a null-terminated string.",
      ],
      bug: [
        "May chosen[0] = 'Y' modify the characters?",
        "No; chosen provides const access. The underlying local array can still be modified through second.",
        "Const access restricts this path; it does not require the original object to be const.",
      ],
      draw: [
        "Draw words and chosen.",
        "Two pointer slots point to separate local character arrays; chosen copies the second address.",
        "The arrays have automatic local lifetimes. The pointer array does not own a dynamic allocation.",
      ],
      takeaway:
        "An array of pointers stores addresses; its target objects can have independent sizes and lifetimes.",
      note: "The board groups each null-terminated character array into one summary cell. Both arrays are local objects; there are no dynamic allocations to delete.",
      optional: true,
      verify: "std::cout << chosen;",
      expected: "yes",
    }),
  ].sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true })),
};
