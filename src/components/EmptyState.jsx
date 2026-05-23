const SUGGESTIONS = [
  "الوضع البشري",
  "إحياء النموذج",
  "sartre",
  "منهجية المقال",
  "antigone",
  "تكسير البنية",
  "metaphore",
  "الشخص",
];

export function EmptyState({ query, showBookmarks, onSuggestion }) {
  if (showBookmarks) {
    return (
      <div className="empty-state">
        <span className="empty-glyph" aria-hidden="true">☆</span>
        <p className="empty-title">لا توجد محفوظات بعد</p>
        <p className="empty-sub">احفظ البطاقات التي تحتاجها بالضغط على "حفظ"</p>
      </div>
    );
  }

  if (query.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-glyph" aria-hidden="true">⬡</span>
        <p className="empty-title">ابدأ بالبحث</p>
        <p className="empty-sub">اقتراحات سريعة:</p>
        <div className="suggestion-chips">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              className="suggestion-chip"
              onClick={() => onSuggestion(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <span className="empty-glyph" aria-hidden="true">∅</span>
      <p className="empty-title">لا نتائج لـ "{query}"</p>
      <p className="empty-sub">جرب كلمات أخرى أو تحقق من تهجئة المصطلح</p>
    </div>
  );
}
