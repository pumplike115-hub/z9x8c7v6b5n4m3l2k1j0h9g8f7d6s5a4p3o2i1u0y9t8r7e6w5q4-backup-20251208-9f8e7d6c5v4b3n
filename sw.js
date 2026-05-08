const CACHE_NAME = 'static-v4';
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

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.includes('cors.eu.org') || url.includes('codetabs.com') || url.includes('pixhost.to') || url.includes('weserv.nl')) {
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
