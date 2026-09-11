# Phase 2 — Progress log

> Append-only. Newest entry at the bottom. Plan:
> [`phase-2-shared-kit.md`](./phase-2-shared-kit.md).

---

### 2026-09-12 — Phase 2 opened

- Re-read source-of-truth before editing (post-compaction discipline): spec
  title-block (`ui-ux-design-system.html` L86–100), transport (L225–242 CSS,
  L548–557 markup + keyboard map L722–727), code (L245–250, tokens L250, markup
  L567–570), analogy field-note (L219–222, L540), states/skeleton (L253–256),
  drawn glyphs (L516–540). Re-read the three shipped step players + two
  transports + `CodeBlock` + `Header`/`Footer` + full `app/globals.css`.
- **Verified scope-safety greps:** old header classes (`site-header`/`site-logo`/
  `nav-link`/…) and `--header-h` are referenced **only** in `globals.css` +
  `Header.tsx` → safe to replace. `<p className="analogy">` has **23** usages
  across 5 tool pages → confirms the field-note must ship under a new class.
- **Decisions locked (see plan):** (1) Header+theme toggle is the sole global
  change; (2) `.analogy` untouched, field-note ships as `.fieldnote`/`<Analogy>`;
  (3) `CodeBlock` extended (opt-in framed `.code` variant), dark `.code-block`
  and its 16 usages unchanged; (4) unified engine = pure `lib/step/transitions`
  (tested) + controlled `useStepEngine` superset hook.
- `tsconfig` has no `noUnusedLocals`; new un-imported kit files type-check clean
  under `next build` — the "build now, adopt in P3/P4" boundary is safe.

---

### 2026-09-12 — Phase 2 implemented (gates green, paused for review)

**Pure logic (tested):**
- `lib/step/transitions.ts` — clampIndex / next / prev / isAtStart / isAtEnd /
  playFrom / advanceOnTick (holds at end, `done` flag) / intervalFor. No React.
- `lib/step/transitions.test.ts` — 11 tests: clamp floors/caps/empty, next/prev
  bounds, start/end predicates, playFrom rewind, tick hold+done, interval scaling.

**Shared components:**
- `components/shared/useStepEngine.ts` — controlled superset hook keyed on
  `steps` identity; all index math delegates to `transitions`; `setInterval`
  effect keyed on `[playing, speed, total, baseInterval]`. `autoPlayOnChange`
  reproduces the old `useStepPlayer.load(…,{autoPlay:true})` for the P3 LL migration.
- `components/shared/StepTransport.tsx` — the one transport (D3): Step X/Y readout,
  `aria-live` caption (motion crossfade, reduced-motion collapses it), prev/play/next,
  scrubber + tabular count, speed slider, optional dot strip, keyboard map
  (Space / ←→ / Home / End / R) with focus-aware skips (buttons keep Space, range
  keeps arrows). Returns null when `total===0`.
- `CodeBlock.tsx` **extended** — bare dark `.code-block` path byte-for-byte unchanged
  (16 shipped usages safe); framing props render the light `.code` plate. Extracted
  `renderTokens` + `normalizeHighlight`; added `TOKEN.lastIndex = 0` reset (latent
  bug now that the shared regex tokenizes per line).
- `Glyph.tsx` (D5) — 8 `currentColor` line drawings (inherit accent ink).
- `Analogy.tsx` — field-note under **`.fieldnote`** (not `.analogy`); optional `ink`.
- `Skeleton.tsx`, `StateNote.tsx` — loading shimmer + dot status note.

**Global CSS (`app/globals.css`) — sole visible change is the header:**
- Replaced the `.site-header`…mobile block with `.titleblock` + `.tb-*` + `.theme-btn`
  (sticky, centered `min(--content-wide, 100%-40px)`, nav wraps to its own row ≤640px).
- Appended (used only by the not-yet-wired kit): framed `.code`/`.code-h`/`.ln`/`.hl`/`.cl`
  + light-ground `.code .tok-*` recolor; `.fieldnote`; `.transport`/`.tp-*`/`.kb-hint`;
  `.state`/`.dot` variants + `.skeleton`/`@keyframes sk`. Reduced-motion already
  neutralizes the skeleton shimmer via the Phase-1 global rule.

**New global-write component:**
- `components/layout/ThemeToggle.tsx` — flips explicit `data-theme`, persists to
  `il-theme` (try/catch), neutral "Theme" label until mounted (no hydration mismatch).
- `Header.tsx` rewritten to `.titleblock`; dropped the hamburger (nav wraps via CSS);
  kept `usePathname` active detection.

**Gates:** `pnpm test` → 117/117 (106 + 11 new `lib/step`). `pnpm build` → clean
static export, 11 pages, no type/lint errors. Committed atomically on `feat/ui-design`.
**Paused for review — not pushed (push is user-gated).**
