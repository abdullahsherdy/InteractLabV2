import type { Metadata } from "next";
import { Reveal } from "@/components/layout/Reveal";
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

export default function LinkedListsPage() {
  return (
    <>
      <section className="tutorial-hero">
        <Reveal>
          <p className="breadcrumb">InteractLab / Linked Lists</p>
          <h1>Linked Lists — chains of clues</h1>
          <p className="hero-desc">
            A linked list is a treasure hunt: every node holds a value and a
            clue (pointer) to the next one. You lose instant access — but you
            gain instant insertion and deletion. Watch every pointer move,
            one animated step at a time.
          </p>
          <div className="hero-tags">
            <span className="hero-tag">nodes &amp; pointers</span>
            <span className="hero-tag">O(1) insert</span>
            <span className="hero-tag">doubly linked</span>
            <span className="hero-tag">Floyd&apos;s cycle</span>
          </div>
        </Reveal>
      </section>

      <main className="tutorial-main" style={{ maxWidth: "var(--content-wide)", paddingTop: 28 }}>
        <Reveal className="ll-section">
          <div className="ll-section-head">
            <p className="ll-kicker">Module 1 · Singly linked</p>
            <h2>Node Chain Builder</h2>
            <p className="analogy">
              🗺️ <span><strong>Treasure hunt:</strong> each clue points to the next.
              Try <code>append</code>, <code>insert at head</code>, and{" "}
              <code>delete value</code> — then flip on the 🐛 bug toggle to see
              what happens if you overwrite a pointer <em>before</em> saving it.</span>
            </p>
          </div>
          <NodeChainBuilder />
        </Reveal>

        <Reveal className="ll-section">
          <div className="ll-section-head">
            <p className="ll-kicker">Module 2 · Doubly linked</p>
            <h2>Dance Line — holding hands both ways</h2>
            <p className="analogy">
              💃 <span><strong>Dance line:</strong> every dancer holds hands in both
              directions. Removing one dancer means <em>two</em> pointer
              updates — watch each neighbor reconnect, one after the other.</span>
            </p>
          </div>
          <DoublyListDemo />
        </Reveal>

        <Reveal className="ll-section">
          <div className="ll-section-head">
            <p className="ll-kicker">Module 3 · Cycle detection</p>
            <h2>Tortoise &amp; Hare Race — Floyd&apos;s algorithm</h2>
            <p className="analogy">
              🐢🐇 <span><strong>Two runners on a track:</strong> one moves 1 step per
              tick, the other 2. If the track loops, the fast runner laps the
              slow one and they collide — same node object, not same value.
              If the track ends, the fast runner falls off: no cycle.</span>
            </p>
          </div>
          <CycleRace />
        </Reveal>

        <Reveal className="ll-section">
          <div className="ll-section-head">
            <p className="ll-kicker">Module 4 · Mini-project</p>
            <h2>Playlist Manager</h2>
            <p className="analogy">
              🎵 <span><strong>Your music app is a linked list:</strong> “next song”
              follows the next pointer, “previous song” follows prev. That is
              exactly why a playlist is a <em>doubly</em> linked list.</span>
            </p>
          </div>
          <PlaylistManager />
        </Reveal>

        <Reveal className="ll-section">
          <div className="ll-section-head">
            <h2>Where this connects</h2>
            <p className="analogy">
              🔗 <span><strong>Looking back:</strong> hash table collision chaining is a
              tiny linked list in every bucket. <strong>Looking forward:</strong> a
              tree node is just a linked-list node with two next pointers —{" "}
              <code>left</code> and <code>right</code>.</span>
            </p>
          </div>
        </Reveal>
      </main>
    </>
  );
}
