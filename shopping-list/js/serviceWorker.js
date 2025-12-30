const CACHE_NAME = 'shopping-list-v1';
const urlsToCache = [
    '/shopping-list/',
    '/shopping-list/index.html',
    '/shopping-list/css/misc.css',
    '/shopping-list/css/settings.css',
    '/shopping-list/css/exportColours.css',
    '/shopping-list/css/themes/winter.css',
    '/shopping-list/css/themes/spring.css',
    '/shopping-list/css/themes/summer.css',
    '/shopping-list/css/themes/autumn.css',
    '/shopping-list/css/themes/dark.css',
    '/shopping-list/css/themes/light.css',
    '/shopping-list/assets/bootstrap-5.3.5/css/bootstrap.min.css',
    '/shopping-list/assets/bootstrap-icons-1.11.3/font/bootstrap-icons.css',
    '/shopping-list/assets/qrcode.js',
    '/shopping-list/assets/qrcode_UTF8.js',
    '/shopping-list/assets/zxing.min.js',
    '/shopping-list/assets/images/themes/bg-autumn.png',
    '/shopping-list/assets/images/themes/bg-spring.png',
    '/shopping-list/assets/images/themes/bg-summer.png',
    '/shopping-list/assets/images/themes/bg-winter.png',
    '/shopping-list/assets/images/logo-dark.png',
    '/shopping-list/assets/images/logo-light.png',
    '/shopping-list/js/defaults.js',
    '/shopping-list/js/init.js',
    '/shopping-list/js/names.js',
    '/shopping-list/js/serviceWorker.js',
    '/shopping-list/js/settings.js',
    '/shopping-list/js/settingsManager.js',
    '/shopping-list/js/state.js',
    '/shopping-list/js/stateManager.js',
    '/shopping-list/js/types.js',
    '/shopping-list/js/uiManager.js',
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
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