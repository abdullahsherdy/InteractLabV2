import Link from "next/link";

export default function NotFound() {
  return (
    <main className="tutorial-main">
      <div style={{ maxWidth: 720, margin: "36px auto", textAlign: "center", padding: "0 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 0" }}>
          <svg
            viewBox="0 0 200 200"
            role="img"
            aria-label="A friendly teal cat"
            style={{ width: 220, height: 220, display: "block" }}
          >
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0d9488" floodOpacity="0.12" />
              </filter>
              <style>{`
                @keyframes blink { 0%,90%,100% { transform:scaleY(1); } 95% { transform:scaleY(0.1); } }
                .cat-eye { transform-origin:center; animation: blink 3s infinite; fill:#fff; }
              `}</style>
            </defs>
            <g filter="url(#shadow)">
              <ellipse cx="100" cy="140" rx="58" ry="18" fill="rgba(13,148,136,0.12)" />
              <path
                fill="var(--teal)"
                d="M60 120c-6-10-8-26 4-36 8-7 18-6 26-10 6-3 10-10 18-10s12 7 18 10c8 4 18 3 26 10 12 10 10 26 4 36-6 10-18 16-40 16s-34-6-40-16z"
              />
              <circle className="cat-eye" cx="82" cy="108" r="6" />
              <circle className="cat-eye" cx="118" cy="108" r="6" />
              <path d="M96 118c4 6 12 6 16 0" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />
              <path d="M72 86c6-8 16-10 28-10s22 2 28 10" fill="#075" opacity="0.06" />
            </g>
          </svg>
        </div>
        <h1>404 — Not Built Yet</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          This topic doesn&apos;t have a visualizer yet. Check back soon, or look at what&apos;s already live.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18 }}>
          <Link className="btn btn-primary" href="/topics/">
            See live topics →
          </Link>
          <Link className="btn btn-ghost" href="/">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
