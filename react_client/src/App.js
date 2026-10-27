import { useCallback, useEffect, useState } from 'react';
import { fetchPictures } from './api';
import Discussion from './components/Discussion';
import Gallery from './components/Gallery';
import { galleryHref, useHashRoute } from './hooks/useHashRoute';
import './App.css';

function App() {
    const { pictureId } = useHashRoute();
    const [pictures, setPictures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        fetchPictures(controller.signal)
            .then(setPictures)
            .catch(err => {
                if (err.name !== 'AbortError') setError(err);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [reloadKey]);

    const retry = useCallback(() => setReloadKey(k => k + 1), []);
    const selectedPicture = pictures.find(p => p.id === pictureId);

    return (
        <div className="App">
            <header className="app-header">
                <a href={galleryHref} className="app-title">
                    <h1>Art Talks</h1>
                </a>
                <p className="app-subtitle">Discover artworks and talk about them in real time</p>
            </header>

            <main>
                {pictureId != null && !loading && !error ? (
                    <Discussion picture={selectedPicture} />
                ) : (
                    <Gallery
                        pictures={pictureId == null ? pictures : []}
                        loading={loading}
                        error={error}
                        onRetry={retry}
                    />
                )}
            </main>
        </div>
    );
}

export default App;
