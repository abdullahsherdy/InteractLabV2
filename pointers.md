# InteractLab · Pointers module

Site: https://learn.abdullahsherdy.tech (InteractLab, by Abdullah Sherdy)
Module: **Pointers**, taught gradually from "what is a pointer?" to hard problems.
Status: integrated into the Next.js static-export site. All Levels 0–8 are implemented as data-driven lessons, including split lessons for address/value assignment, const qualification, node removal, and advanced patterns. The two historical HTML prototypes were not supplied; this implementation was authored from this curriculum.

---

## 1. Purpose

Teach C++ pointers visually: animated, narrated, step-through lessons in the same spirit as the existing Linked Lists, Stacks and Walkthroughs pages. A first-year CS student who has never seen a pointer must be able to start at Level 0 and finish at Level 8 with **one new idea per lesson**.

Primary audience: Abdullah's students (first-year CS, textbook _Problem Solving with C++_, 10th ed., Walter Savitch). Secondary: anyone on the open web. Content may go beyond the course, but anything beyond it is labelled **Beyond the course**.

## 2. Terminology (read before writing any lesson)

Two different things share the word "pointer". Never blur them.

| Term                         | Meaning                                                                                            | Where it lives in this module          |
| ---------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Pointer** (memory pointer) | A variable whose value is a memory address. `int* p = &x;`                                         | Levels 0 to 7                          |
| **Two-pointer technique**    | An algorithm pattern that moves two pointers/indices over data (left/right, slow/fast, read/write) | Level 8 only, after pointers are solid |

The historical walkthrough prototype began with the two-pointer technique. In the implemented curriculum, this is Level 8 so memory-pointer fundamentals come first.

## 3. Curriculum ladder (gradual, one new idea per lesson)

Rule: a lesson may only use ideas taught in earlier lessons. A hard problem is built from already-taught pieces, never from a new idea hidden inside it.
Textbook refs are Savitch 10th ed. pages from the course syllabus. Status: DONE means implemented in the site.

### Level 0 · Memory first (prerequisite: variables)

- 0.1 Variables are boxes: name, value, address (street-of-houses picture). DONE
- 0.2 Where variables live: the stack, in one picture. DONE

### Level 1 · What is a pointer? (9.1, p. 542)

- 1.1 A variable has a value AND an address; `&x` means "address of". DONE
- 1.2 A pointer stores an address: `int* p = &x;`, "p points to x". DONE
- 1.3 Follow the arrow: `*p` reads and writes x (dereference). DONE
- 1.4 Reading declarations: `int* p;` read backwards; types must match; the `int* a, b;` trap. DONE
- 1.5 Initial pointer states: uninitialized (“wild”), null (`nullptr`), and valid. A pointer can also become dangling when its target’s lifetime ends (Level 4). DONE

### Level 2 · Pointer operations

- 2.1 `p = q` copies the address; `*p = *q` copies the value (two lessons, side by side at the end). DONE
- 2.2 Aliasing: two pointers, one variable. DONE
- 2.3 Comparing: `p == q` (addresses) vs `*p == *q` (values, only when both dereferences are valid). DONE
- 2.4 Bonus: `typedef int* IntPtr;` and `const` with pointers. DONE

### Level 3 · Pointers and functions (5.2, p. 291, plus 9.1)

- 3.1 By value vs by reference vs by pointer. DONE
- 3.2 Swap with pointers, and why swapping the pointers fails. DONE
- 3.3 Out-parameters: `minMax(a, b, &mn, &mx)`. DONE
- 3.4 Trap: returning the address of a local variable. DONE

### Level 4 · The heap (9.1, basic memory management)

- 4.1 Stack vs heap; `new` makes a nameless box. DONE
- 4.2 `delete` and `p = nullptr`. DONE
- 4.3 Memory leaks: losing every usable route to an unreleased allocation; ownership responsibility is distinct from mere reachability. DONE
- 4.4 Dangling pointers and double delete. DONE
- 4.5 Ownership: who deletes what a function returns? DONE

### Level 5 · Arrays and pointer arithmetic (9.2, p. 555; 7.2, p. 423)

- 5.1 An array is not a pointer; it converts to a pointer to its first element in many expressions; `a[i] == *(a + i)`. DONE
- 5.2 Pointer arithmetic: `p + 1` jumps one element (optional in syllabus, p. 562, but common in exams). DONE
- 5.3 Arrays in functions: the address is passed, pass the size, the `sizeof` trap. DONE
- 5.4 Dynamic arrays: `new[]` and `delete[]`. DONE
- 5.5 C-strings: char arrays, `'\0'`, walking with `char*` (8.1, p. 487). DONE
- 5.6 Growing a dynamic array: allocate bigger, copy, free the old one. DONE

### Level 6 · Nodes and linked structures (13.1, p. 774; link to /linked-lists/)

- 6.1 A node: a struct holding a value and a pointer to the next node; the `->` operator. DONE
- 6.2 Build a 3-node list by hand; traverse with `p = p->next`. DONE
- 6.3 Insert at the head: the order of the two assignments matters. DONE
- 6.4 Insert at the tail and delete a node without leaking it. DONE
- 6.5 Free a whole list: save `next` before `delete`. DONE

### Level 7 · Pointers to pointers and 2D (9.2, p. 564, optional)

- 7.1 `int**` as a picture. DONE
- 7.2 Dynamic 2D array: rows first on allocation, rows first on cleanup. DONE
- 7.3 `Node** head`: changing the caller's head pointer. DONE
- 7.4 Array of pointers (for example an array of strings). DONE

### Level 8 · Hard: pointer techniques and problems

- 8.1 Two pointers, opposite ends: reverse an array, two-sum on a sorted array, palindrome. DONE
- 8.2 Two pointers, read/write: remove duplicates in place (`w - a` gives the length). DONE
- 8.3 Slow and fast: find the middle; detect a cycle (Floyd). DONE
- 8.4 Linked-list rewiring: reverse a list (DONE draft), merge two sorted lists, remove the n-th node from the end (two pointers n apart). DONE
- 8.5a–b Shallow copy vs deep copy; destructor and copy constructor (copy assignment explicitly disabled in the teaching owner) (11.4, p. 701). DONE
- 8.6 Build a mini dynamic array (push_back with doubling). DONE
- 8.7 Debugging challenge: distinguish losing ownership, losing every access path, dangling aliases, and double delete. Faulty lines are comments; the executable trace is repaired. DONE
- 8.8a–b **Beyond the course:** `unique_ptr`, `shared_ptr`, `weak_ptr`, and RAII. Weak observation does not extend the object’s lifetime; strong ownership cycles can leak. DONE

## 4. Lesson standard (every lesson has all of these)

1. **Hook**: one question the student can almost answer ("what is inside p?").
2. **Animated walkthrough**: 6 to 10 frames at Levels 0 to 4, up to about 25 at Level 8.
3. **Predict checkpoints**: at least one frame where playback pauses and the student predicts the next state before it is shown. Reveal compares the learner’s optional written prediction with the explanation; it does not auto-grade free text.
4. **Three checks**: one output trace, one find-the-bug, one draw-the-memory.
5. **Takeaway**: one sentence, shown at the end.
6. **Exam link**: the Savitch section and page.
7. **Next lesson** button.
   One idea per lesson. If a lesson needs two ideas, split it.

## 5. Implemented lesson data and memory model

- Types: `lib/pointers/types.ts`.
- Authoring helpers: `lib/pointers/authoring.ts`.
- One data file per level: `lib/pointers/lessons/level0.ts` through `level8.ts`.
- Registry: `lib/pointers/content.ts`.
- Pure replay, pointer-state classification, heap reachability, and prediction gating: `lib/pointers/engine.ts`.

Each lesson contains a hook, C++ code, optional helper definitions, narrated frames, a prediction checkpoint, trace/bug/draw questions, takeaway, syllabus reference, and a compiler verification expression with its expected output. Some larger algorithms use clearly labelled unrolled traces for fixed inputs; assumptions and the general loop are explained alongside them.

Frames record a highlighted code line, narration, operations, and changed cell IDs. Operations are discriminated TypeScript objects: `value`, `pointer`, `reference`, `set`, `point`, `free`, and `remove`. State is rebuilt from frame zero, so scrubbing backward cannot retain future mutations. Group IDs associate array elements or node fields; releasing a group releases its displayed members.

The memory board handles scalar cells, pointer-to-pointer chains, array groups, and node fields in the same renderer. Node cards show the value field and a separate next-pointer field. C++ struct layout, padding, pointer widths, and actual addresses are not inferred from the drawing.

A live heap allocation is marked unreachable only if no route from any live local root reaches it, following groups and pointer chains. This catches orphan cycles. This is a bounded visual teaching model, not a general C++ ownership analyzer: a reachable allocation may still be leaked if nobody fulfills cleanup responsibility.

## 6. Narration and teaching rules

- One idea per frame, one or two short sentences, present tense, name what changes and why.
- Plain words first, then the C++ term: "p holds the address of x. We say p points to x."
- Fixed analogy for the whole module: **memory is a street of numbered houses; a variable is a house; an address is the house number; a pointer is a sticky note with a house number on it; the note is not the house.** Do not introduce a second analogy.
- Read symbols the same way every time: `&x` "address of x", `*p` "the variable p points to".
- Every trap gets its own frame and a red or amber highlight (wild pointer, `int* a, b;`, delete vs delete[], dangling, leak).
- Say what is undefined behaviour out loud: “There is no guaranteed behavior; it may crash or do something else.” Never show undefined behaviour as a fixed output.
- Visible text uses typographic punctuation (’ “ ”). Code keeps straight quotes.
- Voice narration must make sense when read aloud: avoid symbols alone in a sentence.

## 7. Content correctness (non-negotiable)

- Every published example is **compiled and run** with C++17 via `lib/pointers/verifyExamples.test.ts`. It checks authored output and nameable live scalar memory states against the animation. It does not dereference dead or uninitialized objects.
- Addresses are small illustrative numbers (1000-based, step 4 for `int`). Say once per lesson that real addresses look like `0x61fe14`.
- Use `nullptr`; mention that older code and some textbook examples use `NULL`.
- `new` pairs with `delete`, `new[]` with `delete[]`. Clear surviving raw aliases separately; clearing one alias does not clear others. Never delete a local object or an interior array pointer.
- Flag platform-dependent facts. Pointer size depends on the implementation and pointer type; do not infer it from a general “64-bit” label. The illustrative int stride of 4 is an explicit assumption, not a language guarantee.
- Mark optional syllabus items (pointer arithmetic, dynamic 2D arrays) as such in the lesson header.
- Do not claim a textbook page unless it is in the section 3 list. If the textbook differs from the syllabus, say so in the lesson notes.

## 8. Player and visual system

The player is video-style and is shared by every lesson.

- Controls: play/pause, restart, step back/forward, timeline scrubber with elapsed/total time, speed (0.75x, 1x, 1.25x, 1.5x), optional voice (browser `speechSynthesis`, with a timer fallback), end card with takeaway, replay and next lesson.
- Keyboard: Space = play/pause, Left/Right = step.
- Frame dwell time: `max(2200 ms, 62 ms x characters) / speed`.
- Animation: pointer markers glide 600 ms, arrows swing 550 ms, changed values flash 800 ms. Respect `prefers-reduced-motion` (no animation, still step-through).
- Implemented: prediction checkpoints block autoplay and forward scrubbing until revealed; review progress is saved locally in this browser. Voice is optional and off by default, with timed captions available without speech support.
- Future work: editable C++ playground, Arabic captions, and account-based progress synchronization.

Design tokens (match the Academy palette, light and dark, theme toggle via `data-theme` plus `prefers-color-scheme`):

- Ink `#141b2d`, panel `#1e2a44`, mint `#12b886` / `#0ca678`, amber `#f59f00`, coral `#ff6b81`, indigo `#5c7cfa`, tint `#eef2f7`, slate `#8a94a8`.
- Use the existing site’s `next/font` typography and theme tokens instead of adding competing fonts. Code uses the shared framed code panel.
- Colour meaning (keep consistent): indigo arrow = pointer; mint = finished/correct; amber = compared/changed; coral = danger (dangling, freed).
- Text on coloured fills is ink or near-black; never white on mint or amber.
- Accessibility: caption in an `aria-live` region, visible focus rings, controls reachable by keyboard, board scrolls horizontally on narrow screens instead of shrinking below readable size.
- Page shell: same header as the other InteractLab pages (brand, Home, Topics, Linked Lists, Stacks, Walkthroughs, Pointers, Theme) and the same footer.

## 9. Site integration

Routes (implemented):

- `/pointers/`: hub page with the level ladder (cards, progress dots).
- `/pointers/<level-slug>/`: one page per level containing its lessons as a playlist.
- Add **Pointers** to the nav and a topic card on the home page, with chips such as `address & value`, `new & delete`, `arrays & nodes`, `two pointers`.
- Cross-links: Level 6 to `/linked-lists/`, Level 8 to `/walkthroughs/`, Level 5.4 to `/stacks/` is not needed.
- Meta description suggestion: "Learn C++ pointers visually: addresses, dereferencing, new and delete, arrays, linked lists and two-pointer problems, step by step."

Confirmed stack: Next.js App Router, React, TypeScript, static export, existing CSS theme tokens and shared code panels. No dependencies were added. Lessons are plain TypeScript data, routes are statically generated Server Components, and the interactive player is a client leaf. CSS handles pointer transitions and value flashes; no animation dependency was added.

Historical prototype references (not present in the supplied repository; no files were fabricated):

- `pointers-visualizer.html`: memory-board engine, seven scenes covering Levels 1 to 5 drafts (basics, `p = q`, `*p = *q`, functions, new/delete/dangling, leak, dynamic array).
- `pointer-walkthroughs.html`: array/list-board engine and video player, six two-pointer lessons. **Re-level these into Level 8** (8.1 to 8.4) and keep the player as the shared player.

## 10. Definition of done for a lesson

- [ ] Uses only ideas from earlier lessons.
- [ ] Hook, frames, predict checkpoint, three checks, takeaway, exam link, next button.
- [ ] Every output claim compiled and run; verification script committed.
- [ ] Final memory state of the animation matches the compiled result.
- [ ] Works at 360 px width and at desktop width, in light and dark themes.
- [ ] Keyboard only: play, pause, step, scrub.
- [ ] `prefers-reduced-motion` honoured; voice off by default.
- [ ] No text overflow, no clipped arrows, caption never covers the board.
- [ ] Visible text reviewed for typographic punctuation and plain language.
- [ ] This file's status line for the lesson updated to DONE.

## 11. Contributor working rules

1. Read this file first, then the nearest existing lesson as the pattern.
2. Keep lessons as data and engine changes separate in responsibility; a complete requested integration can implement both.
3. Build in level order unless told otherwise. Do not write a Level 8 lesson that needs an unwritten Level 5 idea.
4. When unsure about C++ behaviour, compile it. Do not rely on memory.
5. Ask before adding a dependency or build step. New routes within a requested module integration follow the explicit session authorization.
6. Keep prose short and the narration plain; the student is a beginner.

Suggested prompts:

- "Improve the declaration exercise in lesson 1.4 following the lesson standard."
- "Add an extra pointer-to-pointer prediction to lesson 7.1."
- "Add another dereference practice case to lesson 1.3."
- "Review the compiler checks when changing any lesson output."

## 12. Verification and remaining product work

- Run the normal suite: `npm test`.
- Run compiled C++ verification in PowerShell: `$env:VERIFY_POINTER_CPP='1'; npm test -- lib/pointers/verifyExamples.test.ts`. Requires `g++` on PATH; `CXX` may name another compatible compiler.
- Run the production export: `npm run build` (existing Google Fonts need network access on a cold build).
- Optional browser check: serve `out/`, install Playwright externally, then run `node scripts/check-pointers.cjs`. `POINTERS_URL` defaults to `http://127.0.0.1:4173`; `PLAYWRIGHT_MODULE` can identify an existing external installation.
- Future: editable compiled playground, Arabic captions, and synchronized learner accounts. The current review state is intentionally local to a browser.
