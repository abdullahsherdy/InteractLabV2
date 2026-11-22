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

export const level8: Level = {
  level: 8,
  slug: "pointer-techniques",
  title: "Pointer techniques and harder problems",
  description:
    "Combine familiar pointer operations into algorithms, then move toward automatic ownership.",
  prerequisite: "Levels 0–7; loops, conditions, and basic algorithm tracing",
  lessons: [
    lesson({
      id: "8.1",
      title: "Opposite ends: reverse an array",
      hook: "Why can two markers moving inward reverse an array without an extra array?",
      steps: [
        [
          "int a[4] = {2, 4, 6, 8};",
          "Create four contiguous integers. Each swap will finish one pair of positions.",
          [
            v("a[0]", "2", "stack", 1000, "a"),
            v("a[1]", "4", "stack", 1004, "a"),
            v("a[2]", "6", "stack", 1008, "a"),
            v("a[3]", "8", "stack", 1012, "a"),
          ],
        ],
        [
          "int* left = a; int* right = a + 3;",
          "Start at the first and last elements of the same non-empty array.",
          [p("left", "a[0]"), p("right", "a[3]", "stack", 1056)],
        ],
        [
          "int t = *left; *left = *right; *right = t;",
          "Exchange the outside values. Both ends are now in their final positions.",
          [set("a[0]", "8"), set("a[3]", "2"), v("t", "2", "stack", 1080)],
        ],
        [
          "++left; --right;",
          "Move both pointers inward by one element.",
          [point("left", "a[1]"), point("right", "a[2]")],
        ],
        [
          "t = *left; *left = *right; *right = t;",
          "Exchange the remaining middle pair. A general loop repeats while left is before right.",
          [set("a[1]", "6"), set("a[2]", "4"), set("t", "4")],
        ],
      ],
      predict: [
        "What are the final four values?",
        "8, 6, 4, 2",
        "The second swap finishes the middle pair.",
      ],
      trace: [
        "What is a after both swaps?",
        "8 6 4 2",
        "Each pair is exchanged once.",
      ],
      bug: [
        "Why is right = a + 4 wrong if it is immediately dereferenced?",
        "That is the one-past pointer, not the last element.",
        "Use a + 3 for this fixed four-element array. Empty arrays need a separate guard.",
      ],
      draw: [
        "Draw the two finished outer positions after the first swap.",
        "a[0] is 8 and a[3] is 2; the markers move toward the middle pair.",
        "Invariant: positions outside the markers are already final.",
      ],
      takeaway:
        "The two-pointer technique is an algorithm pattern; its markers may be memory pointers or integer indices.",
      note: "This is an unrolled trace for a fixed-size input. A full reverse loop takes O(n) time and O(1) extra storage. Pointer ordering here is within one array.",
      verify: 'for (int n : a) std::cout << n << " ";',
      expected: "8 6 4 2 ",
    }),
    lesson({
      id: "8.3",
      title: "Slow and fast: find a list’s middle",
      hook: "Where is a one-step cursor when a two-step cursor reaches the end?",
      prelude: nodeDefinition,
      steps: [
        [
          "Node c{9, nullptr}; Node b{7, &c}; Node a{4, &b};",
          "Build a three-node acyclic list.",
          [
            ...node("c", "9", null, "stack", 1064),
            ...node("b", "7", "c", "stack", 1032),
            ...node("a", "4", "b", "stack", 1000),
          ],
        ],
        [
          "Node* slow = &a; Node* fast = &a;",
          "Both cursors begin at the head.",
          [p("slow", "a", "stack", 1104), p("fast", "a", "stack", 1120)],
        ],
        [
          "if (fast && fast->next) {",
          "Check fast before reading its next field. Two hops require a live successor.",
          [],
        ],
        [
          "  slow = slow->next; fast = fast->next->next;",
          "slow advances one node to b, while fast advances two nodes to c.",
          [point("slow", "b"), point("fast", "c")],
        ],
        [
          "}",
          "The repeated loop condition now fails because c.next is null. slow identifies the middle.",
          [],
        ],
      ],
      predict: [
        "Would the loop take another iteration?",
        "No; fast->next is nullptr.",
        "The guard prevents a second hop through an absent node.",
      ],
      trace: ["Which value is at the middle?", "7", "slow ends at b."],
      bug: [
        "Why is fast->next && fast an unsafe guard?",
        "It reads fast->next before proving fast is non-null.",
        "Short-circuit evaluation protects only expressions on the right of a successful left operand.",
      ],
      draw: [
        "Draw both cursors after one iteration.",
        "slow → b(7); fast → c(9).",
        "In a general loop, fast makes twice as many hops as slow.",
      ],
      takeaway:
        "A fast cursor can reveal where a slow cursor is; validate each required link before following it.",
      note: "The code shows one iteration for this three-node input. Repeat the guarded body with while for a general acyclic list; on an even-sized list this convention selects the second middle.",
      verify: "std::cout << slow->value;",
      expected: "7",
    }),
    lesson({
      id: "8.4",
      title: "Reverse a list by saving the next link",
      hook: "After reversing a link, how will you find the rest of the original chain?",
      prelude: nodeDefinition,
      steps: [
        [
          "Node b{7, nullptr}; Node a{4, &b};",
          "Start with a two-node local chain. The algorithm changes links, not data.",
          [
            ...node("b", "7", null, "stack", 1032),
            ...node("a", "4", "b", "stack", 1000),
          ],
        ],
        [
          "Node* previous = nullptr; Node* current = &a;",
          "previous marks the reversed prefix; current marks the unprocessed suffix.",
          [
            p("previous", null, "stack", 1104),
            p("current", "a", "stack", 1120),
          ],
        ],
        [
          "Node* next = current->next;",
          "Save the next original node before overwriting its route.",
          [p("next", "b", "stack", 1136)],
        ],
        [
          "current->next = previous;",
          "Reverse the first link: a now points to null.",
          [point("a.next", null)],
        ],
        [
          "previous = current; current = next;",
          "Advance both region markers using the saved route.",
          [point("previous", "a"), point("current", "b")],
        ],
        [
          "next = current->next; current->next = previous;",
          "Save b’s null successor, then reverse b’s link to a.",
          [point("next", null), point("b.next", "a")],
        ],
        [
          "previous = current; current = next;",
          "The unprocessed suffix is empty; previous is the head of the reversed chain.",
          [point("previous", "b"), point("current", null)],
        ],
      ],
      predict: [
        "Where is the new head?",
        "previous points to b, whose value is 7.",
        "The reversed prefix now contains every original node.",
      ],
      trace: [
        "What is the final chain?",
        "7 → 4 → nullptr",
        "Only the next links were rewritten.",
      ],
      bug: [
        "What happens if next is not saved before current->next is overwritten?",
        "The route to the unprocessed suffix may be lost.",
        "Save, rewire, then advance, in that order.",
      ],
      draw: [
        "Draw the two regions after the first iteration.",
        "previous → a → null; current → b → null.",
        "The reversed prefix and unprocessed suffix are kept separate.",
      ],
      takeaway:
        "List reversal saves the successor, rewires one link, then advances the two region markers.",
      note: "This is an unrolled two-node trace. Repeating the three operations while current is non-null gives O(n) time and O(1) extra storage.",
      verify: 'std::cout << previous->value << " " << previous->next->value;',
      expected: "7 4",
    }),
    lesson({
      id: "8.8",
      title: "Beyond the course: RAII with unique_ptr",
      hook: "Can an owner release an allocation even when execution leaves its block early?",
      beyond: true,
      steps: [
        [
          "{ auto owner = std::make_unique<int>(7);",
          "unique_ptr owns one dynamic integer. Its destructor will release that integer when the owner leaves scope.",
          [v("object", "7", "heap", 2000), p("owner", "object")],
        ],
        [
          "  *owner = 12;",
          "Dereferencing the owner accesses the integer as before.",
          [set("object", "12")],
        ],
        [
          "}",
          "The owner’s destructor releases the integer automatically. There is no explicit delete in the calling code.",
          [free("object"), { kind: "remove", id: "owner" }],
        ],
      ],
      predict: [
        "Is the integer leaked when the block ends?",
        "No; unique_ptr releases its owned object.",
        "RAII ties resource cleanup to an owner object’s lifetime.",
      ],
      trace: [
        "How many live allocations remain after the block?",
        "Zero from this example",
        "The unique owner’s destructor performs the release.",
      ],
      bug: [
        "Should delete owner.get() be used manually?",
        "No; the owner would later try to release the same allocation again.",
        "Borrowed raw access does not transfer cleanup responsibility.",
      ],
      draw: [
        "Draw the state after the closing brace.",
        "The owner is gone and its dynamic integer is freed.",
        "Ownership changes lifetime management, not the meaning of dereferencing.",
      ],
      takeaway:
        "RAII gives a resource an owner whose destructor handles cleanup automatically.",
      note: "Beyond the course. Prefer values, standard containers, and unique ownership in production when their semantics fit. The card models the owned target; it does not claim a particular unique_ptr object layout.",
      verify: 'std::cout << "released at scope exit";',
      expected: "released at scope exit",
    }),
    lesson({
      id: "8.1b",
      title: "Sorted two-sum: justify each move",
      hook: "If the current sum is too small in a sorted array, which end can help?",
      steps: [
        [
          "int a[4] = {1, 3, 5, 8}; int target = 11;",
          "The array is sorted in ascending order, so endpoint moves have predictable effects.",
          [
            v("a[0]", "1", "stack", 1000, "a"),
            v("a[1]", "3", "stack", 1004, "a"),
            v("a[2]", "5", "stack", 1008, "a"),
            v("a[3]", "8", "stack", 1012, "a"),
            v("target", "11", "stack", 1080),
          ],
        ],
        [
          "int* left = a; int* right = a + 3;",
          "The outside pair sums to 9, below the target.",
          [p("left", "a[0]"), p("right", "a[3]", "stack", 1056)],
        ],
        [
          "if (*left + *right < target) ++left;",
          "Move left inward. With this left value, every smaller right value would also be too small, so discarding that left endpoint is safe.",
          [point("left", "a[1]")],
        ],
        [
          "bool found = (*left + *right == target);",
          "The new pair 3 and 8 sums to 11.",
          [v("found", "true", "stack", 1096)],
        ],
      ],
      predict: [
        "Does the new pair meet the target?",
        "Yes: 3 + 8 = 11.",
        "Sorted order explains which endpoint can be discarded.",
      ],
      trace: [
        "Which values form the pair?",
        "3 and 8",
        "The pointers identify distinct elements.",
      ],
      bug: [
        "Does the same move rule work on an unsorted array?",
        "No; the elimination argument requires sorted order.",
        "A general loop continues while left < right, moving right when the sum is too large.",
      ],
      draw: [
        "Draw the remaining candidate endpoints.",
        "left → a[1](3), right → a[3](8).",
        "The discarded first element cannot participate in a solution for this search state.",
      ],
      takeaway:
        "Two-sum endpoint moves are justified by sorted order, not by the presence of two pointers alone.",
      note: "Fixed small values avoid integer overflow. A general implementation must choose an arithmetic type wide enough for its input bounds.",
      verify: "std::cout << std::boolalpha << found;",
      expected: "true",
    }),
    lesson({
      id: "8.1c",
      title: "Palindrome: compare symmetric positions",
      hook: "What must be true of every outside pair in a palindrome?",
      steps: [
        [
          "char a[5] = {'l', 'e', 'v', 'e', 'l'};",
          "Use a fixed character array; the known extent is 5, so this algorithm does not require a terminator.",
          [
            v("a[0]", "'l'", "stack", 1000, "a"),
            v("a[1]", "'e'", "stack", 1001, "a"),
            v("a[2]", "'v'", "stack", 1002, "a"),
            v("a[3]", "'e'", "stack", 1003, "a"),
            v("a[4]", "'l'", "stack", 1004, "a"),
          ],
        ],
        [
          "int left = 0, right = 4; bool palindrome = true;",
          "Here the two markers are integer indices, not memory pointer variables.",
          [
            v("left", "0", "stack", 1040),
            v("right", "4", "stack", 1056),
            v("palindrome", "true", "stack", 1080),
          ],
        ],
        [
          "while (left < right) { if (a[left] != a[right]) { palindrome = false; break; } ++left; --right; }",
          "Compare l with l, then e with e. Both match, and the indices meet at the center.",
          [set("left", "2"), set("right", "2")],
        ],
      ],
      predict: [
        "Does the center character need a partner check?",
        "No; it equals itself.",
        "The comparison loop stops when the indices meet or cross.",
      ],
      trace: [
        "Is this input a palindrome?",
        "true",
        "Every symmetric pair matches.",
      ],
      bug: [
        "Why is while (left != right) wrong for even-length arrays?",
        "The indices may cross without ever becoming equal.",
        "Use left < right as the condition.",
      ],
      draw: [
        "Draw the final markers.",
        "Both indices identify position 2, containing v.",
        "Indices implement the same inward-moving algorithm pattern without storing addresses.",
      ],
      takeaway:
        "The two-pointer pattern can use indices; palindrome checking compares symmetric pairs until the markers meet.",
      verify: "std::cout << std::boolalpha << palindrome;",
      expected: "true",
    }),
    lesson({
      id: "8.2",
      title: "Read/write pointers remove sorted duplicates",
      hook: "Can one pointer scan while another marks the next output position?",
      steps: [
        [
          "int a[4] = {1, 1, 2, 2};",
          "Sorted equal values are adjacent. Keep a unique prefix inside the same array.",
          [
            v("a[0]", "1", "stack", 1000, "a"),
            v("a[1]", "1", "stack", 1004, "a"),
            v("a[2]", "2", "stack", 1008, "a"),
            v("a[3]", "2", "stack", 1012, "a"),
          ],
        ],
        [
          "int* write = a + 1;",
          "The first value is already unique. write marks the next free output position.",
          [p("write", "a[1]")],
        ],
        [
          "for (int* read = a + 1; read != a + 4; ++read) { if (*read != *(write - 1)) { *write = *read; ++write; } }",
          "Skip the second 1, copy 2 into output position 1, then skip the repeated 2. The physical array size does not change.",
          [set("a[1]", "2"), point("write", "a[2]")],
        ],
        [
          "int length = static_cast<int>(write - a);",
          "The distance from the beginning to the next free output position is the logical unique length.",
          [v("length", "2", "stack", 1080)],
        ],
      ],
      predict: [
        "What is the logical output length?",
        "2",
        "Only the prefix {1, 2} is part of the result.",
      ],
      trace: [
        "What are the unique prefix and its length?",
        "{1, 2}, length 2",
        "Ignore all positions beyond that logical length.",
      ],
      bug: [
        "May the function print every physical array element as the unique result?",
        "No; the tail is not part of the result.",
        "The algorithm compacts values but does not resize a built-in array.",
      ],
      draw: [
        "Draw the valid result region.",
        "Positions 0 and 1 contain 1 and 2; write identifies position 2, the next output slot.",
        "A general implementation returns length 0 for empty input before initializing write to a + 1.",
      ],
      takeaway:
        "Read scans the input; write advances only when a new unique value extends the output prefix.",
      note: "This fixed non-empty sorted input avoids the empty case. The full scan takes O(n) time and O(1) extra storage.",
      verify: 'std::cout << length << " " << a[0] << " " << a[1];',
      expected: "2 1 2",
    }),
    lesson({
      id: "8.3b",
      title: "Floyd: detect a cycle without extra storage",
      hook: "If the fast cursor keeps lapping the slow cursor, what eventually happens?",
      prelude: nodeDefinition,
      steps: [
        [
          "Node c{9, nullptr}; Node b{7, &c}; Node a{4, &b}; c.next = &b;",
          "Create a local chain whose last node links back to b. The cycle contains b and c.",
          [
            ...node("c", "9", "b", "stack", 1064),
            ...node("b", "7", "c", "stack", 1032),
            ...node("a", "4", "b", "stack", 1000),
          ],
        ],
        [
          "Node* slow = &a; Node* fast = &a;",
          "Start both cursors at the head. Initial equality alone is not evidence of a cycle.",
          [p("slow", "a", "stack", 1104), p("fast", "a", "stack", 1120)],
        ],
        [
          "slow = slow->next; fast = fast->next->next;",
          "After one iteration, slow is at b and fast at c.",
          [point("slow", "b"), point("fast", "c")],
        ],
        [
          "slow = slow->next; fast = fast->next->next;",
          "After a second iteration, both cursors identify c, the same node.",
          [point("slow", "c"), point("fast", "c")],
        ],
        [
          "bool cycle = (slow == fast);",
          "Equality after advancing detects a meeting inside the cycle.",
          [v("cycle", "true", "stack", 1160)],
        ],
      ],
      predict: [
        "Does cursor equality compare node values or node identity?",
        "Node identity: both pointers identify c.",
        "Two different nodes with equal values are not a meeting.",
      ],
      trace: [
        "Is cycle true here?",
        "true",
        "The cursors meet after advancing.",
      ],
      bug: [
        "Why must a general implementation check fast && fast->next before two hops?",
        "An acyclic list can end before the second hop.",
        "This unrolled example has known non-null links; arbitrary input requires the guard.",
      ],
      draw: [
        "Draw the cycle and the meeting.",
        "a → b → c → b; slow and fast both identify c.",
        "A plain traversal waiting for nullptr would never finish on this input.",
      ],
      takeaway:
        "Floyd detects a cycle when one-step and two-step cursors meet after advancing.",
      note: "A general guarded loop takes O(n) time and O(1) extra storage. Do not use ordinary null-terminated list cleanup on a cyclic structure.",
      verify: "std::cout << std::boolalpha << cycle;",
      expected: "true",
    }),
    lesson({
      id: "8.4b",
      title: "Merge sorted lists by reusing their links",
      hook: "Can two sorted chains become one sorted chain without copying their values?",
      prelude: nodeDefinition,
      steps: [
        [
          "Node a2{3, nullptr}; Node a1{1, &a2}; Node b2{4, nullptr}; Node b1{2, &b2};",
          "Create two sorted local chains: 1 → 3 and 2 → 4.",
          [
            ...node("a2", "3", null, "stack", 1032),
            ...node("a1", "1", "a2", "stack", 1000),
            ...node("b2", "4", null, "stack", 1096),
            ...node("b1", "2", "b2", "stack", 1064),
          ],
        ],
        [
          "Node* a = &a1; Node* b = &b1; Node dummy{0, nullptr}; Node* tail = &dummy;",
          "A dummy node provides a stable place for the first output link. tail identifies the last selected output node.",
          [
            p("a", "a1", "stack", 1160),
            p("b", "b1", "stack", 1176),
            ...node("dummy", "0", null, "stack", 1216),
            p("tail", "dummy", "stack", 1256),
          ],
        ],
        [
          "while (a && b) { if (a->value <= b->value) { tail->next = a; a = a->next; } else { tail->next = b; b = b->next; } tail = tail->next; }",
          "Repeatedly append the smaller head: choose 1, then 2, then 3. Each input remains sorted, so its head is its smallest remaining value.",
          [
            point("dummy.next", "a1"),
            point("a1.next", "b1"),
            point("b1.next", "a2"),
            point("a", null),
            point("b", "b2"),
            point("tail", "a2"),
          ],
        ],
        [
          "tail->next = a ? a : b;",
          "When one chain is empty, append the remaining chain in one link assignment.",
          [point("a2.next", "b2")],
        ],
      ],
      predict: [
        "What is the final chain after the dummy?",
        "1 → 2 → 3 → 4 → nullptr",
        "The remaining input chain is already sorted.",
      ],
      trace: [
        "What values does the merged traversal visit?",
        "1 2 3 4",
        "No data values were copied or changed.",
      ],
      bug: [
        "Why must the result begin at dummy.next instead of &dummy?",
        "The dummy is bookkeeping, not an input value, and is local to this scope.",
        "Returning its address from a helper would also be a lifetime error.",
      ],
      draw: [
        "Draw the new links.",
        "dummy → a1 → b1 → a2 → b2 → null.",
        "The original chains are consumed by this destructive merge; they are not independent lists afterward.",
      ],
      takeaway:
        "Merge sorted lists by appending the smaller remaining head and preserving each input’s next route.",
      note: "Inputs must be sorted, acyclic, and disjoint. Equal values are taken from the first list first. Runtime O(n + m), auxiliary storage O(1).",
      verify:
        'for (Node* n = dummy.next; n; n = n->next) std::cout << n->value << " ";',
      expected: "1 2 3 4 ",
    }),
    lesson({
      id: "8.4c",
      title: "A fixed gap locates the n-th node from the end",
      hook: "Can two cursors find a node counted from the end without computing the full length first?",
      prelude: nodeDefinition,
      steps: [
        [
          "Node c{9, nullptr}; Node b{7, &c}; Node a{4, &b}; Node dummy{0, &a};",
          "Use a dummy predecessor before a three-node local chain. We will unlink the second node from the end.",
          [
            ...node("c", "9", null, "stack", 1064),
            ...node("b", "7", "c", "stack", 1032),
            ...node("a", "4", "b", "stack", 1000),
            ...node("dummy", "0", "a", "stack", 1100),
          ],
        ],
        [
          "Node* fast = &a; Node* slow = &dummy;",
          "slow starts one node before the head so it can finish at the removal predecessor.",
          [p("fast", "a", "stack", 1160), p("slow", "dummy", "stack", 1176)],
        ],
        [
          "fast = fast->next; fast = fast->next;",
          "Advance fast by n = 2 links, checking availability in a general implementation.",
          [point("fast", "c")],
        ],
        [
          "while (fast) { fast = fast->next; slow = slow->next; }",
          "Move both by one until fast reaches null. slow finishes at a, immediately before the selected node b.",
          [point("fast", null), point("slow", "a")],
        ],
        [
          "Node* victim = slow->next; slow->next = victim->next;",
          "Save the selected node and bypass it. b is a local object here, so it must not be deleted.",
          [p("victim", "b", "stack", 1192), point("a.next", "c")],
        ],
      ],
      predict: [
        "What chain remains reachable from dummy.next?",
        "4 → 9 → nullptr",
        "b was the second node from the end.",
      ],
      trace: [
        "What value was unlinked?",
        "7",
        "The cursor gap located b’s predecessor.",
      ],
      bug: [
        "Should delete victim be used for these local nodes?",
        "No; delete requires an appropriate dynamic allocation.",
        "For an owning dynamic list, release the unlinked dynamic node once after rewiring.",
      ],
      draw: [
        "Draw the surviving chain and removed object.",
        "dummy → a → c → null; victim → b, which remains alive until scope exit.",
        "Unlinking changes reachability from the list head, not automatic object lifetime.",
      ],
      takeaway:
        "A fixed cursor gap can locate a predecessor relative to the end of a list.",
      note: "This trace uses valid n = 2. A general API must reject n <= 0 or n larger than the list length before dereferencing. Runtime O(length), extra storage O(1).",
      verify: 'std::cout << victim->value << " " << dummy.next->next->value;',
      expected: "7 9",
    }),
    lesson({
      id: "8.5a",
      title: "Shallow copy shares an address",
      hook: "Does copying a struct with a pointer member copy the pointed-to integer too?",
      prelude: "struct View { int* data; };",
      steps: [
        ["int x = 7;", "Create one ordinary integer.", [v("x", "7")]],
        [
          "View a{&x}; View b = a;",
          "Default memberwise copy copies the pointer value. Both views refer to the same integer.",
          [p("a.data", "x"), p("b.data", "x", "stack", 1056)],
        ],
        [
          "*b.data = 12;",
          "Writing through the copied pointer changes the shared target.",
          [set("x", "12")],
        ],
      ],
      predict: [
        "What does *a.data read after this write?",
        "12",
        "The copied member is an address, not a separately copied target.",
      ],
      trace: [
        "How many integer targets exist?",
        "One",
        "Both pointer members identify x.",
      ],
      bug: [
        "If both structs assumed they owned one dynamic target and both deleted it, what would happen?",
        "The second release would be a double delete: undefined behavior.",
        "Ownership needs deliberate copy behavior, not an accidental memberwise copy.",
      ],
      draw: [
        "Draw the copied members.",
        "a.data → x(12), b.data → x(12).",
        "Two structs can share one target after a shallow copy.",
      ],
      takeaway:
        "A shallow copy copies pointer members as addresses, so both objects can share a target.",
      note: "Savitch 10th ed. ?11.4, p. 701 in the supplied syllabus.",
      verify: "std::cout << *a.data;",
      expected: "12",
    }),
    lesson({
      id: "8.5b",
      title: "Deep copy gives each owner its own target",
      hook: "How can an owning object be copied without sharing its allocation?",
      prelude:
        "struct Owner {\n  int* data;\n  explicit Owner(int value) : data(new int(value)) {}\n  Owner(const Owner& other) : data(new int(*other.data)) {}\n  Owner& operator=(const Owner&) = delete; // assignment is intentionally unsupported\n  ~Owner() { delete data; }\n};",
      steps: [
        [
          "Owner a(7);",
          "The constructor allocates one integer for a.",
          [v("a-target", "7", "heap", 2000), p("a.data", "a-target")],
        ],
        [
          "Owner b = a;",
          "The copy constructor allocates a different integer and copies the value, giving each owner one target.",
          [
            v("b-target", "7", "heap", 2100),
            p("b.data", "b-target", "stack", 1056),
          ],
        ],
        [
          "*b.data = 12;",
          "Changing b’s target does not change a’s target.",
          [set("b-target", "12")],
        ],
      ],
      predict: [
        "What are *a.data and *b.data?",
        "7 and 12",
        "Deep copying made independent allocations.",
      ],
      trace: [
        "Do the two owners share one address?",
        "No",
        "Each constructor allocated a separate integer.",
      ],
      bug: [
        "Why is adding a destructor without fixing copy behavior dangerous for a raw owning pointer?",
        "A default shallow copy could make two destructors release the same target.",
        "This teaching type defines a deep-copy constructor and disables copy assignment rather than leaving it unsafe.",
      ],
      draw: [
        "Draw the two owners.",
        "a.data → one integer containing 7; b.data → a different integer containing 12.",
        "At scope exit, each destructor releases its own target once.",
      ],
      takeaway:
        "An owning type needs deliberate copy semantics; a deep copy creates an independent owned target.",
      note: "Savitch 10th ed. §11.4, p. 701 in the supplied syllabus. This small type is not a complete value type: copy assignment is disabled. Standard containers and RAII types usually avoid hand-written ownership.",
      verify: 'std::cout << *a.data << " " << *b.data;',
      expected: "7 12",
    }),
    lesson({
      id: "8.6",
      title: "Build a small doubling array",
      hook: "Why can doubling capacity make repeated appends efficient?",
      prelude:
        "struct TinyArray {\n  int* data = new int[2]{};\n  int size = 0, capacity = 2;\n  TinyArray() = default;\n  TinyArray(const TinyArray&) = delete;\n  TinyArray& operator=(const TinyArray&) = delete;\n  ~TinyArray() { delete[] data; }\n  void push_back(int value) {\n    if (size == capacity) {\n      int* next = new int[capacity * 2]{};\n      for (int i = 0; i < size; ++i) next[i] = data[i];\n      delete[] data; data = next; capacity *= 2;\n    }\n    data[size++] = value;\n  }\n};",
      steps: [
        [
          "TinyArray a;",
          "Create an owner with size 0 and capacity 2. Only the size prefix represents stored values.",
          [
            v("data[0]", "0", "heap", 2000, "old"),
            v("data[1]", "0", "heap", 2004, "old"),
            p("a.data", "data[0]"),
            v("size", "0", "stack", 1080),
            v("capacity", "2", "stack", 1096),
          ],
        ],
        [
          "a.push_back(4); a.push_back(7);",
          "Two appends fill the available slots without reallocating.",
          [set("data[0]", "4"), set("data[1]", "7"), set("size", "2")],
        ],
        [
          "a.push_back(9);",
          "A third append doubles capacity to 4, copies the existing prefix, releases the old allocation, then stores 9.",
          [
            v("larger[0]", "4", "heap", 2100, "new"),
            v("larger[1]", "7", "heap", 2104, "new"),
            v("larger[2]", "9", "heap", 2108, "new"),
            v("larger[3]", "0", "heap", 2112, "new"),
            free("data[0]"),
            point("a.data", "larger[0]"),
            set("size", "3"),
            set("capacity", "4"),
          ],
        ],
      ],
      predict: [
        "What are size and capacity after the third append?",
        "Size 3, capacity 4.",
        "Allocated slots and logically stored values are different quantities.",
      ],
      trace: [
        "What values are in the logical prefix?",
        "4, 7, 9",
        "The unused fourth slot is not part of the sequence.",
      ],
      bug: [
        "Can a raw pointer into the old allocation be used after growth?",
        "No; reallocation invalidates pointers to the old storage.",
        "The class also disables copying to avoid accidental shared ownership.",
      ],
      draw: [
        "Draw the final owner and capacity.",
        "a.data reaches four slots, of which the first three are logical values.",
        "The destructor releases the current allocation at scope exit.",
      ],
      takeaway:
        "Doubling capacity separates size from storage capacity and spreads occasional copying across many appends.",
      note: "This is a bounded teaching example, not a replacement for std::vector: it omits capacity-overflow checks and a complete value-type interface. A growth append costs O(n); appends cost amortized O(1) under geometric growth.",
      verify: 'std::cout << a.size << " " << a.capacity << " " << a.data[2];',
      expected: "3 4 9",
    }),
    lesson({
      id: "8.7",
      title: "Debug a leak, a dangling alias, and a double delete",
      hook: "Can you explain the lifetime bug before trying to repair it?",
      steps: [
        [
          "int* p = new int(7); int* alias = p;",
          "One allocation has two access paths. Decide which pointer owns cleanup.",
          [
            v("object", "7", "heap", 2000),
            p("p", "object"),
            p("alias", "object", "stack", 1056),
          ],
        ],
        [
          "// BUG: p = nullptr; // loses the owner without releasing",
          "Clearing an owner is not cleanup. With alias still present the object is reachable, but its cleanup responsibility is now confused.",
          [],
        ],
        [
          "delete p; p = nullptr;",
          "Release through the designated owner exactly once and clear that owner. alias is now dangling.",
          [free("object"), point("p", null)],
        ],
        [
          "// BUG: *alias = 9; // use after free",
          "Do not write through the dangling alias. Undefined behavior has no fixed output.",
          [],
        ],
        [
          "// BUG: delete alias; // double delete",
          "Do not release the same allocation again. A remaining non-null address is not evidence of a live target.",
          [],
        ],
        [
          "alias = nullptr;",
          "Repair the remaining alias by clearing it without dereferencing or deleting again.",
          [point("alias", null)],
        ],
      ],
      predict: [
        "What should happen to alias now?",
        "Set it to nullptr; do not dereference or delete it.",
        "The one allocation was already released.",
      ],
      trace: [
        "How many releases does one allocation require?",
        "Exactly one valid matching release",
        "Copying its address does not create another allocation.",
      ],
      bug: [
        "What if both p and alias are overwritten before delete?",
        "The allocation becomes unreachable and leaks.",
        "Distinguish losing ownership responsibility from losing every possible access path.",
      ],
      draw: [
        "Draw the state after delete p, before alias is cleared.",
        "p is null; alias dangles; the allocation is freed.",
        "A dangling pointer still carries an address whose object has died.",
      ],
      takeaway:
        "Track allocation, ownership, aliases, and release separately to explain each memory bug.",
      note: "Buggy lines are comments and are never executed. The executable trace demonstrates the repaired lifetime.",
      verify:
        "std::cout << std::boolalpha << (p == nullptr && alias == nullptr);",
      expected: "true",
    }),
    lesson({
      id: "8.8b",
      title: "Beyond the course: shared ownership and weak observation",
      hook: "When two owners share an allocation, which reset releases the object?",
      beyond: true,
      steps: [
        [
          "auto first = std::make_shared<int>(7);",
          "Create one integer with shared ownership.",
          [v("object", "7", "heap", 2000), p("first", "object")],
        ],
        [
          "auto second = first; std::weak_ptr<int> observer = first;",
          "A second shared owner keeps the object alive. A weak observer does not count as an owner.",
          [
            p("second", "object", "stack", 1056),
            v("observer", "not expired", "stack", 1080),
          ],
        ],
        [
          "first.reset();",
          "Removing one owner does not release the object while another shared owner remains.",
          [point("first", null)],
        ],
        [
          "second.reset();",
          "Removing the final shared owner ends the integer’s lifetime. The weak observer now reports expiration.",
          [point("second", null), free("object"), set("observer", "expired")],
        ],
      ],
      predict: [
        "Does observer keep the integer alive?",
        "No; it does not contribute to strong ownership.",
        "A weak observer must obtain a live shared owner with lock() before using the object.",
      ],
      trace: [
        "Is observer.expired() true at the end?",
        "true",
        "All shared owners have reset.",
      ],
      bug: [
        "Do shared_ptr objects automatically prevent leaks in a cycle of strong owners?",
        "No; a cycle of strong ownership can keep itself alive.",
        "Design ownership deliberately; weak_ptr can express non-owning back-links.",
      ],
      draw: [
        "Draw the state after first.reset(), before second.reset().",
        "first is empty; second still owns the live integer; observer is non-owning.",
        "The board models observer as a status, not a strong pointer root.",
      ],
      takeaway:
        "shared_ptr shares lifetime responsibility; weak_ptr observes without extending the target’s lifetime.",
      note: "Beyond the course. Shared ownership adds bookkeeping and should be used when the ownership model requires it. The control block may outlive the integer while weak observers exist; the board shows the integer’s lifetime only.",
      verify: "std::cout << std::boolalpha << observer.expired();",
      expected: "true",
    }),
  ].sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true })),
};
