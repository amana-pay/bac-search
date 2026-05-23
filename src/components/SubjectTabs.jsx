export function SubjectTabs({ subjects, active, onChange }) {
  return (
    <nav className="subject-nav" aria-label="تصفية حسب المادة">
      <div className="subject-tabs-scroll" role="tablist">
        {subjects.map(s => (
          <button
            key={s.id}
            role="tab"
            aria-selected={active === s.id}
            className={`subject-tab ${active === s.id ? "tab-active" : ""}`}
            onClick={() => onChange(s.id)}
          >
            <span className="tab-icon" aria-hidden="true">{s.icon}</span>
            <span className="tab-label">{s.labelFr}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
