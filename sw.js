/**
 * Service Worker for 2:03 AM PWA.
 * Cache-first for static assets; network-first for index.html when online.
 */
var CACHE_NAME = 'nightmarket-v1';
var STATIC_URLS = [
  'index.html',
  'css/style.css',
  'css/minigames.css',
  'js/characters.js',
  'js/audio.js',
  'js/dialogue.js',
  'js/scene.js',
  'js/main.js',
  'js/effects.js',
  'js/minigames/catch.js',
  'js/minigames/timer.js',
  'manifest.webmanifest',
  'assets/images/street-bg-opengameart.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_URLS).catch(function () {
        // Some URLs may 404 (e.g. optional audio); continue
      });
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('index.html') || url.pathname === '/' || url.pathname === '') {
    e.respondWith(
      fetch(e.request).then(function (res) { return res; }).catch(function () {
        return caches.match('index.html');
      })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) return cached;
      return fetch(e.request).then(function (res) {
        var clone = res.clone();
        if (res.status === 200 && res.type === 'basic') {
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(e.request, clone);
          });
        }
        return res;
      }).catch(function () {
        return caches.match(e.request);
      });
    })
  );
});
