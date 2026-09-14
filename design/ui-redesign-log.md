# UI/UX Redesign — Phase Log

> Living record for the **Warmed Blueprint** UI/UX redesign of InteractLab.
> Append to the Revision Log as sheets change. This file is the running memory
> of *why* each design decision was made, so nothing is re-litigated later.

| | |
|---|---|
| **Phase** | UI/UX design → foundations |
| **Direction** | Warmed Blueprint |
| **Branch** | `feat/ui-design` |
| **Repo** | `abdullahsherdy/InteractLabV2` (git root = `web/`) |
| **Opened** | 2026-09-11 |
| **Status** | 🟢 Phase 4 in progress — **4c (Stacks & Queues, built natively in rose `--ink-stack`) landed**, gates green (build + 142 tests); **4d (cleanup: token-alias removal + refresh `web/.claude/CLAUDE.md`)** last |

---

## 1. Goal

Deliver a high-quality programming-**visualisation** learning site with a
distinctive, non-templated identity and strong UX — one that *supports and
enhances* the visual learning rather than decorating it. Audience: absolute
beginners, low English proficiency, who finished Weeks 1–15 of Abdullah's
program.

## 2. Direction — "Warmed Blueprint"

The whole site is an engineer's **graph-paper notebook**: data structures are
drawn, annotated, and animated live. Cool blueprint-blue paper, ink-navy text,
red-pencil annotations, drafting typography, self-drawing SVG schematics.
Warmth (rounded touch surfaces, roomy spacing, plain-language copy) keeps it
from intimidating beginners — *"crisp lines for what's drawn, soft edges for
what's touched."*

## 3. Deliverables

| Artifact | Path | State |
|---|---|---|
| Design system + wireframes + UX playbook (13 sheets) | [`ui-ux-design-system.html`](./ui-ux-design-system.html) | v Rev A — revising |
| Implementation plan (master) | [`implementation-plan.md`](./implementation-plan.md) | living |
| Per-phase plan + progress logs | [`phases/`](./phases/) | Phases 1–3 done |
| This phase log | `ui-redesign-log.md` | living |
| Legacy reference sheet (current shipped tokens) | `design-system.svg` | superseded at impl. |
| Stacks & Queues | built natively in 4c (no SVG mockup — built directly like every other tool) | ✅ shipped |

Open the design system by double-clicking the HTML (works from `file://`; only
external dep is Google Fonts).

## 4. Key decisions

Sign-off convention: **✅ approved 2026-09-11 (plan)** = committed by the approval
of `implementation-plan.md` in plan mode. D2 is deliberately deferred until its
tool is built in Phase 4.

| # | Decision | Rationale | Sign-off |
|---|---|---|---|
| D1 | One identity, per-tool **accent "inks"** | Keep the constant blueprint ground; each tool keeps the accent it already ships, reframed as "the ink this sheet is drawn in." Preserves wayfinding, unifies the look. | ✅ approved 2026-09-11 (plan) |
| D2 | **Rose** accent = Stacks & Queues ink | Fills the empty red gap; the 6th accent that was already awaiting sign-off is now folded into the system. Landed as `--ink-stack` (#e11d48 light / #fb7185 dark) when the tool was built natively in 4c. | ✅ confirmed 2026-09-14 (Phase 4c — tool built) |
| D3 | **Transport redesign**: "Step X / Y" + scrubber + keyboard + `aria-live` | Today's progress *dots* render one node per step and break past ~30 steps; the readout+scrubber scales and is keyboard/AT-accessible. Highest-value fix. | ✅ approved 2026-09-11 (plan) |
| D4 | **Typography change** → Big Shoulders + IBM Plex Sans + IBM Plex Mono + Caveat | Current DM Sans / JetBrains Mono is the generic "developer default"; new stack is grounded in industrial drafting + engineering docs + a pencil hand. **Biggest departure** from shipped tokens. Impl. note: Google consolidated "Big Shoulders Display" into the single **Big Shoulders** family; loaded opsz-variable so `font-optical-sizing:auto` gives large headings the tall display cut automatically. | ✅ approved 2026-09-11 (plan) |
| D5 | **Drawn glyph icons** replace emoji (⛓️ 🎬 01/02/03) | Emoji-as-icon breaks the identity and the a11y floor. | ✅ approved 2026-09-11 (plan) |
| D6 | Self-drawing schematic hero replaces gradient-text hero | Shows the product working; distinctive vs. the template hero. | ✅ approved 2026-09-11 (plan) |

## 5. Location decision (why files live in `web/`)

`web/` **is** the git repo root (remote `InteractLabV2`). The `InteractLab`
parent folder is *not* under version control. So every durable artifact that
must reach GitHub goes **inside `web/`** — design materials live in
`web/design/`. (The global "put artifacts in `./artifacts/`" rule assumes repo
root = working dir, which is false here; following it literally would orphan the
file outside git.) See memory `git-repo-root-is-web`.

## 6. Roadmap — phase by phase (each phase = its own plan + progress log)

1. ✅ **Foundations** — blueprint tokens + back-compat aliases, three-state theme,
   graph-paper body + a11y, drafting fonts via `next/font`, no-flash theme script.
   Files: `app/globals.css`, `app/layout.tsx`. *(Built 2026-09-11; gates green.)*
2. ✅ **Shared kit** — title-block header + theme toggle; ONE unified `StepEngine` +
   ONE `StepTransport`; extended `CodeBlock`; drawn glyphs; analogy field-note; states.
   *(Built 2026-09-12; gates green. Header/theme wired globally; rest built, adopted in P3/P4.)*
3. ✅ **Home + Linked Lists** — self-drawing hero; drawn card glyphs; re-skin LL;
   migrate LL onto the shared kit. *(Built 2026-09-12; gates green. Review on device before Phase 4.)*
4. ⬜ **Roll out** — ink-swap + migrate Recursion / Sorting / Walkthroughs / Bitwise;
   build Stacks & Queues natively (D2 rose); P2/P3 UX upgrades; remove token aliases;
   refresh `web/.claude/CLAUDE.md`.

## 7. Non-negotiables carried forward

Client-only static export · analogy-before-abstraction · **no week numbers** ·
**no auto-grading** · pure tested logic in `lib/` → SVG components → scoped CSS ·
WCAG AA floor · `prefers-reduced-motion` respected.

---

## Revision Log (append-only)

Record each change to the sheets here as we iterate. Newest at the bottom.

| Date | Sheet(s) | Change | Decision ref |
|---|---|---|---|
| 2026-09-11 | all | Rev A authored — 13-sheet design system delivered. | D1–D6 |
| 2026-09-11 | `app/globals.css`, `app/layout.tsx` | **Phase 1 (foundations) implemented** in the live Next app: blueprint token system + back-compat aliases, three-state theme (system-dark + explicit `data-theme`), graph-paper body + global a11y (focus ring, selection), drafting fonts via `next/font`, no-flash theme script, reduced-motion forward-compat. Font reconciled: "Big Shoulders Display" → **Big Shoulders** (opsz-variable, `adjustFontFallback:false`). Gates: `pnpm build` clean static export + `pnpm test` 106/106. | D1, D3, D4, D5, D6 |
| 2026-09-12 | `components/layout/Header.tsx` + new `ThemeToggle.tsx`, `app/globals.css`; new shared kit `components/shared/{StepTransport,useStepEngine,Glyph,Analogy,Skeleton,StateNote}` + `CodeBlock` (extended) + `lib/step/transitions{,.test}` | **Phase 2 (shared kit) implemented.** *Sole global visible change:* `.site-header` → engineer's `.titleblock` (brand stamp · nav with active state · `<ThemeToggle>` writing `il-theme`, the key the Phase-1 no-flash script already reads). *Built but not yet wired (adopted in P3/P4):* one unified step engine — pure `lib/step/transitions.ts` (11 tests) + controlled `useStepEngine` superset — driving one `StepTransport` (Step X/Y + scrubber + speed + keyboard Space/←→/Home/End/R + `aria-live` caption, reduced-motion aware); `CodeBlock` **extended** (bare dark `.code-block` unchanged; opt-in framed light `.code` plate via `filename`/`lang`/`highlight`/`showLineNumbers`, reusing the one tokenizer); drawn `Glyph` set (D5); analogy field-note as **new `.fieldnote`** / `<Analogy>` (legacy `.analogy` + its 23 usages untouched, migrated P3/P4); `Skeleton` + `StateNote`. Gates: `pnpm build` clean static export + `pnpm test` 117/117 (106 + 11 new). | D3, D5 |
| 2026-09-12 | `app/page.tsx` + new `components/home/HomeHero.tsx`, `app/globals.css`; `app/linked-lists/page.tsx` + 4 LL modules + `linked-lists.css`; `components/shared/useStepEngine.ts`; deleted `components/linked-list/{StepTransport,useStepPlayer}` | **Phase 3 (Home + Linked Lists) implemented.** *Home:* gradient hero → self-drawing linked-list schematic as a client island (`HomeHero`, D6 — wrapper `.js`→`.built` triggers staggered CSS draw via per-element `transition-delay`; arrows `pathLength=1` + `stroke-dashoffset`; `useReducedMotion` jumps to built, global reduced-motion block backstops; ▸ replay). Topic cards: emoji + colour-class → drawn `<Glyph>` (D5) + per-tool ink on the shared `.cards`/`.tcard`. *Linked Lists (the reference tool):* crumb breadcrumb + `.tag accent` jump-chip hero; each module framed in a `.plate` (`Fig. N` cap) whose `.plate-b` leads with its analogy as an `<Analogy>` field-note; `--accent: var(--ink-ll)` on hero + main themes the whole kit (crumb/tags/plate/field-note/transport all read `--accent`). All 4 interactive modules (`NodeChainBuilder`/`DoublyListDemo`/`CycleRace`/`PlaylistManager`) migrated from the imperative `useStepPlayer([idle]).load()` to the controlled `useStepEngine(steps,{baseInterval:1400,autoPlayOnChange:true})` (steps held in `useState`, array swapped per op → rewind + autoplay) + the shared `StepTransport`; the LL-local `StepTransport` + `useStepPlayer` deleted. Engine autoplay guard tightened `>0`→`>1` so a lone idle step never flashes the pause icon. Shared primitives `.plate*`/`.diagram`/`.crumb`/`.tag(.accent)`/`.fieldnote code` added to `globals.css` (reused by every P4 tool). `ListCanvas` + all `lib/linked-list` generators unchanged — no tested logic moved. Gates: `pnpm build` clean static export + `pnpm test` 117/117. | D3, D5, D6 |
| 2026-09-12 | `components/walkthrough/WalkthroughPlayer.tsx` + re-skinned `ArrayCanvas.tsx`/`VarBoard.tsx`; rewritten `app/walkthroughs/walkthroughs.css`; rewritten `app/walkthroughs/page.tsx` + `app/walkthroughs/[slug]/page.tsx`; deleted `components/walkthrough/{useWalkPlayer,WalkTransport,CodePanel}` | **Phase 4 · sub-phase 4a (Problem Walkthroughs) implemented.** The least-migrated tool gets the full Linked-Lists treatment in the walkthrough ink (`--accent: var(--ink-walk)`). *Engine unified (D3):* `useWalkPlayer` → `useStepEngine(steps,{baseInterval:2000})` (2000ms preserves old `BASE_MS`; memoised `steps` → stable identity, no autoplay); bespoke dark `CodePanel` → shared framed `CodeBlock` (0-based `codeLine`→1-based `highlight`, `-1`→none, active line lights up in `--accent`); `WalkTransport` → shared `StepTransport` (narration = `aria-live` caption; optional `phase` folded in as a mono `.wt-phase` prefix). The three superseded files deleted — folder is now just `WalkthroughPlayer`+`ArrayCanvas`+`VarBoard`. *Re-skin:* `walkthroughs.css` rewritten onto blueprint tokens (dead `.wt-section*`/`.wt-kicker`/`.wt-intuition*`/`.wt-code*`/`.wt-transport`/`.wt-narration*`/`.wt-controls`/`.wt-btn*`/`.wt-scrubber`/`.wt-speed*` deleted — all now owned by the shared kit; kept + re-skinned player stage / array+vars diagram (graph-paper `.diagram` surface) / example cards / complexity chips; added `.wt-phase`; **file now alias-free**). Canvas inline tokens onto blueprint (`ArrayCanvas` cell `--panel`/in-window `color-mix(--accent 14%)`/stroke `--accent`/flash `--ink-sort`, bracket label → `var(--note)` Caveat hand; `VarBoard` → `--line-strong`/`--accent`) — clears both from the 4d alias radius. *Pages:* index → `.crumb` + `.tag accent` + shared `.cards`/`.tcard` with drawn `<Glyph name="walkthrough">` (dropped emoji/iconClass render); detail → 3-level `.crumb`, `.tag accent`, Intuition/Connects as `<Analogy>` (icon `walkthrough`/`connect`), Statement/Examples/Player/Complexity each framed in a `.plate` with short single-word eyebrows; dropped 💡/🔗 emoji + the last legacy `<p className="analogy">`. `lib/walkthrough/` untouched. Gates: `pnpm test` **117/117** (unchanged) + `pnpm build` clean static export (ESLint pass). | D3, D5 |
| 2026-09-14 | `recursion.css` + `app/recursion/page.tsx`; `sorting.css` + `app/sorting/page.tsx`; `bitwise.css` + `app/bitwise/page.tsx`; deleted `components/shared/useStepper.ts`; deleted `app/topics/page.tsx`; `Header.tsx` / `HomeHero.tsx` / `not-found.tsx` / `app/page.tsx` | **Phase 4 · sub-phase 4b (Recursion / Sorting / Bitwise + `topics` retire) implemented.** The three partially-migrated original tools moved onto the shared kit + blueprint tokens, each in its own ink. *Recursion* (`--ink-rec` purple): `CallStackViz` → `useStepEngine`+`StepTransport`; `recursion.css` de-aliased (local `--rec-red` in all three theme states, soft surfaces via `color-mix`); page → plate system (6 plates, `<Analogy>`+`<Glyph>`, no emoji). *Sorting* (`--ink-sort` amber): both players (`SlowSortViz`/`FastSortViz`) → `useStepEngine`, bespoke transports → shared `StepTransport`; `sorting.css` de-aliased (local `--sort-red`/`--sort-orange`, bar states re-inked by hue); page → 6 plates + why-grid/decision table on Module 6. **`useStepper` deleted** — recursion+sorting were its last consumers, so the one step engine is now the *only* engine (all three legacy players — `useWalkPlayer`/`useStepPlayer`/`useStepper` — retired). *Bitwise* (`--ink-bit` teal): no step-player, so no engine work; `bitwise.css` de-aliased + frameless (borrows only blueprint inks `--ink-ll`/`--ink-sort`/`--ink-rec`, so de-alias is pixel-identical); page → 4 plates, 3 analogies preserved verbatim. **Legacy `topics` route retired** — `app/topics/page.tsx` (a 2nd copy of the home topic list on the old `.tutorial-card`+emoji grid) deleted as pure duplication; 3 inbound links repointed to `/#topics` (`Header` nav / `HomeHero` CTA / `not-found`), home section id `tutorials`→`topics`. Recursion, sorting, walkthroughs *and* bitwise are now all alias-free — 4d alias radius shrinks to Linked-Lists (`.css` + `ListCanvas`/`CycleRace`/`DoublyListDemo`), `globals.css` internal uses, and `not-found.tsx`. `lib/` untouched throughout (no tested logic moved). Gates: `pnpm test` **117/117** (unchanged) + `pnpm build` clean static export (route table 11 → 10, `/topics` gone) + `pnpm exec tsc --noEmit` exit 0. | D3, D5 |
| 2026-09-14 | new `lib/stacks/{operations,types}.ts` (+ `operations.test.ts`); new `components/stacks/{StructDemo,StructCanvas}.tsx`; `components/shared/Glyph.tsx` (queue/coffee/bricks glyphs); new `app/stacks/{page.tsx,stacks.css}`; `app/page.tsx`; `components/layout/Header.tsx` | **Phase 4 · sub-phase 4c (Stacks & Queues) implemented — built natively, the standard way.** The one tool that never existed in the old site is created fresh end-to-end in the rose ink (`--accent: var(--ink-stack)`, #e11d48 light / #fb7185 dark) — **D2 confirmed on landing.** *Pure tested logic:* `lib/stacks/operations.ts` emits `Step[]` for push/pop/peekStack/clear (LIFO) and enqueue/dequeue/peekQueue (FIFO) over an immutable model in `types.ts`; **25 new tests** (`operations.test.ts`) → suite 117 → **142/142** (12 files). *SVG canvas:* `StructCanvas` draws StackView (vertical pile, top-of-stack cued) + QueueView (horizontal line, front/back cued) with `motion` spring + returned-value badge, reduced-motion aware; `StructDemo` is the op-driven client driver (committed state → fresh `Step[]` → `useStepEngine(steps,{baseInterval:1300,autoPlayOnChange:true})` + shared `StepTransport`), same pattern as Linked Lists. *Scoped CSS on blueprint tokens:* `stacks.css` — `.sq-*` classes, no local colour tokens (Queue module + queue column re-ink to `--ink-walk`; cost badges reuse `--ink-ll` for cheap O(1) / `--ink-sort` for costly O(n)); ≥44px touch targets on toolbar input+buttons; alias-free. *Shared kit:* page is a Server Component — `.crumb` + `.tag accent` hero, 5 `.plate` modules (stack demo · queue demo · list-vs-deque cost cards · where-each-shows-up columns · summary table) each leading with an `<Analogy>` (plates / coffee / bricks / connect glyphs), framed light `<CodeBlock filename lang="python">` for both snippets; new drawn `<Glyph name="stacks"/>`+`"queue"`. *Wiring:* new `/stacks` route + **6th home `.tcard`** (rose ink, between linked-lists and bitwise) + **5th `Stacks` nav link** in `.tb-nav` (wraps safely). Closing analogy connects the call stack ↔ `/recursion`, BFS↔queue / DFS↔stack. `lib/` for every other tool untouched. Gates: `pnpm test` **142/142** + clean `pnpm build` (`rm -rf .next out` first — Windows warm-cache reuse triggers spurious `PageNotFoundError`; clean build reliable) static export **11 routes** (`/stacks` 4.57 kB / 152 kB First Load) + `pnpm exec tsc --noEmit` exit 0. | D2, D3, D5 |
