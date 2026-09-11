"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "il-theme";

/**
 * Theme toggle for the title-block. Flips the explicit `data-theme` on <html>
 * and persists the choice in localStorage (`il-theme`) — the same key the
 * no-flash script in layout.tsx reads on load. Three-state model: with no
 * explicit choice the page follows the OS via `prefers-color-scheme`; one click
 * pins light/dark and wins over the OS from then on.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Resolve the *effective* theme on mount: an explicit data-theme wins,
  // otherwise fall back to the OS preference.
  useEffect(() => {
    const explicit = document.documentElement.getAttribute("data-theme");
    const dark = explicit
      ? explicit === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(dark);
    setMounted(true);
  }, []);

  function toggle() {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode / storage disabled — the toggle still works for this
      // session, the choice just won't survive a reload.
    }
    setIsDark(next === "dark");
  }

  // The label names the theme you switch TO. Before mount we can't know the
  // resolved theme without risking a hydration mismatch, so show a neutral
  // "Theme" for the server render and first client paint.
  const label = !mounted ? "Theme" : isDark ? "Light" : "Dark";

  return (
    <button
      type="button"
      className="theme-btn"
      onClick={toggle}
      aria-label="Switch colour theme"
      aria-pressed={mounted ? isDark : undefined}
    >
      {label}
    </button>
  );
}
