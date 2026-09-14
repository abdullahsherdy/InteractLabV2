import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/layout/Reveal";
import { Analogy } from "@/components/shared/Analogy";
import { Glyph } from "@/components/shared/Glyph";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { StructDemo } from "@/components/stacks/StructDemo";

import "./stacks.css";

export const metadata: Metadata = {
  title: "Stacks & Queues — InteractLab",
  description:
    "Interactive stacks and queues: push and pop a stack (LIFO), enqueue and dequeue a queue (FIFO), see why a list makes a fast stack but a slow queue, and where each shows up — undo, BFS, and the call stack.",
};

// Draw the whole page in the rose Stacks ink (D2); the shared kit (crumb, tags,
// plate caps, field-note, framed code, transport) all read var(--accent). The
// Queue module and the queue column of "in the wild" re-ink locally to the
// walkthrough blue, echoing the two structures' two colours.
const heroStyle = { "--accent": "var(--ink-stack)" } as CSSProperties;
const mainStyle = {
  "--accent": "var(--ink-stack)",
  maxWidth: "var(--content-wide)",
  paddingTop: 28,
  display: "flex",
  flexDirection: "column",
  gap: "clamp(28px, 5vw, 48px)",
} as CSSProperties;
const blueStyle = { "--accent": "var(--ink-walk)" } as CSSProperties;

const CODE = {
  stack: `stack = []             # a plain list is all you need

stack.append(9)        # push — 9 goes on top
stack.append(4)        # push — 4 is the new top
stack[-1]              # peek — read the top (4), leave it
stack.pop()            # pop  — remove & return the top (4)
len(stack)             # -> 1   ·  every line here is O(1)`,
  queue: `from collections import deque

q = deque([5, 2, 8])   # front is 5, back is 8
q.append(4)            # enqueue — 4 joins the back
q.popleft()            # dequeue — 5 leaves the front (-> 5)
q[0]                   # peek — the front is now 2
len(q)                 # -> 3   ·  append & popleft are O(1)`,
};

export default function StacksPage() {
  return (
    <>
      <section className="tutorial-hero" style={heroStyle}>
        <Reveal>
          <p className="crumb">
            <Link href="/">InteractLab</Link>
            <span aria-hidden="true">/</span>
            <b>Stacks &amp; Queues</b>
          </p>
          <h1>Stacks &amp; Queues — plates you pile, lines you join</h1>
          <p className="hero-desc">
            Two ways to hold a row of things, told apart by one question: who
            leaves first? A <strong>stack</strong> is a pile of plates — the last
            one you put down is the first you pick up (LIFO). A{" "}
            <strong>queue</strong> is a line at the coffee shop — whoever arrived
            first is served first (FIFO). Push and pop the pile, join and leave
            the line, and watch each rule play out one step at a time.
          </p>
          <div className="hero-tags">
            <a className="tag accent" href="#fig1">stack · LIFO</a>
            <a className="tag accent" href="#fig2">queue · FIFO</a>
            <a className="tag accent" href="#fig3">list vs. deque</a>
            <a className="tag accent" href="#fig4">undo · BFS · call stack</a>
          </div>
        </Reveal>
      </section>

      <main className="tutorial-main" style={mainStyle}>
        {/* Module 1 — the stack */}
        <Reveal>
          <section className="plate" id="fig1">
            <div className="plate-cap">
              <span className="plate-no">Module 1</span>
              <span className="plate-t">A stack — last in, first out</span>
            </div>
            <div className="plate-b">
              <Analogy icon="plates">
                <strong>A pile of plates:</strong> you can only touch the top
                one. Add a plate and it sits on top; take one and it comes off
                the top. The last plate you added is the first to leave — that is
                LIFO. Push a few values, then pop them back off and watch the
                order reverse.
              </Analogy>
              <StructDemo kind="stack" />
              <CodeBlock code={CODE.stack} filename="stack.py" lang="python" />
            </div>
          </section>
        </Reveal>

        {/* Module 2 — the queue (re-inked to the walkthrough blue) */}
        <Reveal>
          <section className="plate" id="fig2" style={blueStyle}>
            <div className="plate-cap">
              <span className="plate-no">Module 2</span>
              <span className="plate-t">A queue — first in, first out</span>
            </div>
            <div className="plate-b">
              <Analogy icon="coffee">
                <strong>A line at the coffee shop:</strong> you join at the back
                and wait; the barista serves the front. Whoever arrived first
                leaves first — that is FIFO. Enqueue a few values at the back,
                then dequeue from the front and watch everyone shift forward.
              </Analogy>
              <StructDemo kind="queue" />
              <CodeBlock code={CODE.queue} filename="queue.py" lang="python" />
            </div>
          </section>
        </Reveal>

        {/* Module 3 — what they are really made of */}
        <Reveal>
          <section className="plate" id="fig3">
            <div className="plate-cap">
              <span className="plate-no">Module 3</span>
              <span className="plate-t">What they&rsquo;re really made of</span>
            </div>
            <div className="plate-b">
              <Analogy icon="bricks">
                <strong>Both are built on a plain list</strong> — but only one
                fits it well. A stack works at the <em>end</em> of a list, where
                adding and removing are cheap. A queue works at the{" "}
                <em>front</em>, and removing from the front of a list is
                secretly slow.
              </Analogy>
              <div className="sq-uh">
                <div className="sq-uh-card">
                  <h3>Stack = a plain list</h3>
                  <p>
                    The end of the list is the top. Adding and removing there
                    never disturb the other items, so both stay fast.
                  </p>
                  <div className="sq-op">
                    <code>stack.append(x)</code>
                    <span className="sq-cost sq-cost-ok">O(1)</span>
                  </div>
                  <div className="sq-op">
                    <code>stack.pop()</code>
                    <span className="sq-cost sq-cost-ok">O(1)</span>
                  </div>
                </div>
                <div className="sq-uh-card">
                  <h3>Queue &ne; a plain list</h3>
                  <p>
                    Removing from the front of a list re-indexes every item
                    behind it. Reach for <code>collections.deque</code>, built
                    to be fast at both ends.
                  </p>
                  <div className="sq-op">
                    <code>list.pop(0)</code>
                    <span className="sq-cost sq-cost-bad">O(n)</span>
                  </div>
                  <div className="sq-op">
                    <code>deque.popleft()</code>
                    <span className="sq-cost sq-cost-ok">O(1)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Module 4 — where you meet them */}
        <Reveal>
          <section className="plate" id="fig4">
            <div className="plate-cap">
              <span className="plate-no">Module 4</span>
              <span className="plate-t">Where you meet them in the wild</span>
            </div>
            <div className="plate-b">
              <div className="sq-wild">
                <div className="sq-col">
                  <span className="sq-col-h">
                    <span className="ic">
                      <Glyph name="stacks" size={22} />
                    </span>
                    Stacks show up as
                  </span>
                  <div className="sq-use">
                    <h4>Undo / redo</h4>
                    <p>
                      Every action you take is pushed onto a stack. Undo pops the
                      most recent one back off.
                    </p>
                  </div>
                  <div className="sq-use">
                    <h4>The browser Back button</h4>
                    <p>
                      Each page you visit is pushed; Back pops you to the page
                      right before it.
                    </p>
                  </div>
                  <div className="sq-use">
                    <h4>The call stack</h4>
                    <p>
                      Function calls stack up and unwind in reverse — the exact
                      stack recursion runs on.
                    </p>
                  </div>
                  <div className="sq-use">
                    <h4>Matching brackets</h4>
                    <p>
                      Push each opening bracket, pop on every closing one. Empty
                      at the end means the brackets balance.
                    </p>
                  </div>
                </div>
                <div className="sq-col" style={blueStyle}>
                  <span className="sq-col-h">
                    <span className="ic">
                      <Glyph name="queue" size={22} />
                    </span>
                    Queues show up as
                  </span>
                  <div className="sq-use">
                    <h4>Print jobs</h4>
                    <p>
                      Documents print in the order you sent them — first in,
                      first out.
                    </p>
                  </div>
                  <div className="sq-use">
                    <h4>Message &amp; task queues</h4>
                    <p>
                      Work is added at the back and handled from the front,
                      strictly in arrival order.
                    </p>
                  </div>
                  <div className="sq-use">
                    <h4>Breadth-first search</h4>
                    <p>
                      Exploring a tree or graph level by level keeps a queue of
                      the nodes still to visit.
                    </p>
                  </div>
                  <div className="sq-use">
                    <h4>Customer service lines</h4>
                    <p>
                      Whoever called first is answered first — the everyday queue
                      you already know.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Module 5 — cheat sheet */}
        <Reveal>
          <section className="plate" id="fig5">
            <div className="plate-cap">
              <span className="plate-no">Module 5</span>
              <span className="plate-t">Cheat sheet</span>
            </div>
            <div className="plate-b">
              <div className="sq-table-wrap">
                <table className="sq-table">
                  <thead>
                    <tr>
                      <th>Structure</th>
                      <th>Add</th>
                      <th>Remove</th>
                      <th>Python</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Stack (LIFO)</td>
                      <td>
                        push <code>append()</code>
                      </td>
                      <td>
                        pop <code>pop()</code>
                      </td>
                      <td>
                        <code>list</code>
                      </td>
                      <td>
                        <span className="sq-cost sq-cost-ok">O(1)</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Queue (FIFO)</td>
                      <td>
                        enqueue <code>append()</code>
                      </td>
                      <td>
                        dequeue <code>popleft()</code>
                      </td>
                      <td>
                        <code>collections.deque</code>
                      </td>
                      <td>
                        <span className="sq-cost sq-cost-ok">O(1)</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Where this connects — closing field-note. */}
        <Reveal>
          <Analogy title="Where this connects" icon="connect">
            <strong>Looking forward:</strong> the call stack you met in{" "}
            <Link href="/recursion/">recursion</Link> is exactly this stack —
            each call pushed on, each return popping off. And when you reach trees
            and graphs, breadth-first search rides a <em>queue</em> while
            depth-first search rides a <em>stack</em>. Two simple shapes, showing
            up everywhere.
          </Analogy>
        </Reveal>
      </main>
    </>
  );
}
