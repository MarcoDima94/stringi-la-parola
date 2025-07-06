const CACHE_NAME = 'stringi-la-parola-v1';
const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'script.js',
    'IMG_8383.png',
    'icon-192x192.png',
    'icon-512x512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'
];

// Evento di installazione: apre il cache e salva i file principali dell'app
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aperto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento fetch: intercetta le richieste di rete
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se la risorsa è in cache, la restituisce
                if (response) {
                    return response;
                }
                // Altrimenti, la richiede dalla rete
                return fetch(event.request);
            })
    );
});