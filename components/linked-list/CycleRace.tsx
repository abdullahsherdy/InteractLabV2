"use client";

import { useState } from "react";
import { floydSteps } from "@/lib/linked-list/operations";
import { ListCanvas } from "./ListCanvas";
import { StepTransport } from "./StepTransport";
import { useStepPlayer } from "./useStepPlayer";

const VALUES = [1, 2, 3, 4, 5, 6];
const CYCLE_TO = 2;

export function CycleRace() {
  const [cycleOn, setCycleOn] = useState(true);
  const player = useStepPlayer([
    {
      state: floydSteps(VALUES, CYCLE_TO, false).steps[0].state,
      caption: "Two runners on a track: the tortoise (slow) and the hare (fast). Press Start!",
    },
  ]);

  function start(findStart: boolean) {
    const { steps } = floydSteps(VALUES, cycleOn ? CYCLE_TO : null, findStart);
    player.load(steps);
  }

  return (
    <div className="ll-module">
      <div className="ll-toolbar">
        <label className={`ll-bug-toggle${cycleOn ? " on" : ""}`}>
          <input type="checkbox" checked={cycleOn} onChange={(e) => setCycleOn(e.target.checked)} />
          🔄 track loops back (cycle)
        </label>
        <button className="ll-btn ll-btn-op" onClick={() => start(false)}>
          ▶ start the race
        </button>
        <button className="ll-btn ll-btn-op" onClick={() => start(true)} disabled={!cycleOn}>
          🎯 also find where the cycle starts
        </button>
      </div>
      <div className="ll-legend">
        <span><i className="ll-swatch" style={{ background: "var(--green)" }} /> slow — 1 step per tick</span>
        <span><i className="ll-swatch" style={{ background: "var(--amber)" }} /> fast — 2 steps per tick</span>
      </div>
      {player.current && <ListCanvas step={player.current} />}
      <StepTransport player={player} />
    </div>
  );
}
