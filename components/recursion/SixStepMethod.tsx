"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SIX_STEPS } from "@/lib/recursion/content";
import { CodeBlock } from "./CodeBlock";

/**
 * Module 5 — the repeatable method. Six expandable cards walk a problem from
 * "read it twice" to "test it", so students have a routine to fall back on
 * instead of freezing at a blank editor. First card starts open.
 */
export function SixStepMethod() {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="rec-steps">
      {SIX_STEPS.map((step, i) => {
        const isOpen = open.has(i);
        return (
          <div key={step.num} className={`rec-step-card${isOpen ? " open" : ""}`}>
            <button
              className="rec-step-head"
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              <span className="rec-step-num">{step.num}</span>
              <span className="rec-step-titles">
                <span className="rec-step-title">{step.title}</span>
                <span className="rec-step-short">{step.short}</span>
              </span>
              <span className="rec-step-chev" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="rec-step-body"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <p className="rec-step-text">{step.body}</p>
                  <CodeBlock code={step.example} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
