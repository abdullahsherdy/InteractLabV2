# Phase 4 — Roll out (plan)

> Living plan. The big phase: migrate the remaining four tools onto the shared
> kit, build Stacks & Queues natively, then remove the back-compat token aliases.
> Progress log: [`phase-4-roll-out-progress.md`](./phase-4-roll-out-progress.md).
> Master plan: [`../implementation-plan.md`](../implementation-plan.md).

| | |
|---|---|
| **Phase** | 4 — Roll out |
| **Branch** | `feat/ui-design` (always branch from `main`; never commit to `main`) |
| **Opened** | 2026-09-12 |
| **Status** | 🟡 In progress — **4a (Walkthroughs) + 4b (Recursion/Sorting/Bitwise + `topics` retire) ✅ landed**; **4c** (Stacks & Queues, native) next |

## Why sub-phases

Phase 4 as scoped in the master plan is too large for one reviewable commit
(4 tools + a brand-new tool + alias removal + docs). It splits into atomic,
individually shippable sub-phases, each with its own gates and its own review
pause. Commits stay atomic per sub-phase.

| Sub | Scope | State |
|---|---|---|
| **4a** | **Problem Walkthroughs** — full re-skin + migrate onto shared kit | ✅ landed (gates green) |
| 4b | Recursion / Sorting / Bitwise — ink-swap + migrate (delete `useStepper`) + retire legacy `topics` | ✅ landed (gates green) |
| 4c | Stacks & Queues — build natively (D2 **rose** `--ink-stack`) | ▶ next |
| 4d | Cleanup — remove back-compat token aliases; refresh `web/.claude/CLAUDE.md` | ⬜ |

> Survey landed (see the refined 4b–4d outline below): only **Recursion + Sorting**
> need engine migration (Bitwise has no shared engine); **Stacks & Queues does not
> exist as code** (design docs only); the alias blast radius is enumerated in 4d.

---

## 4a — Problem Walkthroughs

> ✅ **Landed 2026-09-12** — both gates green (117/117 tests unchanged; clean
> static export). Migration matched this spec exactly; close-out recorded in the
> progress log. Awaiting on-device review before commit (user-gated).

**Why first:** flagged as the weakest UI, and it is the *least*-migrated tool —
still 100% on the old warm-stone system: legacy tokens throughout its CSS, a
**third** step engine (`useWalkPlayer`) + **third** transport (`WalkTransport`),
emoji as icons (💡 🔗 + emoji transport buttons), Comic Sans "whiteboard"
labels, flat `.wt-section` layout (no plates), a bespoke dark code panel, and a
legacy `<p className="analogy">`. It gets the full Linked-Lists treatment.

**Ink:** `--ink-walk` (#2563eb). Set `--accent: var(--ink-walk)` on the hero +
main so the whole kit (crumb, tags, plate caps, field-notes, transport, code
highlight) draws in the walkthrough blue.

**Untouched:** everything under `lib/walkthrough/` (types, `sliding-window.ts`,
its generated trace, and `sliding-window.test.ts`). No tested logic moves.

### Deltas

**Engine migration — `components/walkthrough/WalkthroughPlayer.tsx`**
- `useWalkPlayer(steps)` → `useStepEngine(steps, { baseInterval: 2000 })`
  (`steps` is already memoised from `problem.build()`; stable identity, so no
  `autoPlayOnChange`). Narration cadence (old `BASE_MS = 2000`) preserved.
- `<CodePanel .../>` → shared `<CodeBlock code={problem.code.join("\n")}`
  `lang={problem.language} showLineNumbers`
  `highlight={step && step.codeLine >= 0 ? step.codeLine + 1 : undefined} />`.
  The framed `.code` plate's `.hl` already reads `var(--accent)`, so the active
  line lights up in the walkthrough ink. (Trade-off: loses the springy
  `layoutId` cursor of the bespoke panel for the shared static highlight —
  accepted for consistency + to retire the dark panel, per P2's CodeBlock
  extension. The array canvas keeps its rich motion.)
- `<WalkTransport player={player} />` → shared
  `<StepTransport engine={engine} caption={…} />`. The step **narration**
  becomes the transport's `aria-live` caption; the optional **phase** label is
  folded in as a small mono prefix (`.wt-phase`) so grouping structure survives.
- Keep the `MotionConfig reducedMotion="user"` wrapper (array canvas motion).

**Delete (dead after migration)**
- `components/walkthrough/useWalkPlayer.ts` (→ `useStepEngine`)
- `components/walkthrough/WalkTransport.tsx` (→ shared `StepTransport`)
- `components/walkthrough/CodePanel.tsx` (→ shared `CodeBlock`)

**Re-skin (structure kept, blueprint tokens)**
- `components/walkthrough/ArrayCanvas.tsx` — cell fill `--panel`, in-window tint
  `color-mix(--accent)`, default stroke `--line-strong`; the Comic-Sans
  `.wt-bracket-label` → `var(--note)` (Caveat, the blueprint pencil hand).
  Marker/window/flash colours that arrive from the lib data are left as-is.
- `components/walkthrough/VarBoard.tsx` — inline token defaults only
  (`--line-strong`); the rest is CSS.
- `app/walkthroughs/walkthroughs.css` — rewrite onto blueprint tokens; **delete**
  the now-dead `.wt-section*`, `.wt-kicker`, `.wt-intuition*`, `.wt-code*`,
  `.wt-transport`, `.wt-narration*`, `.wt-controls`, `.wt-btn*`, `.wt-scrubber`,
  `.wt-step-count`, `.wt-speed*`; keep + re-skin `.wt-player`/`.wt-stage`/
  `.wt-canvas-wrap`(→diagram)/`.wt-vars`/`.wt-var`/`.wt-examples`/`.wt-example`/
  `.wt-complexity`/`.wt-chip`/canvas text; add `.wt-phase`.

**Re-skin pages onto the plate/figure system**
- `app/walkthroughs/[slug]/page.tsx` — `.breadcrumb`→`.crumb`+`Link`;
  `.hero-tag`→`.tag accent`; **Intuition** → `<Analogy title="The big idea"
  icon="walkthrough">`; Statement / Examples / Player / Complexity each wrapped
  in a `.plate` (`.plate-cap` label + title, `.plate-b` body); **Connects to** →
  `<Analogy title="Where this connects" icon="connect">` (drops the 🔗 emoji and
  the last legacy `<p className="analogy">`).
- `app/walkthroughs/page.tsx` (index) — `.breadcrumb`→`.crumb`;
  `.hero-tag`→`.tag accent`; problem grid → shared `.cards`/`.tcard` with a drawn
  `<Glyph name="walkthrough">` (drops `p.emoji`/`p.iconClass` rendering; the
  fields stay in the data, cleaned up in 4d).

### Gates (4a)
- `pnpm test` green (unchanged — `lib/`-only; walkthrough trace untouched).
- `pnpm build` clean static export (typecheck + lint + export).
- Transport keyboard (Space/←→/Home/End/R) via the shared `StepTransport`;
  `aria-live` narration caption; reduced-motion jumps to final frame.
- ~400px: player stacks to one column; no horizontal body scroll.

### Close-out (4a)
Append a 4a entry to the progress log + a Revision-Log row to
[`../ui-redesign-log.md`](../ui-redesign-log.md). **Pause for on-device review;
do not push (user-gated); leave git add/commit to the user.**

---

## 4b / 4c / 4d — outline (refined with survey facts)

> Survey source: background sweep 2026-09-12 (Recursion/Sorting/Bitwise engine +
> emoji + analogy usage; Stacks & Queues existence; alias blast radius). Numbers
> below are pre-4a where noted — 4a already cleared the walkthroughs surface
> (walkthroughs.css + `ArrayCanvas.tsx` + `VarBoard.tsx` are now alias-free).

### 4b — Recursion / Sorting / Bitwise

> ✅ **Landed 2026-09-14** — all gates green (117/117 tests unchanged; clean
> static export; `tsc --noEmit` exit 0). Recursion + Sorting migrated onto
> `useStepEngine`/`StepTransport`; `useStepper` deleted (one engine remains);
> Bitwise ink-swapped + de-aliased (no engine work — it never had a shared
> player); and the legacy `topics` route was **retired** (not folded), its 3
> inbound links repointed to the home `/#topics` grid. Recursion, sorting,
> walkthroughs and bitwise are all alias-free — the 4d blast radius shrinks to
> Linked-Lists + `globals.css` internals + `not-found.tsx`. Close-out recorded
> in the progress log. Migration matched the spec below.

Per-tool ink via `--accent` on hero + main (`--ink-rec` #7c3aed / `--ink-sort`
#c2790f / `--ink-bit` #0d9488). Today none of the three CSS files set `--accent`,
so their kit currently draws in the default `--ink-home` — the swap is the
headline visual change.

- **Engine migration (only two tools need it):**
  - **Recursion** — `useStepper` is used in **`CallStackViz` only**; the other 4
    vizes self-manage. Migrate `CallStackViz` → `useStepEngine` + `StepTransport`.
  - **Sorting** — `useStepper` is used in **`SlowSortViz` + `FastSortViz`** (the
    other 3 self-manage). Migrate both.
  - **Bitwise** — **no shared step engine at all** (every viz self-managed), so
    no engine work; ink-swap + chrome re-skin only.
  - After both are migrated, **delete `components/shared/useStepper.ts`** (no
    remaining referents).
- **Chrome re-skin (all three):** `.breadcrumb`→`.crumb`+`Link`;
  `.hero-tag`→`.tag accent`; emoji icons → `<Glyph>` (`recursion`/`sorting`/
  `bitwise` already exist); legacy `<p className="analogy">` → `<Analogy>`
  (Recursion **7**, Sorting **6**, Bitwise **4** boxes); module chrome →
  `.plate`/`.diagram`.
- Also fold the legacy **`app/topics/page.tsx`** (old `.tutorial-card` + emoji
  grid) into this pass or retire it — it duplicates the home `.cards` grid.

### 4c — Stacks & Queues (build natively — confirms D2)

**Does not exist as code** — only design docs. `--ink-stack` (#e11d48 light /
#fb7185 dark) already sits in `globals.css` (lines ~34, ~127, ~168), unused.
Build the whole tool the standard way: pure tested `lib/` logic → SVG canvas →
scoped CSS on blueprint tokens → shared kit (`.plate`/`.tcard`/`StepTransport`/
`Analogy`/a new `stacks` route + home card). Draw in the rose ink. Flip **D2** to
confirmed on landing.

### 4d — Cleanup (remove back-compat aliases; refresh docs)

Remove the 27 back-compat aliases (`globals.css` lines ~71–97, header ~66–70) +
the 5 `*-light` dark redefs (~135–139, ~175–179) **once no file references them**.
Blast radius from the survey (pre-4a):

- **Already cleared by 4a:** `walkthroughs.css`, `ArrayCanvas.tsx`, `VarBoard.tsx`.
- **CSS still to convert:** `sorting.css`, `recursion.css`, `bitwise.css`,
  `linked-lists.css` (**Linked Lists is _not_ alias-clean** — 24 alias lines
  remain here + its canvas/demos), and stray uses in `globals.css` itself
  (e.g. `.tutorial-hero .breadcrumb a:hover { color: var(--teal) }`).
- **Components still to convert:** `ListCanvas.tsx` (11), `CycleRace.tsx` (2),
  `DoublyListDemo.tsx` (2), `FastSortViz.tsx` (1); plus `app/not-found.tsx`
  (~26, ~37). Most fall out of the 4b re-skins; the Linked-Lists trio is
  leftover from Phase 3 and must be swept here.
- **Data-layer colour literals** (e.g. `var(--purple)` inside lib step data) get
  swapped to blueprint tokens too — check whether any `lib/**` data carries
  alias strings before deleting the aliases.
- **3 already-dead aliases** (`--radius-xl`, `--shadow-lg`, `--blue-light`) can
  go immediately.
- Home is fully alias-clean (nothing to do there).

Finish by refreshing `web/.claude/CLAUDE.md`, then run final full gates and flip
master-plan roadmap item 4 → ✅.
