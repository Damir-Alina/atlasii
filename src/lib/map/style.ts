import type { StyleSpecification } from "maplibre-gl";

/**
 * A dark CARTO basemap requires no API key, so `npm run dev` works out of
 * the box with zero setup. If NEXT_PUBLIC_MAPTILER_API_KEY is set, we use
 * MapTiler's vector "darkmatter" style instead — sharper rendering and
 * higher usage limits, recommended for production. Swapping providers only
 * ever touches this file.
 */
export function getMapStyle(): string | StyleSpecification {
  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

  if (maptilerKey) {
    return `https://api.maptiler.com/maps/darkmatter/style.json?key=${maptilerKey}`;
  }

  return {
    version: 8,
    glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
    sources: {
      "carto-dark": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        ],
        tileSize: 256,
        attribution:
          '© <a href="https://carto.com/attributions">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    },
    layers: [
      {
        id: "carto-dark-layer",
        type: "raster",
        source: "carto-dark",
        minzoom: 0,
        maxzoom: 20,
      },
    ],
  };
}
