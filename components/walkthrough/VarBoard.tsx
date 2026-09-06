"use client";

import { motion } from "motion/react";
import type { VarBinding } from "@/lib/walkthrough/types";

export function VarBoard({ vars }: { vars: VarBinding[] }) {
  return (
    <div className="wt-vars" aria-label="Variable values">
      {vars.map((v) => (
        <motion.div
          key={v.name}
          className="wt-var"
          animate={
            v.changed
              ? { scale: [1, 1.06, 1], borderColor: [v.color ?? "var(--border-strong)", v.color ?? "var(--teal)"] }
              : {}
          }
          transition={{ duration: 0.4 }}
          style={{ borderLeftColor: v.color ?? "var(--border-strong)" }}
        >
          <span className="wt-var-name">{v.name}</span>
          <motion.span
            key={v.value}
            className="wt-var-value"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{ color: v.color }}
          >
            {v.value}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}
