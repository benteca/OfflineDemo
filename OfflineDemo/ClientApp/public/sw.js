var staticCacheName = 'offlineDemo-static-v21';

const assets = [
    '/',
    '/counter',
    'manifest.json',
    '/static/js/main.js',
    '/static/js/main.chunk.js',
    '/static/js/0.chunk.js',
    '/static/js/bundle.js',
    '/static/js/bundle.js.map',
    '/images/OfflineDemo-icon-192.png',
    '/images/OfflineDemo-icon-512.png'
];

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                cache.addAll(assets);
            }));
});

self.addEventListener('activate', evt => {
    console.log('service worker has been activated.');
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
});

this.addEventListener('fetch', function (event) {
    console.log('fetching: ', event);

    event.respondWith((async () => {
        try {
            const staticCache = await caches.open(staticCacheName);
            const cacheMatch = await staticCache.match(event.request);

            if (cacheMatch) {
                return cacheMatch;
            }

            return await fetch(event.request);
        } catch (error) {
            if (event.request.url.search('counter')) {
                const counterCacheMatch = await caches.match('/counter');

                if (counterCacheMatch) {
                    return counterCacheMatch;
                }
            }

            const homePage = await caches.match('/');

            if (homePage) {
                return homePage;
            }

            const offlinePage = await caches.match('/offline');

            if (offlinePage) {
                return offlinePage;
            }
        }
    })());
});

self.addEventListener('message', messageEvent => {    
    if (messageEvent &&
        messageEvent.data &&
        messageEvent.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});