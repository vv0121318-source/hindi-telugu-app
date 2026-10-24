const CACHE_NAME = "hindi-telugu-v1";
const CORE = ["https://vv0121318-source.github.io/hindi-telugu-app/","https://vv0121318-source.github.io/hindi-telugu-app/index.html","https://vv0121318-source.github.io/hindi-telugu-app/manifest.json","https://vv0121318-source.github.io/hindi-telugu-app/icon-192.png","https://vv0121318-source.github.io/hindi-telugu-app/icon-512.png"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(CORE).catch(() => {})));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
  self.clients.claim();
});
// Network first so updates show up; falls back to the saved copy when offline.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  if (!e.request.url.startsWith(self.location.origin)) return; // never cache translator API calls
  e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(CACHE_NAME).then((x) => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
