import { useMemo } from "react";
import { qaDatabase } from "../data/qaDatabase";

// ---------------------------------------------------------------------------
// Lightweight fuzzy scorer — no external dependency.
// Strategy: token overlap with partial-match bonus + Levenshtein fallback.
// Runs entirely in-memory; zero network, zero GC pressure per keystroke.
// ---------------------------------------------------------------------------

/** Levenshtein distance (bounded early-exit at maxDist for speed). */
function levenshtein(a, b, maxDist = 4) {
  if (Math.abs(a.length - b.length) > maxDist) return maxDist + 1;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp   = new Uint8Array(rows * cols);

  for (let i = 0; i < rows; i++) dp[i * cols] = i;
  for (let j = 0; j < cols; j++) dp[j]        = j;

  for (let i = 1; i < rows; i++) {
    let rowMin = maxDist + 1;
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const val  = Math.min(
        dp[(i - 1) * cols + j]     + 1,
        dp[i * cols + (j - 1)]     + 1,
        dp[(i - 1) * cols + (j - 1)] + cost
      );
      dp[i * cols + j] = val;
      if (val < rowMin) rowMin = val;
    }
    if (rowMin > maxDist) return maxDist + 1;
  }
  return dp[rows * cols - 1];
}

const STOP_WORDS = new Set([
  "ما", "هو", "هي", "في", "على", "من", "كيف", "ما هو", "شنو",
  "اين", "تعريف", "معنى", "شكون", "le", "la", "les", "de", "du",
  "des", "un", "une", "et", "est", "en", "que", "qui",
]);

/** Tokenise and clean a query string into meaningful tokens. */
function tokenise(str) {
  return str
    .toLowerCase()
    .split(/[\s\-_،,]+/)
    .map(t => t.replace(/['"«»]/g, "").trim())
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

/**
 * Score a single database item against the query tokens.
 * Returns 0 if no match found (item excluded from results).
 */
function scoreItem(item, tokens) {
  let totalScore = 0;

  for (const token of tokens) {
    let bestForToken = 0;

    for (const kw of item.keywords) {
      const kwLower = kw.toLowerCase();

      // Exact or substring match — highest value
      if (kwLower === token) {
        bestForToken = Math.max(bestForToken, 100);
        continue;
      }
      if (kwLower.includes(token)) {
        bestForToken = Math.max(bestForToken, 70 + (token.length / kw.length) * 20);
        continue;
      }
      if (token.includes(kwLower)) {
        bestForToken = Math.max(bestForToken, 60);
        continue;
      }

      // Fuzzy: only bother if lengths are remotely comparable
      if (Math.abs(token.length - kwLower.length) <= 4 && token.length >= 3) {
        const dist = levenshtein(token, kwLower);
        if (dist <= 2) bestForToken = Math.max(bestForToken, 50 - dist * 15);
      }
    }

    // Also check the answer text for bonus signal
    if (bestForToken === 0) {
      const ansLower = item.answer.toLowerCase();
      if (ansLower.includes(token)) bestForToken = 15;
    }

    totalScore += bestForToken;
  }

  return totalScore;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSearch(query, activeSubject) {
  return useMemo(() => {
    const t0 = performance.now();

    if (!query || query.trim().length < 1) {
      return { results: [], stats: { count: 0, ms: "0.00" } };
    }

    const tokens = tokenise(query);
    if (tokens.length === 0) {
      return { results: [], stats: { count: 0, ms: "0.00" } };
    }

    const pool = activeSubject === "all"
      ? qaDatabase
      : qaDatabase.filter(item => item.subject === activeSubject);

    const scored = [];
    for (const item of pool) {
      const s = scoreItem(item, tokens);
      if (s > 0) scored.push({ item, score: s });
    }

    scored.sort((a, b) => b.score - a.score);

    const ms = (performance.now() - t0).toFixed(2);
    return {
      results: scored.map(s => s.item),
      stats:   { count: scored.length, ms },
    };
  }, [query, activeSubject]);
}
