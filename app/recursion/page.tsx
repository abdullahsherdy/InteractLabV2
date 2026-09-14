import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/layout/Reveal";
import { Analogy } from "@/components/shared/Analogy";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { CallStackViz } from "@/components/recursion/CallStackViz";
import { FibTreeViz } from "@/components/recursion/FibTreeViz";
import { BigOChart } from "@/components/recursion/BigOChart";
import { AnnotateCards } from "@/components/recursion/AnnotateCards";
import { SixStepMethod } from "@/components/recursion/SixStepMethod";
import { CODE } from "@/lib/recursion/content";

// CSS is bundled by Next.js; TypeScript has no module declaration for side-effect CSS imports.
// @ts-ignore -- handled by the Next.js CSS loader
import "./recursion.css";

export const metadata: Metadata = {
  title: "Recursion & Big-O — InteractLab",
  description:
    "Recursion and Big-O made visual: step through the call stack frame by frame, watch a Fibonacci tree explode, compare growth rates live, and learn a 6-step method for any problem.",
};

// Draw the whole page in the Recursion ink; the shared kit (crumb, tags, plate
// caption, field-note, transport, code highlight) all read var(--accent).
const heroStyle = { "--accent": "var(--ink-rec)" } as CSSProperties;
const mainStyle = {
  "--accent": "var(--ink-rec)",
  maxWidth: "var(--content-wide)",
  paddingTop: 28,
  display: "flex",
  flexDirection: "column",
  gap: "clamp(28px, 5vw, 48px)",
} as CSSProperties;

export default function RecursionPage() {
  return (
    <>
      <section className="tutorial-hero" style={heroStyle}>
        <Reveal>
          <p className="crumb">
            <Link href="/">InteractLab</Link>
            <span aria-hidden="true">/</span>
            <b>Recursion &amp; Big-O</b>
          </p>
          <h1>Recursion &amp; Big-O — nesting dolls and how fast code grows</h1>
          <p className="hero-desc">
            Recursion is like a set of Russian nesting dolls: a function that
            keeps opening a smaller copy of itself until it reaches the tiniest
            doll — the base case — then closes them all back up. Big-O is how we
            measure whether an idea stays fast or falls apart when the input gets
            big. Step through both, one frame at a time.
          </p>
          <div className="hero-tags">
            <a className="tag accent" href="#fig1">base &amp; recursive case</a>
            <a className="tag accent" href="#fig2">the call stack</a>
            <a className="tag accent" href="#fig3">Fibonacci tree</a>
            <a className="tag accent" href="#fig4">Big-O growth</a>
          </div>
        </Reveal>
      </section>

      <main className="tutorial-main" style={mainStyle}>
        {/* Module 1 — the idea */}
        <Reveal>
          <section className="plate" id="fig1">
            <div className="plate-cap">
              <span className="plate-no">Module 1</span>
              <span className="plate-t">Every recursion needs two things</span>
            </div>
            <div className="plate-b">
              <Analogy icon="nesting-dolls">
                <strong>Nesting dolls:</strong> a recursive function calls a
                smaller copy of itself. Two rules keep it from going forever — a{" "}
                <strong>base case</strong> that stops (the smallest doll) and a{" "}
                <strong>recursive case</strong> that always moves toward it.
              </Analogy>

              <div className="rec-intro-cards">
                <div className="rec-intro-card rec-intro-base">
                  <span className="rec-intro-tag">Base case</span>
                  <p>The stop sign. Without it, the function calls itself forever and
                  Python crashes with <code>RecursionError</code>. Write this first.</p>
                </div>
                <div className="rec-intro-card rec-intro-rec">
                  <span className="rec-intro-tag">Recursive case</span>
                  <p>The step that shrinks the problem — <code>n - 1</code>, a shorter
                  string, a smaller list — so it always heads toward the base case.</p>
                </div>
              </div>

              <CodeBlock code={CODE.countdown} />
              <CodeBlock code={CODE.factorial} />
              <CodeBlock code={CODE.reverseSum} />
            </div>
          </section>
        </Reveal>

        {/* Module 2 — the call stack */}
        <Reveal>
          <section className="plate" id="fig2">
            <div className="plate-cap">
              <span className="plate-no">Module 2</span>
              <span className="plate-t">Watch the calls pile up and unwind</span>
            </div>
            <div className="plate-b">
              <Analogy icon="plates">
                <strong>A stack of plates:</strong> each call is placed on top and
                has to wait for the one above it to finish before it can return.
                Python reaches the base case at the top, then works back down,
                carrying each answer to the call below.
              </Analogy>
              <CallStackViz />
            </div>
          </section>
        </Reveal>

        {/* Module 3 — when recursion explodes */}
        <Reveal>
          <section className="plate" id="fig3">
            <div className="plate-cap">
              <span className="plate-no">Module 3</span>
              <span className="plate-t">The Fibonacci tree — the same work, over and over</span>
            </div>
            <div className="plate-b">
              <Analogy icon="tree">
                <strong>A branching tree:</strong> naive <code>fib(n)</code> makes
                two calls each time, and those make two more. The same small
                answers get recomputed again and again — that repeated work is why
                it becomes so slow so fast.
              </Analogy>
              <FibTreeViz />
            </div>
          </section>
        </Reveal>

        {/* Module 4 — Big-O */}
        <Reveal>
          <section className="plate" id="fig4">
            <div className="plate-cap">
              <span className="plate-no">Module 4</span>
              <span className="plate-t">How fast does the work grow?</span>
            </div>
            <div className="plate-b">
              <Analogy icon="growth-curve">
                <strong>Big-O is the shape of the curve,</strong> not the exact
                time. It answers one question: when the input doubles, does the
                work stay flat, double, or explode? Drag n and compare.
              </Analogy>
              <BigOChart />
            </div>
          </section>
        </Reveal>

        {/* Practice — guess the Big-O */}
        <Reveal>
          <section className="plate" id="fig5">
            <div className="plate-cap">
              <span className="plate-no">Practice</span>
              <span className="plate-t">Guess the Big-O</span>
            </div>
            <div className="plate-b">
              <Analogy icon="magnifier">
                <strong>Count the loops:</strong> no loop is O(1), one loop over
                the input is O(n), a loop inside a loop is O(n²). Read each snippet,
                make your guess, then reveal the answer.
              </Analogy>
              <AnnotateCards />
            </div>
          </section>
        </Reveal>

        {/* Module 5 — a method that always works */}
        <Reveal>
          <section className="plate" id="fig6">
            <div className="plate-cap">
              <span className="plate-no">Module 5</span>
              <span className="plate-t">Six steps for any problem</span>
            </div>
            <div className="plate-b">
              <Analogy icon="compass">
                <strong>Don't code first.</strong> When a problem feels
                overwhelming, follow the same six steps every time. Coding is step
                five — by then you already know it will work.
              </Analogy>
              <SixStepMethod />

              <div className="rec-worked">
                <p className="rec-worked-label">Worked example — brute force vs. optimised</p>
                <CodeBlock code={CODE.bruteVsFast} />
              </div>
            </div>
          </section>
        </Reveal>

        {/* Where this connects — closing field-note. */}
        <Reveal>
          <Analogy title="Where this connects" icon="connect">
            <strong>Looking forward:</strong> trees, graphs, merge sort, and
            divide-and-conquer are all recursion with a base case. And every
            data-structure choice you make later is really a Big-O decision —
            "should this be a list or a dict?" is "O(n) or O(1)?".
          </Analogy>
        </Reveal>
      </main>
    </>
  );
}
