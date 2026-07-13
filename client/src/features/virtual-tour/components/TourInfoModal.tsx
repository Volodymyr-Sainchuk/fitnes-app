import type { TourHotspot } from "../data/tourConfig";

type TourInfoModalProps = {
  open: boolean;
  hotspot: TourHotspot | null;
  onClose: () => void;
  onBookMembership: () => void;
  onViewSchedule: () => void;
};

export default function TourInfoModal({
  open,
  hotspot,
  onClose,
  onBookMembership,
  onViewSchedule,
}: TourInfoModalProps) {
  if (!open || !hotspot) {
    return null;
  }

  return (
    <div className="pano-tour-modal-backdrop" role="presentation" onClick={onClose}>
      <article
        className="pano-tour-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Інформація про зону ${hotspot.title}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="pano-tour-modal-head">
          <div>
            <p className="section-eyebrow">Hotspot</p>
            <h3>{hotspot.title}</h3>
          </div>
          <button type="button" className="button secondary" onClick={onClose}>
            Закрити
          </button>
        </header>

        <p className="pano-tour-modal-description">{hotspot.description}</p>

        <div className="pano-tour-modal-gallery">
          {hotspot.photos.map((photo) => (
            <img key={photo} src={photo} alt={hotspot.title} loading="lazy" />
          ))}
        </div>

        <footer className="pano-tour-modal-actions">
          <button type="button" className="button primary" onClick={onBookMembership}>
            Book Membership
          </button>
          <button type="button" className="button secondary" onClick={onViewSchedule}>
            View Schedule
          </button>
        </footer>
      </article>
    </div>
  );
}
