"use client";
import { useId } from "react";
import {
  pointerState,
  unreachableHeap,
  type Memory,
} from "@/lib/pointers/engine";
import type { Cell } from "@/lib/pointers/types";
export function MemoryBoard({
  state,
  highlight,
  minRows = 2,
}: {
  state: Memory;
  highlight: string[];
  minRows?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const cells = Object.values(state);
  const unreachable = unreachableHeap(state);
  const zones = ["stack", "heap"] as const;
  const positions = new Map<string, { x: number; y: number }>();
  zones.forEach((zone, z) =>
    cells
      .filter((c) => c.zone === zone)
      .forEach((c, i) =>
        positions.set(c.id, {
          x: 22 + z * 390 + (i % 2) * 174,
          y: 65 + Math.floor(i / 2) * 125,
        }),
      ),
  );
  const rows = Math.max(
    minRows,
    ...zones.map((z) =>
      Math.ceil(cells.filter((c) => c.zone === z).length / 2),
    ),
  );
  const height = rows * 125 + 80;
  function value(c: Cell): string {
    if (c.kind === "value") return c.value ?? "?";
    const status = pointerState(c, state);
    if (status === "null") return "nullptr";
    if (status === "wild") return "uninitialized";
    return state[c.target ?? ""]
      ? `@${state[c.target ?? ""].address}`
      : "old address";
  }
  const description = cells.length
    ? cells
        .map(
          (c) =>
            `${c.name}: ${value(c)}${c.freed ? ", freed" : ""}${c.kind !== "value" ? `, ${pointerState(c, state)}${c.target && c.target !== "wild" ? `, points to ${c.target}` : ""}` : ""}${unreachable.includes(c.id) ? ", unreachable allocation" : ""}`,
        )
        .join(". ")
    : "No objects have been created yet.";
  return (
    <figure className="ptr-memory">
      <div
        className="ptr-board-scroll"
        tabIndex={0}
        role="region"
        aria-label="Scrollable memory board"
      >
        <svg
          viewBox={`0 0 780 ${height}`}
          width="780"
          height={height}
          role="img"
          aria-labelledby={`${uid}-title ${uid}-desc`}
        >
          <title id={`${uid}-title`}>Memory state</title>
          <desc id={`${uid}-desc`}>{description}</desc>
          <defs>
            <marker
              id={`${uid}-arrow`}
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
            </marker>
          </defs>
          <text x="22" y="29" className="ptr-zone">
            LOCAL / AUTOMATIC (“STACK”)
          </text>
          <text x="412" y="29" className="ptr-zone">
            DYNAMIC (“HEAP”)
          </text>
          <line
            x1="390"
            x2="390"
            y1="48"
            y2={height - 15}
            className="ptr-divider"
          />
          {cells
            .filter(
              (c) => c.kind !== "value" && c.target && positions.has(c.target),
            )
            .map((c) => {
              const a = positions.get(c.id)!;
              const b = positions.get(c.target!)!;
              const right = b.x > a.x;
              const sameColumn = b.x === a.x;
              const sx = a.x + (right ? 150 : 0),
                tx = b.x + (right || sameColumn ? 0 : 150);
              const bend = right ? 35 : -18;
              const endBend = sameColumn ? -18 : -bend;
              return (
                <path
                  key={`arrow-${c.id}`}
                  d={`M${sx},${a.y + 48} C${sx + bend},${a.y + 48} ${tx + endBend},${b.y + 48} ${tx},${b.y + 48}`}
                  className={`ptr-arrow ${pointerState(c, state) === "dangling" ? "danger" : ""}`}
                  markerEnd={`url(#${uid}-arrow)`}
                />
              );
            })}
          {cells.map((c) => {
            const pos = positions.get(c.id)!;
            const status = c.kind !== "value" ? pointerState(c, state) : "";
            const danger =
              c.freed || status === "dangling" || status === "wild";
            const badge = c.freed
              ? "freed"
              : unreachable.includes(c.id)
                ? "unreachable"
                : status;
            return (
              <g
                key={c.id}
                transform={`translate(${pos.x},${pos.y})`}
                className={`ptr-cell${highlight.includes(c.id) ? " changed" : ""}${danger ? " danger" : ""}${unreachable.includes(c.id) ? " warning" : ""}`}
              >
                <rect width="150" height="100" rx="8" />
                <text x="10" y="20" className="ptr-cell-name">
                  {c.name}
                </text>
                <text
                  x="10"
                  y="48"
                  key={value(c)}
                  className={`ptr-cell-value${value(c).length > 10 ? " small" : ""}`}
                >
                  {value(c)}
                </text>
                <text x="10" y="69" className="ptr-cell-address">
                  address {c.address}
                </text>
                <text x="10" y="88" className="ptr-cell-status">
                  {badge || (c.group ? `member of ${c.group}` : "live value")}
                </text>
              </g>
            );
          })}
          {!cells.length && (
            <text x="22" y="95" className="ptr-zone">
              Step forward to create the first object.
            </text>
          )}
        </svg>
      </div>
      <figcaption>
        Illustrative addresses; real addresses may look like{" "}
        <code>0x61fe14</code>. Arrows follow stored addresses. “Unreachable”
        means no route from a local root in this drawing.
      </figcaption>
    </figure>
  );
}
