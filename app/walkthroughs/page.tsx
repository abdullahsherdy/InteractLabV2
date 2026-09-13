import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/layout/Reveal";
import { Glyph } from "@/components/shared/Glyph";
import { PROBLEMS } from "@/lib/walkthrough";
import "./walkthroughs.css";

export const metadata: Metadata = {
  title: "Problem Walkthroughs — InteractLab",
  description:
    "Animated, whiteboard-style walkthroughs of classic coding problems. Watch the solution build one step at a time with synced pseudocode and plain-English narration.",
};

// Draw the whole page in the Walkthroughs ink; the shared kit (crumb, tags,
// tcard icon + arrow) all read var(--accent).
const heroStyle = { "--accent": "var(--ink-walk)" } as CSSProperties;
const mainStyle = {
  "--accent": "var(--ink-walk)",
  maxWidth: "var(--content-wide)",
  paddingTop: 28,
} as CSSProperties;

export default function WalkthroughsPage() {
  return (
    <>
      <section className="tutorial-hero" style={heroStyle}>
        <Reveal>
          <p className="crumb">
            <Link href="/">InteractLab</Link>
            <span aria-hidden="true">/</span>
            <b>Problem Walkthroughs</b>
          </p>
          <h1>Problem Walkthroughs</h1>
          <p className="hero-desc">
            Like a good whiteboard video, but you hold the marker. Each
            walkthrough plays the real solution one step at a time — the array
            moves, the pointers slide, the code line lights up, and a plain
            sentence tells you what just happened and why.
          </p>
          <div className="hero-tags">
            <span className="tag accent">step-by-step</span>
            <span className="tag accent">synced pseudocode</span>
            <span className="tag accent">plain-English narration</span>
          </div>
        </Reveal>
      </section>

      <main className="tutorial-main" style={mainStyle}>
        <div className="cards">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link className="tcard" href={`/walkthroughs/${p.slug}/`}>
                <span className="ic">
                  <Glyph name="walkthrough" size={26} />
                </span>
                <h5>{p.title}</h5>
                <p>{p.oneLiner}</p>
                <div className="meta">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="arw">Watch walkthrough →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>
    </>
  );
}
