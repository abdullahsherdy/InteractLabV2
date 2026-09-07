"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { clampBigON, growthBars } from "@/lib/recursion/big-o";
import { COMPLEXITY_ROWS } from "@/lib/recursion/content";

/**
 * Module 4 — Big-O growth. Drag n and watch how many "steps" each complexity
 * class needs. O(1) stays flat, O(n) climbs steadily, O(n²) explodes — the
 * whole point is *how differently they scale*, so the bars are drawn relative
 * to the biggest one while the exact counts stay printed alongside.
 */
export function BigOChart() {
  const [n, setN] = useState(8);
  const bars = useMemo(() => growthBars(n), [n]);
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="rec-module">
      <div className="rec-toolbar">
        <label className="rec-field rec-field-grow">
          <span className="rec-field-label">n = {n}</span>
          <input
            className="rec-slider"
            type="range"
            min={1}
            max={20}
            value={n}
            onChange={(e) => setN(clampBigON(Number(e.target.value)))}
            aria-label="n from 1 to 20"
          />
        </label>
      </div>

      <div className="rec-bars">
        {bars.map((b) => (
          <div key={b.kind} className="rec-bar-row">
            <span className="rec-bar-name">{b.label}</span>
            <div className="rec-bar-track">
              <motion.div
                className={`rec-bar rec-bar-${b.cls}`}
                animate={{ width: `${Math.max((b.value / max) * 100, 3)}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 26 }}
              />
            </div>
            <span className="rec-bar-val">{b.display}</span>
          </div>
        ))}
      </div>

      <p className="rec-note">
        At n = {n}, O(n²) already needs <strong>{bars[3].display}</strong> steps
        while O(1) needs just <strong>1</strong>. Now imagine n = 1,000,000.
      </p>

      <table className="rec-table">
        <thead>
          <tr>
            <th>Big-O</th>
            <th>Name</th>
            <th>Example</th>
            <th>Verdict</th>
          </tr>
        </thead>
        <tbody>
          {COMPLEXITY_ROWS.map((r) => (
            <tr key={r.notation}>
              <td>
                <code className={`rec-cx rec-cx-${r.cls}`}>{r.notation}</code>
              </td>
              <td>{r.name}</td>
              <td className="rec-table-eg">
                <code>{r.example}</code>
              </td>
              <td>
                <span className={`rec-badge rec-badge-${r.cls}`}>{r.badge}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
