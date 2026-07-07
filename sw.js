const CACHE_NAME = 'v22';
const CACHE_URLS = ['./', './index.html', './data.js', './background.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Patterns for external image proxy/CDN requests to cache
const _px = [/images\.weserv\.nl/,/pixhost\./,/avjoy\./,/javmiku\./,/dmm\.co\.jp/,/supjav\./,/pvvstream\./,/caribbeancom\./,/javdatabase\./,/xnxxx\./,/springtowndvd\./,/warashi-asian/,/adultdvdmarketplace\./];

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  const isProxy = _px.some(r => r.test(url));
  if (isProxy) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((response) => {
          if (response) return response;
          return fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.ok && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => new Response('', { status: 503, statusText: 'Service Unavailable' }));
        })
      )
    );
  } else {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
  }
});

