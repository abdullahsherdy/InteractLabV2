# Phase 1 — Progress log

> Append-only. Newest entry at the bottom. Plan:
> [`phase-1-foundations.md`](./phase-1-foundations.md).

---

### 2026-09-11 — Phase 1 opened

- Re-read source-of-truth before editing (post-compaction discipline): spec tokens
  (`ui-ux-design-system.html` L12–63), graph-paper body (L68–81), current
  `app/globals.css` (559 L), `app/layout.tsx`, `package.json`.
- Confirmed gate commands: `pnpm build` (CI gate) and `pnpm test` → `vitest run`.
- Created durable master plan (`design/implementation-plan.md`) + this phase's plan/log pair.
- Decision confirmed: **back-compat alias** strategy (not a big-bang token rename) so every
  shipped page keeps rendering; aliases removed in Phase 4. Most accents map 1:1 to inks
  (`--teal`==`--ink-bit`==#0d9488, etc.), so the alias bridge is near-lossless.
- Decision: no-flash theme script placed as first child of `<body>` (App Router has no
  reliable raw-`<head>` slot in the root layout; first-in-body runs pre-paint since `<html>`
  is parsed first) — functionally equivalent to the spec's `<head>` script for anti-FOUC.
- Decision: added `color-scheme` (light/dark) to the token blocks — improves native
  control/scrollbar theming in dark mode; not in the original spec but consistent with it.

---

### 2026-09-11 — Phase 1 completed (gates green, paused for review)

**Fonts — reconciled to Google's consolidated superfamily.** The spec named the display
face *"Big Shoulders Display"*, but Google merged the Big Shoulders superfamily; that name
no longer exists in `next/font`'s catalog. First `pnpm build` failed hard:
`` `next/font` error: Unknown font `Big Shoulders Display` `` → webpack errors. Verified the
valid family against `next/dist/compiled/@next/font/.../google/font-data.json`: the family is
**`Big Shoulders`** (opsz axis 10–72, wght 100–900 + variable). Fix applied in `layout.tsx`:

- `Big_Shoulders_Display` → `Big_Shoulders`.
- Loaded **opsz-variable** (`axes:["opsz"]`, no fixed `weight`) instead of static 500/700, so
  the browser's default `font-optical-sizing:auto` gives large headings the tall *display*
  optical cut and smaller uses stay legible — a faithful reproduction of the old "Display" face
  from the single consolidated family, and self-adjusting per heading size.
- `adjustFontFallback:false` — `next/font` has no CLS-fallback metrics keyed under the new
  "Big Shoulders" name (predates the rename), so the size-adjust fallback can't be synthesised
  regardless. Opting out is behaviour-neutral and silences the two
  `Failed to find font override values` warnings → fully clean build.
- Updated the `:root` `--display` CSS fallback string `"Big Shoulders Display"` → `"Big Shoulders"`.

Other three families validated against the same catalog before editing (avoid a second failed
build): Caveat 400–700, IBM Plex Sans 100–700, IBM Plex Mono 100–700 — all requested weights valid.

**Build-trace ENOENT (root-caused, not a code bug).** After the font fix, `pnpm build` compiled
+ generated all 11 pages but exited 1 with
`ENOENT … .next\server\app\_not-found\page.js.nft.json` during *Collecting build traces*.
Hypotheses ranked: (1) stale `.next` from the prior failed webpack build, (2) known Next 15 +
`output:export` + Windows trace bug, (3) the font change. Tested the cheapest first — `rm -rf .next`
then rebuild — and it **exited clean**. Root cause: the earlier webpack failure left `.next` partially
written, so the file-trace step couldn't find an artifact a clean build regenerates. No source change
needed for it.

**Gate results.**

- `pnpm build` — ✅ clean. Static export, `Exporting (2/2)`, 11 routes, **zero warnings/errors**
  (grep-verified). First Load JS: shared 102 kB; home 146 kB; linked-lists 151 kB.
- `pnpm test` — ✅ **106/106** across 10 `lib/**` suites. No logic touched; no regression.
- Theme: no `il-theme` is written until the Phase-2 toggle, so the no-flash script no-ops and CSS
  `prefers-color-scheme` drives light/dark — inherently flash-free. Deferred a live device pass to
  the Phase-3 on-device review.

**Files touched:** `app/globals.css` (tokens + aliases + 3-state theme + graph-paper body + a11y +
reduced-motion), `app/layout.tsx` (four `next/font` families, no-flash script, font-var body class).

**Logs updated:** flipped D1/D3/D4/D5/D6 → ✅ in `ui-redesign-log.md` (D2 deferred to Phase 4);
appended the Phase-1 revision-log row; corrected the D4 font-name record.

**Status:** Phase 1 complete, committed locally (not pushed — push is user-gated). **Paused for
review before Phase 2** per the approved cadence.
