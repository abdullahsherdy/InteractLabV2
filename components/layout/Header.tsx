"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/topics/", label: "Topics" },
  { href: "/linked-lists/", label: "Linked Lists" },
  { href: "/walkthroughs/", label: "Walkthroughs" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link className="site-logo" href="/">
        <span className="logo-mark">{"{ }"}</span>
        <span className="logo-text">
          Interact<span>Lab</span>
        </span>
      </Link>
      <button
        className="nav-toggle"
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>
      <nav className={`site-nav${open ? " open" : ""}`} aria-label="Main">
        {LINKS.map((l) => {
          const base = l.href.replace(/\/$/, "");
          const active =
            base === ""
              ? pathname === "/"
              : pathname === l.href || pathname === base || pathname.startsWith(`${base}/`);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link${active ? " active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
