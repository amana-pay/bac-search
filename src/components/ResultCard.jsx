import { useState, useCallback } from "react";

const SUBJECT_COLORS = {
  philosophy: { accent: "#a78bfa", label: "فلسفة" },
  arabic:     { accent: "#34d399", label: "عربية" },
  french:     { accent: "#60a5fa", label: "Français" },
  english:    { accent: "#f59e0b", label: "English" },
  math:       { accent: "#f472b6", label: "Riyada" },
  physics:    { accent: "#38bdf8", label: "Physique" },
  svt:        { accent: "#4ade80", label: "SVT" },
  history:    { accent: "#fb923c", label: "Histoire" },
  islamic:    { accent: "#e2b94b", label: "Islamiates" },
};

function getSubjectMeta(subject) {
  return SUBJECT_COLORS[subject] || { accent: "#00ff66", label: subject };
}

export function ResultCard({ item, query, bookmarked, onBookmark, animDelay }) {
  const [copied, setCopied] = useState(false);
  const { accent, label } = getSubjectMeta(item.subject);

  const handleCopy = useCallback(async () => {
    const text = `${item.keywords[0]}\n\n${item.answer}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older WebViews
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity  = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [item]);

  const previewKeywords = item.keywords.slice(0, 3).join(" · ");

  return (
    <article
      className="result-card"
      style={{
        "--card-accent": accent,
        animationDelay: `${animDelay}ms`,
      }}
    >
      {/* Subject badge */}
      <div className="card-subject-badge" style={{ backgroundColor: accent }}>
        {label}
      </div>

      {/* Keywords row */}
      <div className="card-keywords" dir="auto">
        {previewKeywords}
      </div>

      {/* Answer body */}
      <div className="card-answer" dir="auto">
        {item.answer}
      </div>

      {/* Actions row */}
      <div className="card-actions">
        <button
          className={`action-btn copy-btn ${copied ? "copied" : ""}`}
          onClick={handleCopy}
          aria-label="نسخ الجواب"
          title="Copy answer"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span>{copied ? "تم النسخ" : "نسخ"}</span>
        </button>

        <button
          className={`action-btn bookmark-btn ${bookmarked ? "bookmarked" : ""}`}
          onClick={onBookmark}
          aria-label={bookmarked ? "إزالة من المحفوظات" : "حفظ"}
          title={bookmarked ? "Remove bookmark" : "Bookmark"}
          style={{ color: bookmarked ? accent : undefined }}
        >
          <BookmarkIcon filled={bookmarked} />
          <span>{bookmarked ? "محفوظ" : "حفظ"}</span>
        </button>
      </div>
    </article>
  );
}

// ── Inline SVG icons (no external deps) ─────────────────────────────────────

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookmarkIcon({ filled }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="2"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}
