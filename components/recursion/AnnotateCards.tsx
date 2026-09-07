"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ANNOTATE_CARDS } from "@/lib/recursion/content";
import { CodeBlock } from "./CodeBlock";

/**
 * Module 4 (practice) — read a snippet, guess its Big-O, then reveal the answer
 * and the reasoning. Active recall beats being told the answer up front.
 */
export function AnnotateCards() {
  const [shown, setShown] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setShown((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="rec-anno-grid">
      {ANNOTATE_CARDS.map((card, i) => {
        const open = shown.has(i);
        return (
          <div key={i} className="rec-anno">
            <CodeBlock code={card.code} className="rec-code-sm" />
            <button
              className="rec-reveal-btn"
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={open}
            >
              {open ? "Hide answer" : "Guess the Big-O →"}
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  className="rec-anno-body"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <span className={`rec-bigo rec-bigo-${card.cls}`}>{card.bigo}</span>
                  <p className="rec-anno-why">{card.why}</p>
                  <pre className="rec-anno-eg">{card.example}</pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
