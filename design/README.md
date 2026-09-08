# InteractLab — Design

Design-first reference for the InteractLab tutorials. These files are the **source of truth for how a tool should look** before it gets built in `web/`. They are hand-authored SVGs so they render anywhere (browser, VS Code, GitHub) and mirror the real design tokens 1:1.

> Workflow: **design here first → get sign-off → then implement in `web/`.** When a token or component changes in `web/app/globals.css`, update `design-system.svg` to match so this stays honest.

## Files

| File | What it is |
|------|-----------|
| `design-system.svg` | The reference sheet — every real token (colour, type, radius, shadow) and the shared components (buttons, cards, `.analogy`, code block) exactly as they exist in `web/app/globals.css`. |
| `stacks-queues-mockup.svg` | Full-page mockup for the **next** tool, *Stacks & Queues* — header, hero, all six modules, "Where this connects", footer. |

---

## Stacks & Queues — the plan (for sign-off)

The next tool in the recommended order (after Linked Lists). Two structures, taught together because they are opposites and are usually learned as a pair.

### The two pictures (analogies)

Every InteractLab concept is taught with **one everyday picture, reused every time it reappears.**

- **Stack → 🥞 a stack of plates.** Add and remove from the **top** only; last on is first off (**LIFO**). This is *deliberately the same picture* used for the **call stack in Recursion (Module 2)** — so a returning learner recognises it instantly: "the plates piling up in recursion *were* a stack."
- **Queue → ☕ a line at the coffee shop.** Join the **back**, the **front** is served first (**FIFO**). No cutting in.

### The new 6th accent — `rose` ⚠️ *needs your OK*

All five existing accents are already taken by shipped tools:

| Accent | Tool |
|--------|------|
| teal `#0d9488` | Bitwise (and the brand) |
| green `#059669` | Linked Lists |
| purple `#7c3aed` | Recursion & Big-O |
| amber `#d97706` | Sorting |
| blue `#2563eb` | *(free — used inside this tool for the queue)* |

To keep every tool visually distinct, Stacks & Queues introduces a **6th accent, `rose`**, which fills the empty red gap in the palette:

```
--rose        #e11d48   (light)     #fb7185  (dark text)
--rose-light  #ffe4e6   (light)     #4c0519  (dark surface)
```

Inside the tool the two structures are colour-coded so they never blur together:

- **Stack = rose** (the tool's headline accent — card icon 🥞, kickers)
- **Queue = blue** (the existing free accent)

`design-system.svg` shows `rose` slotted into both the accent-base and accent-soft rows, marked **NEW** with a dashed border, so the addition reads as a deliberate palette extension rather than a random colour.

### Module breakdown (six modules)

1. **The stack** — push / pop / peek, LIFO, vertical plate visualiser + live code.
2. **The queue** — enqueue / dequeue, FIFO, horizontal line with front/back pointers + `deque` code.
3. **Under the hood** — a stack is just a `list` (both ends O(1)); a queue needs `collections.deque`, because `list.pop(0)` is O(n) (the one trap).
4. **In the wild** — where you already use them: *stack* → undo/redo, browser Back, the call stack, bracket matching; *queue* → print jobs, message/task queues, BFS, service lines.
5. **Cheat sheet** — the operations + Big-O table, including the `pop(0)` trap called out in red.
6. **Where this connects** — back to Recursion's call stack (same picture); forward to Trees & Graphs (BFS = queue, DFS = stack).

*No week numbers in the UI. No auto-grading — practice is reveal-style.*

---

## Tokens at a glance

Pulled from `web/app/globals.css` (see `design-system.svg` for the full sheet):

- **Type** — `DM Sans` (UI) · `JetBrains Mono` (code, kickers, tags)
- **Radius** — `10 / 16 / 24`
- **Surfaces (light)** — `#fafaf9` bg · `#ffffff` elevated · `#f5f5f4` muted · `#eeede9` subtle
- **Text (light)** — `#0f172a` · `#64748b` secondary · `#94a3b8` tertiary
- **Shadows** — `sm` cards · `md` hover · `lg` popovers

## Implementation checklist (after sign-off)

Follows the established per-tool pattern:

1. Add `--rose` / `--rose-light` (light + dark) and `.card-icon.rose` to `web/app/globals.css`.
2. `lib/stacks-queues/` — pure logic (stack, queue, complexity content) + Vitest tests.
3. `components/stacks-queues/` — client visualisers (`motion`, shared `useStepper`, `CodeBlock`, shared `.analogy`).
4. `app/stacks-queues/page.tsx` + scoped `stacks-queues.css`.
5. Add cards to `app/page.tsx` and `app/topics/page.tsx`.
6. Quality gates (`pnpm vitest run`, `pnpm build`), then commit **locally**.
