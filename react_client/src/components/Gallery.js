import { useMemo, useState } from 'react';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import PictureCard from './PictureCard';
import SearchBar from './SearchBar';

function Gallery({ pictures, loading, error, onRetry }) {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebouncedValue(searchTerm);

    const filteredPictures = useMemo(() => {
        const term = debouncedSearch.trim().toLowerCase();
        return pictures.filter(picture => picture.artist.toLowerCase().includes(term));
    }, [pictures, debouncedSearch]);

    return (
        <section className="gallery-page">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />

            {loading && <div className="status">Loading gallery…</div>}

            {error && (
                <div className="status status--error" role="alert">
                    <p>Couldn't load the gallery. Is the server running?</p>
                    <button type="button" onClick={onRetry}>Try again</button>
                </div>
            )}

            {!loading && !error && filteredPictures.length === 0 && (
                <div className="status">No artists match “{debouncedSearch}”.</div>
            )}

            <div className="gallery">
                {filteredPictures.map(picture => (
                    <PictureCard key={picture.id} picture={picture} />
                ))}
            </div>
        </section>
    );
}

export default Gallery;
