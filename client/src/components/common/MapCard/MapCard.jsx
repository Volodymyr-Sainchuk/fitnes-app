export default function MapCard() {
  return (
    <div className="info-card map-card">
      <div className="map-card-header">
        <div>
          <p className="section-eyebrow">Локація</p>
          <h3>Наші клубні простори</h3>
        </div>
        <a
          className="button secondary"
          href="https://www.google.com/maps/search/?api=1&query=Kyiv+Shevchenka+12"
          target="_blank"
          rel="noopener noreferrer"
        >
          Відкрити в Google Maps
        </a>
      </div>
      <div className="map-frame">
        <iframe
          title="Sportlend location"
          src="https://www.google.com/maps?q=Kyiv%20Shevchenka%2012&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="map-details">
        <p>Київ, вул. Шевченка 12</p>
        <p>Пн–Нд, 06:00–22:00</p>
        <p>+38 (050) 123-45-67 · hello@sportlend.club</p>
      </div>
    </div>
  );
}
