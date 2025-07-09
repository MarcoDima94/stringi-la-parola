const CACHE_NAME = 'stringi-la-parola-v2'; // v1 è diventato v2
// Lista dei file essenziali da salvare per il funzionamento offline
const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'script.js',
    'icon-192x192.png',
    'icon-512x512.png',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/js/all.min.js'
];

// Evento di attivazione: pulisce le vecchie cache
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Evento di installazione: apre la cache e salva i file
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aperto e file salvati');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento fetch: serve i file dalla cache se disponibili
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se la risorsa è in cache, la restituisce, altrimenti la cerca in rete
                return response || fetch(event.request);
            })
    );
});