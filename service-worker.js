const CACHE_NAME = 'gallery-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/gallery.html',
  '/manifest.json',
  '/a.mp3',
  '/img/icon-192x192.png',
  '/img/icon-512x512.png'
];

// Add all 59 image paths to the cache list
for (let i = 1; i <= 59; i++) {
    urlsToCache.push(`/img/${i}.png`);
}

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// The fetch handler serves up the cached content if available, falling back to the network.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
