var staticCacheName = 'offlineDemo-static-v6';
var dynamicCacheName = 'offlineDemo-dynamic-v6';

const assets = [
    '/',
    '/counter',
    '/offline',
    'manifest.json',
    '/static/js/main.js',
    '/static/js/main.chunk.js',
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
            })
            .then(() => {
                caches.open(dynamicCacheName);
            })
    );
});

self.addEventListener('activate', evt => {
    console.log('service worker has been activated.');
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
});

this.addEventListener('fetch', function (event) {
    //console.log('fetching: ', event);
    if (event.request.method === 'POST' || !(event.request.url.indexOf('http') === 0)) {
        return;
    }

    event.respondWith((async () => {
        try {
            const cacheMatch = await caches.match(event.request);

            if (cacheMatch) {
                return cacheMatch;
            }

            var fetchResult = await fetch(event.request);

            if (fetchResult) {
                const resultClone = fetchResult.clone();

                const dynamicCache = await caches.open(dynamicCacheName);
                await dynamicCache.put(event.request, resultClone);
            }

            return fetchResult;
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