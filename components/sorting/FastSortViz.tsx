"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { mergeSort, quickSort, type MergeOp, type QuickOp } from "@/lib/sorting/fast-sorts";
import { PRESETS, parseArray } from "@/lib/sorting/util";
import { FAST_CODE, FAST_EXPLAIN } from "@/lib/sorting/content";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { useStepper } from "@/components/shared/useStepper";

type FastAlgo = "merge" | "quick";

// One colour per recursion depth, cycled — so sibling sub-arrays at the same
// level read as "the same layer of the split".
const DEPTH_COLORS = ["#1D9E75", "#1D4ED8", "#BA7517", "#534AB7", "#B91C1C", "#C2410C"];
const depthColor = (d: number) => DEPTH_COLORS[d % DEPTH_COLORS.length];

/** A row of number pills, tinted by recursion depth. */
function Pills({ values, depth, muted }: { values: number[]; depth: number; muted?: boolean }) {
  const color = depthColor(depth);
  if (values.length === 0) {
    return <span className="sort-pill-empty">empty</span>;
  }
  return (
    <span className="sort-pills">
      {values.map((v, i) => (
        <span
          key={i}
          className="sort-pill"
          style={{
            borderColor: color,
            color: muted ? "var(--text-secondary)" : color,
            background: muted ? "transparent" : `${color}14`,
          }}
        >
          {v}
        </span>
      ))}
    </span>
  );
}

function MergeStage({ op }: { op: MergeOp }) {
  if (op.kind === "split") {
    return (
      <div className="sort-stage" style={{ marginLeft: op.depth * 20 }}>
        <span className="sort-stage-tag" style={{ background: depthColor(op.depth) }}>
          split
        </span>
        <Pills values={op.input} depth={op.depth} />
        <span className="sort-stage-arrow">→</span>
        <Pills values={op.left} depth={op.depth + 1} />
        <Pills values={op.right} depth={op.depth + 1} />
      </div>
    );
  }
  if (op.kind === "base") {
    return (
      <div className="sort-stage" style={{ marginLeft: op.depth * 20 }}>
        <span className="sort-stage-tag sort-stage-tag-base">base</span>
        <Pills values={op.run} depth={op.depth} />
      </div>
    );
  }
  return (
    <div className="sort-stage" style={{ marginLeft: op.depth * 20 }}>
      <span className="sort-stage-tag" style={{ background: depthColor(op.depth) }}>
        merge
      </span>
      <Pills values={op.left} depth={op.depth + 1} muted />
      <span className="sort-stage-plus">+</span>
      <Pills values={op.right} depth={op.depth + 1} muted />
      <span className="sort-stage-arrow">→</span>
      <Pills values={op.result} depth={op.depth} />
    </div>
  );
}

function QuickStage({ op }: { op: QuickOp }) {
  if (op.kind === "partition") {
    return (
      <div className="sort-stage" style={{ marginLeft: op.depth * 20 }}>
        <span className="sort-stage-tag" style={{ background: depthColor(op.depth) }}>
          partition
        </span>
        <Pills values={op.left} depth={op.depth + 1} />
        <span className="sort-pill sort-pill-pivot">{op.pivot}</span>
        <Pills values={op.right} depth={op.depth + 1} />
      </div>
    );
  }
  if (op.kind === "base") {
    return (
      <div className="sort-stage" style={{ marginLeft: op.depth * 20 }}>
        <span className="sort-stage-tag sort-stage-tag-base">base</span>
        <Pills values={op.run} depth={op.depth} />
      </div>
    );
  }
  return (
    <div className="sort-stage" style={{ marginLeft: op.depth * 20 }}>
      <span className="sort-stage-tag" style={{ background: depthColor(op.depth) }}>
        combine
      </span>
      <Pills values={op.left} depth={op.depth + 1} muted />
      <span className="sort-pill sort-pill-pivot">{op.pivot}</span>
      <Pills values={op.right} depth={op.depth + 1} muted />
      <span className="sort-stage-arrow">→</span>
      <Pills values={op.result} depth={op.depth} />
    </div>
  );
}

/**
 * Module 2 — the O(n log n) divide-and-conquer sorts. These don't map cleanly to
 * a single bar chart, so instead we replay the recursion trace one op at a time:
 * split/merge for merge sort, partition/combine for quick sort. Sub-arrays are
 * tinted by recursion depth and indented so the tree shape is visible.
 */
export function FastSortViz() {
  const [algo, setAlgo] = useState<FastAlgo>("merge");
  const [data, setData] = useState<number[]>(PRESETS[0].value);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  const trace = useMemo(() => (algo === "merge" ? mergeSort(data) : quickSort(data)), [algo, data]);
  const ops: (MergeOp | QuickOp)[] = trace.ops;
  const player = useStepper(ops);
  const { current, index } = player;

  const kindLabel = current ? current.kind : "—";

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
      <div className="sort-segmented" role="tablist" aria-label="Divide-and-conquer sort">
        {(["merge", "quick"] as FastAlgo[]).map((a) => (
          <button
            key={a}
            type="button"
            role="tab"
            aria-selected={algo === a}
            className={`sort-seg${algo === a ? " active" : ""}`}
            onClick={() => setAlgo(a)}
          >
            {a === "merge" ? "Merge" : "Quick"}
          </button>
        ))}
      </div>

      <div className="sort-explain">
        <strong>{FAST_EXPLAIN[algo].title}</strong>
        <p>{FAST_EXPLAIN[algo].body}</p>
      </div>

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

      {/* Trace stage */}
      <div className="sort-trace">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {current &&
              (algo === "merge" ? (
                <MergeStage op={current as MergeOp} />
              ) : (
                <QuickStage op={current as QuickOp} />
              ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stats */}
      <div className="sort-stats">
        <div className="sort-stat">
          <span className="sort-stat-num">{kindLabel}</span>
          <span className="sort-stat-label">This step</span>
        </div>
        <div className="sort-stat">
          <span className="sort-stat-num">{current?.depth ?? 0}</span>
          <span className="sort-stat-label">Depth</span>
        </div>
        <div className="sort-stat">
          <span className="sort-stat-num">{trace.maxDepth}</span>
          <span className="sort-stat-label">Max depth</span>
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

      <p className="sort-result">
        Sorted result: <strong>[{trace.result.join(", ")}]</strong>
      </p>

      <details className="sort-code-toggle">
        <summary>Show the Python</summary>
        <CodeBlock code={FAST_CODE[algo]} />
      </details>
    </div>
  );
}
