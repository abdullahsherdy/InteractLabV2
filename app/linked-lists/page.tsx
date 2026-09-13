import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/layout/Reveal";
import { Analogy } from "@/components/shared/Analogy";
import { NodeChainBuilder } from "@/components/linked-list/NodeChainBuilder";
import { DoublyListDemo } from "@/components/linked-list/DoublyListDemo";
import { CycleRace } from "@/components/linked-list/CycleRace";
import { PlaylistManager } from "@/components/linked-list/PlaylistManager";
import "./linked-lists.css";

export const metadata: Metadata = {
  title: "Linked Lists — InteractLab",
  description:
    "Interactive linked list visualizer: build node chains, insert and delete with animated pointers, doubly linked lists, and Floyd's tortoise & hare cycle detection.",
};

// Draw the whole page in the Linked Lists ink; the shared kit (crumb, tags,
// plate caption, field-note, transport) all read var(--accent).
const heroStyle = { "--accent": "var(--ink-ll)" } as CSSProperties;
const mainStyle = {
  "--accent": "var(--ink-ll)",
  maxWidth: "var(--content-wide)",
  paddingTop: 28,
  display: "flex",
  flexDirection: "column",
  gap: "clamp(28px, 5vw, 48px)",
} as CSSProperties;

export default function LinkedListsPage() {
  return (
    <>
      <section className="tutorial-hero" style={heroStyle}>
        <Reveal>
          <p className="crumb">
            <Link href="/">InteractLab</Link>
            <span aria-hidden="true">/</span>
            <b>Linked Lists</b>
          </p>
          <h1>Linked Lists — chains of clues</h1>
          <p className="hero-desc">
            A linked list is a treasure hunt: every node holds a value and a
            clue (pointer) to the next one. You lose instant access — but you
            gain instant insertion and deletion. Watch every pointer move,
            one animated step at a time.
          </p>
          <div className="hero-tags">
            <a className="tag accent" href="#fig1">Fig 1 · Build a chain</a>
            <a className="tag accent" href="#fig2">Fig 2 · Doubly linked</a>
            <a className="tag accent" href="#fig3">Fig 3 · Floyd&apos;s cycle</a>
            <a className="tag accent" href="#fig4">Fig 4 · Playlist</a>
          </div>
        </Reveal>
      </section>

      <main className="tutorial-main" style={mainStyle}>
        <Reveal>
          <section className="plate" id="fig1">
            <div className="plate-cap">
              <span className="plate-no">Fig. 1</span>
              <span className="plate-t">Node Chain Builder</span>
            </div>
            <div className="plate-b">
              <Analogy icon="linked-list">
                <strong>Treasure hunt:</strong> each clue points to the next. Try{" "}
                <code>append</code>, <code>insert at head</code>, and{" "}
                <code>delete value</code> — then flip on the 🐛 bug toggle to see
                what happens if you overwrite a pointer <em>before</em> saving it.
              </Analogy>
              <NodeChainBuilder />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="plate" id="fig2">
            <div className="plate-cap">
              <span className="plate-no">Fig. 2</span>
              <span className="plate-t">Doubly Linked List</span>
            </div>
            <div className="plate-b">
              <Analogy>
                <strong>Dance line:</strong> every dancer holds hands in both
                directions. Removing one dancer means <em>two</em> pointer
                updates — watch each neighbor reconnect, one after the other.
              </Analogy>
              <DoublyListDemo />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="plate" id="fig3">
            <div className="plate-cap">
              <span className="plate-no">Fig. 3</span>
              <span className="plate-t">Tortoise &amp; Hare</span>
            </div>
            <div className="plate-b">
              <Analogy>
                <strong>Two runners on a track:</strong> one moves 1 step per
                tick, the other 2. If the track loops, the fast runner laps the
                slow one and they collide — same node object, not same value.
                If the track ends, the fast runner falls off: no cycle.
              </Analogy>
              <CycleRace />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="plate" id="fig4">
            <div className="plate-cap">
              <span className="plate-no">Fig. 4</span>
              <span className="plate-t">Playlist Manager</span>
            </div>
            <div className="plate-b">
              <Analogy>
                <strong>Your music app is a linked list:</strong> “next song”
                follows the next pointer, “previous song” follows prev. That is
                exactly why a playlist is a <em>doubly</em> linked list.
              </Analogy>
              <PlaylistManager />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <Analogy title="Where this connects" icon="connect">
            <strong>Looking back:</strong> hash table collision chaining is a
            tiny linked list in every bucket. <strong>Looking forward:</strong> a
            tree node is just a linked-list node with two next pointers —{" "}
            <code>left</code> and <code>right</code>.
          </Analogy>
        </Reveal>
      </main>
    </>
  );
}
