const CACHE_NAME = 'gallery-v3'; // เปลี่ยน version เพื่อบังคับ clear cache เก่า
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

// Fetch - cache images from proxy (แก้บั๊ก TypeError)
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Cache proxy images aggressively
  if (url.includes('cors.eu.org') || url.includes('codetabs.com') || url.includes('pixhost.to')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((response) => {
          if (response) return response;
          
          return fetch(event.request)
            .then((networkResponse) => {
              // ต้องเช็คว่า response ถูกต้องก่อน cache
              if (networkResponse && networkResponse.ok && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch((error) => {
              console.error('SW fetch failed:', error);
              // Return empty response แทน throw error
              return new Response('', { status: 503, statusText: 'Service Unavailable' });
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
