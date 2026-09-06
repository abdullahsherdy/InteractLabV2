import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/layout/Reveal";
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
      <section className="tutorial-hero">
        <Reveal>
          <p className="breadcrumb">
            <Link href="/walkthroughs/">Problem Walkthroughs</Link> / {problem.title}
          </p>
          <h1>{problem.title}</h1>
          <div className="hero-tags">
            {problem.tags.map((t) => (
              <span key={t} className="hero-tag">
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <main className="tutorial-main" style={{ maxWidth: "var(--content-wide)", paddingTop: 28 }}>
        {/* Intuition */}
        <Reveal className="wt-section">
          <div className="wt-intuition">
            <span className="wt-intuition-icon" aria-hidden="true">
              💡
            </span>
            <span>
              <strong>The big idea: </strong>
              {problem.intuition}
            </span>
          </div>
        </Reveal>

        {/* Statement */}
        <Reveal className="wt-section">
          <div className="wt-section-head">
            <p className="wt-kicker">The problem</p>
            <h2>What are we solving?</h2>
          </div>
          <div className="wt-statement">
            {problem.statement.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Reveal>

        {/* Examples */}
        <Reveal className="wt-section">
          <div className="wt-section-head">
            <p className="wt-kicker">Test cases</p>
            <h2>A few worked examples</h2>
          </div>
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
        </Reveal>

        {/* The walkthrough */}
        <Reveal className="wt-section">
          <div className="wt-section-head">
            <p className="wt-kicker">The walkthrough</p>
            <h2>Watch it build, one step at a time</h2>
          </div>
          <WalkthroughPlayer slug={problem.slug} />
        </Reveal>

        {/* Complexity */}
        <Reveal className="wt-section">
          <div className="wt-section-head">
            <p className="wt-kicker">How fast is it?</p>
            <h2>Time &amp; space</h2>
          </div>
          <div className="wt-complexity" style={{ marginBottom: 12 }}>
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
        </Reveal>

        {/* Connects to */}
        <Reveal className="wt-section">
          <div className="wt-section-head">
            <h2>Where this connects</h2>
          </div>
          <div className="wt-intuition">
            <span className="wt-intuition-icon" aria-hidden="true">
              🔗
            </span>
            <span>{problem.connectsTo}</span>
          </div>
        </Reveal>
      </main>
    </>
  );
}
