import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSearch } from "./hooks/useSearch";
import { useBookmarks } from "./hooks/useBookmarks";
import { SearchBar } from "./components/SearchBar";
import { SubjectTabs } from "./components/SubjectTabs";
import { ResultCard } from "./components/ResultCard";
import { EmptyState } from "./components/EmptyState";
import { Header } from "./components/Header";

export const SUBJECTS = [
  { id: "all",       label: "الكل",        labelFr: "Tout",        icon: "⬡" },
  { id: "philosophy",label: "الفلسفة",     labelFr: "Philo",       icon: "∞" },
  { id: "arabic",    label: "العربية",     labelFr: "Arabe",       icon: "ع" },
  { id: "french",    label: "Français",    labelFr: "Français",    icon: "Fr" },
  { id: "english",   label: "English",     labelFr: "English",     icon: "En" },
  { id: "math",      label: "الرياضيات",   labelFr: "Maths",       icon: "∑" },
  { id: "physics",   label: "الفيزياء",    labelFr: "Physique",    icon: "⚛" },
  { id: "svt",       label: "SVT",         labelFr: "SVT",         icon: "🧬" },
  { id: "history",   label: "التاريخ",     labelFr: "Histoire",    icon: "⌛" },
  { id: "islamic",   label: "الإسلاميات",  labelFr: "Islamiates",  icon: "☽" },
];

export default function App() {
  const [query, setQuery]           = useState("");
  const [activeSubject, setSubject] = useState("all");
  const [showBookmarks, setShowBookmarks] = useState(false);
  const inputRef = useRef(null);

  const { results, stats } = useSearch(query, activeSubject);
  const { bookmarks, toggle: toggleBookmark, isBookmarked } = useBookmarks();

  const displayResults = useMemo(() => {
    if (showBookmarks) {
      return bookmarks.filter(
        item => activeSubject === "all" || item.subject === activeSubject
      );
    }
    return results;
  }, [showBookmarks, bookmarks, activeSubject, results]);

  // Auto-focus on desktop on mount
  useEffect(() => {
    if (window.innerWidth > 768) inputRef.current?.focus();
  }, []);

  const handleClear = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  return (
    <div className="app-root" dir="rtl">
      <div className="app-bg-grid" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />

      <div className="app-shell">
        <Header
          showBookmarks={showBookmarks}
          onToggleBookmarks={() => setShowBookmarks(v => !v)}
          bookmarkCount={bookmarks.length}
        />

        <div className="search-area">
          <SearchBar
            ref={inputRef}
            value={query}
            onChange={setQuery}
            onClear={handleClear}
          />
          {query && !showBookmarks && (
            <div className="search-meta" aria-live="polite">
              <span className="meta-dot" />
              {stats.count} نتيجة · {stats.ms} ms
            </div>
          )}
        </div>

        <SubjectTabs
          subjects={SUBJECTS}
          active={activeSubject}
          onChange={id => { setSubject(id); setShowBookmarks(false); }}
        />

        <main className="results-area" role="main">
          {displayResults.length > 0 ? (
            <div className="results-grid">
              {displayResults.map((item, i) => (
                <ResultCard
                  key={`${item.subject}-${i}`}
                  item={item}
                  query={query}
                  bookmarked={isBookmarked(item)}
                  onBookmark={() => toggleBookmark(item)}
                  animDelay={i * 40}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              query={query}
              showBookmarks={showBookmarks}
              onSuggestion={setQuery}
            />
          )}
        </main>
      </div>
    </div>
  );
}
