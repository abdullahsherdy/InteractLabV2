import type { CSSProperties, ReactNode } from "react";
import { Glyph, type GlyphName } from "./Glyph";

interface AnalogyProps {
  /** The analogy itself — a short plain-language paragraph. */
  children: ReactNode;
  /** Eyebrow label. Defaults to the spec's "Think of it like…". */
  title?: string;
  /** Drawn glyph in the accent ink. Defaults to the linked-nodes "connect". */
  icon?: GlyphName;
  /** Override the accent ink, e.g. `"var(--ink-ll)"`. Defaults to the ambient
   *  `--accent` in scope (a tool section sets this in P3/P4). */
  ink?: string;
}

/**
 * The analogy field-note (analogy-before-abstraction). Renders the spec's
 * field-note structure under the new `.fieldnote` class — deliberately NOT
 * `.analogy`, which still styles the 23 shipped `<p className="analogy">` boxes
 * until those pages migrate onto this component in Phase 3/4.
 */
export function Analogy({ children, title = "Think of it like…", icon = "connect", ink }: AnalogyProps) {
  const style = ink ? ({ "--accent": ink } as CSSProperties) : undefined;
  return (
    <aside className="fieldnote" style={style}>
      <span className="ic">
        <Glyph name={icon} size={22} />
      </span>
      <div>
        <div className="h">{title}</div>
        <p>{children}</p>
      </div>
    </aside>
  );
}
