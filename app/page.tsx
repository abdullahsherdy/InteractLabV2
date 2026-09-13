import type { CSSProperties } from "react";
import Link from "next/link";
import { Reveal } from "@/components/layout/Reveal";
import { HomeHero } from "@/components/home/HomeHero";
import { Glyph, type GlyphName } from "@/components/shared/Glyph";

interface TopicCard {
  href: string;
  glyph: GlyphName;
  /** per-tool accent ink token */
  ink: string;
  title: string;
  desc: string;
  meta: string[];
  arrow: string;
}

const CARDS: TopicCard[] = [
  {
    href: "/walkthroughs/",
    glyph: "walkthrough",
    ink: "var(--ink-walk)",
    title: "Problem Walkthroughs",
    desc: "Whiteboard-style animated solutions to classic problems. Watch the array, pointers, and pseudocode move together, one narrated step at a time.",
    meta: ["step-by-step", "synced code", "narrated"],
    arrow: "Watch walkthroughs →",
  },
  {
    href: "/linked-lists/",
    glyph: "linked-list",
    ink: "var(--ink-ll)",
    title: "Linked Lists",
    desc: "Animated node chains: build, insert, delete, break the chain on purpose, race the tortoise and hare, and drive a playlist.",
    meta: ["nodes & pointers", "doubly linked", "Floyd's cycle"],
    arrow: "Open visualizer →",
  },
  {
    href: "/bitwise/",
    glyph: "bitwise",
    ink: "var(--ink-bit)",
    title: "Bitwise & Number Systems",
    desc: "A byte as 8 light switches: flip bits, watch decimal→binary conversion animate, and compare bytes in a live AND/OR/XOR/shift playground.",
    meta: ["place value", "decimal → binary", "bitwise ops"],
    arrow: "Open visualizer →",
  },
  {
    href: "/recursion/",
    glyph: "recursion",
    ink: "var(--ink-rec)",
    title: "Recursion & Big-O",
    desc: "Step through the call stack frame by frame, watch a Fibonacci tree explode with repeated work, compare Big-O growth live, and learn a 6-step method for any problem.",
    meta: ["call stack", "Fibonacci tree", "Big-O"],
    arrow: "Open visualizer →",
  },
  {
    href: "/sorting/",
    glyph: "sorting",
    ink: "var(--ink-sort)",
    title: "Sorting Algorithms",
    desc: "Step through bubble, selection and insertion bar by bar, replay merge and quick sort's recursion, compare growth rates live, and see why stable, in-place and adaptive matter.",
    meta: ["O(n²)", "O(n log n)", "sort by key"],
    arrow: "Open visualizer →",
  },
];

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <section id="tutorials" className="home-section">
        <Reveal>
          <div className="section-head">
            <h2>Topics</h2>
            <p>Interactive tutorials with live visualizers and runnable examples.</p>
          </div>
        </Reveal>
        <div className="cards">
          {CARDS.map((c, i) => (
            <Reveal key={c.href} delay={i * 0.06}>
              <Link className="tcard" href={c.href} style={{ "--accent": c.ink } as CSSProperties}>
                <span className="ic">
                  <Glyph name={c.glyph} size={26} />
                </span>
                <h5>{c.title}</h5>
                <p>{c.desc}</p>
                <div className="meta">
                  {c.meta.map((m) => (
                    <span key={m} className="tag">
                      {m}
                    </span>
                  ))}
                </div>
                <span className="arw">{c.arrow}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="home-section">
        <Reveal>
          <div className="section-head">
            <h2>How these lessons help</h2>
          </div>
        </Reveal>
        <div className="features-row">
          {[
            ["Step-by-step", "Advance one operation at a time to build clear mental models of algorithms."],
            ["Built-in examples", "Ready test cases and edge cases so you can practice without setup."],
            ["No setup", "Open in any browser—no account or install required."],
          ].map(([h, p], i) => (
            <Reveal key={h} delay={i * 0.08}>
              <div className="feature-box">
                <h4>{h}</h4>
                <p>{p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
