import type { ReactNode } from "react";

export type StateTone = "ok" | "warn" | "faint";

/**
 * A short status note — a coloured dot beside a message. Used for empty/ready/
 * warning states in the tools (styled in globals.css as `.state` + `.dot`).
 */
export function StateNote({
  tone = "faint",
  children,
}: {
  tone?: StateTone;
  children: ReactNode;
}) {
  return (
    <div className="state">
      <span className={`dot ${tone}`} aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
