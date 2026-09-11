import type { Metadata } from "next";
import {
  Big_Shoulders,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  Caveat,
} from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Drafting-desk type system (D4): industrial display, engineering-doc body/mono,
// and a pencil hand for margin notes. Loaded via next/font (never a <link>).
// Big Shoulders is loaded as its variable font with the optical-size axis, so
// `font-optical-sizing: auto` gives large headings the tall "Display" cut while
// smaller uses stay legible — the single-family successor to "Big Shoulders Display".
const display = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--display",
  // next/font has no fallback metrics keyed under the consolidated "Big Shoulders"
  // name (it predates Google merging the superfamily), so the auto size-adjust
  // fallback can't be synthesized regardless. Opt out explicitly: behaviour-neutral,
  // and it keeps the build output clean.
  adjustFontFallback: false,
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--mono",
});

const note = Caveat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--note",
});

const fontVars = `${display.variable} ${sans.variable} ${mono.variable} ${note.variable}`;

// Runs before first paint to prevent a flash of the wrong theme: apply a persisted
// Light/Dark choice from localStorage as data-theme on <html>. With no stored value
// it no-ops, so the OS setting drives the theme via prefers-color-scheme (globals.css).
// The explicit toggle that writes il-theme ships in Phase 2.
const themeScript = `(function(){try{var t=localStorage.getItem('il-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export const metadata: Metadata = {
  title: "InteractLab — Interactive Programming Tutorials",
  description:
    "InteractLab — free interactive programming tutorials. Learn linked lists, bitwise ops, recursion, Big-O, and sorting algorithms with step-by-step visualizers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={fontVars}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <div className="home-wrap">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
