"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { StepEngineApi } from "./useStepEngine";

interface StepTransportProps<T> {
  engine: StepEngineApi<T>;
  /** The current step's human caption, resolved by the caller from
   *  `engine.current` (tools name this field differently — `.caption`,
   *  `.narration`, …), so the transport stays agnostic about step shape. */
  caption?: ReactNode;
  /** Show a dot-per-step strip in addition to the scrubber. Off by default —
   *  the scrubber is what scales past ~30 steps (the reason dots were dropped). */
  dots?: boolean;
}

/**
 * The one transport (D3). Driven by any {@link StepEngineApi}, it renders the
 * redesigned playback controls from the spec: a "Step X / Y" readout, an
 * `aria-live` caption, prev/play/next, a scrubber with a tabular count, a speed
 * slider, and a keyboard map (Space / ← → / Home / End / R). Replaces the
 * per-tool dot transports, which rendered one node per step and broke on long
 * sequences.
 */
export function StepTransport<T>({ engine, caption, dots = false }: StepTransportProps<T>) {
  const { index, total, playing, speed, atStart, atEnd, steps } = engine;
  const reduce = useReducedMotion();

  if (total === 0) return null;

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    const isRange = target instanceof HTMLInputElement && target.type === "range";
    const isButton = target.tagName === "BUTTON";
    switch (e.key) {
      case " ":
      case "Spacebar":
        if (isButton) return; // let a focused button activate natively
        e.preventDefault();
        engine.toggle();
        break;
      case "ArrowLeft":
        if (isRange) return; // let a focused slider scrub natively
        e.preventDefault();
        engine.prev();
        break;
      case "ArrowRight":
        if (isRange) return;
        e.preventDefault();
        engine.next();
        break;
      case "Home":
        e.preventDefault();
        engine.seek(0);
        break;
      case "End":
        e.preventDefault();
        engine.seek(total - 1);
        break;
      case "r":
      case "R":
        e.preventDefault();
        engine.replay();
        break;
      default:
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="transport" role="group" aria-label="Playback controls" onKeyDown={onKeyDown}>
      <div className="tp-caption">
        <span className="sn">
          Step {index + 1} / {total}
        </span>
        <span className="tp-cap-live" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={index}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: reduce ? 0 : 0.2 }}
            >
              {caption}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>

      <div className="tp-controls">
        <button className="tp-btn" type="button" onClick={engine.prev} disabled={atStart} aria-label="Previous step">
          ⏮
        </button>
        <button
          className="tp-btn play"
          type="button"
          onClick={engine.toggle}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button className="tp-btn" type="button" onClick={engine.next} disabled={atEnd} aria-label="Next step">
          ⏭
        </button>

        <div className="tp-scrub">
          <input
            type="range"
            min={0}
            max={Math.max(0, total - 1)}
            step={1}
            value={index}
            onChange={(e) => engine.seek(Number(e.target.value))}
            aria-label="Step scrubber"
          />
          <span className="tp-count">
            {index + 1} / {total}
          </span>
        </div>

        <label className="tp-speed">
          speed
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.5}
            value={speed}
            onChange={(e) => engine.setSpeed(Number(e.target.value))}
            aria-label="Playback speed"
          />
          <span>{speed}×</span>
        </label>
      </div>

      {dots && (
        <div className="tp-dots" aria-hidden="true">
          {steps.map((_, i) => (
            <span key={i} className={`tp-dot${i <= index ? " on" : ""}`} />
          ))}
        </div>
      )}

      <div className="kb-hint">
        <kbd>Space</kbd> play/pause · <kbd>←</kbd>
        <kbd>→</kbd> step · <kbd>Home</kbd>/<kbd>End</kbd> jump · <kbd>R</kbd> replay
      </div>
    </div>
  );
}
