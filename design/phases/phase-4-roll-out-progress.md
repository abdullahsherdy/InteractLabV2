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
