"use client";

import { useState } from "react";
import {
  appendSteps,
  deleteValueSteps,
  insertAtHeadBuggySteps,
  insertAtHeadSteps,
  makeSingly,
} from "@/lib/linked-list/operations";
import type { ListState, Step } from "@/lib/linked-list/types";
import { StepTransport } from "@/components/shared/StepTransport";
import { useStepEngine } from "@/components/shared/useStepEngine";
import { ListCanvas } from "./ListCanvas";

function idle(state: ListState, caption: string): Step {
  return { state, caption };
}

export function NodeChainBuilder() {
  const [committed, setCommitted] = useState<ListState>(() => makeSingly([3, 7, 12]));
  const [value, setValue] = useState("");
  const [buggy, setBuggy] = useState(false);
  const [steps, setSteps] = useState<Step[]>(() => [
    idle(makeSingly([3, 7, 12]), "Try an operation — every pointer move is animated step by step."),
  ]);
  const engine = useStepEngine(steps, { baseInterval: 1400, autoPlayOnChange: true });

  function run(op: (s: ListState, v: string | number) => Step[]) {
    const v: string | number = value.trim() === "" ? Math.floor(Math.random() * 90) + 10 : isNaN(Number(value)) ? value.trim() : Number(value);
    const next = op(committed, v);
    setCommitted(next[next.length - 1].state);
    setSteps(next);
    setValue("");
  }

  function reset() {
    const fresh = makeSingly([3, 7, 12]);
    setCommitted(fresh);
    setSteps([idle(fresh, "Back to the starting chain: 3 → 7 → 12.")]);
  }

  return (
    <div className="ll-module">
      <div className="ll-toolbar">
        <input
          className="ll-input"
          type="text"
          inputMode="numeric"
          placeholder="value"
          value={value}
          maxLength={6}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="ll-btn ll-btn-op" onClick={() => run(appendSteps)}>
          append
        </button>
        <button
          className="ll-btn ll-btn-op"
          onClick={() => run(buggy ? insertAtHeadBuggySteps : insertAtHeadSteps)}
        >
          insert at head
        </button>
        <button className="ll-btn ll-btn-op" onClick={() => run(deleteValueSteps)}>
          delete value
        </button>
        <button className="ll-btn" onClick={reset}>
          reset
        </button>
        <label className={`ll-bug-toggle${buggy ? " on" : ""}`}>
          <input type="checkbox" checked={buggy} onChange={(e) => setBuggy(e.target.checked)} />
          🐛 break the chain (skip saving <code>next</code>)
        </label>
      </div>
      {engine.current && <ListCanvas step={engine.current} />}
      <StepTransport engine={engine} caption={engine.current?.caption} />
    </div>
  );
}
