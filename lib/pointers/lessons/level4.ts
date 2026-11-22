import type { Level } from "../types";
import { lesson, v, p, set, point, free } from "../authoring";

export const level4: Level = {
  level: 4,
  slug: "heap-and-ownership",
  title: "Heap and ownership",
  description: "Allocate, release, and track who is responsible for cleanup.",
  prerequisite: "Level 3 · calls and lifetimes",
  lessons: [
    lesson({
      id: "4.1",
      title: "new creates a dynamic object",
      hook: "Where is the integer when the pointer itself is a local variable?",
      steps: [
        [
          "int* p = new int(7);",
          "new creates a dynamic integer initialized to 7. The local pointer stores its address.",
          [v("object", "7", "heap", 2000), p("p", "object")],
        ],
        [
          "*p = 12;",
          "Writing through p changes the dynamic integer, not the pointer’s address.",
          [set("object", "12")],
        ],
      ],
      predict: [
        "What changes next?",
        "The heap integer becomes 12.",
        "The pointer continues to identify the same allocation.",
      ],
      trace: [
        "What is *p before cleanup?",
        "12",
        "new int(7) initializes the object, and the next line updates it.",
      ],
      bug: [
        "Does leaving p’s block automatically delete the integer?",
        "No; a raw pointer does not provide automatic ownership cleanup.",
        "The next lesson introduces the required delete.",
      ],
      draw: [
        "Draw the storage zones.",
        "Stack: p. Heap: a nameless integer containing 12, reached by p.",
        "The pointer object and its target have independent lifetimes.",
      ],
      takeaway:
        "new creates an object with dynamic storage duration; a local pointer can refer to it.",
      note: "This focused allocation trace stops before cleanup. The complete verified example releases the object afterward. “Heap” is the usual implementation term; allocation can throw std::bad_alloc.",
      verify: "std::cout << *p; delete p; p = nullptr;",
      expected: "12",
    }),
    lesson({
      id: "4.2",
      title: "delete ends the target’s lifetime",
      hook: "Does delete p automatically erase the address stored in p?",
      steps: [
        [
          "int* p = new int(7);",
          "p is responsible for one live dynamic integer.",
          [v("object", "7", "heap", 2000), p("p", "object")],
        ],
        [
          "delete p;",
          "Release the object. The pointer is now dangling; delete does not assign nullptr.",
          [free("object")],
        ],
        [
          "p = nullptr;",
          "Clear this pointer so it no longer retains the released address.",
          [point("p", null)],
        ],
      ],
      predict: [
        "What does p hold after the last line?",
        "nullptr",
        "The explicit assignment clears the pointer.",
      ],
      trace: [
        "Is p == nullptr at the end?",
        "true",
        "The assignment after delete makes it null.",
      ],
      bug: [
        "Is *p safe after delete, before clearing p?",
        "No; the target no longer exists.",
        "Reading freed storage is undefined behavior.",
      ],
      draw: [
        "Draw the final state.",
        "The heap object is freed; p has no target.",
        "Freed boxes are historical marks, not live objects.",
      ],
      takeaway:
        "delete releases the object; a separate assignment clears the pointer.",
      verify: "std::cout << std::boolalpha << (p == nullptr);",
      expected: "true",
    }),
    lesson({
      id: "4.3",
      title: "Losing the last route leaks memory",
      hook: "If the last address is overwritten, how will the program find the allocation to release it?",
      steps: [
        [
          "int* p = new int(7);",
          "A dynamic object is reachable through p.",
          [v("object", "7", "heap", 2000), p("p", "object")],
        ],
        [
          "p = nullptr; // bug: allocation is lost",
          "The only route to the live allocation disappears. The allocated storage is not released.",
          [point("p", null)],
        ],
      ],
      predict: [
        "Does assigning nullptr free the integer?",
        "No; it leaves an unreachable live allocation.",
        "Only releasing the allocation ends this responsibility.",
      ],
      trace: [
        "What can safely be printed about p now?",
        "p == nullptr is true",
        "The leaked object cannot be recovered through p.",
      ],
      bug: [
        "Repair the final assignment.",
        "delete p; p = nullptr;",
        "Release the object while its address is still available.",
      ],
      draw: [
        "Draw the leaked object.",
        "A live heap house containing 7 with no route from a stack root.",
        "Incoming arrows inside an unreachable cycle do not make an allocation reachable.",
      ],
      takeaway:
        "Overwriting the last route to an allocation without releasing it leaks its storage.",
      note: "This deliberately faulty example leaks one integer. The verification prints only defined behavior; it never dereferences the lost object.",
      verify: "std::cout << std::boolalpha << (p == nullptr);",
      expected: "true",
    }),
    lesson({
      id: "4.4",
      title: "Dangling aliases and double delete",
      hook: "Does clearing one pointer also clear another pointer that held the same address?",
      steps: [
        [
          "int* p = new int(7);",
          "Create one dynamically allocated integer.",
          [v("object", "7", "heap", 2000), p("p", "object")],
        ],
        [
          "int* q = p;",
          "q borrows access to the same object; it is not a second allocation.",
          [p("q", "object", "stack", 1056)],
        ],
        [
          "delete p; p = nullptr;",
          "The object is gone and p is cleared. q still holds the old address and is dangling.",
          [free("object"), point("p", null)],
        ],
        [
          "q = nullptr; // never delete q here",
          "Clear the other alias. Releasing the same object through q again would be undefined behavior.",
          [point("q", null)],
        ],
      ],
      predict: [
        "Should q be deleted before clearing it?",
        "No; the shared target was already deleted.",
        "There was one allocation, so there must be one release.",
      ],
      trace: [
        "What are p and q at the end?",
        "Both are nullptr",
        "Each alias is cleared separately.",
      ],
      bug: [
        "What would delete q do just after delete p?",
        "Attempt a double delete: undefined behavior.",
        "A non-null pointer does not prove that its target is still alive.",
      ],
      draw: [
        "Draw the state immediately after delete p.",
        "p is nullptr; q is dangling; the one heap object is freed.",
        "Clearing p does not rewrite q.",
      ],
      takeaway:
        "Deleting an object invalidates every alias to it; clearing one alias changes only that alias.",
      verify: "std::cout << std::boolalpha << (p == nullptr && q == nullptr);",
      expected: "true",
    }),
    lesson({
      id: "4.5",
      title: "Make ownership a contract",
      hook: "When a function returns a raw pointer, who must release the object?",
      prelude:
        "int* makeScore() { return new int(42); } // caller owns the result",
      steps: [
        [
          "int* owner = makeScore();",
          "The documented contract transfers cleanup responsibility to the caller.",
          [v("score", "42", "heap", 2000), p("owner", "score")],
        ],
        [
          "int result = *owner;",
          "Copy the result while the owned integer is alive.",
          [v("result", "42", "stack", 1080)],
        ],
        [
          "delete owner; owner = nullptr;",
          "The caller releases the allocation once it no longer needs it.",
          [free("score"), point("owner", null)],
        ],
      ],
      predict: [
        "Does releasing owner destroy the copied result?",
        "No; result remains 42.",
        "result is a separate integer object.",
      ],
      trace: [
        "What is result at the end?",
        "42",
        "The value copy has its own lifetime.",
      ],
      bug: [
        "Can int* alone tell you whether you should delete it?",
        "No; ownership must be stated by the API contract.",
        "A raw pointer may borrow an object or transfer ownership; its type alone does not say which.",
      ],
      draw: [
        "Draw caller state after cleanup.",
        "owner is null, score is freed, result contains 42.",
        "Responsibility belongs to one owner even when there are several access paths.",
      ],
      takeaway:
        "State who owns a dynamic object and exactly when that owner releases it.",
      note: "Raw allocation is taught to understand lifetime. Level 8 introduces RAII and unique_ptr for automatic ownership.",
      verify: "std::cout << result;",
      expected: "42",
    }),
  ].sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true })),
};
