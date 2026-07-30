"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Step } from "@/lib/linked-list/types";

export interface StepPlayerApi {
  steps: Step[];
  index: number;
  current: Step | null;
  playing: boolean;
  speed: number;
  atEnd: boolean;
  load: (steps: Step[], opts?: { autoPlay?: boolean }) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  setSpeed: (s: number) => void;
  reset: () => void;
}

export function useStepPlayer(initialSteps: Step[] = []): StepPlayerApi {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const atEnd = index >= steps.length - 1;

  useEffect(() => {
    if (!playing) return;
    const interval = 1400 / speed;
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

  const load = useCallback((s: Step[], opts?: { autoPlay?: boolean }) => {
    setSteps(s);
    setIndex(0);
    setPlaying(opts?.autoPlay ?? true);
  }, []);

  const play = useCallback(() => {
    setIndex((i) => (i >= steps.length - 1 ? 0 : i));
    setPlaying(true);
  }, [steps.length]);

  return {
    steps,
    index,
    current: steps[index] ?? null,
    playing,
    speed,
    atEnd,
    load,
    play,
    pause: () => setPlaying(false),
    next: () => {
      setPlaying(false);
      setIndex((i) => Math.min(i + 1, steps.length - 1));
    },
    prev: () => {
      setPlaying(false);
      setIndex((i) => Math.max(i - 1, 0));
    },
    setSpeed,
    reset: () => {
      setPlaying(false);
      setIndex(0);
    },
  };
}
