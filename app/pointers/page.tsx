import type { Metadata } from "next";
import Link from "next/link";
import { LEVELS } from "@/lib/pointers/content";
import {
  LessonProgress,
  PointerRouteFocus,
} from "@/components/pointers/LessonProgress";
import "./pointers.css";
export const metadata: Metadata = {
  title: "C++ Pointers — InteractLab",
  description:
    "Learn C++ pointers visually: addresses, dereferencing, new and delete, arrays, linked lists and two-pointer problems, step by step.",
};
export default function PointersPage() {
  const count = LEVELS.reduce((n, l) => n + l.lessons.length, 0);
  return (
    <main className="ptr-page" id="main-content" tabIndex={-1}>
      <PointerRouteFocus />
      <section className="tutorial-hero">
        <p className="crumb">
          <Link href="/">InteractLab</Link>
          <span>/</span>
          <b>Pointers</b>
        </p>
        <h1>
          Follow the address.
          <br />
          Understand the pointer.
        </h1>
        <p className="hero-desc">
          Start with a variable’s house number. Learn to store an address,
          follow an arrow, manage a lifetime, and build a linked structure — one
          idea at a time.
        </p>
        <div className="hero-tags">
          <span className="tag accent">C++17</span>
          <span className="tag accent">{count} interactive lessons</span>
          <span className="tag accent">9 levels</span>
          <span className="tag accent">predict · trace · debug · draw</span>
        </div>
        <Link href="/pointers/memory-first/" className="ptr-button primary">
          Start with memory →
        </Link>
      </section>
      <div className="tutorial-main ptr-hub">
        <aside className="ptr-note">
          <b>A pointer is a sticky note with a house number.</b> The note is not
          the house. Memory pointers store addresses; the{" "}
          <em>two-pointer technique</em> is a separate algorithm pattern
          introduced at Level 8.
        </aside>
        <div className="section-head">
          <h2>Your learning path</h2>
          <p>
            Follow the levels in order. Reviewed dots are saved only in this
            browser; no account is needed.
          </p>
        </div>
        <ol className="ptr-ladder">
          {LEVELS.map((level) => (
            <li key={level.slug}>
              <Link
                href={`/pointers/${level.slug}/`}
                className="ptr-level-card"
              >
                <span className="ptr-level-number">
                  {String(level.level).padStart(2, "0")}
                </span>
                <div>
                  <h3>{level.title}</h3>
                  <p>{level.description}</p>
                  <p className="ptr-prereq">
                    Before this: {level.prerequisite}
                  </p>
                  <LessonProgress ids={level.lessons.map((l) => l.id)} />
                  <span className="arw">
                    Open level · {level.lessons.length} lessons →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
        <section className="ptr-note">
          <h2>Learn the model, then use it well</h2>
          <p>
            These lessons make raw pointer mechanics visible for course and exam
            practice. Undefined behavior is identified without inventing an
            output. Modern ownership with RAII appears in the final level as
            beyond-course material.
          </p>
          <p>
            Textbook references follow the supplied Savitch 10th edition
            syllabus; check your course edition for page differences.
          </p>
        </section>
      </div>
    </main>
  );
}
