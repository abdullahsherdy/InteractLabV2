"use client";

import { motion } from "motion/react";
import { bitPositions, placeValues } from "@/lib/bitwise/bits";

export type BitVariant = "one" | "active" | "result";

/**
 * A row of 8 animated bit boxes (most-significant first). Set bits flip in with
 * a spring; cleared bits stay muted. Optionally shows the bit position (7..0)
 * and place value (128..1) underneath, and can be made clickable so the whole
 * byte becomes an editable toggle grid.
 */
export function ByteRow({
  bits,
  variant = "one",
  showPositions = false,
  showValues = false,
  onToggle,
}: {
  bits: string;
  variant?: BitVariant;
  showPositions?: boolean;
  showValues?: boolean;
  onToggle?: (index: number) => void;
}) {
  const positions = bitPositions();
  const values = placeValues();
  const interactive = typeof onToggle === "function";

  return (
    <div className="bw-byte">
      <div className="bw-bit-row" role={interactive ? "group" : undefined}>
        {bits.split("").map((b, i) => {
          const on = b === "1";
          const cls = on ? `bw-bit bw-bit-${variant}` : "bw-bit bw-bit-zero";
          const content = (
            <motion.span
              key={`${i}-${b}`}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
            >
              {b}
            </motion.span>
          );
          return interactive ? (
            <button
              key={i}
              type="button"
              className={cls}
              onClick={() => onToggle!(i)}
              aria-pressed={on}
              aria-label={`Bit ${positions[i]} (value ${values[i]}), currently ${b}`}
            >
              {content}
            </button>
          ) : (
            <div key={i} className={cls} aria-hidden="true">
              {content}
            </div>
          );
        })}
      </div>
      {showValues && (
        <div className="bw-bit-row">
          {values.map((v, i) => (
            <div key={i} className="bw-bit-meta bw-bit-val">
              {v}
            </div>
          ))}
        </div>
      )}
      {showPositions && (
        <div className="bw-bit-row">
          {positions.map((p, i) => (
            <div key={i} className="bw-bit-meta">
              {p}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
