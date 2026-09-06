"use client";

import { motion } from "motion/react";

export function CodePanel({
  code,
  activeLine,
  language,
}: {
  code: string[];
  activeLine: number;
  language: string;
}) {
  return (
    <div className="wt-code" aria-label={`${language} pseudocode`}>
      <div className="wt-code-head">
        <span className="wt-code-dot" />
        <span className="wt-code-dot" />
        <span className="wt-code-dot" />
        <span className="wt-code-lang">{language}</span>
      </div>
      <pre className="wt-code-body">
        {code.map((line, i) => {
          const active = i === activeLine;
          return (
            <div key={i} className={`wt-code-line${active ? " active" : ""}`}>
              {active && (
                <motion.span
                  layoutId="wt-code-cursor"
                  className="wt-code-highlight"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              <span className="wt-code-gutter">{i + 1}</span>
              <code className="wt-code-text">{line === "" ? " " : line}</code>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
