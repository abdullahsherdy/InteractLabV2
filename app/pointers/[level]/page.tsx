import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEVELS, getLevel } from "@/lib/pointers/content";
import { PointerRouteFocus } from "@/components/pointers/LessonProgress";
import { PointerPlaylist } from "@/components/pointers/PointerPlaylist";
import "../pointers.css";
export const dynamicParams = false;
export function generateStaticParams() {
  return LEVELS.map((l) => ({ level: l.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const level = getLevel((await params).level);
  return {
    title: level ? `${level.title} — C++ Pointers` : "Pointers — InteractLab",
    description: level?.description,
  };
}
export default async function PointerLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const level = getLevel((await params).level);
  if (!level) notFound();
  const previous = LEVELS[level.level - 1];
  const next = LEVELS[level.level + 1];
  return (
    <main className="ptr-page" id="main-content" tabIndex={-1}>
      <PointerRouteFocus />
      <section className="tutorial-hero">
        <p className="crumb">
          <Link href="/">InteractLab</Link>
          <span>/</span>
          <Link href="/pointers/">Pointers</Link>
          <span>/</span>
          <b>Level {level.level}</b>
        </p>
        <h1>{level.title}</h1>
        <p className="hero-desc">{level.description}</p>
        <p className="ptr-prereq">Before this: {level.prerequisite}</p>
      </section>
      <div className="tutorial-main ptr-level-main">
        <PointerPlaylist
          lessons={level.lessons}
          nextLevel={
            next
              ? { href: `/pointers/${next.slug}/`, title: next.title }
              : undefined
          }
        />
        {level.level === 6 && (
          <aside className="ptr-note">
            Keep practicing with the{" "}
            <Link href="/linked-lists/">Linked Lists visualizer →</Link>
          </aside>
        )}
        {level.level === 8 && (
          <aside className="ptr-note">
            Apply algorithm patterns in{" "}
            <Link href="/walkthroughs/">Problem Walkthroughs →</Link>
          </aside>
        )}
        <nav className="ptr-level-links" aria-label="Level navigation">
          {previous ? (
            <Link href={`/pointers/${previous.slug}/`}>← {previous.title}</Link>
          ) : (
            <Link href="/pointers/">← Curriculum</Link>
          )}
          {next && <Link href={`/pointers/${next.slug}/`}>{next.title} →</Link>}
        </nav>
      </div>
    </main>
  );
}
