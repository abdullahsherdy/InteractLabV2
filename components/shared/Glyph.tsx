import type { CSSProperties } from "react";

// Drawn schematic glyphs (D5) — replace emoji-as-icon, which broke the
// blueprint identity and the a11y floor. Each is a small `currentColor` line
// drawing, so it takes on the surrounding ink (a `.tcard`/`.fieldnote` sets
// `color:var(--accent)` on its icon box). Purely decorative: aria-hidden.

export type GlyphName =
  | "linked-list"
  | "recursion"
  | "sorting"
  | "bitwise"
  | "walkthrough"
  | "stacks"
  | "home"
  | "connect";

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function paths(name: GlyphName) {
  switch (name) {
    case "linked-list":
      return (
        <>
          <rect x="1" y="9" width="8" height="8" rx="1.5" {...STROKE} />
          <rect x="17" y="9" width="8" height="8" rx="1.5" {...STROKE} />
          <path d="M9 13 H16" {...STROKE} />
          <path d="M13.5 11 l2.5 2 -2.5 2" {...STROKE} strokeWidth={1.4} />
        </>
      );
    case "recursion":
      return (
        <>
          <rect x="2" y="2" width="22" height="22" rx="2" {...STROKE} strokeWidth={1.5} />
          <rect x="6" y="6" width="14" height="14" rx="2" {...STROKE} strokeWidth={1.5} />
          <rect x="10" y="10" width="6" height="6" rx="1" {...STROKE} strokeWidth={1.5} />
        </>
      );
    case "sorting":
      return (
        <>
          <rect x="2" y="15" width="4" height="9" fill="currentColor" />
          <rect x="8" y="10" width="4" height="14" fill="currentColor" />
          <rect x="14" y="6" width="4" height="18" fill="currentColor" />
          <rect x="20" y="2" width="4" height="22" fill="currentColor" />
        </>
      );
    case "bitwise":
      return (
        <>
          <rect x="2" y="9" width="6" height="8" rx="1.2" fill="currentColor" />
          <rect x="10" y="9" width="6" height="8" rx="1.2" {...STROKE} strokeWidth={1.5} />
          <rect x="18" y="9" width="6" height="8" rx="1.2" fill="currentColor" />
        </>
      );
    case "walkthrough":
      return (
        <>
          <rect x="2" y="5" width="22" height="16" rx="2" {...STROKE} strokeWidth={1.5} />
          <path d="M10.5 9.5 l6 3.5 -6 3.5 z" fill="currentColor" />
        </>
      );
    case "stacks":
      return (
        <>
          <rect x="4" y="15.5" width="18" height="5" rx="1.5" {...STROKE} strokeWidth={1.5} />
          <rect x="4" y="9" width="18" height="5" rx="1.5" {...STROKE} strokeWidth={1.5} />
          <rect x="4" y="2.5" width="18" height="5" rx="1.5" {...STROKE} strokeWidth={1.5} />
        </>
      );
    case "home":
      return (
        <>
          <path d="M3.5 12 L13 3.5 L22.5 12" {...STROKE} strokeWidth={1.6} />
          <path d="M6.5 11 V21.5 H19.5 V11" {...STROKE} strokeWidth={1.6} />
        </>
      );
    case "connect":
      return (
        <>
          <circle cx="6.5" cy="13" r="3.2" {...STROKE} />
          <circle cx="19.5" cy="13" r="3.2" {...STROKE} />
          <path d="M9.7 13 H16.3" {...STROKE} />
        </>
      );
  }
}

export function Glyph({
  name,
  size = 26,
  className,
  style,
}: {
  name: GlyphName;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      {paths(name)}
    </svg>
  );
}
