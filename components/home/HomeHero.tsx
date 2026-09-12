"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";

// Node geometry for the schematic (viewBox 0 0 720 236).
const NODES = [
  { x: 30, v: "12" },
  { x: 198, v: "99" },
  { x: 366, v: "37" },
  { x: 534, v: "5" },
];
const NODE_W = 118;
const NODE_H = 60;
const Y = 96;
const MID = Y + NODE_H / 2; // 126
const NONE_CX = 688;

// Staggered draw timings (seconds): nodes settle, then arrows draw between them.
const NODE_DELAY = [0.05, 0.32, 0.59, 0.86];
const ARROW_DELAY = [0.3, 0.57, 0.84, 1.05];

/**
 * The home hero (D6): the product's own subject — a linked list — drawing itself
 * on the blueprint. The wrapper always carries `.js` (its final-frame is hidden);
 * a mount effect adds `.built` on the next frame to trigger the staggered CSS
 * transitions (per-element `transition-delay`; arrows use `pathLength=1` +
 * `stroke-dashoffset`). `useReducedMotion` jumps straight to the built frame, and
 * the global reduced-motion rule neutralises the transitions as a backstop.
 */
export function HomeHero() {
  const reduce = useReducedMotion();
  const figRef = useRef<HTMLDivElement>(null);

  const build = useCallback(() => {
    const el = figRef.current;
    if (!el) return;
    if (reduce) {
      el.classList.add("built");
      return;
    }
    // Restart the transitions: drop .built, force a reflow, re-add next frame.
    el.classList.remove("built");
    void el.offsetWidth;
    requestAnimationFrame(() => el.classList.add("built"));
  }, [reduce]);

  useEffect(() => {
    build();
  }, [build]);

  return (
    <section className="home-hero">
      <div className="home-hero-inner">
        <p className="home-eyebrow">
          <span aria-hidden="true">✎</span> Interactive learning
        </p>
        <h1>
          See algorithms <em>work</em>, not just read about them
        </h1>
        <p className="home-lead">
          Live, step-through visualizers that draw how a data structure changes
          state — and why it behaves the way it does.
        </p>
        <div className="home-cta-row">
          <Link className="btn btn-primary" href="/linked-lists/">
            Try the Linked Lists visualizer
          </Link>
          <Link className="btn btn-ghost" href="/topics/">
            Open a topic →
          </Link>
        </div>
      </div>

      <figure className="hero-figure">
        <div ref={figRef} className="svg-wrap js">
          <svg
            className="schem"
            viewBox="0 0 720 236"
            role="img"
            aria-label="A linked list of 12, 99, 37 and 5 pointing to None, with a head pointer and hand-drawn notes."
          >
            <defs>
              <marker
                id="ah"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L10 5 L0 10 z" fill="var(--blueprint)" />
              </marker>
            </defs>

            {/* head pointer — fades in like a pencilled note */}
            <g className="note-g" style={{ transitionDelay: "0.1s" }}>
              <rect className="s-pill" x="40" y="40" width="60" height="26" rx="13" />
              <text className="s-pill-t" x="70" y="57" textAnchor="middle">
                head
              </text>
              <path className="s-tick" d="M70 66 L70 94" />
            </g>

            {/* pointer arrows: node → node → … → None */}
            {NODES.map((n, i) => {
              const from = n.x + NODE_W;
              const to = i < NODES.length - 1 ? NODES[i + 1].x - 2 : NONE_CX - 19;
              return (
                <path
                  key={`a${i}`}
                  className="arrow s-arrow"
                  d={`M${from} ${MID} L${to} ${MID}`}
                  pathLength={1}
                  markerEnd="url(#ah)"
                  style={{ transitionDelay: `${ARROW_DELAY[i]}s` }}
                />
              );
            })}

            {/* None terminator (static destination) */}
            <circle className="s-none" cx={NONE_CX} cy={MID} r="17" />
            <text
              x={NONE_CX}
              y={MID + 6}
              textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize="18"
              fill="var(--graphite)"
            >
              ∅
            </text>

            {/* nodes (value cell | pointer cell) */}
            {NODES.map((n, i) => (
              <g key={`n${i}`} className="node" style={{ transitionDelay: `${NODE_DELAY[i]}s` }}>
                <rect className="s-face" x={n.x} y={Y} width={NODE_W} height={NODE_H} rx="8" />
                <line className="s-slot" x1={n.x + 80} y1={Y} x2={n.x + 80} y2={Y + NODE_H} />
                <text className="s-val" x={n.x + 40} y={MID + 8} textAnchor="middle">
                  {n.v}
                </text>
                <circle cx={n.x + 99} cy={MID} r="3.5" fill="var(--blueprint)" />
              </g>
            ))}

            {/* hand-drawn annotations */}
            <g className="note-g" style={{ transitionDelay: "1.2s" }}>
              <text className="s-note" x="150" y="210">
                each node points to the next →
              </text>
              <path className="s-note-l" d="M196 198 C230 180 300 168 336 140" />
            </g>
            <g className="note-g" style={{ transitionDelay: "1.35s" }}>
              <text className="s-note" x="548" y="62">
                end of the chain
              </text>
              <path className="s-note-l" d="M632 74 C660 86 674 96 684 108" />
            </g>
          </svg>
        </div>
        <figcaption className="hero-cap">
          <button type="button" className="hero-replay" onClick={build}>
            ▸ replay
          </button>
        </figcaption>
      </figure>
    </section>
  );
}
