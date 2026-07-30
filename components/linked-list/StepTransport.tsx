"use client";

import { AnimatePresence, motion } from "motion/react";
import type { StepPlayerApi } from "./useStepPlayer";

export function StepTransport({ player }: { player: StepPlayerApi }) {
  const { current, index, steps, playing } = player;
  if (steps.length === 0) return null;

  return (
    <div className="ll-transport">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          className="ll-caption"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {current?.caption}
        </motion.p>
      </AnimatePresence>

      <div className="ll-controls">
        <button
          className="ll-btn"
          onClick={player.prev}
          disabled={index === 0}
          aria-label="Previous step"
        >
          ⏮
        </button>
        <button
          className="ll-btn ll-btn-play"
          onClick={playing ? player.pause : player.play}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button
          className="ll-btn"
          onClick={player.next}
          disabled={player.atEnd}
          aria-label="Next step"
        >
          ⏭
        </button>

        <div className="ll-progress" aria-hidden="true">
          {steps.map((_, i) => (
            <span key={i} className={`ll-dot${i <= index ? " on" : ""}`} />
          ))}
        </div>

        <label className="ll-speed">
          <span>Speed</span>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.5}
            value={player.speed}
            onChange={(e) => player.setSpeed(Number(e.target.value))}
          />
          <span className="ll-speed-val">{player.speed}x</span>
        </label>
      </div>
    </div>
  );
}
