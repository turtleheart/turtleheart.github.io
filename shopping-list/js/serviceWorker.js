const CACHE_NAME = 'shopping-list-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/misc.css',
    '/css/settings.css',
    '/css/exportColours.css',
    '/css/themes/winter.css',
    '/css/themes/spring.css',
    '/css/themes/summer.css',
    '/css/themes/autumn.css',
    '/css/themes/dark.css',
    '/css/themes/light.css',
    '/assets/bootstrap-5.3.5/css/bootstrap.min.css',
    '/assets/bootstrap-icons-1.11.3/font/bootstrap-icons.css',
    '/assets/qrcode.js',
    '/assets/qrcode_UTF8.js',
    '/assets/zxing.min.js',
    '/assets/images/themes/bg-autumn.png',
    '/assets/images/themes/bg-spring.png',
    '/assets/images/themes/bg-summer.png',
    '/assets/images/themes/bg-winter.png',
    '/assets/images/logo-dark.png',
    '/assets/images/logo-light.png',
    '/js/defaults.js',
    '/js/init.js',
    '/js/names.js',
    '/js/serviceWorker.js',
    '/js/settings.js',
    '/js/settingsManager.js',
    '/js/state.js',
    '/js/stateManager.js',
    '/js/types.js',
    '/js/uiManager.js',
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(event.request).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});