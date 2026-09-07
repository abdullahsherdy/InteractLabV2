"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  buildFibTree,
  clampFibN,
  fibColor,
  fibStats,
  layoutFibTree,
  walkFib,
} from "@/lib/recursion/fib-tree";

/**
 * Module 3 — the Fibonacci call tree. Naive fib(n) forks into two calls at
 * every step, so the same little sub-problems get solved again and again. The
 * tree makes that wasted work visible; the stats spell out how fast it blows up.
 */
export function FibTreeViz() {
  const [n, setN] = useState(5);

  const { layout, stats, edges } = useMemo(() => {
    const root = buildFibTree(n);
    const layout = layoutFibTree(root);
    const stats = fibStats(root);
    const pos = new Map(layout.placed.map((p) => [p.id, p]));
    const edges: { id: string; x1: number; y1: number; x2: number; y2: number }[] = [];
    walkFib(root, (nd) => {
      const from = pos.get(nd.id)!;
      for (const child of nd.children) {
        const to = pos.get(child.id)!;
        edges.push({ id: `${nd.id}-${child.id}`, x1: from.x, y1: from.y, x2: to.x, y2: to.y });
      }
    });
    return { layout, stats, edges };
  }, [n]);

  const naive2n = 2 ** n;

  return (
    <div className="rec-module">
      <div className="rec-toolbar">
        <label className="rec-field rec-field-grow">
          <span className="rec-field-label">fib(n), n = {n}</span>
          <input
            className="rec-slider"
            type="range"
            min={1}
            max={7}
            value={n}
            onChange={(e) => setN(clampFibN(Number(e.target.value)))}
            aria-label="n from 1 to 7"
          />
        </label>
      </div>

      <div className="rec-tree-wrap">
        <svg
          className="rec-tree"
          width={layout.width}
          height={layout.height}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          role="img"
          aria-label={`Call tree for fib(${n})`}
        >
          {edges.map((e) => (
            <line
              key={e.id}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              className="rec-tree-edge"
            />
          ))}
          {layout.placed.map((p, i) => (
            <motion.g
              key={`${n}-${p.id}`}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.02, 0.4), type: "spring", stiffness: 300, damping: 20 }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={17}
                fill={fibColor(p.node.v)}
                strokeWidth={p.node.isBase ? 2 : 1}
                style={{ stroke: p.node.isBase ? "var(--rec-red)" : "rgba(15,23,42,0.15)" }}
              />
              <text x={p.x} y={p.y + 4} className="rec-tree-text">
                {p.node.v}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>

      <div className="rec-stats">
        <div className="rec-stat">
          <span className="rec-stat-num">{stats.totalCalls}</span>
          <span className="rec-stat-label">total calls</span>
        </div>
        <div className="rec-stat">
          <span className="rec-stat-num">{stats.result}</span>
          <span className="rec-stat-label">fib({n})</span>
        </div>
        <div className="rec-stat">
          <span className="rec-stat-num">≈ {naive2n}</span>
          <span className="rec-stat-label">2ⁿ growth</span>
        </div>
      </div>

      {stats.repeated.length > 0 ? (
        <p className="rec-note">
          Wasted work: {stats.repeated.map((r) => (
            <span key={r.v} className="rec-chip">
              fib({r.v}) ×{r.count}
            </span>
          ))}{" "}
          — each of these is recomputed from scratch. Caching them (memoisation)
          turns this whole tree into a single straight line.
        </p>
      ) : (
        <p className="rec-note">
          Too small to repeat yet — raise n and watch the same values start
          appearing over and over.
        </p>
      )}
    </div>
  );
}
