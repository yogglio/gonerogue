workbox.setConfig({
    debug: true,
});

workbox.precaching.precacheAndRoute(self.__precacheManifest);
/*workbox.precaching.precacheAndRoute([]);*/

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg|mp4)$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    new RegExp('https://cdn.contentful.com/*'),
    workbox.strategies.networkFirst({
        cacheName: 'contentful',
    }),
);

workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'googleapis',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 30,
            }),
        ],
    }),
);