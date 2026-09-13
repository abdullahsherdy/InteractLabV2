# Phase 3 — Home + Linked Lists

> Plan. Progress log lives in
> [`phase-3-home-linked-lists-progress.md`](./phase-3-home-linked-lists-progress.md).
> Branch `feat/ui-design`. Gates: `pnpm test` + `pnpm build`. **Push is
> user-gated; git add/commit is the user's.**

## Goal (roadmap item 3)

> Self-drawing hero (D6) · drawn card glyphs (D5) · re-skin Linked Lists as the
> **reference tool** · migrate Linked Lists onto the Phase-2 shared kit
> (`useStepEngine` / `StepTransport`, `<Analogy>`). Review on device before
> Phase 4.

Two deliverables, low-risk first:

1. **Home** — new self-drawing schematic hero, drawn `<Glyph>` card icons, cards
   re-skinned to the shared `.tcard`. No tested logic touched.
2. **Linked Lists** — the reference implementation of the module anatomy
   (WF-03): breadcrumb + jump chips hero, each module in a `.plate`, analogy →
   `<Analogy>` field-note, and every interactive module driven by the one shared
   step engine + transport. Reuses the untouched `lib/linked-list` step
   generators — only the *player wiring* changes.

## Source of truth

`ui-ux-design-system.html`: S-06 kit (`.tcard`, `.plate`, `.diagram`, `.crumb`,
`.tag`), S-07 wireframes (WF-01 home, WF-02 LL, WF-03 module anatomy), the hero
self-drawing schematic (viewBox `0 0 720 236`) + its draw CSS/JS. Ink map:
Linked Lists = `--ink-ll`, home = `--ink-home`.

## A. Home (`app/page.tsx` + new `components/home/HomeHero.tsx` + `globals.css`)

- **`HomeHero.tsx`** (new client island so `page.tsx` stays a Server Component):
  thesis + CTA (existing copy) **and** the self-drawing linked-list schematic
  with a **▸ replay** control. Draw mechanism per spec: wrapper carries `.js`
  (hides `.node`/`.arrow`/`.note-g`), a mount `useEffect` adds `.built` via
  `requestAnimationFrame` to trigger the staggered CSS transitions
  (per-element `transition-delay`; arrows use `pathLength=1` +
  `stroke-dashoffset`). Honors `useReducedMotion` → jumps straight to `.built`.
- **`page.tsx`**: render `<HomeHero/>`; convert `CARDS` from emoji + colour class
  to a `GlyphName` + ink; render the topic grid as `.cards` → `.tcard`
  (`.ic` holds `<Glyph>` in the card's ink, `h5`, `p`, `.meta` tags, `.arw`).
  Keep the "how these lessons help" notes.
- **`globals.css`**: replace the gradient `.home-hero*` (radial-gradient ground,
  gradient-clip `h1 em`) with the schematic hero layout + `.svg-wrap` /
  `svg.schem` / `.s-*` schematic styles + the `.js`/`.built` draw rules +
  `.hero-replay`. Replace `.tutorial-grid`/`.tutorial-card`/`.card-*` with the
  shared `.cards`/`.tcard`. (Reduced-motion block already neutralises
  `.js .node/.arrow/.note-g` — Phase 1 forward-compat.)

## B. Linked Lists (`app/linked-lists/page.tsx` + 4 modules + `linked-lists.css`)

- **Engine refinement (shared):** `useStepEngine` autoplays on `steps.length > 0`;
  tighten to `> 1` so a 1-step *idle* array doesn't flash the pause icon on
  mount/reset. A single step is nothing to auto-advance — correct semantics, and
  the LL modules are the first (only current) consumer. Pure `lib/step`
  transitions + their 11 tests are untouched.
- **Migrate the 4 modules** (`NodeChainBuilder`, `DoublyListDemo`, `CycleRace`,
  `PlaylistManager`) from the imperative `useStepPlayer([idle]).load(steps)` to
  the controlled `useStepEngine(steps,{baseInterval:1400,autoPlayOnChange:true})`:
  hold `steps` in `useState`, swap the array on each op (new identity → rewind +
  autoplay). Swap the LL `StepTransport` for the shared one
  (`engine` + `caption={engine.current?.caption}`). `ListCanvas` and the
  `lib/linked-list` generators are unchanged.
- **`page.tsx` re-skin:** hero → `.crumb` breadcrumb + H1 + promise + `.tag accent`
  jump chips (anchors to `#fig1…#fig4`); each module wrapped in a `.plate`
  (`.plate-cap` = `Fig. N` + title, `.plate-b` = `<Analogy>` field-note then the
  module); "Where this connects" → a titled `<Analogy>`. Set
  `--accent: var(--ink-ll)` on the hero + main so the whole kit renders in LL ink.
- **`linked-lists.css`:** drop the now-dead per-tool transport
  (`.ll-transport`/`.ll-caption`/`.ll-controls`/`.ll-progress`/`.ll-dot`/
  `.ll-speed*`/`.ll-btn-play`) and the section headers (`.ll-section*`,
  `.ll-kicker` — replaced by `.plate`). Re-skin `.ll-module` to a plain flex
  column (the `.plate` now frames it), `.ll-canvas-wrap` to the `.diagram` look,
  `.ll-btn-op` + input focus to `var(--accent)`.
- **Delete dead files:** `components/linked-list/StepTransport.tsx` +
  `useStepPlayer.ts` (imported only by the 4 migrated modules).
- **Shared primitives → `globals.css`:** `.plate*`, `.diagram`, `.crumb`, `.tag`
  (+`.tag.accent`), `.fieldnote code` — used by LL now, reused by every tool in
  Phase 4. No code snippets exist on the LL page, so no `CodeBlock` framing here.

## Out of scope (Phase 4)

Ink-swap + migrate Recursion / Sorting / Walkthroughs / Bitwise; the other 18
legacy `.analogy` usages; native Stacks & Queues (rose); the button-system /
token-alias cleanup. The CTA `.btn*` keep their aliased colours for now.

## Gates & close-out

`pnpm test` (≥ 117 green — no logic changed, LL migration is wiring only) and
`pnpm build` (clean static export). Append a Phase-3 row to the redesign log +
this phase's progress log. **Pause for on-device review; do not push.**
