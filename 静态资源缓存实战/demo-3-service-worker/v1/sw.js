// This is a flawed service worker implementation
// It demonstrates how caching can prevent updates

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('demo-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached response if found
      if (response) {
        console.log('Serving from cache:', event.request.url);
        return response;
      }
      
      // Otherwise fetch from network
      console.log('Fetching from network:', event.request.url);
      return fetch(event.request);
    })
  );
}); 