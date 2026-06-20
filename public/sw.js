const CACHE_NAME = 'cody-portfolio-v1';
const PRE_CACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/profile_cody.jpg'
];

// Installs the Service Worker and pre-caches basic Shell layout assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline portal assets');
      return cache.addAll(PRE_CACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Cleans up old or outdated cache entries from previous system builds
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Evicting outdated system cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepts network requests to serve cached content or cache dynamically fetched assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // We only handle local HTTP/HTTPS requests (skip browser extensions, APIs that shouldn't be cached, etc.)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Handle SPA routing navigation requests by serving index.html if network is offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        console.log('[Service Worker] Offline navigation match, returning root fallback');
        return caches.match('/') || caches.match('/index.html');
      })
    );
    return;
  }

  // Stale-While-Revalidate or Cache-First for static assets, styles, scripts, and media
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update to keep cache fully fresh
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse);
            });
          }
        }).catch(() => {/* Handle or ignore background network failure silently */});

        return cachedResponse;
      }

      // Decouple network fetching and dynamic caching for requests not preloaded
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch((fetchErr) => {
        // Fallback for image payloads if offline and un-cached
        if (request.destination === 'image') {
          return caches.match('/profile_cody.jpg') || caches.match('/favicon.svg');
        }
        return Promise.reject(fetchErr);
      });
    })
  );
});
