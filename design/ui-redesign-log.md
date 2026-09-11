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
| **Status** | 🟡 Design spec delivered — under review & revision |

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
| This phase log | `ui-redesign-log.md` | living |
| Legacy reference sheet (current shipped tokens) | `design-system.svg` | superseded at impl. |
| Stacks & Queues mockup | `stacks-queues-mockup.svg` | pending build |

Open the design system by double-clicking the HTML (works from `file://`; only
external dep is Google Fonts).

## 4. Key decisions

| # | Decision | Rationale | Sign-off |
|---|---|---|---|
| D1 | One identity, per-tool **accent "inks"** | Keep the constant blueprint ground; each tool keeps the accent it already ships, reframed as "the ink this sheet is drawn in." Preserves wayfinding, unifies the look. | ⬜ pending |
| D2 | **Rose** accent = Stacks & Queues ink | Fills the empty red gap; the 6th accent that was already awaiting sign-off is now folded into the system. | ⬜ pending |
| D3 | **Transport redesign**: "Step X / Y" + scrubber + keyboard + `aria-live` | Today's progress *dots* render one node per step and break past ~30 steps; the readout+scrubber scales and is keyboard/AT-accessible. Highest-value fix. | ⬜ pending |
| D4 | **Typography change** → Big Shoulders Display + IBM Plex Sans + IBM Plex Mono + Caveat | Current DM Sans / JetBrains Mono is the generic "developer default"; new stack is grounded in industrial drafting + engineering docs + a pencil hand. **Biggest departure** from shipped tokens. | ⬜ pending |
| D5 | **Drawn glyph icons** replace emoji (⛓️ 🎬 01/02/03) | Emoji-as-icon breaks the identity and the a11y floor. | ⬜ pending |
| D6 | Self-drawing schematic hero replaces gradient-text hero | Shows the product working; distinctive vs. the template hero. | ⬜ pending |

## 5. Location decision (why files live in `web/`)

`web/` **is** the git repo root (remote `InteractLabV2`). The `InteractLab`
parent folder is *not* under version control. So every durable artifact that
must reach GitHub goes **inside `web/`** — design materials live in
`web/design/`. (The global "put artifacts in `./artifacts/`" rule assumes repo
root = working dir, which is false here; following it literally would orphan the
file outside git.) See memory `git-repo-root-is-web`.

## 6. Next steps — Phase 1 (foundations), *after sign-off*

1. Port tokens + fonts into `web/app/globals.css` + `app/layout.tsx` behind the
   existing dark-mode structure; add graph-paper background utility.
2. Shared kit: title-block header, drawn topic-card glyphs, redesigned
   `StepTransport`, analogy field-note, code block, states.
3. Prove it in production on **Home + Linked Lists**; review on device.
4. Roll the ink-swap across Bitwise / Recursion / Sorting / Walkthroughs; build
   Stacks & Queues natively. Then P2/P3 upgrades; refresh `web/.claude/CLAUDE.md`.

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
| | | *(your revisions go here)* | |
