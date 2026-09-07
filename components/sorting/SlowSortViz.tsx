"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { SLOW_SORTS, type SlowAlgo, type SlowStep } from "@/lib/sorting/slow-sorts";
import { PRESETS, parseArray } from "@/lib/sorting/util";
import { SLOW_CODE } from "@/lib/sorting/content";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { useStepper } from "@/components/shared/useStepper";

const ALGOS: { value: SlowAlgo; label: string; blurb: string }[] = [
  {
    value: "bubble",
    label: "Bubble",
    blurb: "compare each neighbouring pair and let the biggest value bubble to the end each pass",
  },
  {
    value: "selection",
    label: "Selection",
    blurb: "scan the unsorted part for the smallest value and move it to the front",
  },
  {
    value: "insertion",
    label: "Insertion",
    blurb: "grow a sorted pile on the left, sliding each new card back to where it belongs",
  },
];

type BarState = "swap" | "compare" | "key" | "min" | "sorted" | "default";

function barState(step: SlowStep | null, i: number): BarState {
  if (!step) return "default";
  if (step.swapping.includes(i)) return "swap";
  if (step.comparing.includes(i)) return "compare";
  if (step.key === i) return "key";
  if (step.min === i) return "min";
  if (step.sorted.includes(i)) return "sorted";
  return "default";
}

/**
 * Module 1 — the O(n²) sorts, side by side on one bar chart. Pick an algorithm,
 * feed it a preset or your own numbers, and step through every compare and swap.
 * The bars carry colour so the "what's happening right now" reads at a glance:
 * amber = comparing, red = swapping, green = locked in place.
 */
export function SlowSortViz() {
  const [algo, setAlgo] = useState<SlowAlgo>("bubble");
  const [data, setData] = useState<number[]>(PRESETS[0].value);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  const steps = useMemo(() => SLOW_SORTS[algo](data), [algo, data]);
  const player = useStepper(steps);
  const { current, index } = player;

  const array = current?.array ?? data;
  const maxVal = Math.max(...array, 1);
  const meta = ALGOS.find((a) => a.value === algo)!;

  const applyCustom = () => {
    const parsed = parseArray(draft);
    if (parsed.length < 2) {
      setError("Type at least 2 numbers between 1 and 99.");
      return;
    }
    setError("");
    setData(parsed);
  };

  return (
    <div className="sort-module">
      {/* Algorithm sub-nav */}
      <div className="sort-segmented" role="tablist" aria-label="Sorting algorithm">
        {ALGOS.map((a) => (
          <button
            key={a.value}
            type="button"
            role="tab"
            aria-selected={algo === a.value}
            className={`sort-seg${algo === a.value ? " active" : ""}`}
            onClick={() => setAlgo(a.value)}
          >
            {a.label}
          </button>
        ))}
      </div>

      <p className="sort-note">
        <strong>{meta.label} sort</strong> — {meta.blurb}.
      </p>

      {/* Data controls */}
      <div className="sort-toolbar">
        <label className="sort-field">
          <span className="sort-field-label">Preset</span>
          <select
            className="sort-select"
            value=""
            onChange={(e) => {
              const preset = PRESETS[Number(e.target.value)];
              if (preset) {
                setError("");
                setData(preset.value);
              }
            }}
          >
            <option value="" disabled>
              Choose a list…
            </option>
            {PRESETS.map((p, i) => (
              <option key={p.label} value={i}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="sort-field sort-field-grow">
          <span className="sort-field-label">Your own numbers</span>
          <div className="sort-custom">
            <input
              className="sort-input"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 8, 3, 5, 1, 9"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyCustom();
              }}
            />
            <button className="sort-btn-ghost" type="button" onClick={applyCustom}>
              Visualize
            </button>
          </div>
        </label>
      </div>
      <p className={`sort-hint${error ? " sort-hint-error" : ""}`}>
        {error || "Whole numbers 1–99, up to 12 of them."}
      </p>

      {/* The bar chart */}
      <div className="sort-arena">
        <div className="sort-bars" role="img" aria-label={`Array: ${array.join(", ")}`}>
          {array.map((v, i) => {
            const state = barState(current, i);
            return (
              <div key={i} className="sort-bar-col">
                <div className="sort-bar-track">
                  <motion.div
                    className={`sort-bar sort-bar-${state}`}
                    initial={false}
                    animate={{ height: `${(v / maxVal) * 100}%` }}
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  />
                </div>
                <span className={`sort-bar-label sort-bar-label-${state}`}>{v}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="sort-legend">
          <span className="sort-legend-item"><i className="sort-dot sort-bar-compare" /> comparing</span>
          <span className="sort-legend-item"><i className="sort-dot sort-bar-swap" /> swapping</span>
          {algo === "insertion" && (
            <span className="sort-legend-item"><i className="sort-dot sort-bar-key" /> the card in hand</span>
          )}
          {algo === "selection" && (
            <span className="sort-legend-item"><i className="sort-dot sort-bar-min" /> smallest so far</span>
          )}
          <span className="sort-legend-item"><i className="sort-dot sort-bar-sorted" /> locked in place</span>
        </div>
      </div>

      {/* Stats */}
      <div className="sort-stats">
        <div className="sort-stat">
          <span className="sort-stat-num">{current?.pass ?? 0}</span>
          <span className="sort-stat-label">Pass</span>
        </div>
        <div className="sort-stat">
          <span className="sort-stat-num">{current?.comparisons ?? 0}</span>
          <span className="sort-stat-label">Comparisons</span>
        </div>
        <div className="sort-stat">
          <span className="sort-stat-num">{current?.swaps ?? 0}</span>
          <span className="sort-stat-label">Swaps</span>
        </div>
      </div>

      {/* Caption */}
      <p className="sort-caption">{current?.note}</p>

      {/* Transport */}
      <div className="sort-transport">
        <button className="sort-btn" onClick={player.prev} disabled={player.atStart} aria-label="Previous step">
          ⏮
        </button>
        <button
          className="sort-btn sort-btn-play"
          onClick={player.playing ? player.pause : player.play}
          aria-label={player.playing ? "Pause" : "Play"}
        >
          {player.playing ? "❚❚" : "▶"}
        </button>
        <button className="sort-btn" onClick={player.next} disabled={player.atEnd} aria-label="Next step">
          ⏭
        </button>
        <span className="sort-step-count">
          Step {index + 1} / {player.total}
        </span>
        <label className="sort-speed">
          <span>Speed</span>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.5}
            value={player.speed}
            onChange={(e) => player.setSpeed(Number(e.target.value))}
          />
          <span>{player.speed}x</span>
        </label>
      </div>

      <details className="sort-code-toggle">
        <summary>Show the Python</summary>
        <CodeBlock code={SLOW_CODE[algo]} />
      </details>
    </div>
  );
}
