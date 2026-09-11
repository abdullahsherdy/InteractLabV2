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
| **Status** | 🟢 Phase 1 (foundations) implemented — gates green (build + 106 tests), paused for review |

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
| Per-phase plan + progress logs | [`phases/`](./phases/) | Phase 1 done |
| This phase log | `ui-redesign-log.md` | living |
| Legacy reference sheet (current shipped tokens) | `design-system.svg` | superseded at impl. |
| Stacks & Queues mockup | `stacks-queues-mockup.svg` | pending build |

Open the design system by double-clicking the HTML (works from `file://`; only
external dep is Google Fonts).

## 4. Key decisions

Sign-off convention: **✅ approved 2026-09-11 (plan)** = committed by the approval
of `implementation-plan.md` in plan mode. D2 is deliberately deferred until its
tool is built in Phase 4.

| # | Decision | Rationale | Sign-off |
|---|---|---|---|
| D1 | One identity, per-tool **accent "inks"** | Keep the constant blueprint ground; each tool keeps the accent it already ships, reframed as "the ink this sheet is drawn in." Preserves wayfinding, unifies the look. | ✅ approved 2026-09-11 (plan) |
| D2 | **Rose** accent = Stacks & Queues ink | Fills the empty red gap; the 6th accent that was already awaiting sign-off is now folded into the system. | ⬜ pending → confirmed at Phase 4 (when the tool is built) |
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
2. ⬜ **Shared kit** — title-block header + theme toggle; ONE unified `StepEngine` +
   ONE `StepTransport`; extended `CodeBlock`; drawn glyphs; analogy field-note; states.
3. ⬜ **Home + Linked Lists** — self-drawing hero; drawn card glyphs; re-skin LL;
   migrate LL onto the shared kit. Review on device before Phase 4.
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
