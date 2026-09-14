"use client";

// The Stacks & Queues canvas: draws one StructState snapshot on the blueprint
// and animates between snapshots. A stack is drawn vertically (top plate on top,
// pushes drop in from above, pops lift off); a queue is drawn horizontally
// (front on the left, enqueues slide in from the back, dequeues slide out the
// front while the rest shift forward). Everything reads blueprint tokens, so the
// tool re-inks purely through --accent set on the page (rose --ink-stack).

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { StructState, CellValue } from "@/lib/stacks/types";

// ── Stack geometry (vertical) ────────────────────────────────────────────────
const S_W = 360; // viewBox width
const S_CELL_W = 172;
const S_CELL_H = 46;
const S_GAP = 10;
const S_CELL_X = 34;
const S_FLOOR_MARGIN = 30;
const S_TOP_PAD = 44; // room for the returned badge

// ── Queue geometry (horizontal) ──────────────────────────────────────────────
const Q_CELL_W = 66;
const Q_CELL_H = 58;
const Q_GAP = 14;
const Q_PAD = 44;
const Q_ROW_Y = 54;
const Q_H = 176;

const SPRING = { type: "spring" as const, stiffness: 260, damping: 26 };

interface CanvasProps {
  state: StructState;
}

export function StructCanvas({ state }: CanvasProps) {
  return state.kind === "stack" ? <StackView state={state} /> : <QueueView state={state} />;
}

/** rect + value text drawn at the group origin; the parent group positions it. */
function CellBox({
  w,
  h,
  value,
  active,
}: {
  w: number;
  h: number;
  value: CellValue;
  active: boolean;
}) {
  return (
    <>
      <rect
        width={w}
        height={h}
        rx={10}
        fill="var(--node-face)"
        stroke={active ? "var(--accent)" : "var(--node-stroke)"}
        strokeWidth={active ? 2.5 : 1.5}
      />
      {active && <rect width={w} height={h} rx={10} fill="var(--accent)" opacity={0.14} />}
      <text
        x={w / 2}
        y={h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--mono)"
        fontSize={18}
        fontWeight={600}
        fill={active ? "var(--accent)" : "var(--ink)"}
      >
        {String(value)}
      </text>
    </>
  );
}

/** Small "returned N" chip, top-right, shown after pop / dequeue / peek. */
function ReturnedBadge({ x, value }: { x: number; value: CellValue }) {
  const label = `returned ${value}`;
  const w = 30 + label.length * 8.2;
  return (
    <motion.g
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <rect
        x={x - w}
        y={10}
        width={w}
        height={26}
        rx={13}
        fill="var(--node-face)"
        stroke="var(--accent)"
        strokeWidth={1.5}
      />
      <text
        x={x - w / 2}
        y={24}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--mono)"
        fontSize={13}
        fontWeight={600}
        fill="var(--accent)"
      >
        {label}
      </text>
    </motion.g>
  );
}

function StackView({ state }: CanvasProps) {
  const reduce = useReducedMotion();
  const n = state.cells.length;
  const pileH = 4 + n * S_CELL_H + Math.max(0, n - 1) * S_GAP;
  const H = Math.max(300, pileH + S_FLOOR_MARGIN + S_TOP_PAD);
  const floorY = H - S_FLOOR_MARGIN;

  // top-left y of cell at Python index i (0 = bottom).
  const yOf = (i: number) => floorY - 4 - (i + 1) * S_CELL_H - i * S_GAP;
  const topCellY = n > 0 ? yOf(n - 1) : floorY - 4 - S_CELL_H;

  const topVal = n > 0 ? state.cells[n - 1].value : null;
  const label =
    n === 0 ? "Empty stack" : `Stack, ${n} item${n === 1 ? "" : "s"}, top is ${topVal}`;

  return (
    <svg
      viewBox={`0 0 ${S_W} ${H}`}
      role="img"
      aria-label={label}
      style={{ width: "100%", maxWidth: S_W, height: "auto", display: "block", margin: "0 auto" }}
    >
      {/* floor line */}
      <line
        x1={S_CELL_X - 12}
        y1={floorY}
        x2={S_CELL_X + S_CELL_W + 12}
        y2={floorY}
        stroke="var(--line-strong)"
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* top pointer — follows the topmost plate */}
      {n > 0 && (
        <motion.g
          initial={false}
          animate={{ y: topCellY }}
          transition={reduce ? { duration: 0 } : SPRING}
        >
          <text
            x={S_CELL_X + S_CELL_W + 20}
            y={S_CELL_H / 2 - 6}
            fontFamily="var(--note)"
            fontSize={19}
            fill="var(--accent)"
          >
            top
          </text>
          <text
            x={S_CELL_X + S_CELL_W + 20}
            y={S_CELL_H / 2 + 13}
            fontFamily="var(--mono)"
            fontSize={12}
            fill="var(--graphite)"
          >
            stack[-1]
          </text>
          <path
            d={`M${S_CELL_X + S_CELL_W + 16} ${S_CELL_H / 2} L${S_CELL_X + S_CELL_W + 4} ${S_CELL_H / 2}`}
            stroke="var(--accent)"
            strokeWidth={1.6}
            markerEnd="url(#sq-arrow)"
          />
        </motion.g>
      )}

      <defs>
        <marker id="sq-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--accent)" />
        </marker>
      </defs>

      {/* empty placeholder */}
      {n === 0 && (
        <g>
          <rect
            x={S_CELL_X}
            y={floorY - 4 - S_CELL_H}
            width={S_CELL_W}
            height={S_CELL_H}
            rx={10}
            fill="none"
            stroke="var(--line-strong)"
            strokeWidth={1.5}
            strokeDasharray="6 6"
          />
          <text
            x={S_CELL_X + S_CELL_W / 2}
            y={floorY - 4 - S_CELL_H / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--note)"
            fontSize={18}
            fill="var(--faint)"
          >
            empty — push something
          </text>
        </g>
      )}

      <AnimatePresence initial={false}>
        {state.cells.map((cell, i) => {
          const baseY = yOf(i);
          return (
            <motion.g
              key={cell.id}
              initial={reduce ? false : { x: S_CELL_X, y: baseY - 22, opacity: 0 }}
              animate={{ x: S_CELL_X, y: baseY, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: baseY - 26, opacity: 0 }}
              transition={reduce ? { duration: 0 } : SPRING}
            >
              <CellBox
                w={S_CELL_W}
                h={S_CELL_H}
                value={cell.value}
                active={state.activeId === cell.id}
              />
            </motion.g>
          );
        })}
      </AnimatePresence>

      {state.returned != null && <ReturnedBadge x={S_W - 12} value={state.returned} />}
    </svg>
  );
}

function QueueView({ state }: CanvasProps) {
  const reduce = useReducedMotion();
  const n = state.cells.length;
  const W = Math.max(360, Q_PAD * 2 + Math.max(n, 1) * Q_CELL_W + Math.max(0, n - 1) * Q_GAP);

  const xOf = (i: number) => Q_PAD + i * (Q_CELL_W + Q_GAP);
  const frontVal = n > 0 ? state.cells[0].value : null;
  const backVal = n > 0 ? state.cells[n - 1].value : null;
  const label =
    n === 0
      ? "Empty queue"
      : `Queue, ${n} item${n === 1 ? "" : "s"}, front is ${frontVal}, back is ${backVal}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${Q_H}`}
      role="img"
      aria-label={label}
      style={{ width: "100%", minWidth: W, height: "auto", display: "block" }}
    >
      <defs>
        <marker id="sq-arrow-q" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--graphite)" />
        </marker>
      </defs>

      {/* flow annotations: front leaves on the left, back joins on the right */}
      <text x={Q_PAD} y={26} fontFamily="var(--note)" fontSize={18} fill="var(--accent)">
        front
      </text>
      <text
        x={W - Q_PAD}
        y={26}
        textAnchor="end"
        fontFamily="var(--note)"
        fontSize={18}
        fill="var(--graphite)"
      >
        back
      </text>

      {/* out / in direction hints */}
      <path
        d={`M${Q_PAD - 14} ${Q_ROW_Y + Q_CELL_H + 20} L${Q_PAD - 32} ${Q_ROW_Y + Q_CELL_H + 20}`}
        stroke="var(--graphite)"
        strokeWidth={1.4}
        markerEnd="url(#sq-arrow-q)"
      />
      <text
        x={Q_PAD - 14}
        y={Q_ROW_Y + Q_CELL_H + 38}
        textAnchor="end"
        fontFamily="var(--mono)"
        fontSize={11}
        fill="var(--faint)"
      >
        dequeue
      </text>
      <text
        x={W - Q_PAD}
        y={Q_ROW_Y + Q_CELL_H + 38}
        textAnchor="end"
        fontFamily="var(--mono)"
        fontSize={11}
        fill="var(--faint)"
      >
        enqueue →
      </text>

      {/* empty placeholder */}
      {n === 0 && (
        <g>
          <rect
            x={Q_PAD}
            y={Q_ROW_Y}
            width={Q_CELL_W}
            height={Q_CELL_H}
            rx={10}
            fill="none"
            stroke="var(--line-strong)"
            strokeWidth={1.5}
            strokeDasharray="6 6"
          />
          <text
            x={Q_PAD + Q_CELL_W + 16}
            y={Q_ROW_Y + Q_CELL_H / 2}
            dominantBaseline="central"
            fontFamily="var(--note)"
            fontSize={18}
            fill="var(--faint)"
          >
            empty — enqueue someone
          </text>
        </g>
      )}

      <AnimatePresence initial={false}>
        {state.cells.map((cell, i) => {
          const baseX = xOf(i);
          const isFront = i === 0;
          const isBack = i === n - 1;
          return (
            <motion.g
              key={cell.id}
              initial={reduce ? false : { x: baseX + 28, y: Q_ROW_Y, opacity: 0 }}
              animate={{ x: baseX, y: Q_ROW_Y, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { x: baseX - 30, opacity: 0 }}
              transition={reduce ? { duration: 0 } : SPRING}
            >
              <CellBox
                w={Q_CELL_W}
                h={Q_CELL_H}
                value={cell.value}
                active={state.activeId === cell.id}
              />
              {(isFront || isBack) && (
                <text
                  x={Q_CELL_W / 2}
                  y={Q_CELL_H + 18}
                  textAnchor="middle"
                  fontFamily="var(--mono)"
                  fontSize={11}
                  fill="var(--faint)"
                >
                  {isFront ? "q[0]" : "q[-1]"}
                </text>
              )}
            </motion.g>
          );
        })}
      </AnimatePresence>

      {state.returned != null && <ReturnedBadge x={W - 12} value={state.returned} />}
    </svg>
  );
}
