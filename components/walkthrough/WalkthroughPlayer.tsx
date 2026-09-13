"use client";

import { MotionConfig } from "motion/react";
import { useMemo } from "react";
import { getProblem } from "@/lib/walkthrough";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { StepTransport } from "@/components/shared/StepTransport";
import { useStepEngine } from "@/components/shared/useStepEngine";
import { ArrayCanvas } from "./ArrayCanvas";
import { VarBoard } from "./VarBoard";

export function WalkthroughPlayer({ slug }: { slug: string }) {
  const problem = getProblem(slug);
  const steps = useMemo(() => problem?.build() ?? [], [problem]);
  // Narration takes longer to read than a pointer hop, so hold each step at
  // 2000ms at 1× (matches the retired useWalkPlayer's BASE_MS). The steps array
  // has a stable identity (memoised per problem), so no autoplay-on-change.
  const engine = useStepEngine(steps, { baseInterval: 2000 });
  const step = engine.current;
  const code = useMemo(() => problem?.code.join("\n") ?? "", [problem]);

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
          {/* Shared framed code plate: its `.hl` line reads var(--accent), so the
              executing line lights up in the walkthrough ink. codeLine is
              0-indexed (-1 = none); CodeBlock.highlight is 1-based. */}
          <CodeBlock
            code={code}
            lang={problem.language}
            showLineNumbers
            highlight={step && step.codeLine >= 0 ? step.codeLine + 1 : undefined}
          />
        </div>
        {/* One shared transport (D3). The narration is the aria-live caption;
            the optional phase groups steps as a small mono prefix. */}
        <StepTransport
          engine={engine}
          caption={
            step ? (
              <>
                {step.phase ? <b className="wt-phase">{step.phase}</b> : null}
                {step.narration}
              </>
            ) : undefined
          }
        />
      </div>
    </MotionConfig>
  );
}
