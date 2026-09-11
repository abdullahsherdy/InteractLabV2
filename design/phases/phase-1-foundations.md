# Phase 1 — Foundations

> Tokens, fonts, graph-paper ground, and the three-state theme machinery. This is
> the visual foundation every later phase builds on. Progress log:
> [`phase-1-foundations-progress.md`](./phase-1-foundations-progress.md).

## Goal

Swap the warm-stone visual foundation for the **Warmed Blueprint** system **without
breaking any shipped page** — achieved by introducing the new tokens *plus* back-compat
aliases so existing components keep rendering until they're redesigned in Phases 2–4.

## Scope (files)

- `web/app/globals.css` — token system, three-state dark mode, graph-paper body, global a11y.
- `web/app/layout.tsx` — drafting fonts via `next/font/google`, no-flash theme script.

## Deltas

### 1. Token system (`globals.css :root`)
Replace the warm-stone `:root` with the exact blueprint tokens from the spec
(`ui-ux-design-system.html` lines 12–63): ground (`--paper/-2`, `--panel/-2`, `--ink`,
`--graphite`, `--faint`, `--line/-strong`, `--grid/-major`, `--blueprint/-bright`,
`--pencil`, `--node-face/-stroke`), seven per-tool inks (`--ink-home/walk/ll/bit/rec/sort/stack`),
`--accent:var(--ink-home)`, semantic (`--ok/--warn/--danger`), shadows (`sm/md/lift`),
radii (`--r-plate/card/control/pill`), motion (`--e-out`, `--d-fast/mid/draw`), type
fallbacks (`--sans/--mono/--display/--note`), and retained structural tokens
(`--header-h`, `--content-wide`, `--content-narrow`). Add `color-scheme: light`.

### 2. Back-compat aliases
Alias the old names to the new tokens so shipped components render unchanged; most accents
map 1:1 (`--teal → --ink-bit #0d9488`, `--purple → --ink-rec`, `--blue → --ink-walk`,
`--green → --ink-ll`). Variants with no blueprint equivalent (`--teal-dark`, the `*-light`
backgrounds, `--teal-glow`) keep their old literals. **Aliases are deleted in Phase 4.**

### 3. Three-state dark mode
- `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }` — system dark.
- `:root[data-theme="dark"] { … }` — explicit toggle wins on any OS.
Both carry the blueprint dark tokens + dark alias values + `color-scheme: dark`.

### 4. Graph-paper body + global a11y
Body: `--paper` ground + four stacked grid gradients (140px major / 28px minor),
`color:var(--ink)`, `font-family:var(--sans)`, `line-height:1.6`, antialiased. Add
`img,svg{max-width:100%}`, `a{color:var(--blueprint)}`, `::selection` (pencil), and a global
`:focus-visible` pencil outline (satisfies part of S-09 P1 "visible focus").

### 5. Fonts (`layout.tsx`)
Replace `DM_Sans`/`JetBrains_Mono` with `next/font/google`: `Big_Shoulders_Display`
(500,700 → `--display`), `IBM_Plex_Sans` (400,500,600 → `--sans`), `IBM_Plex_Mono`
(400,500 → `--mono`), `Caveat` (600 → `--note`). Body className carries all four variable
classes; globals aliases `--font-sans/--font-mono` bridge old references.

### 6. No-flash theme script (`layout.tsx`)
Inline pre-paint script (first child of `<body>`, `dangerouslySetInnerHTML`) reads
`il-theme` from `localStorage`; if `dark`/`light`, sets `data-theme` before paint; else
no-ops → OS `prefers-color-scheme` applies. Static-export-safe, no external resource.

### 7. Reduced motion
Extend the existing block with forward-compat resets for the draw classes
(`.js .node/.arrow/.note-g` → final frame) used by the Phase-3 hero.

## Gates

- `pnpm build` — zero errors, static export succeeds.
- `pnpm test` — 106 tests green (untouched; no logic changed).
- Visual: every shipped page still renders (home, topics, 5 tools, walkthroughs) via aliases.
- Fonts: the four families load; display/mono/note applied where referenced.
- Theme: system light + system dark correct with no flash (no `il-theme` is written until
  Phase 2, so the script no-ops and CSS `prefers-color-scheme` drives it — inherently flash-free).

## Known transitional notes

- The explicit Light/Dark **toggle** ships in Phase 2; until then `data-theme` is never set,
  so behaviour equals system `prefers-color-scheme` (plus the new blueprint look).
- Two shipped component rules (`.nav-link.active`, `.home-eyebrow`) use bare
  `@media (prefers-color-scheme: dark)`; in the rare "force light on a dark-OS machine" combo
  they'd mis-tint. Both elements are redesigned in Phase 2 (header) / Phase 3 (home), and the
  combo is unreachable until the Phase-2 toggle exists.

## Out of scope (later phases)

Header/nav redesign (P2), topic-card glyphs + hero (P3), transport/engine unification (P2–P4),
removing aliases (P4).
