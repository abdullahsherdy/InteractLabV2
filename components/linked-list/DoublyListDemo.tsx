"use client";

import { useState } from "react";
import {
  appendDoublySteps,
  chainFromHead,
  makeDoubly,
  removeNodeDoublySteps,
} from "@/lib/linked-list/operations";
import type { ListState, Step } from "@/lib/linked-list/types";
import { ListCanvas } from "./ListCanvas";
import { StepTransport } from "./StepTransport";
import { useStepPlayer } from "./useStepPlayer";

export function DoublyListDemo() {
  const [committed, setCommitted] = useState<ListState>(() => makeDoubly(["A", "B", "C"]));
  const [value, setValue] = useState("");
  const player = useStepPlayer([
    {
      state: makeDoubly(["A", "B", "C"]),
      caption: "Each dancer holds two hands: next (teal, above) and prev (purple, below).",
    } as Step,
  ]);

  function commit(steps: Step[]) {
    setCommitted(steps[steps.length - 1].state);
    player.load(steps);
  }

  function append() {
    const v = value.trim() === "" ? String.fromCharCode(65 + committed.nodes.length) : value.trim();
    commit(appendDoublySteps(committed, v));
    setValue("");
  }

  const chain = chainFromHead(committed);

  return (
    <div className="ll-module">
      <div className="ll-toolbar">
        <input
          className="ll-input"
          type="text"
          placeholder="value"
          value={value}
          maxLength={6}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="ll-btn ll-btn-op" onClick={append}>
          append
        </button>
        <span className="ll-hint">remove a dancer:</span>
        {chain.map((id) => {
          const node = committed.nodes.find((n) => n.id === id)!;
          return (
            <button
              key={id}
              className="ll-btn ll-btn-node"
              onClick={() => commit(removeNodeDoublySteps(committed, id))}
            >
              ✕ {String(node.value)}
            </button>
          );
        })}
        <button
          className="ll-btn"
          onClick={() => {
            const fresh = makeDoubly(["A", "B", "C"]);
            setCommitted(fresh);
            player.load([{ state: fresh, caption: "Back to the starting dance line: A ⇄ B ⇄ C." }]);
          }}
        >
          reset
        </button>
      </div>
      <div className="ll-legend">
        <span><i className="ll-swatch" style={{ background: "var(--teal)" }} /> next</span>
        <span><i className="ll-swatch" style={{ background: "var(--purple)" }} /> prev</span>
      </div>
      {player.current && <ListCanvas step={player.current} showPrev />}
      <StepTransport player={player} />
    </div>
  );
}
