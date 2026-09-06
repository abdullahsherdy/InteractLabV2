// Registry of all problem walkthroughs. Add new problems here.

import type { Problem } from "./types";
import { slidingWindowProblem } from "./sliding-window";

export const PROBLEMS: Problem[] = [slidingWindowProblem];

export function getProblem(slug: string): Problem | undefined {
  return PROBLEMS.find((p) => p.slug === slug);
}

export type { Problem, WalkStep, Viz, ArrayViz, VarBinding, Marker, WindowRange, WorkedExample } from "./types";
