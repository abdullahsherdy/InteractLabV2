# InteractLab

Interactive programming tutorials built with Next.js App Router, React and TypeScript. The production site is a static export.

## Local development

Use Node.js and the package manager pinned in `package.json`. Install dependencies with `pnpm install`, then run `pnpm dev`. Run `pnpm build` to generate `out/`. The existing `next/font` Google Fonts configuration needs network access on a cold build. Existing GitHub Pages base-path handling is preserved.

## Pointer lessons

`/pointers/` introduces the nine-level C++17 learning path. `/pointers/<level-slug>/` provides a lesson playlist, reversible memory diagrams, prediction pauses, trace/debug/drawing questions, and optional browser speech. Reviewed lessons are stored only in the browser; speech and storage are optional.

- `lib/pointers/lessons/level0.ts` through `level8.ts`: authored curriculum data.
- `lib/pointers/authoring.ts`: lesson and memory-cell authoring helpers.
- `lib/pointers/types.ts` and `engine.ts`: typed operations, replay, lifetime states, reachability, and prediction boundaries.
- `components/pointers/`: the client player, memory board and local review indicator. Routes remain Server Components; these leaves require browser interaction and state.
- `pointers.md`: curriculum and teaching rules, including assumptions and syllabus references.

Add lessons as data; do not add a separate player per lesson. Addresses and physical layout are illustrative. More complex algorithms identify fixed-input traces explicitly and state their assumptions. Faulty undefined-behavior lines are discussed without executing them or claiming a fixed output.

## Checks

Run `pnpm test` and `pnpm exec tsc --noEmit`. The default JavaScript suite does not require a C++ compiler.

Before publishing changed C++ lessons, compile and run all examples:

```powershell
$env:VERIFY_POINTER_CPP = '1'
pnpm test -- lib/pointers/verifyExamples.test.ts
```

This invokes `g++ -std=c++17`, checks expected output and nameable live scalar states, and removes temporary compiler artifacts. Put the compiler on PATH or set `CXX` to its executable. The deliberate leak demonstration allocates one unreleased integer; undefined behavior is never executed.

For the optional production browser check, serve `out/` with a static server and run:

```powershell
$env:POINTERS_URL = 'http://127.0.0.1:4173'
node scripts/check-pointers.cjs
```

Install Playwright and its Chromium browser in your development environment first, or set `PLAYWRIGHT_MODULE` to an existing installation. This tool is not a site runtime dependency. The check covers every pointer lesson, prediction gating, replay, keyboard stepping, autoplay, local progress, both themes, and 360px/desktop overflow. It saves screenshots to `scratchpad/`. To include axe WCAG 2.1 AA scans, provide an external `@axe-core/playwright` installation through `AXE_PLAYWRIGHT_MODULE`. It also checks behavior when storage and speech are unavailable.

The inherited `lint` script uses `next lint`; this repository currently has no ESLint configuration or ESLint dependency. Production build/type checking and the test suite are available; configuring a separate lint/accessibility CI stack is outside this module integration.
