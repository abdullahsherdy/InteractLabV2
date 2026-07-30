import type { Link, ListState, NodeModel, Pointer, Step } from "./types";

/* Design-token colors for pointer badges */
export const COLORS = {
  head: "var(--teal)",
  current: "var(--blue)",
  previous: "var(--purple)",
  slow: "var(--green)",
  fast: "var(--amber)",
  newNode: "var(--purple)",
};

let idCounter = 0;
export function resetIds() {
  idCounter = 0;
}
function nextId(): string {
  idCounter += 1;
  return `n${idCounter}`;
}

export function clone(state: ListState): ListState {
  return {
    nodes: state.nodes.map((n) => ({ ...n })),
    links: state.links.map((l) => ({ ...l })),
    head: state.head,
    tail: state.tail,
    pointers: state.pointers.map((p) => ({ ...p })),
    cursor: state.cursor,
  };
}

export function makeSingly(values: (string | number)[]): ListState {
  const nodes: NodeModel[] = values.map((v) => ({ id: nextId(), value: v }));
  const links: Link[] = nodes.map((n, i) => ({
    from: n.id,
    to: i < nodes.length - 1 ? nodes[i + 1].id : null,
    kind: "next",
  }));
  return {
    nodes,
    links,
    head: nodes[0]?.id ?? null,
    tail: nodes[nodes.length - 1]?.id ?? null,
    pointers: [],
    cursor: null,
  };
}

export function makeDoubly(values: (string | number)[]): ListState {
  const state = makeSingly(values);
  for (let i = 1; i < state.nodes.length; i++) {
    state.links.push({ from: state.nodes[i].id, to: state.nodes[i - 1].id, kind: "prev" });
  }
  return state;
}

/** Follow next-links from head; returns node ids in chain order. */
export function chainFromHead(state: ListState): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  let cur = state.head;
  while (cur && !seen.has(cur)) {
    out.push(cur);
    seen.add(cur);
    cur = getNext(state, cur);
  }
  return out;
}

export function getNext(state: ListState, id: string): string | null {
  return state.links.find((l) => l.from === id && l.kind === "next")?.to ?? null;
}

function setNext(state: ListState, from: string, to: string | null, highlight = true) {
  state.links.forEach((l) => (l.highlight = false));
  const link = state.links.find((l) => l.from === from && l.kind === "next");
  if (link) {
    link.to = to;
    link.highlight = highlight;
  } else {
    state.links.push({ from, to, kind: "next", highlight });
  }
}

function setPrev(state: ListState, from: string, to: string | null, highlight = true) {
  state.links.forEach((l) => (l.highlight = false));
  const link = state.links.find((l) => l.from === from && l.kind === "prev");
  if (link) {
    link.to = to;
    link.highlight = highlight;
  } else {
    state.links.push({ from, to, kind: "prev", highlight });
  }
}

function setPointer(state: ListState, name: string, nodeId: string | null, color: string) {
  const p = state.pointers.find((x) => x.name === name);
  if (p) p.nodeId = nodeId;
  else state.pointers.push({ name, nodeId, color });
}

function clearPointers(state: ListState, keep: string[] = []) {
  state.pointers = state.pointers.filter((p) => keep.includes(p.name));
  state.links.forEach((l) => (l.highlight = false));
}

class StepBuilder {
  steps: Step[] = [];
  state: ListState;
  constructor(initial: ListState) {
    this.state = clone(initial);
  }
  snap(caption: string, extra?: { highlightNodes?: string[]; flash?: boolean }) {
    this.steps.push({ state: clone(this.state), caption, ...extra });
  }
}

/* ─────────────── Singly list operations ─────────────── */

export function appendSteps(initial: ListState, value: string | number): Step[] {
  const b = new StepBuilder(initial);
  const s = b.state;
  const newNode: NodeModel = { id: nextId(), value };

  s.nodes.push(newNode);
  s.links.push({ from: newNode.id, to: null, kind: "next" });
  setPointer(s, "new", newNode.id, COLORS.newNode);
  b.snap(`Make a new node holding ${value}. It points to nothing yet.`, {
    highlightNodes: [newNode.id],
  });

  if (s.head === null || s.head === newNode.id) {
    s.head = newNode.id;
    s.tail = newNode.id;
    setPointer(s, "head", newNode.id, COLORS.head);
    b.snap(`The list was empty, so the new node becomes the head.`);
    clearPointers(s, ["head"]);
    b.snap(`Done! The list has one node.`);
    return b.steps;
  }

  let cur = s.head;
  setPointer(s, "current", cur, COLORS.current);
  b.snap(`Start at the head. We walk the chain to find the last node.`, {
    highlightNodes: [cur],
  });

  while (getNext(s, cur) !== null && getNext(s, cur) !== newNode.id) {
    cur = getNext(s, cur)!;
    setPointer(s, "current", cur, COLORS.current);
    b.snap(`current.next is not None — step forward to the next clue.`, {
      highlightNodes: [cur],
    });
  }

  setNext(s, cur, newNode.id);
  s.tail = newNode.id;
  b.snap(`Found the last node. Link it forward to the new node.`, {
    highlightNodes: [cur, newNode.id],
  });

  clearPointers(s, []);
  setPointer(s, "head", s.head, COLORS.head);
  b.snap(`Done! ${value} is now at the end of the chain.`);
  return b.steps;
}

export function insertAtHeadSteps(initial: ListState, value: string | number): Step[] {
  const b = new StepBuilder(initial);
  const s = b.state;
  const newNode: NodeModel = { id: nextId(), value };
  const oldHead = s.head;

  s.nodes.unshift(newNode);
  s.links.push({ from: newNode.id, to: null, kind: "next" });
  setPointer(s, "new", newNode.id, COLORS.newNode);
  b.snap(`Make a new node holding ${value}.`, { highlightNodes: [newNode.id] });

  setNext(s, newNode.id, oldHead);
  b.snap(
    oldHead
      ? `First, couple the new car to the old front: new_node.next = head.`
      : `The list is empty, so new_node.next stays None.`,
    { highlightNodes: [newNode.id] }
  );

  s.head = newNode.id;
  if (!oldHead) s.tail = newNode.id;
  setPointer(s, "head", newNode.id, COLORS.head);
  b.snap(`Then move head to the new node. It is now the front of the train.`);

  clearPointers(s, ["head"]);
  b.snap(`Done! ${value} is the new first node. No shifting needed — O(1).`);
  return b.steps;
}

/**
 * The classic bug: move head FIRST, before saving where it pointed.
 * The rest of the chain is orphaned.
 */
export function insertAtHeadBuggySteps(initial: ListState, value: string | number): Step[] {
  const b = new StepBuilder(initial);
  const s = b.state;
  const newNode: NodeModel = { id: nextId(), value };
  const oldHead = s.head;

  s.nodes.unshift(newNode);
  s.links.push({ from: newNode.id, to: null, kind: "next" });
  setPointer(s, "new", newNode.id, COLORS.newNode);
  b.snap(`Make a new node holding ${value}.`, { highlightNodes: [newNode.id] });

  s.head = newNode.id;
  setPointer(s, "head", newNode.id, COLORS.head);
  b.snap(`⚠️ BUG: we moved head to the new node FIRST... without saving where head used to point!`, {
    highlightNodes: [newNode.id],
    flash: true,
  });

  setNext(s, newNode.id, null);
  b.snap(
    oldHead
      ? `Now new_node.next = head... but head IS the new node now. The old chain is lost — orphaned nodes!`
      : `new_node.next = head — nothing to lose this time, the list was empty.`,
    { flash: !!oldHead }
  );

  clearPointers(s, ["head"]);
  b.snap(
    oldHead
      ? `The grey nodes are unreachable. This is why we save next BEFORE overwriting it.`
      : `Done — but only because the list was empty. Try it with nodes in the list!`
  );
  return b.steps;
}

export function deleteValueSteps(initial: ListState, target: string | number): Step[] {
  const b = new StepBuilder(initial);
  const s = b.state;

  if (s.head === null) {
    b.snap(`The list is empty — nothing to delete.`);
    return b.steps;
  }

  const headNode = s.nodes.find((n) => n.id === s.head)!;
  setPointer(s, "head", s.head, COLORS.head);
  b.snap(`Looking for ${target}. First check the head.`, { highlightNodes: [s.head] });

  if (String(headNode.value) === String(target)) {
    const old = s.head;
    s.head = getNext(s, old);
    setPointer(s, "head", s.head, COLORS.head);
    b.snap(`The head holds ${target}! Move head to the next node.`, {
      highlightNodes: old ? [old] : [],
    });
    removeNode(s, old);
    clearPointers(s, ["head"]);
    b.snap(`The old head is uncoupled. Done!`);
    return b.steps;
  }

  let prev = s.head;
  let cur = getNext(s, prev);
  setPointer(s, "previous", prev, COLORS.previous);
  if (cur) setPointer(s, "current", cur, COLORS.current);
  b.snap(`Walk with two pointers: previous and current.`, {
    highlightNodes: cur ? [prev, cur] : [prev],
  });

  while (cur !== null) {
    const curNode = s.nodes.find((n) => n.id === cur)!;
    if (String(curNode.value) === String(target)) {
      b.snap(`Found ${target}! Now skip over it: previous.next = current.next.`, {
        highlightNodes: [prev, cur],
        flash: true,
      });
      setNext(s, prev, getNext(s, cur));
      b.snap(`previous now points past the deleted car.`, { highlightNodes: [prev] });
      if (s.tail === cur) s.tail = prev;
      removeNode(s, cur);
      clearPointers(s, ["head"]);
      setPointer(s, "head", s.head, COLORS.head);
      b.snap(`${target} is uncoupled from the train. Done!`);
      return b.steps;
    }
    prev = cur;
    cur = getNext(s, cur);
    setPointer(s, "previous", prev, COLORS.previous);
    setPointer(s, "current", cur, COLORS.current);
    b.snap(
      cur
        ? `Not a match — both pointers step forward.`
        : `current reached None.`,
      { highlightNodes: cur ? [prev, cur] : [prev] }
    );
  }

  clearPointers(s, ["head"]);
  setPointer(s, "head", s.head, COLORS.head);
  b.snap(`${target} was never found. The list is unchanged.`);
  return b.steps;
}

function removeNode(s: ListState, id: string | null) {
  if (!id) return;
  s.nodes = s.nodes.filter((n) => n.id !== id);
  s.links = s.links.filter((l) => l.from !== id);
  s.links.forEach((l) => {
    if (l.to === id) l.to = null;
  });
  s.pointers = s.pointers.filter((p) => p.nodeId !== id);
  if (s.cursor === id) s.cursor = null;
}

/* ─────────────── Doubly list operations ─────────────── */

export function appendDoublySteps(initial: ListState, value: string | number): Step[] {
  const b = new StepBuilder(initial);
  const s = b.state;
  const newNode: NodeModel = { id: nextId(), value };

  s.nodes.push(newNode);
  s.links.push({ from: newNode.id, to: null, kind: "next" });
  s.links.push({ from: newNode.id, to: null, kind: "prev" });
  setPointer(s, "new", newNode.id, COLORS.newNode);
  b.snap(`A new dancer (${value}) wants to join the end of the line.`, {
    highlightNodes: [newNode.id],
  });

  if (s.tail === null) {
    s.head = newNode.id;
    s.tail = newNode.id;
    b.snap(`The line was empty — the new dancer is both head and tail.`);
    clearPointers(s);
    b.snap(`Done!`);
    return b.steps;
  }

  const oldTail = s.tail;
  setPrev(s, newNode.id, oldTail);
  b.snap(`New dancer holds hands backward: new_node.prev = tail.`, {
    highlightNodes: [newNode.id, oldTail],
  });

  setNext(s, oldTail, newNode.id);
  b.snap(`Old last dancer holds hands forward: tail.next = new_node.`, {
    highlightNodes: [oldTail, newNode.id],
  });

  s.tail = newNode.id;
  clearPointers(s);
  b.snap(`Move tail. ${value} is now the end of the dance line. Both hands linked!`);
  return b.steps;
}

export function removeNodeDoublySteps(initial: ListState, nodeId: string): Step[] {
  const b = new StepBuilder(initial);
  const s = b.state;
  const node = s.nodes.find((n) => n.id === nodeId);
  if (!node) {
    b.snap(`That node is not in the list.`);
    return b.steps;
  }

  const prevId = s.links.find((l) => l.from === nodeId && l.kind === "prev")?.to ?? null;
  const nextId_ = getNext(s, nodeId);

  setPointer(s, "node", nodeId, COLORS.current);
  b.snap(`Removing ${node.value}. A doubly linked delete touches TWO pointers, not one.`, {
    highlightNodes: [nodeId],
  });

  if (prevId) {
    setNext(s, prevId, nextId_);
    b.snap(`Step 1: the left neighbor reaches past — node.prev.next = node.next.`, {
      highlightNodes: [prevId],
    });
  } else {
    s.head = nextId_;
    b.snap(`Step 1: no left neighbor — we are removing the first dancer, so head moves right.`);
  }

  if (nextId_) {
    setPrev(s, nextId_, prevId);
    b.snap(`Step 2: the right neighbor reaches back — node.next.prev = node.prev.`, {
      highlightNodes: [nextId_],
    });
  } else {
    s.tail = prevId;
    b.snap(`Step 2: no right neighbor — we removed the last dancer, so tail moves left.`);
  }

  removeNode(s, nodeId);
  clearPointers(s);
  b.snap(`${node.value} left the line, and both neighbors are holding hands again.`);
  return b.steps;
}

/* ─────────────── Floyd's cycle detection ─────────────── */

export interface FloydResult {
  steps: Step[];
  hasCycle: boolean;
}

/**
 * values: node values in order; cycleTo: index the last node loops back to, or null.
 * findStart: run phase 2 after a collision.
 */
export function floydSteps(
  values: (string | number)[],
  cycleTo: number | null,
  findStart = false
): FloydResult {
  const state = makeSingly(values);
  if (cycleTo !== null && state.nodes.length > 0 && cycleTo < state.nodes.length) {
    const last = state.nodes[state.nodes.length - 1].id;
    const target = state.nodes[cycleTo].id;
    const link = state.links.find((l) => l.from === last && l.kind === "next")!;
    link.to = target;
  }

  const b = new StepBuilder(state);
  const s = b.state;
  const ids = s.nodes.map((n) => n.id);
  const nextOf = (id: string | null): string | null => (id ? getNext(s, id) : null);

  let slow: string | null = s.head;
  let fast: string | null = s.head;
  setPointer(s, "slow", slow, COLORS.slow);
  setPointer(s, "fast", fast, COLORS.fast);
  b.snap(`Two runners start at the head. Slow moves 1 step per tick, fast moves 2.`, {
    highlightNodes: slow ? [slow] : [],
  });

  let guard = 0;
  while (fast !== null && nextOf(fast) !== null && guard < 200) {
    guard++;
    slow = nextOf(slow);
    fast = nextOf(nextOf(fast));
    setPointer(s, "slow", slow, COLORS.slow);
    setPointer(s, "fast", fast, COLORS.fast);

    if (slow !== null && slow === fast) {
      b.snap(`💥 The runners collide — they are the SAME node object. A cycle exists!`, {
        highlightNodes: [slow],
        flash: true,
      });

      if (findStart) {
        let p1: string | null = s.head;
        let p2: string | null = slow;
        setPointer(s, "slow", p1, COLORS.slow);
        b.snap(`Phase 2: send one runner back to the head. Now BOTH move 1 step per tick.`, {
          highlightNodes: p1 ? [p1] : [],
        });
        let g2 = 0;
        while (p1 !== p2 && g2 < 200) {
          g2++;
          p1 = nextOf(p1);
          p2 = nextOf(p2);
          setPointer(s, "slow", p1, COLORS.slow);
          setPointer(s, "fast", p2, COLORS.fast);
          b.snap(`Step... step... they will meet exactly where the cycle begins.`, {
            highlightNodes: [p1, p2].filter(Boolean) as string[],
          });
        }
        if (p1) {
          b.snap(`🎯 They meet again — THIS node is where the cycle starts.`, {
            highlightNodes: [p1],
            flash: true,
          });
        }
      }
      return { steps: b.steps, hasCycle: true };
    }

    b.snap(`Slow takes 1 step, fast takes 2. ${slow && fast ? "Still running..." : ""}`, {
      highlightNodes: [slow, fast].filter(Boolean) as string[],
    });
  }

  s.pointers = s.pointers.filter((p) => p.name !== "fast" || p.nodeId !== null);
  b.snap(`The fast runner reached None — the track has an end. No cycle here. ✅`);
  return { steps: b.steps, hasCycle: false };
}

/* ─────────────── Playlist (doubly + cursor) ─────────────── */

export function makePlaylist(songs: string[]): ListState {
  const s = makeDoubly(songs);
  s.cursor = s.head;
  return s;
}

export function playNextSteps(initial: ListState): Step[] {
  const b = new StepBuilder(initial);
  const s = b.state;
  if (!s.cursor) {
    b.snap(`No song is playing.`);
    return b.steps;
  }
  const nxt = getNext(s, s.cursor);
  if (!nxt) {
    b.snap(`This is the last song — there is no next.`, { highlightNodes: [s.cursor] });
    return b.steps;
  }
  b.snap(`Follow the next pointer forward...`, { highlightNodes: [s.cursor, nxt] });
  s.cursor = nxt;
  const song = s.nodes.find((n) => n.id === nxt)!;
  b.snap(`▶ Now playing: ${song.value}`, { highlightNodes: [nxt], flash: true });
  return b.steps;
}

export function playPreviousSteps(initial: ListState): Step[] {
  const b = new StepBuilder(initial);
  const s = b.state;
  if (!s.cursor) {
    b.snap(`No song is playing.`);
    return b.steps;
  }
  const prv = s.links.find((l) => l.from === s.cursor && l.kind === "prev")?.to ?? null;
  if (!prv) {
    b.snap(`This is the first song — there is no previous.`, { highlightNodes: [s.cursor] });
    return b.steps;
  }
  b.snap(`Follow the prev pointer backward — this is why the playlist is DOUBLY linked.`, {
    highlightNodes: [s.cursor, prv],
  });
  s.cursor = prv;
  const song = s.nodes.find((n) => n.id === prv)!;
  b.snap(`▶ Now playing: ${song.value}`, { highlightNodes: [prv], flash: true });
  return b.steps;
}

export function addSongSteps(initial: ListState, title: string): Step[] {
  const steps = appendDoublySteps(initial, title);
  const last = steps[steps.length - 1];
  if (last && last.state.cursor === null && last.state.head) {
    steps.forEach((st) => {
      if (st.state.cursor === null) st.state.cursor = st.state.head;
    });
  }
  return steps;
}

export function removeSongSteps(initial: ListState, nodeId: string): Step[] {
  const wasCursor = initial.cursor === nodeId;
  const fallback = getNext(initial, nodeId) ?? initial.links.find((l) => l.from === nodeId && l.kind === "prev")?.to ?? null;
  const steps = removeNodeDoublySteps(initial, nodeId);
  if (wasCursor) {
    steps.forEach((st) => {
      if (st.state.cursor === nodeId || st.state.cursor === null) st.state.cursor = st.state.nodes.some((n) => n.id === fallback) ? fallback : st.state.head;
    });
  }
  return steps;
}
