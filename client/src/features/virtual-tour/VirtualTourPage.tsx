import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PanoramaViewer, { type PanoramaViewerControls } from "./components/PanoramaViewer";
import TourInfoModal from "./components/TourInfoModal";
import TourConsultant from "./components/TourConsultant";
import TourMiniMap from "./components/TourMinimap";
import { ROOM_BY_ID, TOUR_ROOMS, TOUR_SEQUENCE, type TourHotspot, type TourRoomId } from "./data/tourConfig";

export default function VirtualTourPage() {
  const navigate = useNavigate();
  const [currentRoomId, setCurrentRoomId] = useState<TourRoomId>("reception");
  const [selectedHotspot, setSelectedHotspot] = useState<TourHotspot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [viewerControls, setViewerControls] = useState<PanoramaViewerControls | null>(null);

  const currentRoom = ROOM_BY_ID[currentRoomId];
  const currentIndex = TOUR_SEQUENCE.indexOf(currentRoomId);
  const prevRoomId = TOUR_SEQUENCE[(currentIndex - 1 + TOUR_SEQUENCE.length) % TOUR_SEQUENCE.length];
  const nextRoomId = TOUR_SEQUENCE[(currentIndex + 1) % TOUR_SEQUENCE.length];

  const hasModal = selectedHotspot !== null;

  const handleReady = useCallback((controls: PanoramaViewerControls | null) => {
    setViewerControls(controls);
  }, []);

  const handleHotspotSelect = useCallback((hotspot: TourHotspot) => {
    setSelectedHotspot(hotspot);
  }, []);

  const handleNavigate = useCallback((roomId: TourRoomId) => {
    setCurrentRoomId(roomId);
  }, []);

  const handleLoadingStateChange = useCallback((loading: boolean, progress: number) => {
    setIsLoading(loading);
    setLoadProgress(progress);
  }, []);

  const neighboringRooms = useMemo(
    () => TOUR_ROOMS.filter((room) => room.id === prevRoomId || room.id === nextRoomId),
    [nextRoomId, prevRoomId],
  );

  return (
    <main className="pano-tour-page">
      <button
        type="button"
        className="pano-tour-back-home button secondary"
        onClick={() => navigate("/")}
        aria-label="Back to Home"
      >
        ← Back to Home
      </button>

      <section className="pano-tour-viewer-shell">
        <PanoramaViewer
          room={currentRoom}
          onReady={handleReady}
          onHotspotSelect={handleHotspotSelect}
          onNavigate={handleNavigate}
          onLoadingStateChange={handleLoadingStateChange}
        />

        {isLoading ? (
          <div className="pano-tour-loading" role="status" aria-live="polite">
            <p className="section-eyebrow">Завантаження панорами</p>
            <strong>{currentRoom.title}</strong>
            <div className="pano-tour-loading-track" aria-hidden="true">
              <span style={{ width: `${Math.max(8, loadProgress)}%` }} />
            </div>
            <p>{loadProgress}%</p>
          </div>
        ) : null}

        <button
          type="button"
          className="pano-tour-arrow pano-tour-arrow-left"
          onClick={() => setCurrentRoomId(prevRoomId)}
          aria-label={`Перейти до ${ROOM_BY_ID[prevRoomId].title}`}
        >
          ‹
        </button>
        <button
          type="button"
          className="pano-tour-arrow pano-tour-arrow-right"
          onClick={() => setCurrentRoomId(nextRoomId)}
          aria-label={`Перейти до ${ROOM_BY_ID[nextRoomId].title}`}
        >
          ›
        </button>

        <header className="pano-tour-topbar">
          <div>
            <p className="section-eyebrow">360° Virtual Tour</p>
            <h1>SportLand Лівобережна</h1>
            <p>{currentRoom.description}</p>
          </div>
          <div className="pano-tour-topbar-actions">
            <button type="button" className="button secondary" onClick={() => viewerControls?.zoomOut()}>
              Zoom -
            </button>
            <button type="button" className="button secondary" onClick={() => viewerControls?.zoomIn()}>
              Zoom +
            </button>
            <button type="button" className="button secondary" onClick={() => viewerControls?.toggleFullscreen()}>
              Fullscreen
            </button>
            <button type="button" className="button primary" onClick={() => navigate("/")}>
              Exit
            </button>
          </div>
        </header>
      </section>

      <aside className="pano-tour-sidebar">
        <TourMiniMap
          rooms={TOUR_ROOMS}
          currentRoomId={currentRoomId}
          onSelectRoom={(roomId) => setCurrentRoomId(roomId)}
        />

        <section className="pano-tour-card info-card">
          <p className="section-eyebrow">Навігація</p>
          <h2>{currentRoom.title}</h2>
          <p>{currentRoom.description}</p>
          <div className="pano-tour-neighbors">
            {neighboringRooms.map((room) => (
              <button key={room.id} type="button" className="pano-tour-chip" onClick={() => setCurrentRoomId(room.id)}>
                {room.title}
              </button>
            ))}
          </div>
        </section>

        <section className="pano-tour-card info-card">
          <p className="section-eyebrow">Hotspots</p>
          <div className="pano-tour-hotspot-list">
            {TOUR_ROOMS.map((room) => (
              <button
                key={room.hotspot.id}
                type="button"
                className={`pano-tour-hotspot-item ${currentRoomId === room.id ? "is-active" : ""}`}
                onClick={() => {
                  setCurrentRoomId(room.id);
                  setSelectedHotspot(room.hotspot);
                }}
              >
                <strong>{room.hotspot.title}</strong>
                <span>{room.title}</span>
              </button>
            ))}
          </div>
        </section>
      </aside>

      <TourInfoModal
        open={hasModal}
        hotspot={selectedHotspot}
        onClose={() => setSelectedHotspot(null)}
        onBookMembership={() => navigate("/memberships")}
        onViewSchedule={() => navigate("/classes")}
      />

      <TourConsultant
        roomTitle={currentRoom.title}
        onBookMembership={() => navigate("/memberships")}
        onViewSchedule={() => navigate("/classes")}
      />
    </main>
  );
}
