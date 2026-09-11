import { Fragment, type ReactNode } from "react";

// A deliberately small Python highlighter for the static teaching snippets used
// across the tools (recursion, sorting, …). The snippets are trusted,
// hand-written constants (see each tool's content.ts), so a single-pass
// tokenizer is plenty — no parser, no client JS, no CDN.
//
// Two container skins share this one tokenizer:
//   • bare  `.code-block` — the shipped dark slate block (default; unchanged).
//   • framed `.code`      — the blueprint "plate" with a filename/lang header,
//                            line numbers and a highlighted line, opted into via
//                            the `filename` / `lang` / `showLineNumbers` /
//                            `highlight` props. Its light-ground token colours
//                            are set in globals.css as `.code .tok-*`.

const TOKEN = /#[^\n]*|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|\b\d+\b|\b[A-Za-z_]\w*\b/g;

const KEYWORDS = new Set([
  "def", "return", "if", "elif", "else", "for", "while", "in", "and", "or",
  "not", "is", "True", "False", "None", "import", "from", "class", "pass",
  "break", "continue", "with", "as", "lambda", "yield", "raise", "try", "except",
]);

const BUILTINS = new Set([
  "print", "range", "len", "get", "append", "split", "reverse", "join", "int",
  "str", "list", "dict", "set", "sum", "sorted", "enumerate", "extend",
]);

type Tok = { text: string; cls: string };

function tokenize(code: string): Tok[] {
  const out: Tok[] = [];
  let last = 0;
  TOKEN.lastIndex = 0; // reset: the regex is reused across many strings (per line)
  for (let m = TOKEN.exec(code); m; m = TOKEN.exec(code)) {
    if (m.index > last) out.push({ text: code.slice(last, m.index), cls: "" });
    const t = m[0];
    let cls = "";
    if (t.startsWith("#")) cls = "tok-comment";
    else if (t.startsWith("'") || t.startsWith('"')) cls = "tok-str";
    else if (/^\d/.test(t)) cls = "tok-num";
    else if (KEYWORDS.has(t)) cls = "tok-kw";
    else if (BUILTINS.has(t)) cls = "tok-fn";
    out.push({ text: t, cls });
    last = m.index + t.length;
  }
  if (last < code.length) out.push({ text: code.slice(last), cls: "" });
  return out;
}

/** Render one code string as highlighted token spans. */
function renderTokens(code: string): ReactNode {
  return tokenize(code).map((t, i) =>
    t.cls ? (
      <span key={i} className={t.cls}>
        {t.text}
      </span>
    ) : (
      <Fragment key={i}>{t.text}</Fragment>
    ),
  );
}

function normalizeHighlight(highlight?: number | number[]): Set<number> {
  if (highlight === undefined) return new Set();
  return new Set(Array.isArray(highlight) ? highlight : [highlight]);
}

export interface CodeBlockProps {
  code: string;
  className?: string;
  /** Filename shown at the left of the framed header (opts into `.code`). */
  filename?: string;
  /** Language label shown at the right of the framed header (opts into `.code`). */
  lang?: string;
  /** Show line numbers in the framed variant. Defaults to true when framed. */
  showLineNumbers?: boolean;
  /** 1-based line number(s) to highlight (opts into `.code`). */
  highlight?: number | number[];
}

/**
 * A syntax-highlighted, read-only Python snippet. With no framing props it is
 * the shipped bare `.code-block`; passing `filename`, `lang`, `showLineNumbers`
 * or `highlight` renders the framed blueprint `.code` plate instead.
 */
export function CodeBlock({
  code,
  className,
  filename,
  lang,
  showLineNumbers,
  highlight,
}: CodeBlockProps) {
  const framed =
    filename !== undefined ||
    lang !== undefined ||
    highlight !== undefined ||
    showLineNumbers === true;

  if (!framed) {
    return (
      <pre className={`code-block${className ? ` ${className}` : ""}`}>
        <code>{renderTokens(code)}</code>
      </pre>
    );
  }

  const showNums = showLineNumbers !== false;
  const hl = normalizeHighlight(highlight);
  const lines = code.replace(/\n$/, "").split("\n");

  return (
    <div className={`code${className ? ` ${className}` : ""}`}>
      {(filename || lang) && (
        <div className="code-h">
          <span>{filename}</span>
          <span>{lang}</span>
        </div>
      )}
      <pre>
        <code>
          {lines.map((line, i) => {
            const n = i + 1;
            const body = line.length ? renderTokens(line) : " ";
            const inner = (
              <>
                {showNums && <span className="ln">{n}</span>}
                {body}
              </>
            );
            return hl.has(n) ? (
              <span key={i} className="hl">
                {inner}
              </span>
            ) : (
              <span key={i} className="cl">
                {inner}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
