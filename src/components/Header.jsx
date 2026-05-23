export function Header({ showBookmarks, onToggleBookmarks, bookmarkCount }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="brand-glyph" aria-hidden="true">0x6</span>
        <div className="brand-text">
          <span className="brand-title">BAC SEARCH</span>
          <span className="brand-sub">NEURAL INDEX // OFFLINE v5.0</span>
        </div>
      </div>

      <button
        className={`bookmark-toggle ${showBookmarks ? "active" : ""}`}
        onClick={onToggleBookmarks}
        aria-label={showBookmarks ? "عرض نتائج البحث" : "عرض المحفوظات"}
        title={showBookmarks ? "Back to search" : "Bookmarks"}
      >
        <BookmarkIcon filled={showBookmarks} />
        {bookmarkCount > 0 && (
          <span className="bookmark-badge" aria-label={`${bookmarkCount} محفوظ`}>
            {bookmarkCount}
          </span>
        )}
      </button>
    </header>
  );
}

function BookmarkIcon({ filled }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}
