const CACHE_NAME = 'gallery-v1';
const CACHE_URLS = [
  './',
  './index.html',
  './data.js',
  './background.js'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_URLS))
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch - cache images from proxy
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Cache proxy images aggressively
  if (url.includes('corsproxy.io') || url.includes('pixhost.to')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((response) => {
          if (response) return response;
          
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
      )
    );
  } else {
    // Network first for other resources
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
