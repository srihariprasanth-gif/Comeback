/* Study Rhythm service worker: caches the app files so it opens offline.
   It never touches localStorage, so saved checkmarks survive updates.
   To release an update, change VERSION here and APP_VERSION in index.html. */
const VERSION = '1.0.0';
const CACHE = 'study-rhythm-' + VERSION;
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('study-rhythm-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* Open from the cache at once, then refresh the cached copy in the background.
   A new version therefore appears the next time you open the app after it has been downloaded. */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(req, {ignoreSearch: true});
    const fresh = fetch(req, {cache: 'no-cache'}).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(fresh); return hit; }
    const res = await fresh;
    return res || (req.mode === 'navigate' ? cache.match('./index.html') : Response.error());
  }));
});
