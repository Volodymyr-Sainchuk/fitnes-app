import type { TourRoom, TourRoomId } from "../data/tourConfig";

type TourMiniMapProps = {
  rooms: TourRoom[];
  currentRoomId: TourRoomId;
  onSelectRoom: (roomId: TourRoomId) => void;
};

export default function TourMiniMap({ rooms, currentRoomId, onSelectRoom }: TourMiniMapProps) {
  const currentRoom = rooms.find((room) => room.id === currentRoomId);

  return (
    <section className="pano-tour-card pano-tour-minimap info-card">
      <div className="pano-tour-minimap-head">
        <p className="section-eyebrow">Mini Map</p>
        <strong>{currentRoom?.title}</strong>
      </div>

      <div className="pano-tour-minimap-plan">
        <img src="/virtual-tour/plan_c97923177a.jpg" alt="План фітнес-клубу" loading="lazy" />

        {rooms.map((room) => (
          <button
            key={room.id}
            type="button"
            className={`pano-tour-minimap-dot ${room.id === currentRoomId ? "is-active" : ""}`}
            style={{ left: `${room.mapX}%`, top: `${room.mapY}%` }}
            onClick={() => onSelectRoom(room.id)}
            aria-label={`Перейти до зони ${room.title}`}
          >
            <span />
          </button>
        ))}
      </div>
    </section>
  );
}
