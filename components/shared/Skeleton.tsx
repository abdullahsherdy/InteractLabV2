import type { CSSProperties } from "react";

/**
 * Shimmer placeholder for content that is still loading/computing. One or more
 * `.skeleton` bars (styled in globals.css, animation collapses under
 * `prefers-reduced-motion`).
 */
export function Skeleton({
  lines = 1,
  width,
  height,
  className,
}: {
  lines?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
}) {
  const base: CSSProperties = { height, width };
  if (lines <= 1) {
    return <div className={`skeleton${className ? ` ${className}` : ""}`} style={base} aria-hidden="true" />;
  }
  return (
    <div className="skeleton-stack" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`skeleton${className ? ` ${className}` : ""}`}
          // Last line is short, like a real paragraph tail.
          style={{ ...base, width: i === lines - 1 ? "62%" : width }}
        />
      ))}
    </div>
  );
}
