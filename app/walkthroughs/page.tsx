import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/layout/Reveal";
import { PROBLEMS } from "@/lib/walkthrough";
import "./walkthroughs.css";

export const metadata: Metadata = {
  title: "Problem Walkthroughs — InteractLab",
  description:
    "Animated, whiteboard-style walkthroughs of classic coding problems. Watch the solution build one step at a time with synced pseudocode and plain-English narration.",
};

export default function WalkthroughsPage() {
  return (
    <>
      <section className="tutorial-hero">
        <Reveal>
          <p className="breadcrumb">InteractLab / Problem Walkthroughs</p>
          <h1>Problem Walkthroughs</h1>
          <p className="hero-desc">
            Like a good whiteboard video, but you hold the marker. Each
            walkthrough plays the real solution one step at a time — the array
            moves, the pointers slide, the code line lights up, and a plain
            sentence tells you what just happened and why.
          </p>
          <div className="hero-tags">
            <span className="hero-tag">step-by-step</span>
            <span className="hero-tag">synced pseudocode</span>
            <span className="hero-tag">plain-English narration</span>
          </div>
        </Reveal>
      </section>

      <main className="tutorial-main" style={{ maxWidth: "var(--content-wide)", paddingTop: 28 }}>
        <div className="tutorial-grid">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link className="tutorial-card" href={`/walkthroughs/${p.slug}/`}>
                <div className={`card-icon ${p.iconClass}`} aria-hidden="true">
                  {p.emoji}
                </div>
                <h3>{p.title}</h3>
                <p>{p.oneLiner}</p>
                <div className="card-meta">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <span className="card-arrow">Watch walkthrough →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>
    </>
  );
}
