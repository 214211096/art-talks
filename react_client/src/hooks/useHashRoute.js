import { useEffect, useState } from 'react';

// Minimal hash router: "#/picture/3" -> { pictureId: 3 }, anything else -> gallery
function parseHash(hash) {
    const match = hash.match(/^#\/picture\/(\d+)$/);
    return { pictureId: match ? Number(match[1]) : null };
}

export function useHashRoute() {
    const [route, setRoute] = useState(() => parseHash(window.location.hash));

    useEffect(() => {
        const onHashChange = () => {
            setRoute(parseHash(window.location.hash));
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    return route;
}

export const pictureHref = (id) => `#/picture/${id}`;
export const galleryHref = '#/';
