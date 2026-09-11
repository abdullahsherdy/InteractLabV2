"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/topics/", label: "Topics" },
  { href: "/linked-lists/", label: "Linked Lists" },
  { href: "/walkthroughs/", label: "Walkthroughs" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="titleblock">
      <Link className="tb-cell tb-brand" href="/" aria-label="InteractLab — home">
        <span className="tb-stamp" aria-hidden="true">
          {"{ }"}
        </span>
        <span className="tb-name">InteractLab</span>
      </Link>
      <nav className="tb-nav" aria-label="Main">
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
              className={`tb-link${active ? " on" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="tb-grow" aria-hidden="true" />
      <div className="tb-cell tb-theme">
        <ThemeToggle />
      </div>
    </header>
  );
}
