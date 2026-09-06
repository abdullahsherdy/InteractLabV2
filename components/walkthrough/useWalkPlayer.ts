"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WalkStep } from "@/lib/walkthrough/types";

export interface WalkPlayerApi {
  steps: WalkStep[];
  index: number;
  current: WalkStep | null;
  playing: boolean;
  speed: number;
  atEnd: boolean;
  atStart: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (i: number) => void;
  setSpeed: (s: number) => void;
  reset: () => void;
}

// Steps hold at 2000ms at 1x; narration needs longer to read than a pointer hop.
const BASE_MS = 2000;

export function useWalkPlayer(steps: WalkStep[]): WalkPlayerApi {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const atEnd = index >= steps.length - 1;
  const atStart = index <= 0;

  useEffect(() => {
    if (!playing) return;
    const interval = BASE_MS / speed;
    timer.current = setInterval(() => {
      setIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, interval);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, speed, steps.length]);

  const play = useCallback(() => {
    setIndex((i) => (i >= steps.length - 1 ? 0 : i));
    setPlaying(true);
  }, [steps.length]);

  const pause = useCallback(() => setPlaying(false), []);

  return {
    steps,
    index,
    current: steps[index] ?? null,
    playing,
    speed,
    atEnd,
    atStart,
    play,
    pause,
    toggle: () => (playing ? pause() : play()),
    next: () => {
      setPlaying(false);
      setIndex((i) => Math.min(i + 1, steps.length - 1));
    },
    prev: () => {
      setPlaying(false);
      setIndex((i) => Math.max(i - 1, 0));
    },
    seek: (i: number) => {
      setPlaying(false);
      setIndex(Math.max(0, Math.min(i, steps.length - 1)));
    },
    setSpeed,
    reset: () => {
      setPlaying(false);
      setIndex(0);
    },
  };
}
