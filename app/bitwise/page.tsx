import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/layout/Reveal";
import { Analogy } from "@/components/shared/Analogy";
import { PlaceValueExplorer } from "@/components/bitwise/PlaceValueExplorer";
import { ConversionTrace } from "@/components/bitwise/ConversionTrace";
import { BitwisePlayground } from "@/components/bitwise/BitwisePlayground";

import "./bitwise.css";

export const metadata: Metadata = {
  title: "Bitwise & Number Systems — InteractLab",
  description:
    "Interactive bitwise and number-systems playground: a byte as 8 light switches, animated decimal→binary conversion, and a live AND/OR/XOR/NOT/shift explorer.",
};

// Draw the whole page in the Bitwise ink; the shared kit (crumb, tags, plate
// caption, field-note, code highlight) all read var(--accent).
const heroStyle = { "--accent": "var(--ink-bit)" } as CSSProperties;
const mainStyle = {
  "--accent": "var(--ink-bit)",
  maxWidth: "var(--content-wide)",
  paddingTop: 28,
  display: "flex",
  flexDirection: "column",
  gap: "clamp(28px, 5vw, 48px)",
} as CSSProperties;

export default function BitwisePage() {
  return (
    <>
      <section className="tutorial-hero" style={heroStyle}>
        <Reveal>
          <p className="crumb">
            <Link href="/">InteractLab</Link>
            <span aria-hidden="true">/</span>
            <b>Bitwise &amp; Number Systems</b>
          </p>
          <h1>Bits &amp; Bytes — eight little light switches</h1>
          <p className="hero-desc">
            A byte is just eight light switches in a row. Each switch is worth
            double the one to its right — 1, 2, 4, 8, 16, 32, 64, 128. Flip the
            right switches and you can spell any number from 0 to 255. Then watch
            AND, OR, XOR, and shifts move those switches around, one column at a
            time.
          </p>
          <div className="hero-tags">
            <a className="tag accent" href="#fig1">binary &amp; place value</a>
            <a className="tag accent" href="#fig2">decimal → binary</a>
            <a className="tag accent" href="#fig3">bitwise playground</a>
            <a className="tag accent" href="#fig4">real-world uses</a>
          </div>
        </Reveal>
      </section>

      <main className="tutorial-main" style={mainStyle}>
        {/* Module 1 — place value */}
        <Reveal>
          <section className="plate" id="fig1">
            <div className="plate-cap">
              <span className="plate-no">Module 1</span>
              <span className="plate-t">A byte is 8 light switches</span>
            </div>
            <div className="plate-b">
              <Analogy icon="switches">
                <strong>Light switches:</strong> each of the 8 switches has a
                value — the rightmost is 1, and every switch to the left is worth
                double. Drag the slider or tap a switch to flip it, and watch the
                lit values add up to the number.
              </Analogy>
              <PlaceValueExplorer />
            </div>
          </section>
        </Reveal>

        {/* Module 2 — conversion */}
        <Reveal>
          <section className="plate" id="fig2">
            <div className="plate-cap">
              <span className="plate-no">Module 2</span>
              <span className="plate-t">Decimal → binary, by hand</span>
            </div>
            <div className="plate-b">
              <Analogy icon="halving">
                <strong>Keep halving:</strong> divide by 2 over and over and
                write down each remainder. Read those remainders from the bottom
                up and you have the binary number. The trace below runs the real
                division so it always matches.
              </Analogy>
              <ConversionTrace />
            </div>
          </section>
        </Reveal>

        {/* Module 3 — operators */}
        <Reveal>
          <section className="plate" id="fig3">
            <div className="plate-cap">
              <span className="plate-no">Module 3</span>
              <span className="plate-t">The bitwise playground</span>
            </div>
            <div className="plate-b">
              <Analogy icon="sliders">
                <strong>Column by column:</strong> line up two bytes and compare
                them one switch at a time. AND keeps a switch on only if both are
                on, OR if either is on, XOR only if they disagree. Shifts slide
                the whole row left or right.
              </Analogy>
              <BitwisePlayground />
            </div>
          </section>
        </Reveal>

        {/* Module 4 — real-world uses */}
        <Reveal>
          <section className="plate" id="fig4">
            <div className="plate-cap">
              <span className="plate-no">Module 4</span>
              <span className="plate-t">Where you actually meet bitwise code</span>
            </div>
            <div className="plate-b">
              <div className="bw-cards">
                <div className="bw-card">
                  <h3>Even / odd check</h3>
                  <p>
                    Instead of <code>n % 2 == 0</code>, low-level code writes{" "}
                    <code>(n &amp; 1) == 0</code>. The last bit of any even number
                    is always 0.
                  </p>
                </div>
                <div className="bw-card">
                  <h3>Power-of-two check</h3>
                  <p>
                    <code>n &amp; (n - 1) == 0</code> — a power of 2 has exactly
                    one 1-bit. Subtracting 1 flips every bit below it, so AND
                    gives 0.
                  </p>
                </div>
                <div className="bw-card">
                  <h3>File permission flags</h3>
                  <p>
                    <code>chmod 755</code> is bitwise flags. Read = 4, Write = 2,
                    Execute = 1. OR them together: <code>4 | 2 | 1 = 7</code>,
                    full access.
                  </p>
                </div>
                <div className="bw-card">
                  <h3>RGB colour masking</h3>
                  <p>
                    Pull red out of <code>0xFF5733</code> with{" "}
                    <code>(color &gt;&gt; 16) &amp; 0xFF</code> = <code>255</code>.
                    Every browser and image editor does this.
                  </p>
                </div>
                <div className="bw-card">
                  <h3>Multiply / divide by 2, fast</h3>
                  <p>
                    <code>n &lt;&lt; 1</code> is n × 2 and <code>n &gt;&gt; 1</code>{" "}
                    is n ÷ 2. Compilers lean on this internally for speed.
                  </p>
                </div>
                <div className="bw-card">
                  <h3>Interview patterns</h3>
                  <p>
                    Single number, counting bits, missing number, subset
                    generation — all lean on XOR or AND. Once you see the pattern
                    they get straightforward.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Where this connects — closing field-note. */}
        <Reveal>
          <Analogy title="Where this connects" icon="connect">
            <strong>Looking forward:</strong> hashing, hash-set membership, and
            bitmasks in dynamic programming all reuse this exact switch-flipping.
            Once a byte feels like eight switches, those topics stop looking like
            magic.
          </Analogy>
        </Reveal>
      </main>
    </>
  );
}
