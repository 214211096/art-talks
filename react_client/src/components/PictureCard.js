import { pictureHref } from '../hooks/useHashRoute';

function PictureCard({ picture }) {
    return (
        <a className="picture-card" href={pictureHref(picture.id)}>
            <div className="picture-card__image">
                <img src={picture.url} alt={`Artwork by ${picture.artist}`} loading="lazy" />
            </div>
            <div className="picture-card__body">
                <h2>{picture.artist}</h2>
                <p>{picture.description}</p>
                <span className="picture-card__cta">Join the discussion →</span>
            </div>
        </a>
    );
}

export default PictureCard;
