"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Lesson } from "@/lib/pointers/types";
import { checkpointLimit, dwellTime, replay } from "@/lib/pointers/engine";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { MemoryBoard } from "./MemoryBoard";

import { readProgress, progressKey } from "./LessonProgress";

export function PointerPlaylist({
  lessons,
  nextLevel,
}: {
  lessons: Lesson[];
  nextLevel?: { href: string; title: string };
}) {
  const [selected, setSelected] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  function select(index: number) {
    setSelected(index);
    requestAnimationFrame(() => heading.current?.focus());
  }
  return (
    <div className="ptr-playlist">
      <nav className="ptr-lesson-nav" aria-label="Lessons in this level">
        {lessons.map((l, i) => (
          <button
            type="button"
            key={l.id}
            aria-current={i === selected ? "step" : undefined}
            onClick={() => select(i)}
          >
            <span>{l.id}</span>
            {l.title}
          </button>
        ))}
      </nav>
      <section className="ptr-lesson" aria-label="Selected lesson">
        <h2 ref={heading} tabIndex={-1}>
          {lessons[selected].id} · {lessons[selected].title}
        </h2>
        <PointerLesson
          key={lessons[selected].id}
          lesson={lessons[selected]}
          next={
            selected + 1 < lessons.length
              ? () => select(selected + 1)
              : undefined
          }
          nextLevel={nextLevel}
        />
      </section>
    </div>
  );
}
function PointerLesson({
  lesson,
  next,
  nextLevel,
}: {
  lesson: Lesson;
  next?: () => void;
  nextLevel?: { href: string; title: string };
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [voice, setVoice] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [prediction, setPrediction] = useState("");
  const [completed, setCompleted] = useState(false);
  const [saveNote, setSaveNote] = useState("");
  const frame = lesson.frames[index];
  const blocked = !!frame.prediction && !revealed.includes(index);
  const last = index === lesson.frames.length - 1;
  const memory = useMemo(
    () => replay(lesson.frames, index),
    [lesson.frames, index],
  );
  const boardRows = useMemo(
    () =>
      Math.max(
        2,
        ...lesson.frames.flatMap((_, i) => {
          const cells = Object.values(replay(lesson.frames, i));
          return ["stack", "heap"].map((zone) =>
            Math.ceil(cells.filter((c) => c.zone === zone).length / 2),
          );
        }),
      ),
    [lesson.frames],
  );
  const timings = useMemo(
    () => lesson.frames.map((f) => dwellTime(f.narration, 1)),
    [lesson.frames],
  );
  const duration = timings.reduce((a, b) => a + b, 0);
  const elapsed = last
    ? duration
    : timings.slice(0, index).reduce((a, b) => a + b, 0);
  useEffect(() => {
    setCompleted(readProgress().includes(lesson.id));
    setSpeechSupported(
      typeof window.speechSynthesis !== "undefined" &&
        typeof SpeechSynthesisUtterance !== "undefined",
    );
  }, [lesson.id]);
  useEffect(() => {
    if (!playing || blocked || last) {
      if (blocked || last) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(
      () => setIndex((i) => checkpointLimit(lesson.frames, i, i + 1, revealed)),
      dwellTime(frame.narration, speed),
    );
    return () => window.clearTimeout(timer);
  }, [playing, blocked, last, frame.narration, speed, lesson.frames, revealed]);
  useEffect(() => {
    if (!voice || !playing || blocked || !speechSupported) return;
    const speech = window.speechSynthesis;
    speech.cancel();
    const utterance = new SpeechSynthesisUtterance(frame.narration);
    utterance.rate = speed;
    try {
      speech.speak(utterance);
    } catch {
      setVoice(false);
    }
    return () => speech.cancel();
  }, [voice, playing, blocked, speechSupported, index, frame.narration, speed]);
  function seek(requested: number) {
    setPlaying(false);
    setIndex(
      checkpointLimit(
        lesson.frames,
        index,
        Math.max(0, Math.min(requested, lesson.frames.length - 1)),
        revealed,
      ),
    );
  }
  function toggle() {
    if (blocked) return;
    if (last) {
      setIndex(0);
      setRevealed([]);
    }
    setPlaying((p) => !p);
  }
  function restart() {
    setPlaying(false);
    setIndex(0);
    setRevealed([]);
    setPrediction("");
  }
  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    if (target.closest(".ptr-board-scroll")) return;
    if (
      [
        "INPUT",
        "TEXTAREA",
        "SELECT",
        "BUTTON",
        "A",
        "SUMMARY",
        "PRE",
        "CODE",
      ].includes(target.tagName)
    )
      return;
    if (e.key === " ") {
      e.preventDefault();
      toggle();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      seek(index + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      seek(index - 1);
    }
    if (e.key === "Home") {
      e.preventDefault();
      seek(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      seek(lesson.frames.length - 1);
    }
  }
  function markComplete() {
    setCompleted(true);
    try {
      localStorage.setItem(
        progressKey,
        JSON.stringify([...new Set([...readProgress(), lesson.id])]),
      );
      setSaveNote("Saved in this browser.");
    } catch {
      setSaveNote("Reviewed for this visit. Browser storage is unavailable.");
    }
  }
  const clock = (ms: number) =>
    `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}`;
  return (
    <>
      <p className="ptr-hook">{lesson.hook}</p>
      <div className="hero-tags">
        <span className="tag">{lesson.savitch}</span>
        {lesson.optional && (
          <span className="tag">Optional syllabus material</span>
        )}
        {lesson.beyond && <span className="tag">Beyond the course</span>}
      </div>
      {lesson.note && <p className="ptr-note">{lesson.note}</p>}
      {lesson.prelude && (
        <CodeBlock
          focusable
          code={lesson.prelude}
          lang="C++17 · definitions used below"
          showLineNumbers
        />
      )}
      <div
        className="ptr-player plate"
        role="group"
        tabIndex={0}
        aria-label="Pointer lesson player. Space plays or pauses; left and right arrows step."
        onKeyDown={onKey}
      >
        <div className="plate-cap">
          <span className="plate-no">Memory lab</span>
          <span>
            Step {index + 1} / {lesson.frames.length}
          </span>
        </div>
        <MemoryBoard
          state={memory}
          highlight={frame.highlight ?? []}
          minRows={boardRows}
        />
        <CodeBlock
          focusable
          code={lesson.code.join("\n")}
          lang="C++17 · inside main()"
          showLineNumbers
          highlight={frame.line >= 0 ? frame.line + 1 : undefined}
        />
        <div className="transport">
          <p
            className="tp-caption ptr-caption"
            aria-live="polite"
            aria-atomic="true"
          >
            {frame.narration}
          </p>
          {frame.prediction && (
            <div className="ptr-prediction">
              <h3>Pause &amp; predict</h3>
              <p>{frame.prediction.q}</p>
              {blocked ? (
                <>
                  <label htmlFor={`prediction-${lesson.id}`}>
                    Your prediction (optional)
                  </label>
                  <input
                    id={`prediction-${lesson.id}`}
                    value={prediction}
                    onChange={(e) => setPrediction(e.target.value)}
                  />
                  <button
                    type="button"
                    className="ptr-button"
                    onClick={() => setRevealed((a) => [...a, index])}
                  >
                    Reveal &amp; compare
                  </button>
                </>
              ) : (
                <p role="status">
                  <b>{frame.prediction.answer}</b> {frame.prediction.why}
                </p>
              )}
            </div>
          )}
          <div className="tp-controls ptr-controls">
            <button
              className="tp-btn"
              type="button"
              disabled={index === 0}
              onClick={() => seek(index - 1)}
              aria-label="Previous step"
            >
              ←
            </button>
            <button
              className="tp-btn play"
              type="button"
              disabled={blocked}
              onClick={toggle}
            >
              {playing ? "Pause" : last ? "Replay" : "Play"}
            </button>
            <button
              className="tp-btn"
              type="button"
              disabled={last || blocked}
              onClick={() => seek(index + 1)}
              aria-label="Next step"
            >
              →
            </button>
            <button className="ptr-button" type="button" onClick={restart}>
              Restart
            </button>
            <label className="ptr-speed">
              Speed
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              >
                {[0.75, 1, 1.25, 1.5].map((s) => (
                  <option key={s} value={s}>
                    {s}×
                  </option>
                ))}
              </select>
            </label>
            {speechSupported && (
              <label className="ptr-voice">
                <input
                  type="checkbox"
                  checked={voice}
                  onChange={(e) => setVoice(e.target.checked)}
                />
                Voice
              </label>
            )}
          </div>
          <label className="ptr-timeline">
            Timeline · {clock(elapsed)} / ~{clock(duration)} at 1×
            <input
              type="range"
              min={0}
              max={lesson.frames.length - 1}
              value={index}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Lesson timeline"
              aria-valuetext={`Step ${index + 1} of ${lesson.frames.length}`}
            />
          </label>
          <p className="kb-hint">
            Focus the player: Space play/pause · ← → step · Home/End jump.
            Predictions pause playback until revealed.
          </p>
        </div>
      </div>
      <section className="ptr-checks" aria-labelledby={`checks-${lesson.id}`}>
        <h3 id={`checks-${lesson.id}`}>Check your understanding</h3>
        <p>
          Try each question before opening the answer. For the memory check,
          draw on paper first.
        </p>
        {lesson.checks.map((c) => (
          <details key={c.type}>
            <summary>
              <span className="tag">
                {c.type === "trace"
                  ? "Trace"
                  : c.type === "bug"
                    ? "Find the bug"
                    : "Draw the memory"}
              </span>{" "}
              {c.q}
            </summary>
            <div>
              <b>{c.answer}</b>
              <p>{c.why}</p>
            </div>
          </details>
        ))}
      </section>
      {last && (
        <section className="ptr-end" aria-label="Lesson complete">
          <h3>Keep this idea</h3>
          <p>{lesson.takeaway}</p>
          <div className="ptr-end-actions">
            <button
              className="ptr-button"
              type="button"
              onClick={markComplete}
              disabled={completed}
            >
              {completed ? "✓ Reviewed" : "Mark as reviewed"}
            </button>
            <button className="ptr-button" type="button" onClick={restart}>
              Replay lesson
            </button>
            {next ? (
              <button
                className="ptr-button primary"
                type="button"
                onClick={next}
              >
                Next lesson →
              </button>
            ) : nextLevel ? (
              <Link className="ptr-button primary" href={nextLevel.href}>
                Next: {nextLevel.title} →
              </Link>
            ) : (
              <Link href="/pointers/" className="ptr-button">
                Back to the curriculum →
              </Link>
            )}
          </div>
          <p role="status">{saveNote}</p>
        </section>
      )}
    </>
  );
}
