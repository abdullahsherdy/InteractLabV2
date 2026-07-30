export type LinkKind = "next" | "prev";

export interface NodeModel {
  id: string;
  value: string | number;
}

export interface Link {
  from: string;
  /** null = points to None */
  to: string | null;
  kind: LinkKind;
  /** visually emphasized (being reassigned right now) */
  highlight?: boolean;
}

export interface Pointer {
  name: string;
  /** null = pointing at None */
  nodeId: string | null;
  color: string;
}

export interface ListState {
  nodes: NodeModel[];
  links: Link[];
  head: string | null;
  tail: string | null;
  pointers: Pointer[];
  /** playlist "now playing" node */
  cursor: string | null;
}

export interface Step {
  state: ListState;
  caption: string;
  highlightNodes?: string[];
  /** big flash moment (e.g. tortoise/hare collision) */
  flash?: boolean;
}
