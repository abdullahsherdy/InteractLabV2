import type { Level } from "../types";
import { lesson, v, p, set, point } from "../authoring";

export const level2: Level = {
  level: 2,
  slug: "pointer-operations",
  title: "Pointer operations",
  description: "Copy addresses, copy values, and reason about aliases.",
  prerequisite: "Level 1 · address and dereference",
  lessons: [
    lesson({
      id: "2.1a",
      title: "Copy the address: p = q",
      hook: "Does copying q into p copy the target’s value?",
      steps: [
        [
          "int x = 7, y = 9;",
          "Two separate integer houses contain 7 and 9.",
          [v("x", "7"), v("y", "9", "stack", 1016)],
        ],
        [
          "int* p = &x; int* q = &y;",
          "p points to x; q points to y.",
          [p("p", "x"), p("q", "y", "stack", 1056)],
        ],
        [
          "p = q;",
          "Copy the address inside q into p. Both pointers now point to y; x is unchanged.",
          [point("p", "y")],
        ],
      ],
      predict: [
        "Where does p point next?",
        "To y, just like q.",
        "The assignment writes the pointer object p.",
      ],
      trace: [
        "What are x and y after the copy?",
        "7 and 9",
        "Copying an address does not write either integer.",
      ],
      bug: [
        "Does p = q make p point to q itself?",
        "No. Use &q for q’s address, with a matching pointer-to-pointer type.",
        "q’s value and q’s own address differ.",
      ],
      draw: [
        "Draw the arrows after assignment.",
        "p → y and q → y; x still contains 7.",
        "There are two arrows to the same house.",
      ],
      takeaway: "p = q copies an address and redirects p.",
      verify:
        'std::cout << x << " " << y << " " << std::boolalpha << (p == q);',
      expected: "7 9 true",
    }),
    lesson({
      id: "2.1b",
      title: "Copy the value: *p = *q",
      hook: "What changes when both sides have a star?",
      steps: [
        [
          "int x = 7, y = 9;",
          "Start with two different integer values.",
          [v("x", "7"), v("y", "9", "stack", 1016)],
        ],
        [
          "int* p = &x; int* q = &y;",
          "Keep one pointer to each integer.",
          [p("p", "x"), p("q", "y", "stack", 1056)],
        ],
        [
          "*p = *q;",
          "Read the variable q points to, then copy 9 into the variable p points to. Neither arrow moves.",
          [set("x", "9")],
        ],
      ],
      predict: [
        "Does p now point to y?",
        "No; x becomes 9 and p still points to x.",
        "Dereference selects the target value on both sides.",
      ],
      trace: [
        "What are x and y now?",
        "9 and 9",
        "The values match but the objects remain distinct.",
      ],
      bug: [
        "Can this be used when q is nullptr?",
        "No; reading *q would be undefined behavior.",
        "Both dereferences require valid live targets.",
      ],
      draw: [
        "Draw the final arrows and values.",
        "p → x(9); q → y(9).",
        "Equal contents do not merge houses.",
      ],
      takeaway:
        "*p = *q copies a value while leaving both addresses unchanged.",
      verify:
        'std::cout << x << " " << y << " " << std::boolalpha << (p == q);',
      expected: "9 9 false",
    }),
    lesson({
      id: "2.2",
      title: "Aliasing: two routes to one object",
      hook: "If p and q point to x, does a write through q affect what p reads?",
      steps: [
        ["int x = 7;", "There is one integer object.", [v("x", "7")]],
        [
          "int* p = &x; int* q = p;",
          "Both sticky notes contain the same house number.",
          [p("p", "x"), p("q", "x", "stack", 1056)],
        ],
        [
          "*q = 20;",
          "Write through q. Reading through p now sees the same updated object.",
          [set("x", "20")],
        ],
      ],
      predict: ["What would *p read now?", "20", "Both pointers alias x."],
      trace: ["What is *p?", "20", "There is only one target object."],
      bug: [
        "Does int y = *p make y an alias too?",
        "No; that copies an integer value into a separate object.",
        "A copied value does not track future writes.",
      ],
      draw: [
        "How many integer houses are needed?",
        "One integer house x, plus the two pointer objects.",
        "Two pointers do not imply two targets.",
      ],
      takeaway:
        "Aliases give multiple access paths to one object; a write through either path changes that object.",
      verify: "std::cout << *p;",
      expected: "20",
    }),
    lesson({
      id: "2.3",
      title: "Same address or same value?",
      hook: "Can two pointers compare unequal when their targets contain equal numbers?",
      steps: [
        [
          "int x = 7, y = 7;",
          "x and y are different houses with equal contents.",
          [v("x", "7"), v("y", "7", "stack", 1016)],
        ],
        [
          "int* p = &x; int* q = &y;",
          "p and q identify different integer objects.",
          [p("p", "x"), p("q", "y", "stack", 1056)],
        ],
        [
          "bool same = (p == q); bool equal = (*p == *q);",
          "Compare addresses to ask “same object?”. Compare dereferenced values to ask “same integer?”.",
          [
            v("same", "false", "stack", 1080),
            v("equal", "true", "stack", 1096),
          ],
        ],
      ],
      predict: [
        "What are same and equal?",
        "false and true",
        "Different objects can hold equal values.",
      ],
      trace: [
        "Which comparison is true?",
        "*p == *q",
        "Both integers contain 7.",
      ],
      bug: [
        "May *p == *q be evaluated if one pointer is null?",
        "No; the dereference would be invalid.",
        "Pointer equality alone does not require dereferencing.",
      ],
      draw: [
        "Draw the state before comparison.",
        "Two separate houses containing 7, with one arrow to each.",
        "Keep identity separate from contents.",
      ],
      takeaway:
        "p == q compares addresses; *p == *q compares values when both dereferences are valid.",
      verify: 'std::cout << std::boolalpha << same << " " << equal;',
      expected: "false true",
    }),
    lesson({
      id: "2.4a",
      title: "A typedef names the entire pointer type",
      hook: "Does a pointer typedef change the int* a, b declaration rule?",
      steps: [
        [
          "typedef int* IntPtr;",
          "IntPtr names the complete type “pointer to int”. It does not create an object.",
          [],
        ],
        ["int x = 7;", "Create a live integer target.", [v("x", "7")]],
        [
          "IntPtr a = &x, b = &x;",
          "Both declarators use IntPtr, so both objects are pointers to int.",
          [p("a", "x"), p("b", "x", "stack", 1056)],
        ],
      ],
      predict: [
        "Is b a pointer in this declaration?",
        "Yes; both a and b have type IntPtr.",
        "The alias already includes the pointer type.",
      ],
      trace: ["Is a == b true?", "true", "Both store x’s address."],
      bug: [
        "Does int* a, b declare the same types as IntPtr a, b?",
        "No; the first declares b as int.",
        "A typedef names the entire type; a star in a declaration belongs to a declarator.",
      ],
      draw: [
        "Draw both aliases.",
        "a → x and b → x.",
        "A type alias creates no additional target object.",
      ],
      takeaway:
        "A pointer typedef names the whole pointer type, so each variable using that alias is a pointer.",
      verify: "std::cout << std::boolalpha << (a == b);",
      expected: "true",
    }),
    lesson({
      id: "2.4b",
      title: "const int*: read-only access to a target",
      hook: "Does a pointer to const have to point at a const variable?",
      steps: [
        [
          "int x = 7, y = 9;",
          "Create two ordinary mutable integers.",
          [v("x", "7"), v("y", "9", "stack", 1016)],
        ],
        [
          "const int* p = &x;",
          "p permits reading x through this access path, but not writing x through p.",
          [p("p", "x")],
        ],
        [
          "p = &y;",
          "The pointer itself is still assignable. Redirect it to y.",
          [point("p", "y")],
        ],
      ],
      predict: [
        "Can p be redirected to y?",
        "Yes; const applies to the pointed-to integer, not p itself.",
        "This restricts writes through this access path.",
      ],
      trace: ["What is *p now?", "9", "p now identifies y."],
      bug: [
        "Why does *p = 12 fail to compile?",
        "p provides const access to the target.",
        "The target may still change through another permitted non-const access path.",
      ],
      draw: [
        "Draw the final arrow.",
        "p → y(9); x remains 7.",
        "Read-only access does not imply an unchanging pointer.",
      ],
      takeaway:
        "const int* permits redirecting the pointer but forbids modifying the target through it.",
      verify: "std::cout << *p;",
      expected: "9",
    }),
    lesson({
      id: "2.4c",
      title: "int* const: a fixed address",
      hook: "Can a constant pointer still change the integer it points to?",
      steps: [
        ["int x = 7;", "Create a mutable integer.", [v("x", "7")]],
        [
          "int* const p = &x;",
          "Initialize a constant pointer. Its stored address cannot be reassigned.",
          [p("p", "x")],
        ],
        [
          "*p = 12;",
          "The target is not const, so writing through this fixed pointer is allowed.",
          [set("x", "12")],
        ],
      ],
      predict: [
        "Can this write change x?",
        "Yes; x becomes 12.",
        "The pointer is const; the pointed-to integer is not.",
      ],
      trace: ["What is x at the end?", "12", "The write targets x."],
      bug: [
        "Why would p = nullptr fail to compile?",
        "It attempts to modify the constant pointer object.",
        "const int* const would restrict both the pointer and writes through it.",
      ],
      draw: [
        "Draw the state after the write.",
        "The fixed arrow p → x remains; x now contains 12.",
        "Const qualification can constrain the address independently of the target.",
      ],
      takeaway:
        "int* const fixes the stored address; it does not make the pointed-to integer const.",
      verify: "std::cout << x;",
      expected: "12",
    }),
  ].sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true })),
};
