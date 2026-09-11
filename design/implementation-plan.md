# Warmed Blueprint — Implementation Plan (master)

> Durable, in-git copy of the approved implementation plan. The authoritative
> design spec is [`ui-ux-design-system.html`](./ui-ux-design-system.html) (Rev A);
> the decision history is [`ui-redesign-log.md`](./ui-redesign-log.md). Each phase
> has its own plan + progress log under [`phases/`](./phases/).

## Context

The **Warmed Blueprint** redesign is fully designed but not yet built into the live
Next.js app. The app still ships the old warm-stone tokens (`--bg/--text/--teal…`) in
`app/globals.css`, DM Sans / JetBrains Mono fonts, emoji topic icons, a gradient-text
hero, and **three separate step-player engines with five duplicated transport UIs**. This
plan ports the spec into `web/` faithfully, **one phase at a time**, each phase producing
its own plan + progress-log markdown and **pausing for review before the next begins**.

## Non-negotiables carried forward

Client-only **static export** · analogy-before-abstraction · **no week numbers** · **no
auto-grading** · pure tested logic in `lib/` → SVG components → scoped CSS · fonts only via
**`next/font`** · WCAG 2.1 AA · `prefers-reduced-motion` respected · Server Components by
default, `"use client"` only at interactive leaves.

## Process & artifacts (every phase)

- **This master plan** — durable, in git.
- **Per phase, two files** under `design/phases/`:
  - `phase-N-<name>.md` — the plan/checklist (scope, exact deltas, gates).
  - `phase-N-<name>-progress.md` — append-only progress log (dated entries).
- **Master decision log** — `ui-redesign-log.md`; flip D1/D3/D4/D5/D6 to ✅ on approval, D2 at Phase 4.
- **Cadence** — finish a phase → update logs → run gates → **pause for review**.
- **Commits** — atomic, local, per phase. **Pushing is user-gated.**

## Quality gates (end of every phase)

| Gate | Command / check |
|---|---|
| Tests | `pnpm test` (`vitest run`) — stays green (106 tests, all under `lib/**`). |
| Build (CI gate) | `pnpm build` — type-check + static export, zero errors. |
| Keyboard | Any changed transport: Space / ← → / Home End / R; visible `:focus-visible`. |
| Screen reader | `aria-live="polite"` step caption; SVGs `role="img"` + `aria-label`. |
| Motion | `prefers-reduced-motion` jumps to final frame. |
| Theme | Light/Dark/system correct; no flash; toggle persists (`il-theme`). |
| Responsive | ~400px: one column, no horizontal body scroll. |

## Phases

1. **Foundations** — blueprint tokens + back-compat aliases, three-state theme, graph-paper
   body, drafting fonts via `next/font`, no-flash theme script. Files: `app/globals.css`,
   `app/layout.tsx`. → [`phases/phase-1-foundations.md`](./phases/phase-1-foundations.md)
2. **Shared kit** — title-block header + theme toggle; ONE unified `StepEngine` +
   ONE `StepTransport` (Step X/Y + scrubber + keyboard + aria-live); extended `CodeBlock`;
   drawn glyphs; analogy field-note; states/skeleton.
3. **Home + Linked Lists** — self-drawing schematic hero; drawn topic-card glyphs; re-skin
   Linked Lists; migrate LL onto the shared kit; delete `useStepPlayer` + old transport.
   Review on device before Phase 4.
4. **Roll out** — ink-swap + migrate Recursion / Sorting / Walkthroughs / Bitwise onto the
   shared kit (delete `useStepper`, `useWalkPlayer`, `WalkTransport`); build Stacks & Queues
   natively (D2 rose); P2/P3 UX upgrades; remove token aliases; refresh `web/.claude/CLAUDE.md`.

## Key existing code to reuse

- `components/layout/Reveal.tsx` — scroll reveal wrapper.
- `components/shared/CodeBlock.tsx` — server-side Python tokenizer (extend).
- `components/shared/useStepper.ts` — closest to the target engine; `StepEngine` generalises it.
- Scoped-CSS-per-route + `--accent` pattern in each tool's CSS.
- `next.config.ts` static-export config (unchanged).

## Risks & notes

- **Engine unification** touches every interactive demo, but is contained per phase and is
  **test-safe** (tests are `lib/`-only). Sharing only the transport UI is rejected (leaves 3 engines).
- **Token aliasing** keeps each phase shippable; aliases removed in P4.
- **Fonts** — all four families exist on Google Fonts.
