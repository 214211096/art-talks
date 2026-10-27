import { galleryHref } from '../hooks/useHashRoute';
import Chat from './Chat';

function Discussion({ picture }) {
    if (!picture) {
        return (
            <section className="status">
                <p>This picture doesn't exist.</p>
                <a className="back-link" href={galleryHref}>← Back to gallery</a>
            </section>
        );
    }

    return (
        <section className="discussion-page">
            <a className="back-link" href={galleryHref}>← Back to gallery</a>
            <div className="discussion-layout">
                <figure className="discussion-artwork">
                    <img src={picture.url} alt={`Artwork by ${picture.artist}`} />
                    <figcaption>
                        <h2>{picture.artist}</h2>
                        <p>{picture.description}</p>
                    </figcaption>
                </figure>
                <Chat pictureId={picture.id} />
            </div>
        </section>
    );
}

export default Discussion;
