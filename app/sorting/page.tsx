import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/layout/Reveal";
import { Analogy } from "@/components/shared/Analogy";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { SlowSortViz } from "@/components/sorting/SlowSortViz";
import { FastSortViz } from "@/components/sorting/FastSortViz";
import { CompareChart } from "@/components/sorting/CompareChart";
import { KeyDemo } from "@/components/sorting/KeyDemo";
import { PropertiesTable } from "@/components/sorting/PropertiesTable";
import { BUILTIN_CODE, WHY_LEARN, DECISIONS } from "@/lib/sorting/content";

import "./sorting.css";

export const metadata: Metadata = {
  title: "Sorting Algorithms — InteractLab",
  description:
    "Sorting made visual: step through bubble, selection and insertion sort bar by bar, replay merge and quick sort's recursion, compare growth rates live, and see why stable, in-place and adaptive matter.",
};

// Draw the whole page in the Sorting ink; the shared kit (crumb, tags, plate
// caption, field-note, transport, code highlight) all read var(--accent).
const heroStyle = { "--accent": "var(--ink-sort)" } as CSSProperties;
const mainStyle = {
  "--accent": "var(--ink-sort)",
  maxWidth: "var(--content-wide)",
  paddingTop: 28,
  display: "flex",
  flexDirection: "column",
  gap: "clamp(28px, 5vw, 48px)",
} as CSSProperties;

export default function SortingPage() {
  return (
    <>
      <section className="tutorial-hero" style={heroStyle}>
        <Reveal>
          <p className="crumb">
            <Link href="/">InteractLab</Link>
            <span aria-hidden="true">/</span>
            <b>Sorting Algorithms</b>
          </p>
          <h1>Sorting Algorithms — tidying a bookshelf, strategy by strategy</h1>
          <p className="hero-desc">
            Sorting is tidying a messy bookshelf, and there's more than one way to
            do it. You can swap neighbouring books over and over, always grab the
            shortest one next, or split the shelf in half and merge the piles back
            in order. Each strategy is a sorting algorithm — step through them one
            move at a time and watch how they differ.
          </p>
          <div className="hero-tags">
            <a className="tag accent" href="#fig1">bubble · selection · insertion</a>
            <a className="tag accent" href="#fig2">merge &amp; quick sort</a>
            <a className="tag accent" href="#fig3">O(n²) vs O(n log n)</a>
            <a className="tag accent" href="#fig5">stable · in-place · adaptive</a>
          </div>
        </Reveal>
      </section>

      <main className="tutorial-main" style={mainStyle}>
        {/* Module 1 — the simple sorts */}
        <Reveal>
          <section className="plate" id="fig1">
            <div className="plate-cap">
              <span className="plate-no">Module 1</span>
              <span className="plate-t">Compare, swap, repeat — the O(n²) sorts</span>
            </div>
            <div className="plate-b">
              <Analogy icon="books">
                <strong>Tidying by hand:</strong> the three simplest sorts each
                tidy the shelf a different way — bubble swaps neighbours, selection
                hunts for the smallest, insertion slides each book back into a
                growing tidy pile. All three are easy to follow and all three are
                slow on big shelves.
              </Analogy>
              <SlowSortViz />
            </div>
          </section>
        </Reveal>

        {/* Module 2 — divide and conquer */}
        <Reveal>
          <section className="plate" id="fig2">
            <div className="plate-cap">
              <span className="plate-no">Module 2</span>
              <span className="plate-t">Split the shelf — the O(n log n) sorts</span>
            </div>
            <div className="plate-b">
              <Analogy icon="scissors">
                <strong>Split the pile:</strong> instead of one long shelf, cut it
                in half again and again until every piece is trivially sorted, then
                merge the pieces back in order. Doing less comparing overall is what
                makes merge and quick sort so much faster on big inputs.
              </Analogy>
              <FastSortViz />
            </div>
          </section>
        </Reveal>

        {/* Module 3 — how fast do they grow? */}
        <Reveal>
          <section className="plate" id="fig3">
            <div className="plate-cap">
              <span className="plate-no">Module 3</span>
              <span className="plate-t">O(n²) vs O(n log n), side by side</span>
            </div>
            <div className="plate-b">
              <Analogy icon="growth-curve">
                <strong>Big-O is the shape of the curve.</strong> On a tiny shelf
                every sort feels instant. The difference only shows up as the shelf
                grows — drag n and watch the slow sorts pull away.
              </Analogy>
              <CompareChart />
            </div>
          </section>
        </Reveal>

        {/* Module 4 — sorting by a key */}
        <Reveal>
          <section className="plate" id="fig4">
            <div className="plate-cap">
              <span className="plate-no">Module 4</span>
              <span className="plate-t">Sort by anything, not just size</span>
            </div>
            <div className="plate-b">
              <Analogy icon="key">
                <strong>You choose the rule.</strong> Real sorting is rarely
                "smallest number first". Python's <code>sorted(key=...)</code> lets
                you sort by length, by last letter, by grade, or by several keys at
                once — same data, different rule.
              </Analogy>
              <KeyDemo />

              <div className="sort-builtin">
                <p className="sort-builtin-label">In real code, you don't write the sort yourself</p>
                <CodeBlock code={BUILTIN_CODE} />
              </div>
            </div>
          </section>
        </Reveal>

        {/* Module 5 — the vocabulary */}
        <Reveal>
          <section className="plate" id="fig5">
            <div className="plate-cap">
              <span className="plate-no">Module 5</span>
              <span className="plate-t">Stable, in-place, adaptive — and the full comparison</span>
            </div>
            <div className="plate-b">
              <Analogy icon="tag">
                <strong>Three words describe every sort.</strong> Does it keep equal
                items in order (stable)? Does it avoid making a second copy
                (in-place)? Does it speed up on nearly-tidy shelves (adaptive)? Tap
                any row for the plain-English why.
              </Analogy>
              <PropertiesTable />
            </div>
          </section>
        </Reveal>

        {/* Module 6 — why bother learning these? */}
        <Reveal>
          <section className="plate" id="fig6">
            <div className="plate-cap">
              <span className="plate-no">Module 6</span>
              <span className="plate-t">Python already has <code>sorted()</code> — so why?</span>
            </div>
            <div className="plate-b">
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
            </div>
          </section>
        </Reveal>

        {/* Where this connects — closing field-note. */}
        <Reveal>
          <Analogy title="Where this connects" icon="connect">
            <strong>Looking forward:</strong> merge and quick sort are recursion
            with a base case — the same nesting-dolls idea. And "which sort?" is
            always a Big-O decision, the same trade-off you make every time you
            choose a data structure.
          </Analogy>
        </Reveal>
      </main>
    </>
  );
}
