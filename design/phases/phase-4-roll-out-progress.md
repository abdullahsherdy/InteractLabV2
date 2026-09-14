# Phase 4 — Progress log

> Append-only. Newest entry at the bottom. Plan:
> [`phase-4-roll-out.md`](./phase-4-roll-out.md).

---

### 2026-09-12 — Phase 4 opened; sub-phase 4a (Walkthroughs) started

- Split the large "roll out" phase into four atomic, individually-reviewable
  sub-phases (**4a** Walkthroughs · **4b** Recursion/Sorting/Bitwise · **4c**
  Stacks & Queues native · **4d** alias cleanup + docs). Rationale + the 4a spec
  live in the plan.
- **4a chosen first** — flagged by the user as the weakest UI ("its ui isn't
  good at all"), and confirmed to be the least-migrated tool: 100% legacy
  warm-stone tokens, a third step engine (`useWalkPlayer`) + third transport
  (`WalkTransport`), emoji icons, Comic-Sans labels, flat `.wt-section` layout,
  a bespoke dark code panel, and a legacy `<p className="analogy">`. It earns a
  full migration, not a repaint — so it leads.
- A background survey of the other tools (Recursion/Sorting/Bitwise engine +
  emoji + analogy usage, whether Stacks & Queues exists, the alias blast radius)
  is running to size 4b–4d; 4a does not depend on it.
- Re-reading the 4a surface after compaction (stale-context discipline) before
  any edit: the Walkthroughs internals, both page files, and the shared-kit APIs
  being migrated onto (`useStepEngine`, `StepTransport`, `CodeBlock`, `Glyph`,
  `Analogy`).

---

### 2026-09-12 — Sub-phase 4a (Walkthroughs) landed; gates green

Full migration of Problem Walkthroughs onto the shared kit + blueprint tokens,
in the walkthrough ink (`--accent: var(--ink-walk)`). **`lib/walkthrough/`
untouched** (types, `sliding-window.ts`, its trace, tests).

- **Engine unified (D3).** `WalkthroughPlayer.tsx`: `useWalkPlayer` →
  `useStepEngine(steps, { baseInterval: 2000 })` (2000ms preserves the old
  `BASE_MS`; `steps` is memoised per problem → stable identity, no
  `autoPlayOnChange`). Bespoke `CodePanel` → shared `CodeBlock` (0-based
  `codeLine` → 1-based `highlight`, `-1` → none). `WalkTransport` → shared
  `StepTransport`; narration is the `aria-live` caption, the optional `phase`
  folded in as a small mono prefix (`.wt-phase`). `MotionConfig
  reducedMotion="user"` kept for the canvas.
- **Deleted** the three now-dead files: `useWalkPlayer.ts`, `WalkTransport.tsx`,
  `CodePanel.tsx`. The walkthrough folder is now just `WalkthroughPlayer` +
  `ArrayCanvas` + `VarBoard`.
- **Canvas re-skinned onto blueprint tokens** (also clears these from the 4d
  alias blast radius): `ArrayCanvas.tsx` cell fill `--panel` / in-window
  `color-mix(--accent 14%)` / stroke `--line-strong`→`--accent`, flash
  `--ink-sort`; bracket label → `var(--note)` (Caveat, the pencil hand).
  `VarBoard.tsx` inline defaults → `--line-strong`/`--accent`.
- **`walkthroughs.css` rewritten** onto blueprint tokens — deleted the dead
  `.wt-section*`/`.wt-kicker`/`.wt-intuition*`/`.wt-code*`/`.wt-transport`/
  `.wt-narration*`/`.wt-controls`/`.wt-btn*`/`.wt-scrubber`/`.wt-speed*`
  (all now owned by the shared kit); kept + re-skinned the player stage, the
  array/vars diagram (graph-paper surface matching `.diagram`), the worked-example
  cards, and the complexity chips; added `.wt-phase`. **File is now alias-free.**
- **Both pages re-skinned onto the plate/figure system.** Index: `.breadcrumb`→
  `.crumb`, `.hero-tag`→`.tag accent`, problem grid → shared `.cards`/`.tcard`
  with a drawn `<Glyph name="walkthrough">` (dropped `emoji`/`iconClass`
  rendering; fields stay in data for 4d). Detail: 3-level `.crumb`, `.tag accent`
  hero, **Intuition** → `<Analogy title="The big idea" icon="walkthrough">`,
  Statement / Examples / Player / Complexity each framed in a `.plate` (short
  single-word `.plate-no` eyebrows to avoid mobile cap-wrap, since `.plate-cap`
  is a no-wrap flex row), **Connects** → `<Analogy … icon="connect">`. Dropped
  the 💡/🔗 emoji and the last legacy `<p className="analogy">`.
- **Gates:** `pnpm test` **117/117** (unchanged — lib-only, untouched);
  `pnpm build` clean static export, ESLint passing, `/walkthroughs` (402 B) +
  `/walkthroughs/smallest-subarray-sum` prerendered.
- **Doc drift noted for 4d:** `docs/walkthroughs.md` still lists the three deleted
  files — fold into 4d's docs refresh.
- **Not pushed / not committed** — user handles git add/commit; push is
  user-gated. Paused for on-device review.

---

### 2026-09-14 — Sub-phase 4b opened (Recursion/Sorting/Bitwise); Unit 1 Recursion landed (backfill)

Sub-phase 4b migrates the three original tools that were only partially on the
kit — Recursion, Sorting, Bitwise — onto the shared step engine + blueprint
tokens, then retires the legacy `useStepper` hook once its last consumer is gone.
Unlike 4a (a full rebuild), these are engine-swap + de-alias + plate re-skin.

**Recursion (Unit 1)** was migrated and committed in a prior session; logging it
here for the record (verified against the current tree before writing):

- **Ink:** `--accent: var(--ink-rec)` (recursion purple) on both `.tutorial-hero`
  and `.tutorial-main`, so the whole shared kit draws purple.
- **Engine unified (D3).** `CallStackViz` (the one step-player in the tool) →
  `useStepEngine(steps)` + shared `StepTransport`. The four non-player vizes
  (`FibTreeViz`, `BigOChart`, `AnnotateCards`, `SixStepMethod`) are static/
  interactive, not transport-driven, so they needed no engine.
- **`recursion.css` de-aliased + re-inked.** Frameless `.rec-module` (the `.plate`
  is the frame). Local `--rec-red` (+ `-light`, `-border`) defined in all three
  theme states on `.tutorial-main` (blueprint has no red). Soft surfaces use
  `color-mix(... transparent)` off blueprint inks, so no separate dark `@media`
  bodies. Frame/log/bar states re-inked onto `--ink-bit`/`--ink-ll`/`--ink-sort`/
  `--accent`/`--rec-red`. **File is alias-free.**
- **Page re-skinned onto the plate system.** 3-part `.crumb`, four `.tag accent`
  hero tags, six `.plate`s (Modules 1–5 + a Practice plate), every intro →
  `<Analogy>` with a drawn `<Glyph>` (nesting-dolls, plates, tree, growth-curve,
  magnifier, compass), closing `<Analogy … icon="connect">`. No legacy emoji.

---

### 2026-09-14 — Unit 2 Sorting landed; `useStepper` retired; gates green

Sorting migrated onto the shared kit + blueprint tokens in the sorting ink
(`--accent: var(--ink-sort)`, #c2790f / #fbbf24). **`lib/sorting/` untouched**
(slow/fast sort traces, util, content, tests).

- **Engine unified (D3).** Both step-players moved off the legacy hook:
  `SlowSortViz` → `useStepEngine(steps)` and `FastSortViz` → `useStepEngine(ops)`
  (each source array is memoised on `[algo, data]`, so a preset/input change
  yields a fresh identity and the engine rewinds — the old auto-reset behaviour,
  preserved for free). Both bespoke transports (`.sort-caption`/`.sort-transport`/
  `.sort-btn*`/`.sort-step-count`/`.sort-speed`) → shared `StepTransport
  engine={player} caption={current?.note}`. `FastSortViz` keeps `index` from the
  engine purely as the `AnimatePresence` motion key.
- **`useStepper.ts` deleted.** With recursion (4b/1) and sorting both migrated,
  the hook had no remaining consumers — grep for live imports is clean, and the
  clean type-check confirms nothing references the removed module. This clears
  the last of the three legacy players (`useWalkPlayer` went in 4a). The one
  step engine is now the *only* step engine. Historical mentions of the old
  players survive as design comments in `useStepEngine.ts` / `lib/step/
  transitions.ts` (documenting what the engine unified) — left as accurate
  history, not code.
- **`sorting.css` de-aliased + re-inked.** Frameless `.sort-module`. Local
  `--sort-red` (#dc2626 / #f87171) and `--sort-orange` (#ea580c / #fb923c)
  defined in all three theme states on `.tutorial-main` (blueprint has no red/
  orange); dropped the dead `-light`/`-border`/`-orange-light` tokens. Bar states
  re-inked by hue — default `--ink-walk`, compare `--accent`, swap `--sort-red`,
  key `--ink-rec`, min `--sort-orange`, sorted `--ink-ll`. Soft-amber surfaces
  (`.sort-explain`, `.sort-key-pill-after`, `.sort-table-row.open`) →
  `color-mix(... transparent)` off `--ink-sort`/`--accent`, so the dark `@media`
  overrides are gone. Added `.plate-t code { font-family: var(--mono);
  text-transform: none; }` so Module 6's inline `sorted()` opts out of the plate
  cap's display-face uppercasing. Deleted the dead `.sort-block*`/`.sort-kicker`/
  transport/button rules. **File is alias-free.**
- **Page re-skinned onto the plate system.** 3-part `.crumb`, four `.tag accent`
  hero tags (jump links to figs), six `.plate`s (Modules 1–6) each with a drawn
  `<Glyph>` (books, scissors, growth-curve, key, tag) intro `<Analogy>` — Module
  6 opens with a why-grid + decision table instead — and a closing `<Analogy …
  icon="connect">`. Legacy emoji + `<span>` analogy wrappers dropped (children go
  straight into the field-note's `<p>`).
- **De-aliasing dividend:** with recursion, sorting *and* walkthroughs now
  alias-free, only Bitwise (+ any legacy `topics`) still rides the back-compat
  aliases — shrinking the 4d blast radius to those.
- **Gates:** `pnpm test` **117/117** (unchanged — lib untouched); `pnpm build`
  clean static export, `/sorting` 7.96 kB prerendered, all 11 routes green. (An
  initial build failed uniformly across *every* route in "Collecting page data"
  — a stale `.next` cache, not the edits, since the type-check passed; deleting
  `.next` and rebuilding was clean.)
- **Not pushed / not committed** — user handles git add/commit; push is
  user-gated. Paused for on-device review before Unit 3 (Bitwise).

---

### 2026-09-14 — Unit 3 Bitwise landed; sub-phase 4b complete; gates green

Bitwise migrated onto the shared kit + blueprint tokens in the bitwise ink
(`--accent: var(--ink-bit)`, teal). **`lib/bitwise/` untouched** (bits, tests);
**`components/bitwise/` untouched** (the three vizes carried no inline alias
tokens, so de-aliasing `bitwise.css` alone made the whole tool alias-free).

- **No engine work.** Unlike recursion/sorting, Bitwise has no step-player —
  `PlaceValueExplorer`, `ConversionTrace` and `BitwisePlayground` each manage
  their own `useState` and animate with `motion` directly. Nothing to move onto
  `useStepEngine`/`StepTransport`.
- **No local token block needed.** Bitwise borrows only three accent hues, and
  all three are already blueprint inks — the lit-switch green (`--ink-ll`), the
  "B operand" amber (`--ink-sort`), and the result purple (`--ink-rec`). So
  unlike sorting's `--sort-red`/`--sort-orange` or recursion's `--rec-red`, this
  sheet defines nothing locally; every colour flips with the theme through the
  inks. De-aliasing is therefore pixel-identical to the old render (the aliases
  already resolved to these tokens) — only the soft surfaces moved.
- **`bitwise.css` de-aliased + re-inked + frameless.** `.bw-module` reduced to
  `display:flex; flex-direction:column; gap:16px;` (the `.plate` is the frame);
  deleted the dead `.bw-block`/`.bw-block-head`/`.bw-kicker` (+ its dark
  `@media`)/`.bw-block-head h2`. Every alias mapped to its blueprint token
  (`--font-mono`→`--mono`, `--font-sans`→`--sans`, `--bg*`→`--paper`/`--panel`/
  `--panel-2`, `--text*`→`--ink`/`--graphite`/`--faint`, `--border*`→`--line`/
  `--line-strong`, `--radius*`→`--r-control`/`--r-card`, `--teal`→`--accent`,
  `--green`/`--amber`/`--purple`→`--ink-ll`/`--ink-sort`/`--ink-rec`). The
  `.bw-op-answer` result gradient and the `.bw-tag-a/b/r` chips moved to
  `color-mix(… transparent)` off `--accent`/`--ink-rec`/`--ink-ll`/`--ink-sort`,
  so the two dark-mode `-light` alias overrides are gone. **File is alias-free.**
- **Page re-skinned onto the plate system.** `.breadcrumb`→`.crumb` (Link home),
  `.hero-tag`→`.tag accent` with `#fig1..#fig4` jump links, four modules →
  `.plate`/`.plate-cap` (`.plate-no` "Module N" + `.plate-t` title)/`.plate-b`.
  The three teaching analogies → `<Analogy>` with drawn `<Glyph>`s (switches,
  halving, sliders) — original wording preserved verbatim, 💡/➗/🎛️ emoji and the
  wrapping `<span>` dropped. Module 4 (real-world cards) keeps no intro analogy,
  as in the source. Closing → `<Analogy title="Where this connects" icon="connect">`
  (🔗 dropped).
- **De-aliasing dividend — 4b done.** Recursion, sorting, walkthroughs *and*
  bitwise are now all alias-free. The only remaining referents of the back-compat
  aliases are the legacy `app/topics/page.tsx` (next to retire), `linked-lists`
  (its `.css` + a few canvas components), the globals' own internal uses, and
  `not-found.tsx` — that is the full 4d blast radius.
- **Gates:** `pnpm exec tsc --noEmit` clean; `pnpm test` **117/117** (lib
  untouched); `pnpm build` clean static export, `/bitwise` **4.85 kB**, all 11
  routes prerendered. (One build attempt failed on `next/font` with
  `getaddrinfo ENOTFOUND fonts.googleapis.com` — a transient Google-Fonts outage,
  not the edits: the errors named only the untouched `layout.tsx`, and the
  type-check passed. Lesson noted: `rm -rf .next` also nukes `next/font`'s cache,
  forcing a refetch that fails offline — don't delete `.next` reflexively.)
- **Not pushed / not committed** — user handles git add/commit; push is
  user-gated.

---

### 2026-09-14 — Legacy `topics` route retired; sub-phase 4b fully closed

The old `app/topics/page.tsx` — a second copy of the home topic list on the
pre-redesign `.tutorial-card` + emoji grid (🎬 ⛓️ 01 02 03) — is **deleted**.
The home page's `<section id="topics">` already carries the canonical topic
index on the new `.cards`/`.tcard` grid (drawn `<Glyph>`s + per-tool inks), so
the route was pure duplication — a DRY / single-source-of-truth violation.

- **Retired, not rebuilt.** The plan offered "fold … into this pass or retire
  it"; retiring is the DRY-correct choice — one topic list, not two kept in sync
  by hand. Retiring also surfaced that the legacy `.tutorial-card` /
  `.tutorial-grid` / `.card-icon` class families are referenced by **nothing**
  else: they were never ported into the redesigned `globals.css`, so that page
  had been rendering them unstyled since Phase 3. Flagged as dead selectors for
  the 4d sweep (they were already gone from the token authority; only the markup
  lingered).
- **Three inbound links repointed** to the home topics grid at `/#topics`: the
  header nav "Topics" item (`Header.tsx`), the home-hero "Open a topic →" ghost
  CTA (`HomeHero.tsx`), and the 404 page's "See live topics →" button
  (`not-found.tsx`). The home section id was renamed `tutorials`→`topics` for
  label/anchor coherence (its `<h2>` reads "Topics", and all three inbound links
  are about topics) — verified nothing referenced the old `#tutorials`.
- **Gates:** `pnpm test` **117/117**; `pnpm build` clean static export — the
  route table drops **11 → 10 routes**, `/topics` gone, all prerendered; a
  post-build `pnpm exec tsc --noEmit` exit **0**. (A *pre*-build standalone
  `tsc` first flagged three errors, all inside the auto-generated
  `.next/types/**` route validators still importing the deleted
  `app/topics/page.js` — a stale-cache artifact, not a source error. `next
  build` regenerates `.next/types` from the current route tree up front, so its
  own typecheck passed clean, and the post-build `tsc` then confirmed exit 0.
  Root cause proven; no `.next` deletion needed.)
- **Not pushed / not committed** — user handles git add/commit; push is
  user-gated.

**Sub-phase 4b is now complete.** Recursion, Sorting and Bitwise are migrated
onto the shared kit + blueprint tokens; `useStepper` is deleted (one step engine
remains); and the legacy `topics` route is retired. Recursion, sorting,
walkthroughs and bitwise are all alias-free — the 4d alias blast radius is now
just Linked-Lists (its `.css` + `ListCanvas`/`CycleRace`/`DoublyListDemo`),
`globals.css`'s own internal uses, and `not-found.tsx`. Next: **4c — Stacks &
Queues, built natively** (rose `--ink-stack`, confirms **D2**).

---

### 2026-09-14 — Sub-phase 4c (Stacks & Queues) landed — built natively; D2 confirmed; gates green

The one tool that never existed in the old site is created fresh, end-to-end,
the standard way — pure tested `lib/` logic → SVG canvas → scoped CSS on
blueprint tokens → shared kit → new route + home card. Drawn in the rose ink
(`--accent: var(--ink-stack)`, #e11d48 light / #fb7185 dark). **D2 flipped to
✅ confirmed on landing** (both the master log's decision table and its
deliverables row updated).

- **Pure tested logic (built first, TDD-style).** `lib/stacks/types.ts` holds an
  immutable model; `lib/stacks/operations.ts` emits `Step[]` builders for
  push / pop / peekStack / clear (LIFO) and enqueue / dequeue / peekQueue (FIFO),
  each step carrying the array snapshot + highlight + caption. **25 new tests**
  (`operations.test.ts`) cover every op incl. empty-structure guards → suite
  117 → **142/142** (12 test files). `lib/` for every other tool untouched.
- **SVG canvas.** `StructCanvas.tsx` draws `StackView` (vertical pile, newest on
  top, top-of-stack cued) and `QueueView` (horizontal line, front/back labelled),
  with a `motion` spring (`stiffness:260 damping:26`), a returned-value badge for
  pop/dequeue/peek, and `MotionConfig reducedMotion="user"`. `StructDemo.tsx` is
  the `"use client"` op-driven driver — committed state in `useState` → op builds
  a fresh `Step[]` → swapped into `steps` → `useStepEngine(steps, { baseInterval:
  1300, autoPlayOnChange: true })` rewinds to 0 + autoplays (length>1 only) →
  shared `StepTransport`. Same op-driven pattern as Linked Lists (the reference
  tool); no fourth engine, no bespoke transport.
- **Scoped CSS on blueprint tokens.** `stacks.css` — `.sq-*` classes, **no local
  colour tokens**: the Queue demo module + the queue "where it shows up" column
  re-ink to `--ink-walk` (blue) so stack=rose / queue=blue reads at a glance; the
  cost badges reuse `--ink-ll` for cheap O(1) (`.sq-cost-ok`) and `--ink-sort`
  for costly O(n) (`.sq-cost-bad`). Toolbar input + buttons are ≥44px touch
  targets; `.sq-btn-op` is the filled-accent primary. `.sq-canvas{display:flex}`
  composes over the shared `.diagram` graph-paper surface (page CSS wins by
  source order). **Alias-free from birth.**
- **Shared kit — the page is a Server Component.** `.crumb` + four `.tag accent`
  hero jump-chips, then five `.plate` modules, each leading with an `<Analogy>`:
  (1) stack demo + `plates` glyph + framed `<CodeBlock filename="stack.py"
  lang="python">`; (2) queue demo (re-inked blue) + `coffee` glyph + framed
  `queue.py`; (3) list-vs-deque cost cards + `bricks` glyph (why a list is a fast
  stack but a slow queue — `list.pop(0)` O(n) vs `deque.popleft()` O(1)); (4)
  where-each-shows-up, two columns (stack: undo/redo, browser Back, call stack,
  bracket matching · queue: print jobs, task queues, BFS, service lines); (5) a
  summary `.sq-table`. Closing `<Analogy title="Where this connects"
  icon="connect">` ties the call stack ↔ `/recursion`, BFS↔queue / DFS↔stack.
  New drawn glyphs `stacks` + `queue` (D5); no emoji anywhere.
- **Wiring.** New `/stacks` route; **6th home `.tcard`** (rose ink, placed
  between Linked Lists and Bitwise) with `<Glyph name="stacks">`; **5th nav link
  `Stacks`** in the header's `.tb-nav` (wraps safely — `flex-wrap:wrap`).
- **Gates:** `pnpm exec tsc --noEmit` exit **0**; `pnpm test` **142/142** (12
  files); `pnpm build` clean static export — **11 routes**, `/stacks` **4.57 kB /
  152 kB** First Load, `out/stacks/index.html` written fresh. (Build hygiene
  reconfirmed: reusing a warm `.next` on Windows throws a spurious
  `PageNotFoundError` on a random untouched page during "Collecting page data",
  and can ENOENT the trace-collection step which `output:"export"` doesn't even
  need — `rm -rf .next out` then build is reliable. My code compiled/typed clean
  on every attempt; the flakiness was purely the stale cache.)
- **Not pushed / not committed** — user handles git add/commit; push is
  user-gated.

**Sub-phase 4c is complete; D2 is confirmed.** Stacks & Queues now exists as a
first-class tool built to the same standard as the rest. Next and last: **4d —
alias cleanup + docs.** Remaining back-compat-alias referents are Linked-Lists
(`linked-lists.css` + `ListCanvas`/`CycleRace`/`DoublyListDemo`), `globals.css`'s
own internal uses, and `not-found.tsx`; plus the stale `web/.claude/CLAUDE.md`
to refresh and the master-plan roadmap item 4 to flip ✅.
