self.addEventListener('install', function(event) {
    event.waitUntil(caches.open('offline').then(function(cache) {
        return cache.addAll([
            '/',
            '/vue.js',
            '/script.js',
            '/style.css',
            '/index.html', 
            '/fawesome.css',
        ]);
    }));
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request)
        .then(res => res || fetch(event.request)));
});
