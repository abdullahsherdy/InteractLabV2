import type { CSSProperties } from "react";

// Drawn schematic glyphs (D5) — replace emoji-as-icon, which broke the
// blueprint identity and the a11y floor. Each is a small `currentColor` line
// drawing, so it takes on the surrounding ink (a `.tcard`/`.fieldnote` sets
// `color:var(--accent)` on its icon box). Purely decorative: aria-hidden.

export type GlyphName =
  // Topic glyphs (tutorial cards, nav)
  | "linked-list"
  | "recursion"
  | "sorting"
  | "bitwise"
  | "walkthrough"
  | "stacks"
  | "home"
  | "connect"
  // Analogy glyphs (the field-note "think of it like…" icons)
  | "nesting-dolls"
  | "plates"
  | "tree"
  | "growth-curve"
  | "magnifier"
  | "compass"
  | "books"
  | "scissors"
  | "key"
  | "tag"
  | "switches"
  | "halving"
  | "sliders";

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

    // — Analogy glyphs —————————————————————————————————————————————

    // Recursion = Russian nesting dolls (the preserved key analogy).
    case "nesting-dolls":
      return (
        <>
          <path d="M6.5 23 C6.5 13 9 4 13 4 C17 4 19.5 13 19.5 23 Z" {...STROKE} strokeWidth={1.5} />
          <circle cx="13" cy="10" r="2.6" {...STROKE} strokeWidth={1.5} />
          <path d="M8 15.5 Q13 18.5 18 15.5" {...STROKE} strokeWidth={1.5} />
        </>
      );
    // A stack of plates — the call stack piling up.
    case "plates":
      return (
        <>
          <ellipse cx="13" cy="8" rx="9" ry="2.6" {...STROKE} strokeWidth={1.5} />
          <ellipse cx="13" cy="13.5" rx="9" ry="2.6" {...STROKE} strokeWidth={1.5} />
          <ellipse cx="13" cy="19" rx="9" ry="2.6" {...STROKE} strokeWidth={1.5} />
        </>
      );
    // A branching tree — the recursion / Fibonacci call tree.
    case "tree":
      return (
        <>
          <circle cx="13" cy="4.5" r="2.2" {...STROKE} strokeWidth={1.5} />
          <circle cx="6.5" cy="13" r="2.2" {...STROKE} strokeWidth={1.5} />
          <circle cx="19.5" cy="13" r="2.2" {...STROKE} strokeWidth={1.5} />
          <circle cx="3.5" cy="21.5" r="1.8" {...STROKE} strokeWidth={1.5} />
          <circle cx="9.5" cy="21.5" r="1.8" {...STROKE} strokeWidth={1.5} />
          <path
            d="M11.4 6 L8.1 11.4 M14.6 6 L17.9 11.4 M5.6 15 L4.2 19.8 M7.4 15 L8.8 19.8"
            {...STROKE}
            strokeWidth={1.4}
          />
        </>
      );
    // A rising curve on axes — Big-O growth.
    case "growth-curve":
      return (
        <>
          <path d="M4 3 V22 H23" {...STROKE} strokeWidth={1.5} />
          <path d="M5.5 20 C13 20 16.5 16 21.5 5" {...STROKE} />
        </>
      );
    // A magnifying glass — searching / phone-book halving.
    case "magnifier":
      return (
        <>
          <circle cx="11" cy="11" r="6.6" {...STROKE} strokeWidth={1.5} />
          <path d="M15.8 15.8 L22 22" {...STROKE} strokeWidth={1.8} />
        </>
      );
    // A compass — the 6-step method for approaching any problem.
    case "compass":
      return (
        <>
          <circle cx="13" cy="13" r="9.5" {...STROKE} strokeWidth={1.5} />
          <path d="M13 5.5 L15.2 13 L13 20.5 L10.8 13 Z" {...STROKE} strokeWidth={1.4} />
          <path d="M13 5.5 L15.2 13 L10.8 13 Z" fill="currentColor" stroke="none" />
        </>
      );
    // Books on a shelf — sorting = tidying a bookshelf (preserved analogy).
    case "books":
      return (
        <>
          <rect x="3.5" y="7" width="3.8" height="15" rx="0.8" {...STROKE} strokeWidth={1.5} />
          <rect x="8.3" y="7" width="3.8" height="15" rx="0.8" {...STROKE} strokeWidth={1.5} />
          <rect x="13.1" y="7" width="3.8" height="15" rx="0.8" {...STROKE} strokeWidth={1.5} />
          <path d="M18.8 22 L21 8 L24 8.6 L21.8 22.6 Z" {...STROKE} strokeWidth={1.5} />
          <path d="M2.5 23 H24" {...STROKE} strokeWidth={1.5} />
        </>
      );
    // Scissors — the "cut the deck in half" split of merge/quick sort.
    case "scissors":
      return (
        <>
          <circle cx="5.5" cy="6.5" r="2.6" {...STROKE} strokeWidth={1.5} />
          <circle cx="5.5" cy="19.5" r="2.6" {...STROKE} strokeWidth={1.5} />
          <path d="M7.8 8 L21 17" {...STROKE} strokeWidth={1.5} />
          <path d="M7.8 18 L21 9" {...STROKE} strokeWidth={1.5} />
        </>
      );
    // A key — sorting by a key / comparison key.
    case "key":
      return (
        <>
          <circle cx="7.5" cy="13" r="4.8" {...STROKE} strokeWidth={1.5} />
          <path d="M12.3 13 H22.5" {...STROKE} strokeWidth={1.5} />
          <path d="M18.5 13 V17 M21.5 13 V16" {...STROKE} strokeWidth={1.5} />
        </>
      );
    // A luggage tag — labelling / stable sort keys.
    case "tag":
      return (
        <>
          <path d="M11 4 H21.5 V22 H11 L3.5 13 Z" {...STROKE} strokeWidth={1.5} />
          <circle cx="8" cy="13" r="1.7" {...STROKE} strokeWidth={1.4} />
        </>
      );
    // Toggle switches — a byte as 8 light switches (bitwise).
    case "switches":
      return (
        <>
          <rect x="3" y="5" width="20" height="7" rx="3.5" {...STROKE} strokeWidth={1.5} />
          <circle cx="19" cy="8.5" r="2.2" fill="currentColor" />
          <rect x="3" y="14" width="20" height="7" rx="3.5" {...STROKE} strokeWidth={1.5} />
          <circle cx="7" cy="17.5" r="2.2" fill="currentColor" />
        </>
      );
    // A halving mark — repeated division (binary / place value).
    case "halving":
      return (
        <>
          <path d="M5 13 H21" {...STROKE} strokeWidth={1.8} />
          <circle cx="13" cy="7.5" r="1.9" fill="currentColor" />
          <circle cx="13" cy="18.5" r="1.9" fill="currentColor" />
        </>
      );
    // Mixing-board sliders — a bitwise operations playground.
    case "sliders":
      return (
        <>
          <path d="M6 4 V22 M13 4 V22 M20 4 V22" {...STROKE} strokeWidth={1.5} />
          <circle cx="6" cy="9" r="2.4" fill="currentColor" />
          <circle cx="13" cy="16" r="2.4" fill="currentColor" />
          <circle cx="20" cy="7" r="2.4" fill="currentColor" />
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
