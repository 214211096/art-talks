function SearchBar({ value, onChange }) {
    return (
        <div className="search-bar">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
                type="search"
                placeholder="Search by artist name..."
                aria-label="Search by artist name"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <button
                    type="button"
                    className="search-clear"
                    aria-label="Clear search"
                    onClick={() => onChange('')}
                >
                    ×
                </button>
            )}
        </div>
    );
}

export default SearchBar;
