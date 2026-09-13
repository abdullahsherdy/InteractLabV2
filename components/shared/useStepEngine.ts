"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  advanceOnTick,
  clampIndex,
  intervalFor,
  isAtEnd,
  isAtStart,
  nextIndex,
  playFrom,
  prevIndex,
} from "@/lib/step/transitions";

export interface StepEngineApi<T> {
  steps: T[];
  index: number;
  current: T | null;
  playing: boolean;
  speed: number;
  atStart: boolean;
  atEnd: boolean;
  total: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (i: number) => void;
  reset: () => void;
  replay: () => void;
  setSpeed: (s: number) => void;
}

export interface StepEngineOptions {
  /** Auto-play cadence at 1× speed, in ms. Tools differ: node hops are quick
   *  (~1100–1400), narration needs longer to read (~2000). */
  baseInterval?: number;
  /** Rewind to 0 and start playing whenever a new `steps` identity arrives.
   *  Reproduces the old `useStepPlayer.load(…, { autoPlay: true })` behaviour
   *  for tools that swap their step array on user actions. */
  autoPlayOnChange?: boolean;
}

/**
 * The one step engine (D3). It generalises the three shipped players —
 * `useStepper`, `useStepPlayer`, `useWalkPlayer` — into a single controlled
 * hook driven by a `steps: T[]` array. A new array identity rewinds to the
 * start (and pauses, unless `autoPlayOnChange`). Index arithmetic lives in the
 * pure, unit-tested `lib/step/transitions` module; this hook only owns React
 * state and the auto-play timer.
 *
 * Pass a *stable* `steps` reference (memoise it, or hold it in state) — the
 * engine keys its rewind on the array's identity.
 */
export function useStepEngine<T>(
  steps: T[],
  { baseInterval = 1100, autoPlayOnChange = false }: StepEngineOptions = {},
): StepEngineApi<T> {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoPlayOnChange && steps.length > 1);
  const [speed, setSpeed] = useState(1);
  const total = steps.length;

  // New step list → back to the start; play or pause per option. A lone step
  // (e.g. an idle placeholder) has nothing to auto-advance, so never autoplays.
  useEffect(() => {
    setIndex(0);
    setPlaying(autoPlayOnChange && steps.length > 1);
  }, [steps, autoPlayOnChange]);

  // Auto-advance while playing; stop when the tick reports the end.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setIndex((i) => {
        const { index: nextI, done } = advanceOnTick(i, total);
        if (done) setPlaying(false);
        return nextI;
      });
    }, intervalFor(baseInterval, speed));
    return () => clearInterval(id);
  }, [playing, speed, total, baseInterval]);

  const play = useCallback(() => {
    setIndex((i) => playFrom(i, total));
    setPlaying(total > 0);
  }, [total]);

  const pause = useCallback(() => setPlaying(false), []);

  const toggle = useCallback(() => {
    setPlaying((p) => {
      if (p) return false;
      setIndex((i) => playFrom(i, total));
      return total > 0;
    });
  }, [total]);

  const next = useCallback(() => {
    setPlaying(false);
    setIndex((i) => nextIndex(i, total));
  }, [total]);

  const prev = useCallback(() => {
    setPlaying(false);
    setIndex((i) => prevIndex(i, total));
  }, [total]);

  const seek = useCallback(
    (i: number) => {
      setPlaying(false);
      setIndex(clampIndex(i, total));
    },
    [total],
  );

  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);

  const replay = useCallback(() => {
    setIndex(0);
    setPlaying(total > 0);
  }, [total]);

  return {
    steps,
    index,
    current: steps[index] ?? null,
    playing,
    speed,
    atStart: isAtStart(index),
    atEnd: isAtEnd(index, total),
    total,
    play,
    pause,
    toggle,
    next,
    prev,
    seek,
    reset,
    replay,
    setSpeed,
  };
}
