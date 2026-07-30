import Link from "next/link";
import { Reveal } from "@/components/layout/Reveal";

const CARDS = [
  {
    href: "/linked-lists/",
    icon: "⛓️",
    iconClass: "green",
    title: "Linked Lists",
    desc: "Animated node chains: build, insert, delete, break the chain on purpose, race the tortoise and hare, and drive a playlist.",
    meta: ["nodes & pointers", "doubly linked", "Floyd's cycle", "animated"],
    arrow: "Open visualizer →",
  },
  {
    href: "/bitwise-and-number-systems.html",
    icon: "01",
    iconClass: "teal",
    title: "Bitwise & Number Systems",
    desc: "Binary and hexadecimal conversions plus a hands-on bitwise operators playground.",
    meta: ["number systems", "bitwise ops", "foundations"],
    arrow: "Open tutorial →",
    legacy: true,
  },
  {
    href: "/recursion-and-big-o.html",
    icon: "02",
    iconClass: "purple",
    title: "Recursion & Big-O",
    desc: "Call stack visualizers, Fibonacci trees, and Big-O charts to build recursion intuition.",
    meta: ["call stack", "complexity", "recursion"],
    arrow: "Open tutorial →",
    legacy: true,
  },
  {
    href: "/sorting-algorithms.html",
    icon: "03",
    iconClass: "amber",
    title: "Sorting Algorithms",
    desc: "Step-through visualizers for common sorting algorithms and runtime comparisons.",
    meta: ["O(n²)", "O(n log n)", "Python"],
    arrow: "Open tutorial →",
    legacy: true,
  },
  {
    href: "/revision-app/index.html",
    icon: "🐍",
    iconClass: "green",
    title: "Python Comprehensive Revision",
    desc: "13 topic reviews with runnable code examples, 10 multi-concept practice problems, and a full in-browser Python IDE.",
    meta: ["OOP", "recursion", "Big-O", "sorting", "Pyodide"],
    arrow: "Open revision app →",
    legacy: true,
  },
];

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-inner">
          <Reveal>
            <p className="home-eyebrow">Interactive learning</p>
            <h1>
              See algorithms <em>work</em>, not just read about them
            </h1>
            <p className="home-lead">
              Live, step-through visualizers that show how algorithms change
              state and why they behave the way they do.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="home-cta-row">
              <Link className="btn btn-primary" href="/linked-lists/">
                Try the Linked Lists visualizer
              </Link>
              <Link className="btn btn-ghost" href="/topics/">
                Open a topic →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="tutorials" className="home-section">
        <Reveal>
          <div className="section-head">
            <h2>Topics</h2>
            <p>Interactive tutorials with live visualizers and runnable examples.</p>
          </div>
        </Reveal>
        <div className="tutorial-grid">
          {CARDS.map((c, i) => (
            <Reveal key={c.href} delay={i * 0.06}>
              {c.legacy ? (
                <a className="tutorial-card" href={c.href}>
                  <CardBody card={c} />
                </a>
              ) : (
                <Link className="tutorial-card" href={c.href}>
                  <CardBody card={c} />
                </Link>
              )}
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

function CardBody({ card }: { card: (typeof CARDS)[number] }) {
  return (
    <>
      <div className={`card-icon ${card.iconClass}`} aria-hidden="true">
        {card.icon}
      </div>
      <h3>{card.title}</h3>
      <p>{card.desc}</p>
      <div className="card-meta">
        {card.meta.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <span className="card-arrow">{card.arrow}</span>
    </>
  );
}
