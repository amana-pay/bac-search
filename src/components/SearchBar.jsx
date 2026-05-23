import { forwardRef } from "react";

export const SearchBar = forwardRef(function SearchBar(
  { value, onChange, onClear },
  ref
) {
  return (
    <div className="searchbar-wrap">
      <SearchIcon />
      <input
        ref={ref}
        className="searchbar-input"
        type="search"
        inputMode="search"
        dir="auto"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="اكتب سؤالك، كلمة، أو مصطلح..."
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="خانة البحث"
      />
      {value.length > 0 && (
        <button
          className="searchbar-clear"
          onClick={onClear}
          aria-label="مسح البحث"
          tabIndex={0}
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
});

function SearchIcon() {
  return (
    <svg className="searchbar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
