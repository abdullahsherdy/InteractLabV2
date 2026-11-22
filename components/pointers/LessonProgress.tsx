"use client";
import { useEffect, useState } from "react";
export const progressKey = "interactlab-pointer-progress-v1";
export function readProgress(): string[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(progressKey) ?? "[]");
    return Array.isArray(data)
      ? data.filter((s): s is string => typeof s === "string")
      : [];
  } catch {
    return [];
  }
}
export function PointerRouteFocus() {
  useEffect(() => {
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, []);
  return null;
}
export function LessonProgress({ ids }: { ids: string[] }) {
  const [completed, setCompleted] = useState<string[]>([]);
  useEffect(() => {
    setCompleted(readProgress());
  }, []);
  return (
    <span
      className="ptr-progress"
      role="group"
      aria-label={`${ids.filter((id) => completed.includes(id)).length} of ${ids.length} lessons reviewed`}
    >
      {ids.map((id) => (
        <span
          key={id}
          className={completed.includes(id) ? "done" : ""}
          title={`Lesson ${id}${completed.includes(id) ? " reviewed" : ""}`}
        />
      ))}
      <span>
        {ids.filter((id) => completed.includes(id)).length}/{ids.length}{" "}
        reviewed
      </span>
    </span>
  );
}
