"use client";

import { AnimatePresence, motion } from "motion/react";
import type { WalkPlayerApi } from "./useWalkPlayer";

export function WalkTransport({ player }: { player: WalkPlayerApi }) {
  const { current, index, steps, playing } = player;
  if (steps.length === 0) return null;

  return (
    <div className="wt-transport">
      <div className="wt-narration-wrap">
        <span className="wt-narration-marker" aria-hidden="true">
          {current?.phase ?? ""}
        </span>
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            className="wt-narration"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {current?.narration}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="wt-controls">
        <button className="wt-btn" onClick={player.prev} disabled={player.atStart} aria-label="Previous step">
          ⏮
        </button>
        <button
          className="wt-btn wt-btn-play"
          onClick={player.toggle}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button className="wt-btn" onClick={player.next} disabled={player.atEnd} aria-label="Next step">
          ⏭
        </button>
        <button className="wt-btn wt-btn-ghost" onClick={player.reset} aria-label="Restart">
          ↺
        </button>

        <input
          className="wt-scrubber"
          type="range"
          min={0}
          max={steps.length - 1}
          step={1}
          value={index}
          onChange={(e) => player.seek(Number(e.target.value))}
          aria-label="Scrub steps"
        />
        <span className="wt-step-count">
          {index + 1}/{steps.length}
        </span>

        <label className="wt-speed">
          <span>Speed</span>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.5}
            value={player.speed}
            onChange={(e) => player.setSpeed(Number(e.target.value))}
          />
          <span className="wt-speed-val">{player.speed}x</span>
        </label>
      </div>
    </div>
  );
}
