"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useMemo } from "react";
import { chainFromHead } from "@/lib/linked-list/operations";
import type { ListState, Step } from "@/lib/linked-list/types";

const NODE_W = 76;
const NODE_H = 46;
const STEP_X = 128;
const PAD = 36;
const CHAIN_Y = 84;
const ORPHAN_Y = 196;

interface Pos {
  x: number;
  y: number;
  orphan: boolean;
}

export function ListCanvas({
  step,
  showPrev = false,
  cursorLabel = "▶",
}: {
  step: Step;
  showPrev?: boolean;
  cursorLabel?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const state = step.state;
  const highlight = new Set(step.highlightNodes ?? []);

  const { positions, chain, orphans, width, height } = useMemo(() => {
    const chain = chainFromHead(state);
    const chainSet = new Set(chain);
    const orphans = state.nodes.filter((n) => !chainSet.has(n.id)).map((n) => n.id);
    const positions = new Map<string, Pos>();
    chain.forEach((id, i) => positions.set(id, { x: PAD + i * STEP_X, y: CHAIN_Y, orphan: false }));
    orphans.forEach((id, i) => positions.set(id, { x: PAD + i * STEP_X, y: ORPHAN_Y, orphan: true }));
    const cols = Math.max(chain.length + 1, orphans.length + 1, 3);
    const width = PAD * 2 + cols * STEP_X;
    const hasCycle = state.links.some((l) => {
      if (l.kind !== "next" || !l.to) return false;
      const fi = chain.indexOf(l.from);
      const ti = chain.indexOf(l.to);
      return fi >= 0 && ti >= 0 && ti <= fi;
    });
    const height =
      (orphans.length > 0 ? ORPHAN_Y + NODE_H + 30 : CHAIN_Y + NODE_H + (showPrev ? 70 : hasCycle ? 96 : 46));
    return { positions, chain, orphans, width, height };
  }, [state, showPrev]);

  const noneX = PAD + chain.length * STEP_X;

  return (
    <div className="ll-canvas-wrap">
      <svg
        className="ll-canvas"
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: width }}
        role="img"
        aria-label="Linked list diagram"
      >
        <defs>
          {[
            ["teal", "var(--teal)"],
            ["purple", "var(--purple)"],
            ["amber", "var(--amber)"],
            ["grey", "var(--text-tertiary)"],
          ].map(([name, color]) => (
            <marker
              key={name}
              id={`arr-${name}-${uid}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
            </marker>
          ))}
        </defs>

        {/* Links */}
        <AnimatePresence>
          {state.links.map((link) => {
            const from = positions.get(link.from);
            if (!from) return null;
            const key = `${link.from}-${link.kind}`;

            let d: string;
            let color: string;
            let markerName: string;

            if (link.to === null) {
              // arrow to a None bubble to the right of the node
              const isLastChain = chain.length > 0 && chain[chain.length - 1] === link.from && !from.orphan;
              const tx = isLastChain ? noneX : from.x + NODE_W + 46;
              const ty = from.y + NODE_H / 2;
              d = `M ${from.x + NODE_W} ${from.y + NODE_H / 2} C ${from.x + NODE_W + 18} ${ty}, ${tx - 16} ${ty}, ${tx - 4} ${ty}`;
              color = from.orphan ? "var(--text-tertiary)" : link.highlight ? "var(--amber)" : "var(--teal)";
              markerName = from.orphan ? "grey" : link.highlight ? "amber" : "teal";
              if (link.kind === "prev") return null; // don't draw prev→None
            } else {
              const to = positions.get(link.to);
              if (!to) return null;
              const isBackward = to.x <= from.x && to.y === from.y;

              if (link.kind === "prev") {
                // purple curve under the chain, right-to-left
                d = `M ${from.x + 10} ${from.y + NODE_H} C ${from.x + 10} ${from.y + NODE_H + 34}, ${to.x + NODE_W - 10} ${to.y + NODE_H + 34}, ${to.x + NODE_W - 10} ${to.y + NODE_H + 2}`;
                color = link.highlight ? "var(--amber)" : "var(--purple)";
                markerName = link.highlight ? "amber" : "purple";
              } else if (isBackward) {
                // cycle return arc under the chain
                d = `M ${from.x + NODE_W / 2} ${from.y + NODE_H} C ${from.x + NODE_W / 2} ${from.y + NODE_H + 72}, ${to.x + NODE_W / 2} ${to.y + NODE_H + 72}, ${to.x + NODE_W / 2} ${to.y + NODE_H + 2}`;
                color = link.highlight ? "var(--amber)" : "var(--blue)";
                markerName = link.highlight ? "amber" : "teal";
              } else {
                d = `M ${from.x + NODE_W} ${from.y + NODE_H / 2} C ${from.x + NODE_W + 26} ${from.y + NODE_H / 2}, ${to.x - 26} ${to.y + NODE_H / 2}, ${to.x - 4} ${to.y + NODE_H / 2}`;
                color = from.orphan ? "var(--text-tertiary)" : link.highlight ? "var(--amber)" : "var(--teal)";
                markerName = from.orphan ? "grey" : link.highlight ? "amber" : "teal";
              }
            }

            return (
              <motion.path
                key={key}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1, d }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={link.highlight ? 3 : 2}
                markerEnd={`url(#arr-${markerName}-${uid})`}
              />
            );
          })}
        </AnimatePresence>

        {/* None bubble at end of chain */}
        {chain.length > 0 && state.links.some((l) => l.kind === "next" && l.from === chain[chain.length - 1] && l.to === null) && (
          <g>
            <circle cx={noneX + 22} cy={CHAIN_Y + NODE_H / 2} r={22} fill="var(--bg-muted)" stroke="var(--border-strong)" strokeDasharray="4 3" />
            <text x={noneX + 22} y={CHAIN_Y + NODE_H / 2 + 4} textAnchor="middle" className="ll-none-text">
              None
            </text>
          </g>
        )}

        {/* Nodes */}
        <AnimatePresence>
          {state.nodes.map((node) => {
            const pos = positions.get(node.id);
            if (!pos) return null;
            const isHi = highlight.has(node.id);
            const isCursor = state.cursor === node.id;
            return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0.6, x: pos.x, y: pos.y }}
                animate={{
                  opacity: pos.orphan ? 0.45 : 1,
                  scale: isHi && step.flash ? [1, 1.15, 1] : 1,
                  x: pos.x,
                  y: pos.y,
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={12}
                  fill={isCursor ? "var(--teal-light)" : "var(--bg-elevated)"}
                  stroke={isHi ? "var(--amber)" : pos.orphan ? "var(--text-tertiary)" : isCursor ? "var(--teal)" : "var(--border-strong)"}
                  strokeWidth={isHi || isCursor ? 3 : 1.5}
                />
                <text x={NODE_W / 2} y={NODE_H / 2 + 5} textAnchor="middle" className="ll-node-text">
                  {String(node.value)}
                </text>
                {isCursor && (
                  <text x={NODE_W / 2} y={-8} textAnchor="middle" className="ll-cursor-text">
                    {cursorLabel}
                  </text>
                )}
              </motion.g>
            );
          })}
        </AnimatePresence>

        {/* Orphan label */}
        {orphans.length > 0 && (
          <text x={PAD} y={ORPHAN_Y - 14} className="ll-orphan-label">
            ⚠ unreachable (orphaned) nodes
          </text>
        )}

        {/* Pointer badges */}
        <AnimatePresence>
          {state.pointers.map((p, pi) => {
            const pos = p.nodeId ? positions.get(p.nodeId) : null;
            const stack = state.pointers.filter((q, qi) => q.nodeId === p.nodeId && qi < pi).length;
            const bx = pos ? pos.x + NODE_W / 2 : noneX + 22;
            const by = (pos ? pos.y : CHAIN_Y) - 26 - stack * 24;
            return (
              <motion.g
                key={p.name}
                initial={{ opacity: 0, y: by - 10, x: bx }}
                animate={{ opacity: 1, x: bx, y: by }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <rect x={-30} y={-14} width={60} height={20} rx={10} fill={p.color} />
                <text x={0} y={0} textAnchor="middle" className="ll-pointer-text">
                  {p.name}
                </text>
                <path d="M 0 6 L 0 12" stroke={p.color} strokeWidth={2.5} />
              </motion.g>
            );
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
}
