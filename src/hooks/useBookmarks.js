import { useState, useCallback } from "react";

const STORAGE_KEY = "bac_bookmarks_v1";

function makeId(item) {
  return `${item.subject}::${item.keywords[0]}`;
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or private mode — fail silently
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(load);

  const toggle = useCallback((item) => {
    setBookmarks(prev => {
      const id = makeId(item);
      const exists = prev.some(b => makeId(b) === id);
      const next   = exists
        ? prev.filter(b => makeId(b) !== id)
        : [item, ...prev];
      save(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (item) => bookmarks.some(b => makeId(b) === makeId(item)),
    [bookmarks]
  );

  return { bookmarks, toggle, isBookmarked };
}
