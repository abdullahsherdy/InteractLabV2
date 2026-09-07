"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  binaryContributions,
  clampByte,
  decimalToBinarySteps,
  toBin8,
} from "@/lib/bitwise/bits";
import { ByteRow } from "./ByteRow";

/**
 * Panel 2 — the "keep dividing by 2" trace. Each division animates in as its
 * own row; the remainders read bottom-to-top spell the binary number, which we
 * then verify with the place-value sum.
 */
export function ConversionTrace() {
  const [input, setInput] = useState("42");
  const n = clampByte(Number(input) || 0);
  const steps = decimalToBinarySteps(n);
  const bin = toBin8(n);
  const contrib = binaryContributions(n);

  return (
    <div className="bw-module">
      <div className="bw-toolbar">
        <label className="bw-field">
          <span className="bw-field-label">number (0–255)</span>
          <input
            className="bw-input"
            type="number"
            min={0}
            max={255}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </label>
      </div>

      <div className="bw-steps">
        <AnimatePresence mode="popLayout">
          {steps.map((s, i) => (
            <motion.div
              key={`${n}-${i}`}
              className="bw-step"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
            >
              <span className="bw-step-num">step {i + 1}</span>
              <span className="bw-step-math">
                {s.value} ÷ 2 = {s.quotient} remainder
              </span>
              <span className={`bw-rem ${s.remainder ? "bw-rem-1" : "bw-rem-0"}`}>
                {s.remainder}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        <p className="bw-note">↑ read the remainders bottom-to-top</p>
      </div>

      <div className="bw-result">
        <p className="bw-label">result — {n} in binary</p>
        <ByteRow bits={bin} variant="one" showPositions />
        <p className="bw-note">
          verify:{" "}
          <code>{contrib.length ? `${contrib.join(" + ")} = ${n}` : "0 = 0"}</code>
        </p>
      </div>
    </div>
  );
}
