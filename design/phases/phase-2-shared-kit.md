# Phase 2 — Shared kit (plan)

> Progress log: [`phase-2-shared-kit-progress.md`](./phase-2-shared-kit-progress.md).
> Master plan: [`../implementation-plan.md`](../implementation-plan.md).
> Source of truth: [`../ui-ux-design-system.html`](../ui-ux-design-system.html) (Rev A).

## Goal

Build the **shared kit** the whole site draws from — "one place, reused
everywhere." Phase 2 *builds and proves the components*; per-tool **adoption**
(re-skinning pages onto the kit) is deferred to Phase 3 (Linked Lists) and
Phase 4 (the rest), exactly as the roadmap states.

## Scope boundary (what changes globally vs. what is only built)

- **One global, visible change:** the **title-block Header + theme toggle**.
  It is rendered by the root layout, so it appears on every page — that is its
  job (Phase 2 deliverable). The old `.site-header` markup/CSS is replaced.
- **Everything else is built as new, self-contained modules and NOT wired into
  any shipped page.** No existing tool page changes appearance in Phase 2. This
  mirrors the Phase 1 back-compat strategy: add the new, keep the old rendering
  untouched, migrate later.

### The `.analogy` collision — resolved without regressing shipped pages

The spec redesigns `.analogy` into a **field-note** (`display:flex`, accent
left-border, `color-mix(--accent …)` tint). But **23 shipped usages** across 5
tool pages render `<p className="analogy">…</p>` against the *current* muted-box
rule, and none of them set `--accent` (it is defined only once, globally, as
`--ink-home`/blueprint — verified `app/globals.css:35`). Redefining `.analogy`
now would tint all five pages blueprint — a regression in a phase meant not to
regress shipped pages, and tool re-skins are explicitly P3/P4 work.

**Resolution:** ship the field-note as a new `<Analogy>` component under a new
class **`.fieldnote`** (spec structure + styles, ported verbatim). Leave the
legacy `.analogy` rule and all 23 `<p className="analogy">` usages **untouched**.
During P3/P4 re-skins, pages adopt `<Analogy>`; when the last `<p className=
"analogy">` is gone (Phase 4), the legacy `.analogy` rule is removed alongside
the token aliases. `.fieldnote` is the transitional destination name.

### The code-block skin — extend, don't reskin

The spec's `.code` (light `--panel-2` ground, filename/lang header, line
numbers, highlighted line, blueprint-inked tokens) is a different design from
the shipped dark `.code-block` (used by 16 files). **Extend, don't replace:**
`CodeBlock` gains opt-in props (`filename`, `lang`, `showLineNumbers`,
`highlight`). When any is set it renders the framed `.code` variant; otherwise
it renders the existing `.code-block` **unchanged**. The single tokenizer is
reused; the framed variant re-colours the *same* `.tok-*` classes under `.code`
for the light ground (DRY — one tokenizer, two container skins). All 16 shipped
usages stay pixel-identical.

## Deliverables

| # | Item | Files | Global? |
|---|---|---|---|
| 1 | Title-block Header + ThemeToggle (writes `il-theme`, flips `data-theme`) | `components/layout/Header.tsx` (rewrite), `components/layout/ThemeToggle.tsx` (new), `app/globals.css` (`.titleblock`/`.tb-*`/`.theme-btn`, replace `.site-header` block) | **Yes** |
| 2 | Unified step engine — pure transitions + hook | `lib/step/transitions.ts` (new, pure), `lib/step/transitions.test.ts` (new), `components/shared/useStepEngine.ts` (new) | No |
| 3 | Unified `StepTransport` (Step X/Y + scrubber + speed + keyboard + `aria-live` + optional dots) | `components/shared/StepTransport.tsx` (new), `app/globals.css` (`.transport`/`.tp-*`/`.kb-hint`) | No |
| 4 | Extended `CodeBlock` (framed variant) | `components/shared/CodeBlock.tsx` (extend), `app/globals.css` (`.code`/`.code-h`/`.ln`/`.hl` + light `.code .tok-*`) | No |
| 5 | Drawn glyphs | `components/shared/Glyph.tsx` (new) | No |
| 6 | Analogy field-note | `components/shared/Analogy.tsx` (new), `app/globals.css` (`.fieldnote` + `.fieldnote .ic`/`.h`) | No |
| 7 | States + skeleton | `components/shared/Skeleton.tsx` + `StateNote.tsx` (new), `app/globals.css` (`.state`/`.state .dot`/dot variants, `.skeleton` + `@keyframes sk`) | No |

## Unified step engine — design

One controlled hook subsumes all three shipped players
(`useStepper`, `useStepPlayer`, `useWalkPlayer`):

- **Pure logic in `lib/step/transitions.ts`** (tested): `clampIndex`,
  `nextIndex`, `prevIndex`, `playFrom` (jump to 0 when at end), `advanceOnTick`,
  `isAtStart`, `isAtEnd`, `intervalFor(base, speed)`. This is the off-by-one
  surface — it gets the unit tests, matching the project's "pure tested logic in
  `lib/`" rule.
- **`useStepEngine<T>(steps, { baseInterval?, autoPlayOnChange? })`** — thin
  React wrapper (state + timer). Controlled by `steps`: a new array identity
  resets to 0 (pauses, or auto-plays when `autoPlayOnChange`). API is the
  **superset**: `steps, index, current, playing, speed, atStart, atEnd, total,
  play, pause, toggle, next, prev, seek, reset, replay, setSpeed`.
  - `baseInterval` covers the three tools' cadences (1100 / 1400 / 2000).
  - `autoPlayOnChange:true` reproduces `useStepPlayer.load(…, {autoPlay:true})`
    once LL moves from the imperative `load` to controlled `steps` state (that
    refactor lands with the P3 LL migration; the engine is ready for it now).

## Keyboard map (StepTransport)

`Space` play/pause · `←` prev · `→` next · `Home` first · `End` last · `R`
replay. Arrows are let through when a range input is focused (native scrub);
Space is let through when a button is focused (native activate). The caption's
live text sits in an `aria-live="polite"` region for AT parity.

## Non-negotiables carried forward

Client-only static export · WCAG AA (focus-visible, `aria-live`, full keyboard)
· `prefers-reduced-motion` (caption crossfade collapses to an instant swap) ·
pure tested logic in `lib/` → components → scoped CSS · no new runtime deps
(`motion` already present).

## Quality gates (run before commit)

- `pnpm test` — **≥ 106 green** (106 existing + new `lib/step` suite). CWD is
  already `web/`; no `-C web`.
- `pnpm build` — clean static export, zero warnings/errors.

## Cadence

Atomic commit on `feat/ui-design`; update `ui-redesign-log.md` Revision Log +
this phase's progress log. **Pause for review. Do NOT push (user-gated).**
