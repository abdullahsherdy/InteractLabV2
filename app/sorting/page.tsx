import type { Metadata } from "next";

import { Reveal } from "@/components/layout/Reveal";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { SlowSortViz } from "@/components/sorting/SlowSortViz";
import { FastSortViz } from "@/components/sorting/FastSortViz";
import { CompareChart } from "@/components/sorting/CompareChart";
import { KeyDemo } from "@/components/sorting/KeyDemo";
import { PropertiesTable } from "@/components/sorting/PropertiesTable";
import { BUILTIN_CODE, WHY_LEARN, DECISIONS } from "@/lib/sorting/content";

// The stylesheet is resolved by Next.js at build time but has no TypeScript declaration.
// @ts-expect-error CSS side-effect import
import "./sorting.css";

export const metadata: Metadata = {
  title: "Sorting Algorithms — InteractLab",
  description:
    "Sorting made visual: step through bubble, selection and insertion sort bar by bar, replay merge and quick sort's recursion, compare growth rates live, and see why stable, in-place and adaptive matter.",
};

export default function SortingPage() {
  return (
    <>
      <section className="tutorial-hero">
        <Reveal>
          <p className="breadcrumb">InteractLab / Sorting Algorithms</p>
          <h1>Sorting Algorithms — tidying a bookshelf, strategy by strategy</h1>
          <p className="hero-desc">
            Sorting is tidying a messy bookshelf, and there's more than one way to
            do it. You can swap neighbouring books over and over, always grab the
            shortest one next, or split the shelf in half and merge the piles back
            in order. Each strategy is a sorting algorithm — step through them one
            move at a time and watch how they differ.
          </p>
          <div className="hero-tags">
            <span className="hero-tag">bubble · selection · insertion</span>
            <span className="hero-tag">merge &amp; quick sort</span>
            <span className="hero-tag">O(n²) vs O(n log n)</span>
            <span className="hero-tag">stable · in-place · adaptive</span>
          </div>
        </Reveal>
      </section>

      <main className="tutorial-main" style={{ maxWidth: "var(--content-wide)", paddingTop: 28 }}>
        <Reveal className="sort-block">
          <div className="sort-block-head">
            <p className="sort-kicker">Module 1 · The simple sorts</p>
            <h2>Compare, swap, repeat — the O(n²) sorts</h2>
            <p className="sort-analogy">
              📚 <span><strong>Tidying by hand:</strong> the three simplest sorts each
              tidy the shelf a different way — bubble swaps neighbours, selection
              hunts for the smallest, insertion slides each book back into a growing
              tidy pile. All three are easy to follow and all three are slow on big
              shelves.</span>
            </p>
          </div>
          <SlowSortViz />
        </Reveal>

        <Reveal className="sort-block">
          <div className="sort-block-head">
            <p className="sort-kicker">Module 2 · Divide and conquer</p>
            <h2>Split the shelf — the O(n log n) sorts</h2>
            <p className="sort-analogy">
              ✂️ <span><strong>Split the pile:</strong> instead of one long shelf, cut it
              in half again and again until every piece is trivially sorted, then
              merge the pieces back in order. Doing less comparing overall is what
              makes merge and quick sort so much faster on big inputs.</span>
            </p>
          </div>
          <FastSortViz />
        </Reveal>

        <Reveal className="sort-block">
          <div className="sort-block-head">
            <p className="sort-kicker">Module 3 · How fast do they grow?</p>
            <h2>O(n²) vs O(n log n), side by side</h2>
            <p className="sort-analogy">
              📈 <span><strong>Big-O is the shape of the curve.</strong> On a tiny shelf
              every sort feels instant. The difference only shows up as the shelf
              grows — drag n and watch the slow sorts pull away.</span>
            </p>
          </div>
          <CompareChart />
        </Reveal>

        <Reveal className="sort-block">
          <div className="sort-block-head">
            <p className="sort-kicker">Module 4 · Sorting by a key</p>
            <h2>Sort by anything, not just size</h2>
            <p className="sort-analogy">
              🔑 <span><strong>You choose the rule.</strong> Real sorting is rarely
              "smallest number first". Python's <code>sorted(key=...)</code> lets you
              sort by length, by last letter, by grade, or by several keys at once —
              same data, different rule.</span>
            </p>
          </div>
          <KeyDemo />

          <div className="sort-builtin">
            <p className="sort-builtin-label">In real code, you don't write the sort yourself</p>
            <CodeBlock code={BUILTIN_CODE} />
          </div>
        </Reveal>

        <Reveal className="sort-block">
          <div className="sort-block-head">
            <p className="sort-kicker">Module 5 · The vocabulary</p>
            <h2>Stable, in-place, adaptive — and the full comparison</h2>
            <p className="sort-analogy">
              🏷️ <span><strong>Three words describe every sort.</strong> Does it keep equal
              items in order (stable)? Does it avoid making a second copy (in-place)?
              Does it speed up on nearly-tidy shelves (adaptive)? Tap any row for the
              plain-English why.</span>
            </p>
          </div>
          <PropertiesTable />
        </Reveal>

        <Reveal className="sort-block">
          <div className="sort-block-head">
            <p className="sort-kicker">Module 6 · Why bother learning these?</p>
            <h2>Python already has <code>sorted()</code> — so why?</h2>
          </div>
          <div className="sort-why-grid">
            {WHY_LEARN.map((w) => (
              <div key={w.title} className="sort-why">
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </div>
            ))}
          </div>

          <div className="sort-decide">
            <p className="sort-decide-label">Which sort should I reach for?</p>
            <table className="sort-decide-table">
              <thead>
                <tr>
                  <th>When…</th>
                  <th>Use</th>
                </tr>
              </thead>
              <tbody>
                {DECISIONS.map((d) => (
                  <tr key={d.when}>
                    <td>{d.when}</td>
                    <td>{d.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal className="sort-block">
          <div className="sort-block-head">
            <h2>Where this connects</h2>
            <p className="sort-analogy">
              🔗 <span><strong>Looking forward:</strong> merge and quick sort are recursion
              with a base case — the same nesting-dolls idea. And "which sort?" is
              always a Big-O decision, the same trade-off you make every time you
              choose a data structure.</span>
            </p>
          </div>
        </Reveal>
      </main>
    </>
  );
}
