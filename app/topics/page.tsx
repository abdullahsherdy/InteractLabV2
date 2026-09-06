import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/layout/Reveal";

export const metadata: Metadata = {
  title: "Topics — InteractLab",
  description:
    "Published topics on InteractLab — linked lists, bitwise ops, recursion & Big-O, and sorting algorithms.",
};

export default function TopicsPage() {
  return (
    <>
      <main className="home-hero" style={{ padding: "28px 18px" }}>
        <div className="home-hero-inner">
          <Reveal>
            <h1>Published topics</h1>
            <p className="home-lead">
              These are the interactive tutorials currently available.
            </p>
          </Reveal>
        </div>
      </main>

      <section className="home-section" style={{ padding: 18 }}>
        <div className="tutorial-grid">
          <Reveal>
            <Link className="tutorial-card" href="/walkthroughs/">
              <div className="card-icon blue" aria-hidden="true">🎬</div>
              <h3>Problem Walkthroughs</h3>
              <p>Whiteboard-style animated solutions with synced pseudocode and plain-English narration.</p>
            </Link>
          </Reveal>
          <Reveal delay={0.06}>
            <Link className="tutorial-card" href="/linked-lists/">
              <div className="card-icon green" aria-hidden="true">⛓️</div>
              <h3>Linked Lists</h3>
              <p>Node chains, doubly linked dance lines, and Floyd&apos;s tortoise &amp; hare — fully animated.</p>
            </Link>
          </Reveal>
          <Reveal delay={0.12}>
            <a className="tutorial-card" href="/bitwise-and-number-systems.html">
              <div className="card-icon teal" aria-hidden="true">01</div>
              <h3>Bitwise &amp; Number Systems</h3>
              <p>Binary, hex, conversion, and a hands-on bitwise playground.</p>
            </a>
          </Reveal>
          <Reveal delay={0.18}>
            <a className="tutorial-card" href="/recursion-and-big-o.html">
              <div className="card-icon purple" aria-hidden="true">02</div>
              <h3>Recursion &amp; Big-O</h3>
              <p>Call stack visualizers, Fibonacci trees, and Big-O intuition.</p>
            </a>
          </Reveal>
          <Reveal delay={0.24}>
            <a className="tutorial-card" href="/sorting-algorithms.html">
              <div className="card-icon amber" aria-hidden="true">03</div>
              <h3>Sorting Algorithms</h3>
              <p>Bubble, selection, insertion, merge, and quick sort visualizers.</p>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
