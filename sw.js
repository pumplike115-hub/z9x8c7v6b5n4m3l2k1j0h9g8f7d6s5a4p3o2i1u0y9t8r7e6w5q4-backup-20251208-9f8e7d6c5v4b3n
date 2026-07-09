const APP_CACHE = 'app-shell-v29';
const RUNTIME_CACHE = 'runtime-images-v29';
const MAX_RUNTIME_ENTRIES = 220;
const APP_SHELL_URLS = [
  './',
  './index.html',
  './data.js',
  './background.js',
  './manifest.json',
  './offline.html',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png'
];

const IMAGE_CACHE_PATTERNS = [
  /images\.weserv\.nl/,
  /pixhost\./,
  /avjoy\./,
  /javmiku\./,
  /dmm\.co\.jp/,
  /supjav\./,
  /pvvstream\./,
  /caribbeancom\./,
  /javdatabase\./,
  /xnxxx\./,
  /springtowndvd\./,
  /warashi-asian/,
  /adultdvdmarketplace\./
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) =>
      Promise.all(APP_SHELL_URLS.map((url) => cache.add(url).catch(() => null)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const keep = new Set([APP_CACHE, RUNTIME_CACHE]);
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => !keep.has(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await Promise.all(keys.slice(0, keys.length - maxEntries).map((request) => cache.delete(request)));
}

function isRuntimeImageRequest(request) {
  if (request.method !== 'GET') return false;
  return IMAGE_CACHE_PATTERNS.some((pattern) => pattern.test(request.url));
}

async function cacheFirstRuntime(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === 'opaque')) {
      cache.put(request, response.clone()).then(() => trimCache(RUNTIME_CACHE, MAX_RUNTIME_ENTRIES));
    }
    return response;
  } catch (error) {
    return new Response('', { status: 503, statusText: 'Service Unavailable' });
  }
}

async function networkFirstNavigate(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(APP_CACHE);
    cache.put(request, response.clone()).catch(() => null);
    return response;
  } catch (error) {
    return caches.match(request).then((cached) => cached || caches.match('./offline.html'));
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(APP_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone()).catch(() => null);
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigate(request));
    return;
  }

  if (isRuntimeImageRequest(request)) {
    event.respondWith(cacheFirstRuntime(request));
    return;
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(fetch(request).catch(() => caches.match(request)));
});