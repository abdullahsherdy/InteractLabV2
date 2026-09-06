"use client";

import { MotionConfig } from "motion/react";
import { useMemo } from "react";
import { getProblem } from "@/lib/walkthrough";
import { useWalkPlayer } from "./useWalkPlayer";
import { ArrayCanvas } from "./ArrayCanvas";
import { CodePanel } from "./CodePanel";
import { VarBoard } from "./VarBoard";
import { WalkTransport } from "./WalkTransport";

export function WalkthroughPlayer({ slug }: { slug: string }) {
  const problem = getProblem(slug);
  const steps = useMemo(() => problem?.build() ?? [], [problem]);
  const player = useWalkPlayer(steps);
  const step = player.current;

  if (!problem) return null;

  return (
    // reducedMotion="user" drops transform/layout animation (the sliding
    // pointers, the spring bracket) for viewers who ask for it, while keeping
    // opacity fades — the walkthrough still advances, it just doesn't glide.
    <MotionConfig reducedMotion="user">
      <div className="wt-player">
        <div className="wt-stage">
          <div className="wt-stage-main">
            {step?.viz.kind === "array" && <ArrayCanvas viz={step.viz} />}
            <VarBoard vars={step?.vars ?? []} />
          </div>
          <CodePanel code={problem.code} activeLine={step?.codeLine ?? -1} language={problem.language} />
        </div>
        <WalkTransport player={player} />
      </div>
    </MotionConfig>
  );
}
