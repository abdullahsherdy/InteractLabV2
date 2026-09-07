"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { KEY_DEMO_KINDS, runKeyDemo, type KeyDemoKind } from "@/lib/sorting/key-demo";
import { CodeBlock } from "@/components/shared/CodeBlock";

/**
 * Module 4 — sorting by a key. The same data, sorted five different ways, to
 * show that `sorted(key=...)` is where sorting actually gets useful: by length,
 * by last letter, descending, by a tuple of keys, and a stability demo.
 */
export function KeyDemo() {
  const [kind, setKind] = useState<KeyDemoKind>("len");
  const result = runKeyDemo(kind);

  return (
    <div className="sort-module">
      <label className="sort-field sort-field-grow">
        <span className="sort-field-label">Try a different key</span>
        <select
          className="sort-select"
          value={kind}
          onChange={(e) => setKind(e.target.value as KeyDemoKind)}
        >
          {KEY_DEMO_KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </label>

      <CodeBlock code={result.code} className="code-block-sm" />

      <div className="sort-key-cols">
        <div className="sort-key-col">
          <span className="sort-key-label">Before</span>
          <div className="sort-key-list">
            {result.before.map((tok, i) => (
              <span key={i} className="sort-key-pill">
                {tok}
              </span>
            ))}
          </div>
        </div>
        <div className="sort-key-arrow" aria-hidden="true">
          →
        </div>
        <div className="sort-key-col">
          <span className="sort-key-label">After</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={kind}
              className="sort-key-list"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {result.after.map((tok, i) => (
                <span key={i} className="sort-key-pill sort-key-pill-after">
                  {tok}
                </span>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="sort-caption">{result.note}</p>
    </div>
  );
}
