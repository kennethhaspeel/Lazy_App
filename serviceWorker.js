console.log('Hello from serviceWorker.js');
var CACHE_NAME = 'pwa-task-manager';
var urlsToCache = [
  '/'
];

self.addEventListener('install', event => {
    // Perform install steps
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
        })
    );
  });