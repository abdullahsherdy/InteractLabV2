# Phase 3 — Progress log

> Append-only. Newest entry at the bottom. Plan:
> [`phase-3-home-linked-lists.md`](./phase-3-home-linked-lists.md).

---

### 2026-09-12 — Phase 3 opened

- Re-read source-of-truth after compaction (stale-context discipline): the four
  LL interactive modules + `ListCanvas` + the old `useStepPlayer` /
  `StepTransport`, `app/linked-lists/linked-lists.css`, both page files
  (`app/page.tsx`, `app/linked-lists/page.tsx`), the shared kit
  (`useStepEngine`, `StepTransport`, `Analogy`, `Glyph`) and the relevant
  `globals.css` ranges (home 351–660, kit 680–902, reduced-motion 904–921).
- **Migration surface mapped.** All 4 modules share one shape:
  `useStepPlayer([idle]).load(steps)` (imperative) → invert to controlled
  `useStepEngine(steps, {autoPlayOnChange})` with `steps` in component state.
  `useStepPlayer` + the LL `StepTransport` are imported **only** by those 4
  (grep-confirmed) → safe to delete post-migration. `ListCanvas` and every
  `lib/linked-list` step generator are reused unchanged — no tested logic moves.
- **Kit ink flow confirmed:** `.transport`, `.fieldnote`, `.code`, `.tp-btn.play`
  and both scrubbers read `var(--accent)`, so one `--accent: var(--ink-ll)` on
  the LL hero + main themes the entire module UI. No per-component colour props.
- **Decisions locked (see plan):** (1) Home hero is a new client island
  (`HomeHero`) so `page.tsx` stays a Server Component; (2) `.tcard`/`.plate`/
  `.diagram`/`.crumb`/`.tag` land in `globals.css` as shared primitives (P4 tools
  reuse them); (3) `useStepEngine` autoplay guard tightened `> 0` → `> 1` so
  1-step idle arrays don't flash the pause icon (correct: nothing to
  auto-advance); (4) no `CodeBlock` on the LL page (it ships no snippets); (5)
  CTA `.btn*` keep aliased colours — button-system cleanup stays in P4.

---

### 2026-09-12 — Phase 3 implemented (all deliverables shipped, gates green)

**Home (`app/page.tsx` + new `components/home/HomeHero.tsx`, `globals.css`)**

- Gradient-text hero → **self-drawing linked-list schematic** (D6), extracted to a
  client island `HomeHero` so `page.tsx` stays a Server Component. Draw is pure
  CSS: a wrapper class flips `.js` → `.built` on mount, and per-element
  `transition-delay` staggers nodes + arrows into view; arrows use
  `pathLength={1}` + animated `stroke-dashoffset` so length is resolution-free.
  `useReducedMotion()` snaps straight to the built state, and the global
  reduced-motion block in `globals.css` backstops it for the no-JS path. A ▸
  control replays the draw.
- Topic cards: emoji + colour-class → drawn **`<Glyph>`** (D5) + per-tool ink,
  re-skinned onto the shared `.cards` / `.tcard` primitives. `.tcard .meta`
  renders `<span className="tag">`, so the shared `.tag` primitive was added to
  globals in the same pass (see below).

**Linked Lists (`app/linked-lists/page.tsx` + `linked-lists.css` + 4 modules)**

- Page rewritten as a Server Component: crumb breadcrumb + a `.tag accent`
  jump-chip row in the hero; each of the 4 modules framed in a `.plate`
  (`Fig. N` caption) whose `.plate-b` leads with its analogy as an `<Analogy>`
  field-note (replacing the old `<p className="analogy">`). One
  `--accent: var(--ink-ll)` on the hero + main themes the whole kit — crumb,
  tags, plate caption, field-note and transport all read `var(--accent)`.
- **All 4 interactive modules migrated** off the imperative
  `useStepPlayer([idle]).load(steps)` onto the controlled
  `useStepEngine(steps, { baseInterval: 1400, autoPlayOnChange: true })`:
  `steps` held in `useState`, the array swapped per operation → engine rewinds
  and autoplays on the new identity. Each now renders the **shared**
  `StepTransport`. `committed` state still tracks the final step's list state,
  so toolbars (Doubly's remove buttons, Playlist's now-playing) reflect the end
  state during playback — existing UX preserved.
- **Deleted** the LL-local `components/linked-list/{StepTransport,useStepPlayer}`
  (grep-confirmed no other consumers). `ListCanvas` + every `lib/linked-list`
  generator untouched — no tested logic moved.
- `useStepEngine` autoplay guard tightened `> 0` → `> 1` (both the `useState`
  initializer and the `useEffect`), so a lone idle step never flashes the pause
  icon. Verified beforehand that only the shared `StepTransport` type-imports the
  engine, so the change is scoped to the now-migrated modules.
- `linked-lists.css` trimmed to inner module chrome (`.ll-module` is now just the
  stack inside a `.plate`); `.ll-canvas-wrap` re-skinned to the `.diagram`
  graph-paper look; dead per-tool transport CSS (`.ll-transport`, `.ll-caption`,
  `.ll-controls`, `.ll-progress`, `.ll-dot`, `.ll-speed`, `.ll-section*`,
  `.ll-kicker`, `.ll-btn-play`) removed; alias tokens rebased to blueprint names.

**Shared primitives added to `globals.css`** (reused by every P4 tool): `.plate`
`.plate-cap` `.plate-no` `.plate-t` `.plate-b`, `.diagram`, `.crumb`,
`.tag` (+ `.accent`), and `.fieldnote code`.

**Gates:** `pnpm test` → 117/117 (11 files); `pnpm build` → clean compile +
lint + typecheck + static export (linked-lists route 10.4 kB / 156 kB First
Load JS). Both passed first try.

**Close-out:** Phase-3 row appended to
[`../ui-redesign-log.md`](../ui-redesign-log.md); roadmap item 3 flipped to ✅.
**Paused for on-device review before Phase 4. Not pushed — push is user-gated;
git add/commit left to the user.**

---
