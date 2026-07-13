const CACHE = "birrometro-v30";
const FLAG_CODES = ["ar","at","au","be","br","ca","cn","cu","cz","de","dk","ec","es","fi","fr","gb","ie","in","it","jm","jp","ma","mx","nl","pe","pl","pt","sg","th","us"];
const ASSETS = ["./", "index.html", "styles.css?v=30", "beer-catalog.js?v=30", "script.js?v=30", "firebase-sync.js?v=30", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png", ...FLAG_CODES.map((code) => `assets/flags/${code}.svg`)];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put("index.html", copy));
        return response;
      })
      .catch(() => caches.match("index.html")));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  })));
});
