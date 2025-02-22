self.addEventListener('install', (event) => {
  event.waitUntil(
      caches.open('v2').then((cache) => {
          return cache.addAll([
              '/',
              '/index.html',
              '/manifest.json',
              '/icons/icon-192x192.png',
              '/icons/icon-512x512.png',
              '/styles.css',
              '/script.js',
              '/calculator.js' // Add this if it's used
          ]);
      })
  );
  self.skipWaiting(); // Forces activation of new service worker
});

// Activate event to clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
      caches.keys().then((cacheNames) => {
          return Promise.all(
              cacheNames.map((cache) => {
                  if (cache !== 'v2') {
                      return caches.delete(cache);
                  }
              })
          );
      })
  );
  self.clients.claim(); // Take control of the page immediately
});

// Fetch event with API request handling
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('binance.com')) {
      return; // Don't cache API responses
  }

  event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || fetch(event.request);
      })
  );
});
