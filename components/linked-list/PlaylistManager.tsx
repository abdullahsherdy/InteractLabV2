"use client";

import { useState } from "react";
import {
  addSongSteps,
  makePlaylist,
  playNextSteps,
  playPreviousSteps,
  removeSongSteps,
} from "@/lib/linked-list/operations";
import type { ListState, Step } from "@/lib/linked-list/types";
import { ListCanvas } from "./ListCanvas";
import { StepTransport } from "./StepTransport";
import { useStepPlayer } from "./useStepPlayer";

const START_SONGS = ["Intro", "Sunrise", "Groove", "Outro"];

export function PlaylistManager() {
  const [committed, setCommitted] = useState<ListState>(() => makePlaylist(START_SONGS));
  const [title, setTitle] = useState("");
  const player = useStepPlayer([
    {
      state: makePlaylist(START_SONGS),
      caption: "A playlist is a doubly linked list — that is how “previous song” can work.",
    } as Step,
  ]);

  function commit(steps: Step[]) {
    setCommitted(steps[steps.length - 1].state);
    player.load(steps);
  }

  const nowPlaying = committed.nodes.find((n) => n.id === committed.cursor)?.value ?? "—";

  return (
    <div className="ll-module">
      <div className="ll-nowplaying">
        <span className="ll-np-icon">♪</span>
        <div>
          <p className="ll-np-label">Now playing</p>
          <p className="ll-np-title">{String(nowPlaying)}</p>
        </div>
      </div>
      <div className="ll-toolbar">
        <button className="ll-btn ll-btn-op" onClick={() => commit(playPreviousSteps(committed))}>
          ⏮ play previous
        </button>
        <button className="ll-btn ll-btn-op" onClick={() => commit(playNextSteps(committed))}>
          play next ⏭
        </button>
        <input
          className="ll-input"
          type="text"
          placeholder="song name"
          value={title}
          maxLength={10}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="ll-btn ll-btn-op"
          onClick={() => {
            const t = title.trim() || `Track ${committed.nodes.length + 1}`;
            commit(addSongSteps(committed, t));
            setTitle("");
          }}
        >
          + add song
        </button>
        <button
          className="ll-btn"
          onClick={() => committed.cursor && commit(removeSongSteps(committed, committed.cursor))}
          disabled={!committed.cursor}
        >
          🗑 remove current
        </button>
      </div>
      {player.current && <ListCanvas step={player.current} showPrev cursorLabel="♪ playing" />}
      <StepTransport player={player} />
    </div>
  );
}
