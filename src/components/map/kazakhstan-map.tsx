"use client";

import {
  Map as MapLibreMap,
  Marker as MapLibreMarker,
  Popup as MapLibrePopup,
  NavigationControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";

import { getMapStyle } from "@/lib/map/style";
import { KAZAKHSTAN_BOUNDS, KAZAKHSTAN_CENTER, KAZAKHSTAN_INITIAL_ZOOM } from "@/lib/map/regions";
import type { MapPoint } from "@/types";

export interface KazakhstanMapProps {
  /** Every clickable marker currently shown on the map. */
  points: MapPoint[];
  /** Tentatively-selected point (e.g. a quiz answer candidate, or the region-detail selection on /map). Rendered as a highlighted marker. */
  selectedId?: string | null;
  /** Once a quiz answer is graded, the correct point renders green regardless of what was clicked. */
  correctId?: string | null;
  /** Once a quiz answer is graded and wrong, the clicked point renders red. */
  incorrectId?: string | null;
  /** Disable marker clicks (e.g. while a quiz answer is already graded). */
  disabled?: boolean;
  onSelectPoint: (point: MapPoint) => void;
  className?: string;
}

const MARKER_BASE_CLASS =
  "relative before:absolute before:-inset-3 before:content-[''] flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-2 border-white/80 bg-primary shadow-[0_0_0_4px_hsla(217,91%,60%,0.25)] transition-transform duration-200 ease-out hover:scale-125";
const MARKER_SELECTED_CLASS =
  "!h-5 !w-5 !bg-accent !shadow-[0_0_0_6px_hsla(189,94%,55%,0.35)] scale-125";
const MARKER_CORRECT_CLASS =
  "!h-5 !w-5 !bg-success !shadow-[0_0_0_6px_hsla(142,71%,45%,0.4)] scale-125";
const MARKER_INCORRECT_CLASS =
  "!h-5 !w-5 !bg-destructive !shadow-[0_0_0_6px_hsla(0,72%,58%,0.4)] scale-125";
const MARKER_DISABLED_CLASS = "!cursor-default hover:!scale-100";

function resolveMarkerClass({
  id,
  selectedId,
  correctId,
  incorrectId,
  disabled,
}: {
  id: string;
  selectedId?: string | null;
  correctId?: string | null;
  incorrectId?: string | null;
  disabled?: boolean;
}): string {
  const classes = [MARKER_BASE_CLASS];

  if (correctId && id === correctId) classes.push(MARKER_CORRECT_CLASS);
  else if (incorrectId && id === incorrectId) classes.push(MARKER_INCORRECT_CLASS);
  else if (selectedId && id === selectedId) classes.push(MARKER_SELECTED_CLASS);

  if (disabled) classes.push(MARKER_DISABLED_CLASS);

  return classes.join(" ");
}

export function KazakhstanMap({
  points,
  selectedId = null,
  correctId = null,
  incorrectId = null,
  disabled = false,
  onSelectPoint,
  className,
}: KazakhstanMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, MapLibreMarker>>(new Map());
  const popupRef = useRef<MapLibrePopup | null>(null);

  // Live mirrors so the map (created once) always calls latest callbacks /
  // reads latest state without needing to re-create markers every render.
  const onSelectPointRef = useRef(onSelectPoint);
  onSelectPointRef.current = onSelectPoint;
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  // Init map + markers once per `points` identity change (a new quiz
  // category selection swaps the whole point set; grading state changes do
  // NOT recreate markers — see the styling effect below).
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new MapLibreMap({
      container: containerRef.current,
      style: getMapStyle(),
      center: KAZAKHSTAN_CENTER,
      zoom: KAZAKHSTAN_INITIAL_ZOOM,
      minZoom: 3,
      maxZoom: 10,
      maxBounds: KAZAKHSTAN_BOUNDS,
      attributionControl: { compact: true },
    });

    map.addControl(new NavigationControl({ showCompass: false }), "top-right");

    popupRef.current = new MapLibrePopup({
      closeButton: false,
      closeOnClick: false,
      offset: 14,
    });

    points.forEach((point) => {
      const el = document.createElement("div");
      el.className = MARKER_BASE_CLASS;
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", point.name);

      el.addEventListener("mouseenter", () => {
        popupRef.current
          ?.setLngLat([point.lng, point.lat])
          .setHTML(
            `<div style="font-family:var(--font-inter);font-size:12.5px;font-weight:500;color:#f5f7fa;">${point.name}</div>`,
          )
          .addTo(map);
      });
      el.addEventListener("mouseleave", () => {
        popupRef.current?.remove();
      });
      el.addEventListener("click", () => {
        if (disabledRef.current) return;
        onSelectPointRef.current(point);
      });

      const marker = new MapLibreMarker({ element: el })
        .setLngLat([point.lng, point.lat])
        .addTo(map);

      markersRef.current.set(point.id, marker);
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  // Sync marker styling with selection / grading state.
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      marker.getElement().className = resolveMarkerClass({
        id,
        selectedId,
        correctId,
        incorrectId,
        disabled,
      });
    });
  }, [selectedId, correctId, incorrectId, disabled]);

  // Fly the camera to whichever point is authoritative right now.
  useEffect(() => {
    const targetId = correctId ?? selectedId;
    if (!targetId || !mapRef.current) return;
    const point = points.find((p) => p.id === targetId);
    if (!point) return;

    mapRef.current.flyTo({
      center: [point.lng, point.lat],
      zoom: 6,
      duration: 900,
      essential: true,
    });
  }, [selectedId, correctId, points]);

  return (
    <div
      ref={containerRef}
      className={className}
      role="application"
      aria-label="Интерактивная карта Казахстана"
    />
  );
}
