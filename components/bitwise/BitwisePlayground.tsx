"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { applyOp, clampByte, isUnary, type BitOp } from "@/lib/bitwise/bits";
import { ByteRow } from "./ByteRow";

const OPTIONS: { value: BitOp; label: string }[] = [
  { value: "and", label: "& (AND)" },
  { value: "or", label: "| (OR)" },
  { value: "xor", label: "^ (XOR)" },
  { value: "not", label: "~ (NOT A)" },
  { value: "shl", label: "<< (left shift)" },
  { value: "shr", label: ">> (right shift)" },
];

/**
 * Panel 3 — the operator playground. A (and B, when the op is binary) feed a
 * live `applyOp` call; A, B, and the result render as stacked byte rows so the
 * student can read the result column-by-column against the two inputs.
 */
export function BitwisePlayground() {
  const [a, setA] = useState(12);
  const [b, setB] = useState(10);
  const [op, setOp] = useState<BitOp>("and");

  const unary = isUnary(op);
  const r = applyOp(a, b, op);

  return (
    <div className="bw-module">
      <div className="bw-toolbar">
        <label className="bw-field">
          <span className="bw-field-label">
            <span className="bw-tag bw-tag-a">A</span> first number
          </span>
          <input
            className="bw-input"
            type="number"
            min={0}
            max={255}
            value={a}
            onChange={(e) => setA(clampByte(Number(e.target.value)))}
          />
        </label>

        <label className="bw-field">
          <span className="bw-field-label">operator</span>
          <select
            className="bw-select"
            value={op}
            onChange={(e) => setOp(e.target.value as BitOp)}
          >
            {OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className={`bw-field${unary ? " bw-field-dim" : ""}`}>
          <span className="bw-field-label">
            <span className="bw-tag bw-tag-b">B</span>
            {unary ? " shift amount" : " second number"}
          </span>
          <input
            className="bw-input"
            type="number"
            min={0}
            max={255}
            value={b}
            onChange={(e) => setB(clampByte(Number(e.target.value)))}
          />
        </label>
      </div>

      <div className="bw-op-grid">
        <div className="bw-op-line">
          <span className="bw-tag bw-tag-a">A</span>
          <span className="bw-op-dec">{r.a}</span>
        </div>
        <ByteRow bits={r.binA} variant="one" />

        {!unary && (
          <>
            <div className="bw-op-line">
              <span className="bw-tag bw-tag-b">B</span>
              <span className="bw-op-dec">{r.b}</span>
            </div>
            <ByteRow bits={r.binB} variant="active" />
          </>
        )}

        {unary && op !== "not" && (
          <p className="bw-note bw-shift-note">
            shift {r.shift} place(s) {op === "shl" ? "left" : "right"}
          </p>
        )}
        {op === "not" && <p className="bw-note bw-shift-note">flip every bit</p>}

        <div className="bw-op-sep" />

        <div className="bw-op-line">
          <span className="bw-tag bw-tag-r">result</span>
          <span className="bw-op-hint">{r.colExpl}</span>
        </div>
        <ByteRow bits={r.binR} variant="result" showPositions />
      </div>

      <motion.div
        className="bw-op-answer"
        key={`${r.a}-${r.b}-${r.op}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <span className="bw-op-expr">
          {r.a} {r.symbol} {unary ? "" : r.b} =
        </span>
        <span className="bw-op-result-num">{r.result}</span>
        <span className="bw-op-bin">binary {r.binR}</span>
      </motion.div>
      <p className="bw-note">{r.explanation}</p>
    </div>
  );
}
