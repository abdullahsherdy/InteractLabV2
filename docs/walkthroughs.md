# Problem Walkthroughs — Build Brief & Data Contract

> Whiteboard-style animated problem walkthroughs for InteractLab (Next.js `web/`).
> Route: `/walkthroughs/` (grid) and `/walkthroughs/<slug>/` (one problem).
> This is the source of truth for adding a new walkthrough.

---

## 1. What it is

A YouTube-whiteboard-style explainer for one coding problem. Each walkthrough
plays the **real** solution one step at a time: the array animates, pointers
slide, the current pseudocode line lights up, a variable board updates, and a
plain-English sentence narrates every transition.

The teaching voice matches the rest of InteractLab: simple English, warm,
second person, analogy before abstraction. No jargon dumps.

---

## 2. The golden rule: the trace is always generated

**Never hand-author frame data.** Each problem's `build()` runs the actual
algorithm and calls a local `push(...)` at every meaningful transition,
snapshotting state into a `WalkStep`. This is what keeps the animation honest —
change the algorithm and the animation changes with it, and a Vitest test
asserts the trace's final answer equals a reference implementation.

---

## 3. Architecture

```
lib/walkthrough/
├── types.ts             # WalkStep, Problem, Viz, Marker, VarBinding, ...
├── index.ts             # PROBLEMS registry + getProblem(slug)
├── sliding-window.ts    # first problem: step engine + Problem object
└── sliding-window.test.ts

components/walkthrough/
├── useWalkPlayer.ts     # playback hook (play/pause/next/prev/seek/speed)
├── WalkTransport.tsx    # narration + controls + scrubber + speed
├── ArrayCanvas.tsx      # SVG renderer: cells, markers, window bracket
├── CodePanel.tsx        # pseudocode with animated line highlight (layoutId)
├── VarBoard.tsx         # the "variables" board beside the canvas
└── WalkthroughPlayer.tsx# assembles the above; takes a slug (see gotcha below)

app/walkthroughs/
├── page.tsx             # card grid over PROBLEMS
├── walkthroughs.css     # all wt-* styles (whiteboard accents)
└── [slug]/page.tsx      # problem page; generateStaticParams from PROBLEMS
```

Mirrors the proven linked-lists pattern (pure step engine + motion SVG +
player hook + transport), plus one thing linked-lists lacks: a **synced
pseudocode panel** driven by each step's `codeLine`.

---

## 4. Data contract — adding a new problem

1. Create `lib/walkthrough/<name>.ts` exporting:
   - a `build<Name>(...)` function returning `WalkStep[]` (runs the real algo), and
   - a `Problem` object (see `types.ts` for every field).
2. Register it in `lib/walkthrough/index.ts` by adding it to `PROBLEMS`.
3. Add a test `lib/walkthrough/<name>.test.ts` that compares the generated
   trace's answer against a plain reference implementation across random inputs.

That's it — the grid card, the static route, and metadata are all derived from
the `Problem` object automatically. No page edits needed.

### WalkStep shape (per frame)
- `viz` — currently `ArrayViz` (`values`, `markers`, `window`, `flash`). Add a
  new `Viz` variant + a matching canvas component for non-array problems.
- `vars` — the variable board rows (`name`, `value` pre-formatted, `color`, `changed`).
- `codeLine` — 0-indexed into `Problem.code` (the line to highlight; -1 = none).
- `narration` — one plain-English sentence for this step.
- `phase` — optional short label (Setup / Expand / Shrink / Done ...).

---

## 5. Gotchas (learned the hard way)

- **Static export cannot pass functions to Client Components.** The `Problem`
  object has a `build()` function, so the server page must NOT hand the whole
  object to the client player. `WalkthroughPlayer` takes a **`slug` string** and
  re-looks-up the problem client-side via `getProblem(slug)`. Passing
  `problem={problem}` fails the export with "Functions cannot be passed directly
  to Client Components."
- **Trailing slashes are required** on all internal links (`next.config.ts` sets
  `trailingSlash: true`). Grid links use `/walkthroughs/<slug>/`.
- **`generateStaticParams` + `dynamicParams = false`** in `[slug]/page.tsx` is
  what makes the dynamic route work under `output: "export"`.
- Reuse the design tokens in `globals.css`. Do not invent new colors. The
  whiteboard "hand" accent is a cursive font stack on labels only, plus a
  dependency-free SVG `feTurbulence`/`feDisplacementMap` wobble on the window
  bracket — no rough.js dependency.
- Respect `prefers-reduced-motion` (already handled in `walkthroughs.css`).

---

## 6. First problem (shipped)

**Smallest Subarray with Sum ≥ Target** (`smallest-subarray-sum`), sliding
window / two pointers. `nums=[2,1,5,2,3,2]`, `target=7` → answer `2`.
