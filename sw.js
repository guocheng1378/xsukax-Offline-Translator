const CACHE_NAME = 'translator-v1';
const urlsToCache = [
  '/xsukax-Offline-Translator/',
  '/xsukax-Offline-Translator/index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(r => {
        if (r.status === 200) {
          const clone = r.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return r;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/xsukax-Offline-Translator/index.html');
        }
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
  );
});
