/**
 * AtlasIQ service worker — Stage 16 PWA support.
 *
 * Strategy:
 *   - Navigations (HTML pages): network-first, falling back to the cached
 *     copy, and finally to /offline if neither is available.
 *   - Same-origin static assets (_next/static, icons, fonts): cache-first,
 *     since Next.js content-hashes these filenames — a cached copy is
 *     never stale.
 *   - Everything else (API routes, cross-origin map tiles, Supabase calls):
 *     untouched, straight to the network. Caching API responses or map
 *     tiles here would risk serving stale data silently, which matters
 *     more than offline support for those requests.
 */
const CACHE_NAME = "atlasiq-v1";
const OFFLINE_URL = "/offline";
const PRECACHE_URLS = [OFFLINE_URL, "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isStaticAsset(url) {
  return (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/_next/static/") ||
      url.pathname.startsWith("/icons/") ||
      url.pathname === "/favicon.ico")
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Navigations — network-first with offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(
        () =>
          caches.match(request).then((cached) => cached ?? caches.match(OFFLINE_URL)),
      ),
    );
    return;
  }

  // Static build assets — cache-first.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          }),
      ),
    );
  }
  // Everything else: no caching, default network behavior.
});
