"use client";

import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PROP_CONCEPTS, PROP_ROWS } from "@/lib/sorting/content";

const Mark = ({ on }: { on: boolean }) => (
  <span className={on ? "sort-mark-yes" : "sort-mark-no"} aria-label={on ? "yes" : "no"}>
    {on ? "✓" : "✕"}
  </span>
);

/**
 * Module 5 — the vocabulary (stable / in-place / adaptive) and a full comparison
 * table. Each row expands to a plain-English "when and why" so the table isn't
 * just symbols to memorise.
 */
export function PropertiesTable() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="sort-props">
      <div className="sort-concept-grid">
        {PROP_CONCEPTS.map((c) => (
          <div key={c.term} className="sort-concept">
            <span className="sort-concept-term">{c.term}</span>
            <p className="sort-concept-def">{c.def}</p>
            <p className="sort-concept-why">{c.why}</p>
          </div>
        ))}
      </div>

      <div className="sort-table-wrap">
        <table className="sort-table">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Best</th>
              <th>Average</th>
              <th>Worst</th>
              <th>Space</th>
              <th>Stable</th>
              <th>In-place</th>
              <th>Adaptive</th>
              <th aria-label="Expand" />
            </tr>
          </thead>
          <tbody>
            {PROP_ROWS.map((r, i) => {
              const isOpen = open === i;
              return (
                <Fragment key={r.algo}>
                  <tr
                    className={`sort-table-row${isOpen ? " open" : ""}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <td className="sort-table-algo">{r.algo}</td>
                    <td><code>{r.best}</code></td>
                    <td><code>{r.average}</code></td>
                    <td><code>{r.worst}</code></td>
                    <td><code>{r.space}</code></td>
                    <td><Mark on={r.stable} /></td>
                    <td><Mark on={r.inPlace} /></td>
                    <td><Mark on={r.adaptive} /></td>
                    <td className="sort-table-chev" aria-hidden="true">{isOpen ? "−" : "+"}</td>
                  </tr>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <tr className="sort-table-detail-row">
                        <td colSpan={9}>
                          <motion.div
                            className="sort-table-detail"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22 }}
                          >
                            {r.detail}
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
