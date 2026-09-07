"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { compareOps } from "@/lib/sorting/util";

/**
 * Module 3 — the growth comparison. Drag n and watch the O(n²) bars pull away
 * from the O(n log n) ones. The point isn't the exact numbers; it's the shape:
 * doubling n roughly quadruples the slow sorts but barely moves the fast ones.
 */
export function CompareChart() {
  const [n, setN] = useState(10);
  const rows = compareOps(n);
  const max = Math.max(...rows.map((r) => r.ops), 1);

  return (
    <div className="sort-module">
      <label className="sort-field">
        <span className="sort-field-label">Input size — n = {n}</span>
        <input
          className="sort-slider"
          type="range"
          min={2}
          max={30}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
        />
      </label>

      <div className="sort-cmp-bars">
        {rows.map((r) => (
          <div key={r.algo} className="sort-cmp-row">
            <span className="sort-cmp-name">{r.algo}</span>
            <div className="sort-cmp-track">
              <motion.div
                className={`sort-cmp-bar sort-cmp-${r.tone}`}
                initial={false}
                animate={{ width: `${(r.ops / max) * 100}%` }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
              />
            </div>
            <span className="sort-cmp-val">
              {r.ops.toLocaleString()}
              <span className="sort-cmp-cx">{r.complexity}</span>
            </span>
          </div>
        ))}
      </div>

      <p className="sort-note">
        At n = {n}, an O(n²) sort does about <strong>{(n * n).toLocaleString()}</strong> operations
        while an O(n log n) sort does about{" "}
        <strong>{Math.max(n, Math.round(n * Math.log2(n))).toLocaleString()}</strong>. Push n higher
        and the gap becomes a chasm.
      </p>
    </div>
  );
}
