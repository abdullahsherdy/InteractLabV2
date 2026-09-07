import type { Metadata } from "next";
import { Reveal } from "@/components/layout/Reveal";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { CallStackViz } from "@/components/recursion/CallStackViz";
import { FibTreeViz } from "@/components/recursion/FibTreeViz";
import { BigOChart } from "@/components/recursion/BigOChart";
import { AnnotateCards } from "@/components/recursion/AnnotateCards";
import { SixStepMethod } from "@/components/recursion/SixStepMethod";
import { CODE } from "@/lib/recursion/content";
import "./recursion.css";

export const metadata: Metadata = {
  title: "Recursion & Big-O — InteractLab",
  description:
    "Recursion and Big-O made visual: step through the call stack frame by frame, watch a Fibonacci tree explode, compare growth rates live, and learn a 6-step method for any problem.",
};

export default function RecursionPage() {
  return (
    <>
      <section className="tutorial-hero">
        <Reveal>
          <p className="breadcrumb">InteractLab / Recursion &amp; Big-O</p>
          <h1>Recursion &amp; Big-O — nesting dolls and how fast code grows</h1>
          <p className="hero-desc">
            Recursion is like a set of Russian nesting dolls: a function that
            keeps opening a smaller copy of itself until it reaches the tiniest
            doll — the base case — then closes them all back up. Big-O is how we
            measure whether an idea stays fast or falls apart when the input gets
            big. Step through both, one frame at a time.
          </p>
          <div className="hero-tags">
            <span className="hero-tag">base &amp; recursive case</span>
            <span className="hero-tag">the call stack</span>
            <span className="hero-tag">Fibonacci tree</span>
            <span className="hero-tag">Big-O growth</span>
          </div>
        </Reveal>
      </section>

      <main className="tutorial-main" style={{ maxWidth: "var(--content-wide)", paddingTop: 28 }}>
        <Reveal className="rec-block">
          <div className="rec-block-head">
            <p className="rec-kicker">Module 1 · The idea</p>
            <h2>Every recursion needs two things</h2>
            <p className="rec-analogy">
              🪆 <span><strong>Nesting dolls:</strong> a recursive function calls a
              smaller copy of itself. Two rules keep it from going forever — a{" "}
              <strong>base case</strong> that stops (the smallest doll) and a{" "}
              <strong>recursive case</strong> that always moves toward it.</span>
            </p>
          </div>

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
        </Reveal>

        <Reveal className="rec-block">
          <div className="rec-block-head">
            <p className="rec-kicker">Module 2 · The call stack</p>
            <h2>Watch the calls pile up and unwind</h2>
            <p className="rec-analogy">
              🥞 <span><strong>A stack of plates:</strong> each call is placed on top and
              has to wait for the one above it to finish before it can return.
              Python reaches the base case at the top, then works back down,
              carrying each answer to the call below.</span>
            </p>
          </div>
          <CallStackViz />
        </Reveal>

        <Reveal className="rec-block">
          <div className="rec-block-head">
            <p className="rec-kicker">Module 3 · When recursion explodes</p>
            <h2>The Fibonacci tree — the same work, over and over</h2>
            <p className="rec-analogy">
              🌳 <span><strong>A branching tree:</strong> naive <code>fib(n)</code> makes
              two calls each time, and those make two more. The same small
              answers get recomputed again and again — that repeated work is why
              it becomes so slow so fast.</span>
            </p>
          </div>
          <FibTreeViz />
        </Reveal>

        <Reveal className="rec-block">
          <div className="rec-block-head">
            <p className="rec-kicker">Module 4 · Big-O</p>
            <h2>How fast does the work grow?</h2>
            <p className="rec-analogy">
              📈 <span><strong>Big-O is the shape of the curve,</strong> not the exact
              time. It answers one question: when the input doubles, does the
              work stay flat, double, or explode? Drag n and compare.</span>
            </p>
          </div>
          <BigOChart />
        </Reveal>

        <Reveal className="rec-block">
          <div className="rec-block-head">
            <p className="rec-kicker">Module 4 · Practice</p>
            <h2>Guess the Big-O</h2>
            <p className="rec-analogy">
              🔍 <span><strong>Count the loops:</strong> no loop is O(1), one loop over
              the input is O(n), a loop inside a loop is O(n²). Read each snippet,
              make your guess, then reveal the answer.</span>
            </p>
          </div>
          <AnnotateCards />
        </Reveal>

        <Reveal className="rec-block">
          <div className="rec-block-head">
            <p className="rec-kicker">Module 5 · A method that always works</p>
            <h2>Six steps for any problem</h2>
            <p className="rec-analogy">
              🧭 <span><strong>Don't code first.</strong> When a problem feels
              overwhelming, follow the same six steps every time. Coding is step
              five — by then you already know it will work.</span>
            </p>
          </div>
          <SixStepMethod />

          <div className="rec-worked">
            <p className="rec-worked-label">Worked example — brute force vs. optimised</p>
            <CodeBlock code={CODE.bruteVsFast} />
          </div>
        </Reveal>

        <Reveal className="rec-block">
          <div className="rec-block-head">
            <h2>Where this connects</h2>
            <p className="rec-analogy">
              🔗 <span><strong>Looking forward:</strong> trees, graphs, merge sort, and
              divide-and-conquer are all recursion with a base case. And every
              data-structure choice you make later is really a Big-O decision —
              "should this be a list or a dict?" is "O(n) or O(1)?".</span>
            </p>
          </div>
        </Reveal>
      </main>
    </>
  );
}
