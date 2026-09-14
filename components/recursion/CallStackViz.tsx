"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  buildSteps,
  clampCallN,
  REC_FNS,
  type Frame,
  type RecFn,
} from "@/lib/recursion/call-stack";
import { useStepEngine } from "@/components/shared/useStepEngine";
import { StepTransport } from "@/components/shared/StepTransport";

const STATE_LABEL: Record<Frame["state"], string> = {
  active: "running",
  waiting: "waiting",
  base: "base case",
  returning: "returning",
};

/**
 * Module 2 — the call stack. Pick a recursive function and a size, then step
 * through the calls piling up to the base case and unwinding back with their
 * return values. Every frame is keyed by its depth so motion can animate the
 * push/pop cleanly.
 */
export function CallStackViz() {
  const [fn, setFn] = useState<RecFn>("factorial");
  const [n, setN] = useState(4);

  const steps = useMemo(() => buildSteps(fn, n), [fn, n]);
  const player = useStepEngine(steps);
  const { current, index } = player;

  // Execution log = the narration of every step taken so far.
  const log = steps.slice(0, index + 1);
  const logEnd = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    logEnd.current?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const frames = current?.frames ?? [];
  const blurb = REC_FNS.find((f) => f.value === fn)?.blurb ?? "";

  return (
    <div className="rec-module">
      <div className="rec-toolbar">
        <label className="rec-field">
          <span className="rec-field-label">Function</span>
          <select
            className="rec-select"
            value={fn}
            onChange={(e) => setFn(e.target.value as RecFn)}
          >
            {REC_FNS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>

        <label className="rec-field">
          <span className="rec-field-label">n</span>
          <input
            className="rec-input"
            type="number"
            min={1}
            max={7}
            value={n}
            onChange={(e) => setN(clampCallN(Number(e.target.value)))}
          />
        </label>

        <button className="rec-btn-ghost" type="button" onClick={player.reset}>
          Reset
        </button>
      </div>

      <p className="rec-note">
        <code>{REC_FNS.find((f) => f.value === fn)?.label}</code> {blurb}.
      </p>

      <div className="rec-stack-grid">
        {/* The stack arena — newest frame sits on top. */}
        <div className="rec-arena">
          <p className="rec-arena-label">Call stack</p>
          <div className="rec-frames">
            <AnimatePresence initial={false}>
              {[...frames].reverse().map((f) => (
                <motion.div
                  key={f.depth}
                  layout
                  className={`rec-frame rec-frame-${f.state}`}
                  initial={{ opacity: 0, y: -12, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                >
                  <span className="rec-frame-label">{f.label}</span>
                  <span className="rec-frame-tag">{STATE_LABEL[f.state]}</span>
                  {f.retVal !== null && (
                    <span className="rec-frame-ret">→ {f.retVal}</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {frames.length === 0 && (
              <p className="rec-arena-empty">Stack is empty.</p>
            )}
          </div>
        </div>

        {/* The execution log — one line per step. */}
        <div className="rec-arena">
          <p className="rec-arena-label">Execution log</p>
          <div className="rec-log">
            {log.map((s, i) => (
              <div key={i} className={`rec-log-line rec-log-${s.tone}`}>
                {s.log}
              </div>
            ))}
            <div ref={logEnd} />
          </div>
        </div>
      </div>

      <StepTransport engine={player} caption={current?.caption} />

      {current?.answer && (
        <div className="rec-answer">
          <span className="rec-answer-label">Answer</span>
          <span className="rec-answer-val">{current.answer}</span>
        </div>
      )}
    </div>
  );
}
