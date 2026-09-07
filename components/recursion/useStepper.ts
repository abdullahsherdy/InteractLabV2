"use client";

import { useEffect, useState } from "react";

export interface StepperApi<T> {
  index: number;
  current: T | null;
  playing: boolean;
  speed: number;
  atStart: boolean;
  atEnd: boolean;
  total: number;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  setSpeed: (s: number) => void;
}

/**
 * A tiny, type-generic step player. Mirrors the linked-list `useStepPlayer`
 * pattern but is agnostic about the step shape so the call-stack tracer can
 * drive it. Pass a *memoised* `steps` array — the player rewinds to the start
 * whenever the array identity changes (i.e. a new function/size was chosen).
 */
export function useStepper<T>(steps: T[], baseInterval = 1100): StepperApi<T> {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // New step list → back to the beginning, paused.
  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [steps]);

  const atEnd = index >= steps.length - 1;
  const atStart = index <= 0;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, baseInterval / speed);
    return () => clearInterval(id);
  }, [playing, speed, steps.length, baseInterval]);

  return {
    index,
    current: steps[index] ?? null,
    playing,
    speed,
    atStart,
    atEnd,
    total: steps.length,
    play: () => {
      setIndex((i) => (i >= steps.length - 1 ? 0 : i));
      setPlaying(true);
    },
    pause: () => setPlaying(false),
    next: () => {
      setPlaying(false);
      setIndex((i) => Math.min(i + 1, steps.length - 1));
    },
    prev: () => {
      setPlaying(false);
      setIndex((i) => Math.max(i - 1, 0));
    },
    reset: () => {
      setPlaying(false);
      setIndex(0);
    },
    setSpeed,
  };
}
