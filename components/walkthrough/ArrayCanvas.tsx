"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId } from "react";
import type { ArrayViz } from "@/lib/walkthrough/types";

const CELL = 60;
const GAP = 12;
const STEP = CELL + GAP;
const PAD_X = 40;
const TOP = 64; // room for markers above
const BOTTOM = 92; // room for markers + bracket below
const CELL_Y = TOP;

export function ArrayCanvas({ viz }: { viz: ArrayViz }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { values, markers, window: win, flash } = viz;
  const flashSet = new Set(flash);

  const width = PAD_X * 2 + values.length * STEP - GAP;
  const height = CELL_Y + CELL + BOTTOM;

  const cellX = (i: number) => PAD_X + i * STEP;

  return (
    <div className="wt-canvas-wrap">
      <svg
        className="wt-canvas"
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: width }}
        role="img"
        aria-label="Array visualization"
      >
        <defs>
          {/* Hand-drawn wobble for whiteboard accents. */}
          <filter id={`wobble-${uid}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={7} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.2} />
          </filter>
        </defs>

        {/* Window bracket under the active range */}
        <AnimatePresence>
          {win && win.end >= win.start && (
            <motion.g
              key="window"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              filter={`url(#wobble-${uid})`}
            >
              <motion.path
                fill="none"
                stroke={win.color}
                strokeWidth={3}
                strokeLinecap="round"
                animate={{
                  d: bracketPath(cellX(win.start), cellX(win.end) + CELL, CELL_Y + CELL + 14),
                }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
              />
              {win.label && (
                <motion.text
                  className="wt-bracket-label"
                  textAnchor="middle"
                  animate={{
                    x: (cellX(win.start) + cellX(win.end) + CELL) / 2,
                    y: CELL_Y + CELL + 44,
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                >
                  {win.label}
                </motion.text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Cells */}
        {values.map((v, i) => {
          const inWindow = win && i >= win.start && i <= win.end;
          const isFlash = flashSet.has(i);
          return (
            <g key={i}>
              <motion.rect
                x={cellX(i)}
                y={CELL_Y}
                width={CELL}
                height={CELL}
                rx={10}
                animate={{
                  fill: inWindow ? "var(--teal-light)" : "var(--bg-elevated)",
                  stroke: isFlash ? "var(--amber)" : inWindow ? "var(--teal)" : "var(--border-strong)",
                  strokeWidth: isFlash ? 3.5 : inWindow ? 2.5 : 1.5,
                  scale: isFlash ? [1, 1.08, 1] : 1,
                }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                transition={{ duration: 0.4 }}
              />
              <text x={cellX(i) + CELL / 2} y={CELL_Y + CELL / 2 + 7} textAnchor="middle" className="wt-cell-text">
                {String(v)}
              </text>
              {/* index label */}
              <text x={cellX(i) + CELL / 2} y={CELL_Y - 44} textAnchor="middle" className="wt-index-text">
                {i}
              </text>
            </g>
          );
        })}

        {/* Markers (left/right pointers) */}
        <AnimatePresence>
          {markers.map((m) => {
            const x = cellX(Math.min(m.index, values.length - 1)) + CELL / 2;
            const above = m.above ?? false;
            const y = above ? CELL_Y - 16 : CELL_Y + CELL + 16;
            return (
              <motion.g
                key={m.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x, y }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                <path
                  d={above ? "M 0 10 L -6 0 L 6 0 Z" : "M 0 -10 L -6 0 L 6 0 Z"}
                  fill={m.color}
                />
                <rect x={-26} y={above ? -20 : 4} width={52} height={17} rx={8} fill={m.color} />
                <text x={0} y={above ? -8 : 16} textAnchor="middle" className="wt-marker-text">
                  {m.label}
                </text>
              </motion.g>
            );
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
}

// A downward "]___[" style bracket spanning [x1, x2] with the dip at depth y.
function bracketPath(x1: number, x2: number, y: number): string {
  const drop = 12;
  return `M ${x1} ${y - drop} L ${x1} ${y} L ${x2} ${y} L ${x2} ${y - drop}`;
}
