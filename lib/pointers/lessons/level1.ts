import type { Level } from "../types";
import { lesson, v, p, set } from "../authoring";

export const level1: Level = {
  level: 1,
  slug: "what-is-a-pointer",
  title: "What is a pointer?",
  description: "Find an address, store it, and follow it safely.",
  prerequisite: "Level 0 · objects and lifetimes",
  lessons: [
    lesson({
      id: "1.1",
      title: "Address of: &x",
      hook: "How can a program ask where x lives?",
      steps: [
        [
          "int x = 7;",
          "x holds the integer 7. Its illustrative address is 1000.",
          [v("x", "7")],
        ],
        [
          "(void)&x;",
          "Address of x identifies x’s location. Computing an address does not change x.",
          [],
        ],
      ],
      predict: [
        "Does evaluating address of x replace its value?",
        "No; x still holds 7.",
        "The address-of expression produces an address, not an assignment.",
      ],
      trace: [
        "What is x after these lines?",
        "7",
        "No line writes a new value to x.",
      ],
      bug: [
        "Is &x the integer stored inside x?",
        "No; it is a pointer to x.",
        "The stored value and the address have different meanings and types.",
      ],
      draw: [
        "Label the name, value, and address.",
        "Name: x. Value: 7. Illustrative address: 1000.",
        "Real addresses may look like 0x61fe14 and vary between runs.",
      ],
      takeaway:
        "Read &x as “address of x”; the address is separate from the stored value.",
      verify: "std::cout << x;",
      expected: "7",
    }),
    lesson({
      id: "1.2",
      title: "A pointer stores an address",
      hook: "What is actually inside p: 7, or the address of x?",
      steps: [
        ["int x = 7;", "Create the house named x.", [v("x", "7")]],
        [
          "int* p = &x;",
          "p is a separate house holding a sticky note with x’s address. The arrow follows that note.",
          [p("p", "x")],
        ],
      ],
      predict: [
        "What does p store?",
        "The address of x, illustrated as 1000.",
        "p does not hold a copy of the integer 7.",
      ],
      trace: [
        "What is the result of p == &x?",
        "true",
        "Both sides identify the same object x.",
      ],
      bug: [
        "Can int* p = 7 replace the declaration?",
        "No. An ordinary integer value is not an int pointer.",
        "Use the address of a compatible live object.",
      ],
      draw: [
        "Draw x and p.",
        "x contains 7; p contains address 1000 and points to x.",
        "p has its own separate address.",
      ],
      takeaway:
        "A pointer is an object whose value can identify another object’s location.",
      verify: "std::cout << std::boolalpha << (p == &x);",
      expected: "true",
    }),
    lesson({
      id: "1.3",
      title: "Dereference: read and write through p",
      hook: "Can changing the variable p points to change x?",
      steps: [
        ["int x = 7;", "Start with x equal to 7.", [v("x", "7")]],
        ["int* p = &x;", "p points to the live integer x.", [p("p", "x")]],
        [
          "*p = 12;",
          "The variable p points to is x. Store 12 there; the address in p stays the same.",
          [set("x", "12")],
        ],
      ],
      predict: [
        "After *p = 12, what changes?",
        "x becomes 12; p still points to x.",
        "Dereferencing chooses the destination object.",
      ],
      trace: ["What is x now?", "12", "Writing through p writes x."],
      bug: [
        "Would p = 12 do the same thing?",
        "No; it tries to assign an integer to a pointer and is ill-formed.",
        "p and *p are different expressions with different types.",
      ],
      draw: [
        "Draw the arrow after the write.",
        "p still points to x, whose contents are 12.",
        "Only the target’s contents changed.",
      ],
      takeaway:
        "Read *p as “the variable p points to”; use it only when p points to a suitable live object.",
      verify: "std::cout << x;",
      expected: "12",
    }),
    lesson({
      id: "1.4",
      title: "Read each declaration separately",
      hook: "In int* a, b, are both names pointers?",
      steps: [
        ["int x = 7;", "x is an integer object.", [v("x", "7")]],
        [
          "int* a = &x, b = 9;",
          "The star belongs to a’s declarator. a is a pointer, but b is an integer.",
          [p("a", "x"), v("b", "9", "stack", 1080)],
        ],
      ],
      predict: [
        "Is b a pointer?",
        "No; b is an int.",
        "Write int* a; int* b; when both should be pointers.",
      ],
      trace: ["What does b hold?", "9", "Only a is declared with a star."],
      bug: [
        "Can a double’s address initialize int*?",
        "No; the pointed-to types are incompatible.",
        "An int pointer must be used with an appropriate int object.",
      ],
      draw: [
        "Draw a, b, and x.",
        "a points to x; b contains 9; x contains 7.",
        "Only a has an arrow.",
      ],
      takeaway:
        "Read every declarator: int* a, b declares one pointer and one integer.",
      verify: "std::cout << b;",
      expected: "9",
    }),
    lesson({
      id: "1.5",
      title: "Uninitialized, null, and valid",
      hook: "Does declaring a pointer automatically give it something safe to point to?",
      steps: [
        [
          "int* wild; // do not read it",
          "An uninitialized automatic pointer has no usable known value. We display “uninitialized”, not an invented address.",
          [p("wild", "wild")],
        ],
        [
          "int* empty = nullptr;",
          "A null pointer intentionally points to no object.",
          [p("empty", null, "stack", 1056)],
        ],
        ["int x = 7;", "Create a live integer to point to.", [v("x", "7")]],
        [
          "int* valid = &x;",
          "This pointer identifies a live integer and can be dereferenced.",
          [p("valid", "x", "stack", 1072)],
        ],
      ],
      predict: [
        "Which pointer can read x safely?",
        "valid",
        "Null and uninitialized pointers must not be dereferenced.",
      ],
      trace: [
        "What is empty == nullptr?",
        "true",
        "empty was explicitly initialized to nullptr.",
      ],
      bug: [
        "What is wrong with *empty = 3?",
        "It dereferences a null pointer: undefined behavior.",
        "Undefined behavior has no guaranteed output and may crash or do something else.",
      ],
      draw: [
        "Draw the three pointer states.",
        "wild: uninitialized; empty: nullptr; valid: arrow to x.",
        "An absent safe target must not be drawn as an ordinary object.",
      ],
      takeaway:
        "Initialize pointers; dereference only when you know the target is a suitable live object.",
      note: "Older examples use NULL; modern C++ uses nullptr. Dangling pointers appear after lifetime ends in Level 4.",
      verify: "std::cout << std::boolalpha << (empty == nullptr);",
      expected: "true",
    }),
  ].sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true })),
};
