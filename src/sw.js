workbox.setConfig({
    debug: true,
});

workbox.precaching.precacheAndRoute(self.__precacheManifest);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg|mp4)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'static-resources',
    })
);

workbox.routing.registerRoute(
    new RegExp('https://cdn.contentful.com/*'),
    workbox.strategies.networkFirst({
        cacheName: 'contentful',
    }),
);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    workbox.strategies.cacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /.*(?:googleapis)\.com/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'googleapis',
    })
);

workbox.routing.registerRoute(
    /.*(?:gstatic)\.com/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'gstatic',
    })
);

self.addEventListener('push', function(e) {
    
    e.waitUntil(
        self.registration.showNotification('Hello world!', 'stuff')
    );
});

