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

export const level6: Level = {
  level: 6,
  slug: "nodes-and-links",
  title: "Nodes and linked structures",
  description:
    "Read fields through pointers and preserve the route through a chain.",
  prerequisite: "Level 5 · pointers, arrays, cleanup; basic structs",
  lessons: [
    lesson({
      id: "6.1",
      title: "A node holds a value and a link",
      hook: "How can one object carry both data and a route to the next object?",
      prelude: nodeDefinition,
      steps: [
        [
          "Node a{7, nullptr};",
          "A Node groups an integer value and a next pointer. Here a is a local object.",
          node("a", "7", null, "stack", 1000),
        ],
        [
          "Node* p = &a;",
          "p points to the node object.",
          [p("p", "a", "stack", 1080)],
        ],
        [
          "p->value = 12;",
          "The arrow operator accesses a field through a pointer. p->value means (*p).value.",
          [set("a", "12")],
        ],
      ],
      predict: [
        "Which field changes?",
        "a.value becomes 12; a.next remains null.",
        "The member name after the arrow selects the field.",
      ],
      trace: ["What is a.value now?", "12", "p identifies a."],
      bug: [
        "Can p->value be evaluated when p is null?",
        "No; member access would dereference an invalid pointer.",
        "A node link being null marks an absent node, not a node with zero data.",
      ],
      draw: [
        "Draw the two fields of a.",
        "a: value 12, next nullptr; p points to a.",
        "The value field and the link field have different jobs.",
      ],
      takeaway:
        "A node groups data and a link; p->field accesses a field of the node p points to.",
      note: "A node card’s large number is its value field. The separate .next card is the pointer field; grouped cards belong to one object. Node layout and padding are illustrative.",
      verify: "std::cout << a.value;",
      expected: "12",
    }),
    lesson({
      id: "6.2",
      title: "Traverse a three-node chain",
      hook: "How do you advance to the next node without changing the links?",
      prelude: nodeDefinition,
      steps: [
        [
          "Node c{9, nullptr};",
          "c is the final node; its next link is null.",
          node("c", "9", null, "stack", 1064),
        ],
        [
          "Node b{7, &c}; Node a{4, &b};",
          "a links to b, and b links to c. These nodes have automatic local lifetimes.",
          [
            ...node("b", "7", "c", "stack", 1032),
            ...node("a", "4", "b", "stack", 1000),
          ],
        ],
        [
          "Node* cursor = &a;",
          "Start a traversal cursor at the first node.",
          [p("cursor", "a", "stack", 1104)],
        ],
        [
          "cursor = cursor->next;",
          "Read a’s next field and copy that address into cursor. The list itself does not change.",
          [point("cursor", "b")],
        ],
        [
          "cursor = cursor->next;",
          "Advance from b to c by the same rule.",
          [point("cursor", "c")],
        ],
        [
          "cursor = cursor->next;",
          "The next link in c is null. A traversal loop stops before another dereference.",
          [point("cursor", null)],
        ],
      ],
      predict: [
        "Where does cursor go after c?",
        "nullptr",
        "The last node has no successor.",
      ],
      trace: [
        "What values does a full traversal visit?",
        "4, 7, 9",
        "Following next from a visits b and then c.",
      ],
      bug: [
        "Why is while (cursor->next) unsafe when cursor may be null?",
        "It reads a member before checking cursor itself.",
        "Use while (cursor != nullptr) before accessing its fields.",
      ],
      draw: [
        "Draw the links after traversal.",
        "a → b → c → nullptr; cursor is nullptr.",
        "Moving cursor does not rewrite any node’s next field.",
      ],
      takeaway:
        "cursor = cursor->next advances the cursor while preserving the chain.",
      verify:
        'for (Node* n = &a; n; n = n->next) std::cout << n->value << " ";',
      expected: "4 7 9 ",
    }),
    lesson({
      id: "6.3",
      title: "Insert at the head without losing the chain",
      hook: "Which link must be saved before the head pointer moves?",
      prelude: nodeDefinition,
      steps: [
        [
          "Node a{7, nullptr}; Node* head = &a;",
          "The current head reaches the existing chain.",
          [
            ...node("a", "7", null, "stack", 1000),
            p("head", "a", "stack", 1104),
          ],
        ],
        [
          "Node fresh{3, nullptr};",
          "Create the new node separately; it has not joined the chain.",
          node("fresh", "3", null, "stack", 1032),
        ],
        [
          "fresh.next = head;",
          "First connect the new node to the old head.",
          [point("fresh.next", "a")],
        ],
        [
          "head = &fresh;",
          "Then move the head to the new node. The old chain stays reachable.",
          [point("head", "fresh")],
        ],
      ],
      predict: [
        "What is the final chain from head?",
        "3 → 7 → nullptr",
        "Save the old head in the new node before replacing head.",
      ],
      trace: ["Which value is first?", "3", "head now points to fresh."],
      bug: [
        "What is wrong with head = &fresh; fresh.next = head;?",
        "It makes fresh point to itself instead of the old head.",
        "The original head address is overwritten too early.",
      ],
      draw: [
        "Draw the final two arrows.",
        "head → fresh; fresh.next → a; a.next is null.",
        "Assignment order preserves the old route.",
      ],
      takeaway:
        "Head insertion connects the new node to the old head before updating head.",
      verify: 'std::cout << head->value << " " << head->next->value;',
      expected: "3 7",
    }),
    lesson({
      id: "6.5",
      title: "Free a list: save next first",
      hook: "How can you find the successor after deleting the current node?",
      prelude: nodeDefinition,
      steps: [
        [
          "Node* head = new Node{4, new Node{7, nullptr}};",
          "Create two dynamic nodes; head reaches the whole chain.",
          [
            ...node("first", "4", "second", "heap", 2000),
            ...node("second", "7", null, "heap", 2032),
            p("head", "first", "stack", 1104),
          ],
        ],
        [
          "Node* next = head->next;",
          "Save the successor while the first node is alive.",
          [p("next", "second", "stack", 1120)],
        ],
        [
          "delete head;",
          "Release the first node. Its value and link fields are both dead.",
          [free("first")],
        ],
        [
          "head = next;",
          "Move head to the saved live successor.",
          [point("head", "second")],
        ],
        [
          "delete head; head = nullptr; next = nullptr;",
          "Release the final node and clear both remaining aliases. Repeating the save-delete-advance pattern frees any acyclic chain.",
          [free("second"), point("head", null), point("next", null)],
        ],
      ],
      predict: [
        "Which live heap nodes remain after the last line?",
        "None",
        "Both allocations have been released exactly once.",
      ],
      trace: [
        "What is head at the end?",
        "nullptr",
        "The final cleanup clears it.",
      ],
      bug: [
        "Why is delete head; head = head->next; invalid?",
        "The second statement accesses a field of the deleted node.",
        "Save next before ending the current node’s lifetime.",
      ],
      draw: [
        "Draw the state just after the first delete.",
        "head is dangling; next still points to the second live node.",
        "Saving the successor preserves a safe route forward.",
      ],
      takeaway:
        "Save the successor before deleting a node; never read its fields afterward.",
      verify: "std::cout << std::boolalpha << (head == nullptr);",
      expected: "true",
    }),
    lesson({
      id: "6.4a",
      title: "Insert at the tail",
      hook: "Which link changes when a new last node is appended?",
      prelude: nodeDefinition,
      steps: [
        [
          "Node a{4, nullptr}; Node* head = &a;",
          "Start with one local node and a head pointer.",
          [
            ...node("a", "4", null, "stack", 1000),
            p("head", "a", "stack", 1104),
          ],
        ],
        [
          "Node fresh{7, nullptr};",
          "The new node’s next link is null because it will become the tail.",
          node("fresh", "7", null, "stack", 1032),
        ],
        [
          "Node* tail = head;",
          "For this one-node input, head already identifies the tail.",
          [p("tail", "a", "stack", 1120)],
        ],
        [
          "tail->next = &fresh;",
          "Connect the old last node to the new last node. The head stays unchanged.",
          [point("a.next", "fresh")],
        ],
      ],
      predict: [
        "Does head need to move?",
        "No; head still identifies a.",
        "Appending changes the old tail’s next field. An initially empty list needs its head set separately.",
      ],
      trace: [
        "What is the chain from head?",
        "4 → 7 → nullptr",
        "The old tail now reaches fresh.",
      ],
      bug: [
        "Can tail->next be written when head is nullptr?",
        "Not until the empty-list case establishes a valid tail.",
        "Check the empty case before traversing or dereferencing.",
      ],
      draw: [
        "Draw the final link.",
        "head → a; a.next → fresh; fresh.next is null.",
        "A general traversal stops at the node whose next is null.",
      ],
      takeaway:
        "Tail insertion connects the old tail to a new node whose next link is null.",
      verify: 'std::cout << head->value << " " << head->next->value;',
      expected: "4 7",
    }),
    lesson({
      id: "6.4b",
      title: "Unlink a node, then release it",
      hook: "If a middle node is deleted first, how can the list keep reaching its successor?",
      prelude: nodeDefinition,
      steps: [
        [
          "Node* tail = new Node{9, nullptr};",
          "Create the final dynamic node.",
          [
            ...node("tailNode", "9", null, "heap", 2064),
            p("tail", "tailNode", "stack", 1104),
          ],
        ],
        [
          "Node* victim = new Node{7, tail};",
          "Create a middle node that reaches the tail.",
          [
            ...node("victimNode", "7", "tailNode", "heap", 2032),
            p("victim", "victimNode", "stack", 1120),
          ],
        ],
        [
          "Node* head = new Node{4, victim};",
          "The head reaches the full three-node chain.",
          [
            ...node("headNode", "4", "victimNode", "heap", 2000),
            p("head", "headNode", "stack", 1136),
          ],
        ],
        [
          "head->next = victim->next;",
          "First bypass the middle node by preserving its successor in the previous node’s link.",
          [point("headNode.next", "tailNode")],
        ],
        [
          "delete victim; victim = nullptr;",
          "Now release the detached node without breaking the remaining route.",
          [free("victimNode"), point("victim", null)],
        ],
        [
          "int value = head->next->value; delete head; delete tail; head = tail = nullptr;",
          "The remaining successor is 9. Release the two surviving allocations after copying the value.",
          [
            v("value", "9", "stack", 1160),
            free("headNode"),
            free("tailNode"),
            point("head", null),
            point("tail", null),
          ],
        ],
      ],
      predict: [
        "What does the remaining head’s next value read before cleanup?",
        "9",
        "The predecessor link bypassed the removed node.",
      ],
      trace: [
        "What is value?",
        "9",
        "The tail remained reachable after the middle node was removed.",
      ],
      bug: [
        "Does just changing head->next release the removed node?",
        "No; detached dynamic storage must still be deleted by its owner.",
        "Rewiring and releasing are separate responsibilities.",
      ],
      draw: [
        "Draw the chain after unlinking, before cleanup.",
        "head → 4 → 9 → null; victim identifies the detached 7 node until it is deleted.",
        "Preserve the successor before releasing the old node.",
      ],
      takeaway:
        "Removing a dynamic node requires preserving the chain and releasing the detached allocation.",
      verify: "std::cout << value;",
      expected: "9",
    }),
  ].sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true })),
};
