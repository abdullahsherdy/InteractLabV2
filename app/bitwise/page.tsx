import type { Metadata } from "next";
import { Reveal } from "@/components/layout/Reveal";
import { PlaceValueExplorer } from "@/components/bitwise/PlaceValueExplorer";
import { ConversionTrace } from "@/components/bitwise/ConversionTrace";
import { BitwisePlayground } from "@/components/bitwise/BitwisePlayground";
import "./bitwise.css";

export const metadata: Metadata = {
  title: "Bitwise & Number Systems — InteractLab",
  description:
    "Interactive bitwise and number-systems playground: a byte as 8 light switches, animated decimal→binary conversion, and a live AND/OR/XOR/NOT/shift explorer.",
};

export default function BitwisePage() {
  return (
    <>
      <section className="tutorial-hero">
        <Reveal>
          <p className="breadcrumb">InteractLab / Bitwise &amp; Number Systems</p>
          <h1>Bits &amp; Bytes — eight little light switches</h1>
          <p className="hero-desc">
            A byte is just eight light switches in a row. Each switch is worth
            double the one to its right — 1, 2, 4, 8, 16, 32, 64, 128. Flip the
            right switches and you can spell any number from 0 to 255. Then watch
            AND, OR, XOR, and shifts move those switches around, one column at a
            time.
          </p>
          <div className="hero-tags">
            <span className="hero-tag">binary &amp; place value</span>
            <span className="hero-tag">decimal → binary</span>
            <span className="hero-tag">bitwise playground</span>
            <span className="hero-tag">real-world uses</span>
          </div>
        </Reveal>
      </section>

      <main className="tutorial-main" style={{ maxWidth: "var(--content-wide)", paddingTop: 28 }}>
        <Reveal className="bw-block">
          <div className="bw-block-head">
            <p className="bw-kicker">Module 1 · Place value</p>
            <h2>A byte is 8 light switches</h2>
            <p className="analogy">
              💡 <span><strong>Light switches:</strong> each of the 8 switches has a
              value — the rightmost is 1, and every switch to the left is worth
              double. Drag the slider or tap a switch to flip it, and watch the
              lit values add up to the number.</span>
            </p>
          </div>
          <PlaceValueExplorer />
        </Reveal>

        <Reveal className="bw-block">
          <div className="bw-block-head">
            <p className="bw-kicker">Module 2 · Conversion</p>
            <h2>Decimal → binary, by hand</h2>
            <p className="analogy">
              ➗ <span><strong>Keep halving:</strong> divide by 2 over and over and
              write down each remainder. Read those remainders from the bottom
              up and you have the binary number. The trace below runs the real
              division so it always matches.</span>
            </p>
          </div>
          <ConversionTrace />
        </Reveal>

        <Reveal className="bw-block">
          <div className="bw-block-head">
            <p className="bw-kicker">Module 3 · Operators</p>
            <h2>The bitwise playground</h2>
            <p className="analogy">
              🎛️ <span><strong>Column by column:</strong> line up two bytes and compare
              them one switch at a time. AND keeps a switch on only if both are
              on, OR if either is on, XOR only if they disagree. Shifts slide the
              whole row left or right.</span>
            </p>
          </div>
          <BitwisePlayground />
        </Reveal>

        <Reveal className="bw-block">
          <div className="bw-block-head">
            <p className="bw-kicker">Module 4 · In the wild</p>
            <h2>Where you actually meet bitwise code</h2>
          </div>
          <div className="bw-cards">
            <div className="bw-card">
              <h3>Even / odd check</h3>
              <p>
                Instead of <code>n % 2 == 0</code>, low-level code writes{" "}
                <code>(n &amp; 1) == 0</code>. The last bit of any even number is
                always 0.
              </p>
            </div>
            <div className="bw-card">
              <h3>Power-of-two check</h3>
              <p>
                <code>n &amp; (n - 1) == 0</code> — a power of 2 has exactly one
                1-bit. Subtracting 1 flips every bit below it, so AND gives 0.
              </p>
            </div>
            <div className="bw-card">
              <h3>File permission flags</h3>
              <p>
                <code>chmod 755</code> is bitwise flags. Read = 4, Write = 2,
                Execute = 1. OR them together: <code>4 | 2 | 1 = 7</code>, full
                access.
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
                Single number, counting bits, missing number, subset generation —
                all lean on XOR or AND. Once you see the pattern they get
                straightforward.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="bw-block">
          <div className="bw-block-head">
            <h2>Where this connects</h2>
            <p className="analogy">
              🔗 <span><strong>Looking forward:</strong> hashing, hash-set membership,
              and bitmasks in dynamic programming all reuse this exact
              switch-flipping. Once a byte feels like eight switches, those topics
              stop looking like magic.</span>
            </p>
          </div>
        </Reveal>
      </main>
    </>
  );
}
