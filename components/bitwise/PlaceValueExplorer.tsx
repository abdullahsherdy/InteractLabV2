"use client";

import { useState } from "react";
import { binaryContributions, clampByte, toBin8 } from "@/lib/bitwise/bits";
import { ByteRow } from "./ByteRow";

/**
 * Panel 1 — "a byte is 8 light switches". Drag the slider OR click individual
 * bits; the decimal value, binary string, and the place-value sum update live.
 */
export function PlaceValueExplorer() {
  const [n, setN] = useState(42);
  const bin = toBin8(n);
  const contrib = binaryContributions(n);

  function toggleBit(index: number) {
    // index 0 is the most-significant bit (position 7).
    const place = 2 ** (7 - index);
    setN((prev) => (bin[index] === "1" ? prev - place : prev + place));
  }

  return (
    <div className="bw-module">
      <div className="bw-toolbar">
        <input
          className="bw-slider"
          type="range"
          min={0}
          max={255}
          value={n}
          onChange={(e) => setN(clampByte(Number(e.target.value)))}
          aria-label="Value from 0 to 255"
        />
        <div className="bw-readout">
          <span className="bw-readout-num">{n}</span>
          <span className="bw-readout-sub">decimal</span>
        </div>
      </div>

      <ByteRow bits={bin} variant="one" showValues showPositions onToggle={toggleBit} />

      <p className="bw-note">
        {contrib.length > 0 ? (
          <>
            The lit switches add up: <code>{contrib.join(" + ")} = {n}</code>. Tap
            any switch to flip that bit.
          </>
        ) : (
          <>Every switch is off — that is <code>0</code>. Tap a switch to turn it on.</>
        )}
      </p>
    </div>
  );
}
