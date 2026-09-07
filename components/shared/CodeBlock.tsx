import { Fragment } from "react";

// A deliberately small Python highlighter for the static teaching snippets used
// across the tools (recursion, sorting, …). The snippets are trusted,
// hand-written constants (see each tool's content.ts), so a single-pass
// tokenizer is plenty — no parser, no client JS, no CDN. Styling lives in
// globals.css as `.code-block` + `.tok-*`, so every tool shares one look.

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

/** A syntax-highlighted, read-only Python snippet. */
export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const tokens = tokenize(code);
  return (
    <pre className={`code-block${className ? ` ${className}` : ""}`}>
      <code>
        {tokens.map((t, i) =>
          t.cls ? (
            <span key={i} className={t.cls}>
              {t.text}
            </span>
          ) : (
            <Fragment key={i}>{t.text}</Fragment>
          ),
        )}
      </code>
    </pre>
  );
}
