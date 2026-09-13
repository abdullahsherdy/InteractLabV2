import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/layout/Reveal";
import { Analogy } from "@/components/shared/Analogy";
import { WalkthroughPlayer } from "@/components/walkthrough/WalkthroughPlayer";

import { getProblem, PROBLEMS } from "@/lib/walkthrough";
import "../walkthroughs.css";

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) return { title: "Problem Walkthroughs — InteractLab" };
  return {
    title: `${problem.title} — Problem Walkthroughs`,
    description: problem.oneLiner,
  };
}

// Draw the whole page in the Walkthroughs ink; the shared kit (crumb, tags,
// plate captions, field-note, transport, code highlight) all read var(--accent).
const heroStyle = { "--accent": "var(--ink-walk)" } as CSSProperties;
const mainStyle = {
  "--accent": "var(--ink-walk)",
  maxWidth: "var(--content-wide)",
  paddingTop: 28,
  display: "flex",
  flexDirection: "column",
  gap: "clamp(28px, 5vw, 48px)",
} as CSSProperties;

export default async function WalkthroughProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();

  return (
    <>
      <section className="tutorial-hero" style={heroStyle}>
        <Reveal>
          <p className="crumb">
            <Link href="/">InteractLab</Link>
            <span aria-hidden="true">/</span>
            <Link href="/walkthroughs/">Problem Walkthroughs</Link>
            <span aria-hidden="true">/</span>
            <b>{problem.title}</b>
          </p>
          <h1>{problem.title}</h1>
          <p className="hero-desc">{problem.oneLiner}</p>
          <div className="hero-tags">
            {problem.tags.map((t) => (
              <span key={t} className="tag accent">
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <main className="tutorial-main" style={mainStyle}>
        {/* Intuition — the analogy-before-abstraction field-note. */}
        <Reveal>
          <Analogy title="The big idea" icon="walkthrough">
            {problem.intuition}
          </Analogy>
        </Reveal>

        {/* Statement */}
        <Reveal>
          <section className="plate">
            <div className="plate-cap">
              <span className="plate-no">Problem</span>
              <span className="plate-t">What are we solving?</span>
            </div>
            <div className="plate-b">
              <div className="wt-statement">
                {problem.statement.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* Worked examples */}
        <Reveal>
          <section className="plate">
            <div className="plate-cap">
              <span className="plate-no">Examples</span>
              <span className="plate-t">Worked cases</span>
            </div>
            <div className="plate-b">
              <div className="wt-examples">
                {problem.examples.map((ex, i) => (
                  <div key={i} className="wt-example">
                    <div className="wt-example-io wt-example-in">
                      <b>in:</b> {ex.input}
                    </div>
                    <div className="wt-example-io wt-example-out">
                      <b>out:</b> {ex.output}
                    </div>
                    <p className="wt-example-why">{ex.why}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* The walkthrough player */}
        <Reveal>
          <section className="plate">
            <div className="plate-cap">
              <span className="plate-no">Walkthrough</span>
              <span className="plate-t">Step by step</span>
            </div>
            <div className="plate-b">
              <WalkthroughPlayer slug={problem.slug} />
            </div>
          </section>
        </Reveal>

        {/* Complexity */}
        <Reveal>
          <section className="plate">
            <div className="plate-cap">
              <span className="plate-no">Cost</span>
              <span className="plate-t">Time &amp; space</span>
            </div>
            <div className="plate-b">
              <div className="wt-complexity">
                <span className="wt-chip">
                  <span className="wt-chip-label">time</span>
                  <b>{problem.complexity.time}</b>
                </span>
                <span className="wt-chip">
                  <span className="wt-chip-label">space</span>
                  <b>{problem.complexity.space}</b>
                </span>
              </div>
              <p className="wt-complexity-note">{problem.complexity.note}</p>
            </div>
          </section>
        </Reveal>

        {/* Connects to — closing field-note. */}
        <Reveal>
          <Analogy title="Where this connects" icon="connect">
            {problem.connectsTo}
          </Analogy>
        </Reveal>
      </main>
    </>
  );
}
