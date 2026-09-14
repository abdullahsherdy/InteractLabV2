"use client";

// Interactive driver for a stack or queue. Mirrors the Linked-Lists pattern:
// the committed structure lives in useState; each operation builds a fresh Step[]
// (pure, from lib/stacks) that is swapped into state, so useStepEngine rewinds to
// 0 and autoplays the operation, and StepTransport lets the learner scrub it.
// One component serves both structures — the op set and seed differ by `kind`.

import { useState } from "react";
import { useStepEngine } from "@/components/shared/useStepEngine";
import { StepTransport } from "@/components/shared/StepTransport";
import { StructCanvas } from "./StructCanvas";
import {
  clearSteps,
  dequeueSteps,
  enqueueSteps,
  makeQueue,
  makeStack,
  peekQueueSteps,
  peekStackSteps,
  popSteps,
  pushSteps,
} from "@/lib/stacks/operations";
import type { CellValue, Step, StructState, Structure } from "@/lib/stacks/types";

type Op =
  | { label: string; needsValue: true; make: (s: StructState, v: CellValue) => Step[] }
  | { label: string; needsValue: false; make: (s: StructState) => Step[] };

const STACK_INIT: CellValue[] = [3, 7, 1, 9]; // top (stack[-1]) = 9
const QUEUE_INIT: CellValue[] = [5, 2, 8, 4]; // front = 5, back = 4

const STACK_OPS: Op[] = [
  { label: "push", needsValue: true, make: pushSteps },
  { label: "pop", needsValue: false, make: popSteps },
  { label: "peek", needsValue: false, make: peekStackSteps },
  { label: "clear", needsValue: false, make: clearSteps },
];

const QUEUE_OPS: Op[] = [
  { label: "enqueue", needsValue: true, make: enqueueSteps },
  { label: "dequeue", needsValue: false, make: dequeueSteps },
  { label: "peek", needsValue: false, make: peekQueueSteps },
];

function seed(kind: Structure): StructState {
  return kind === "stack" ? makeStack(STACK_INIT) : makeQueue(QUEUE_INIT);
}

/** Parse the input box: blank → a random 2-digit number; numeric → number; else the trimmed string. */
function parseValue(raw: string): CellValue {
  const t = raw.trim();
  if (t === "") return Math.floor(Math.random() * 90) + 10;
  return isNaN(Number(t)) ? t : Number(t);
}

export function StructDemo({ kind }: { kind: Structure }) {
  const idleCaption =
    kind === "stack" ? "Push, pop, or peek the stack." : "Enqueue, dequeue, or peek the queue.";
  const ops = kind === "stack" ? STACK_OPS : QUEUE_OPS;

  const [committed, setCommitted] = useState<StructState>(() => seed(kind));
  const [value, setValue] = useState("");
  const [steps, setSteps] = useState<Step[]>(() => [{ state: seed(kind), caption: idleCaption }]);
  const engine = useStepEngine(steps, { baseInterval: 1300, autoPlayOnChange: true });

  function run(op: Op) {
    const next = op.needsValue ? op.make(committed, parseValue(value)) : op.make(committed);
    setCommitted(next[next.length - 1].state);
    setSteps(next);
    setValue("");
  }

  const current = engine.current?.state ?? committed;

  return (
    <div className="sq-demo">
      <div className="sq-toolbar" role="group" aria-label={`${kind} operations`}>
        <input
          className="sq-input"
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="value"
          aria-label={`value to ${kind === "stack" ? "push" : "enqueue"}`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              run(ops[0]);
            }
          }}
        />
        {ops.map((op) => (
          <button
            key={op.label}
            type="button"
            className={`sq-btn${op.needsValue ? " sq-btn-op" : ""}`}
            onClick={() => run(op)}
          >
            {op.label}
          </button>
        ))}
      </div>

      <div className="diagram sq-canvas">
        <StructCanvas state={current} />
      </div>

      <StepTransport engine={engine} caption={engine.current?.caption} />
    </div>
  );
}
