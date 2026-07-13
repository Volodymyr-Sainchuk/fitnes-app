import { useEffect, useMemo, useRef } from "react";
import { Viewer, events as viewerEvents } from "@photo-sphere-viewer/core";
import { MarkersPlugin, events as markerEvents, type MarkerConfig } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { ROOM_BY_ID, type TourHotspot, type TourRoom, type TourRoomId } from "../data/tourConfig";
import { optimizePanorama, preloadPanoramas } from "../utils/panoramaOptimizer";

export type PanoramaViewerControls = {
  zoomIn: () => void;
  zoomOut: () => void;
  toggleFullscreen: () => void;
};

type PanoramaViewerProps = {
  room: TourRoom;
  onReady: (controls: PanoramaViewerControls | null) => void;
  onHotspotSelect: (hotspot: TourHotspot) => void;
  onNavigate: (roomId: TourRoomId) => void;
  onLoadingStateChange: (loading: boolean, progress: number) => void;
};

function disposeMaterialTextures(material: unknown) {
  if (!material || typeof material !== "object") {
    return;
  }

  const candidate = material as Record<string, unknown>;
  for (const value of Object.values(candidate)) {
    if (value && typeof value === "object" && "isTexture" in (value as Record<string, unknown>)) {
      (value as { dispose?: () => void }).dispose?.();
    }
  }

  (candidate as { dispose?: () => void }).dispose?.();
}

function disposeSceneGraph(scene: unknown) {
  if (!scene || typeof scene !== "object" || !("traverse" in (scene as Record<string, unknown>))) {
    return;
  }

  (scene as { traverse: (cb: (object: Record<string, unknown>) => void) => void }).traverse((object) => {
    const geometry = object.geometry as { dispose?: () => void } | undefined;
    geometry?.dispose?.();

    const material = object.material as unknown;
    if (Array.isArray(material)) {
      material.forEach(disposeMaterialTextures);
    } else {
      disposeMaterialTextures(material);
    }
  });
}

function disposeViewerResources(viewer: Viewer) {
  const internalRenderer = (
    viewer as unknown as {
      renderer?: {
        renderer?: {
          renderLists?: { dispose?: () => void };
          dispose?: () => void;
          getContext?: () => {
            getExtension?: (name: string) => { loseContext?: () => void } | null;
          };
        };
        scene?: unknown;
      };
    }
  ).renderer;
  const glRenderer = internalRenderer?.renderer;
  const scene = internalRenderer?.scene;

  disposeSceneGraph(scene);

  glRenderer?.renderLists?.dispose?.();
  glRenderer?.dispose?.();

  const glContext = glRenderer?.getContext?.();
  const loseContext = glContext?.getExtension?.("WEBGL_lose_context");
  loseContext?.loseContext?.();
}

function buildMarkers(room: TourRoom): MarkerConfig[] {
  const roomHotspot: MarkerConfig = {
    id: room.hotspot.id,
    html: '<span class="pano-tour-marker-dot"></span>',
    position: { yaw: room.hotspot.yaw, pitch: room.hotspot.pitch },
  };

  const links: MarkerConfig[] = room.links.map((link) => ({
    id: `link:${link.target}`,
    html: '<span class="pano-tour-marker-link">→</span>',
    position: { yaw: link.yaw, pitch: link.pitch },
    tooltip: link.label,
  }));

  return [roomHotspot, ...links];
}

export default function PanoramaViewer({
  room,
  onReady,
  onHotspotSelect,
  onNavigate,
  onLoadingStateChange,
}: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const roomRef = useRef(room);
  const onHotspotSelectRef = useRef(onHotspotSelect);
  const onNavigateRef = useRef(onNavigate);
  const onLoadingStateChangeRef = useRef(onLoadingStateChange);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  useEffect(() => {
    onHotspotSelectRef.current = onHotspotSelect;
  }, [onHotspotSelect]);

  useEffect(() => {
    onNavigateRef.current = onNavigate;
  }, [onNavigate]);

  useEffect(() => {
    onLoadingStateChangeRef.current = onLoadingStateChange;
  }, [onLoadingStateChange]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const controls = useMemo<PanoramaViewerControls>(
    () => ({
      zoomIn: () => {
        const viewer = viewerRef.current;
        if (!viewer) return;
        viewer.zoom(Math.min(100, viewer.getZoomLevel() + 12));
      },
      zoomOut: () => {
        const viewer = viewerRef.current;
        if (!viewer) return;
        viewer.zoom(Math.max(0, viewer.getZoomLevel() - 12));
      },
      toggleFullscreen: () => {
        viewerRef.current?.toggleFullscreen();
      },
    }),
    [],
  );

  useEffect(() => {
    if (viewerRef.current) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const initialRoom = roomRef.current;

    const viewer = new Viewer({
      container,
      panorama: initialRoom.panorama,
      defaultYaw: initialRoom.defaultYaw,
      defaultPitch: initialRoom.defaultPitch,
      mousewheel: true,
      touchmoveTwoFingers: false,
      plugins: [[MarkersPlugin, { markers: buildMarkers(initialRoom) }]],
    });

    viewerRef.current = viewer;
    onReadyRef.current(controls);

    const markers = viewer.getPlugin(MarkersPlugin) as MarkersPlugin | undefined;

    const onPanoramaLoad: EventListener = () => onLoadingStateChangeRef.current(true, 0);
    const onPanoramaProgress: EventListener = ((event: Event) => {
      const progress = (event as { progress?: number }).progress ?? 0;
      onLoadingStateChangeRef.current(true, Math.round(progress));
    }) as EventListener;
    const onPanoramaLoaded: EventListener = () => onLoadingStateChangeRef.current(false, 100);

    const onSelectMarker: EventListener = ((event: Event) => {
      const markerId = (event as { marker?: { id?: string } }).marker?.id;
      if (!markerId) {
        return;
      }

      if (markerId.startsWith("link:")) {
        onNavigateRef.current(markerId.replace("link:", "") as TourRoomId);
        return;
      }

      if (markerId === roomRef.current.hotspot.id) {
        onHotspotSelectRef.current(roomRef.current.hotspot);
      }
    }) as EventListener;

    viewer.addEventListener(viewerEvents.PanoramaLoadEvent.type, onPanoramaLoad);
    viewer.addEventListener(viewerEvents.LoadProgressEvent.type, onPanoramaProgress);
    viewer.addEventListener(viewerEvents.PanoramaLoadedEvent.type, onPanoramaLoaded);
    markers?.addEventListener(markerEvents.SelectMarkerEvent.type, onSelectMarker);

    return () => {
      markers?.removeEventListener(markerEvents.SelectMarkerEvent.type, onSelectMarker);
      viewer.removeEventListener(viewerEvents.PanoramaLoadEvent.type, onPanoramaLoad);
      viewer.removeEventListener(viewerEvents.LoadProgressEvent.type, onPanoramaProgress);
      viewer.removeEventListener(viewerEvents.PanoramaLoadedEvent.type, onPanoramaLoaded);
      viewer.destroy();
      disposeViewerResources(viewer);
      viewerRef.current = null;
      onReadyRef.current(null);
    };
  }, [controls]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const markers = viewer.getPlugin(MarkersPlugin) as MarkersPlugin | undefined;
    let cancelled = false;

    const linkedPanoramas = room.links.map((link) => ROOM_BY_ID[link.target].panorama);
    preloadPanoramas(linkedPanoramas);

    void (async () => {
      onLoadingStateChangeRef.current(true, 0);
      const optimized = await optimizePanorama(room.panorama);
      if (cancelled) return;

      await viewer.setPanorama(optimized, {
        caption: room.title,
      });

      if (cancelled) return;
      markers?.setMarkers(buildMarkers(room));
      onLoadingStateChangeRef.current(false, 100);
    })();

    return () => {
      cancelled = true;
    };
  }, [room]);

  return <div ref={containerRef} className="pano-tour-viewer" />;
}
