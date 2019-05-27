self.addEventListener('install', function(event) {
    event.waitUntil(caches.open('offline').then(function(cache) {
        return cache.addAll([
            '/',
            '/vue.js',
            '/script.js',
            '/style.css',
            '/index.html', 
            '/fawesome.css',
        ]).then(() => console.log('done'));
    }));
});

self.addEventListener('fetch', function(event) {
    console.log('fetching', event.request);
    event.respondWith(caches.match(event.request));
});
