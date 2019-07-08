workbox.setConfig({
    debug: false,
});

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

workbox.routing.registerNavigationRoute(
  // Assuming '/single-page-app.html' has been precached,
  // look up its corresponding cache key.
  workbox.precaching.getCacheKeyForURL('/index.html')
);

workbox.routing.setCatchHandler(({url, event, params}) => {
  console.log("error")
});

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

// workbox.routing.registerRoute(
//     /\.(?:js|css)$/,
//     workbox.strategies.staleWhileRevalidate({
//         cacheName: 'static-resources',
//     })
// );

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

// workbox.routing.registerRoute(
//     /.*(?:googleapis)\.com/,
//     workbox.strategies.staleWhileRevalidate({
//         cacheName: 'googleapis',
//     })
// );

// workbox.routing.registerRoute(
//     /.*(?:gstatic)\.com/,
//     workbox.strategies.staleWhileRevalidate({
//         cacheName: 'gstatic',
//     })
// );

// listen for push events
self.addEventListener("push", event => {
    const data = event.data.json();
    console.log("Push Recieved...");

    event.waitUntil(
        self.clients.matchAll().then(function(clientList) {
            let focused = clientList.some(function(client) {
                return client.focused;
            });
            let notificationMessage;
            if (focused) {
                notificationMessage = 'You\'re still here, thanks!';
            } else if (clientList.length > 0) {
                notificationMessage = 'You haven\'t closed the page, ' +
                    'click here to focus it!';
            } else {
                notificationMessage = 'You have closed the page, ' +
                    'click here to re-open it!';
            }

            self.registration.showNotification(data.title, {
                body: notificationMessage
            });
        })
    )
});

// focus or reopen window on click
self.addEventListener('notificationclick', event => {
    event.waitUntil(
        self.clients.matchAll().then(function (clientList) {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return self.clients.openWindow('https://gonerogue.herokuapp.com');
        })
    )
});

// resubscribe for push if expired
self.addEventListener('pushsubscriptionchange', event => {
    console.log('Subscription expired');
    event.waitUntil(
        self.registration.pushManager.subscribe({ userVisibleOnly: true })
            .then((subscription) => {
                console.log('Subscribed after expiration', subscription.endpoint);
                return fetch('/register', {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        endpoint: subscription.endpoint
                    })
                });
            })
    );
});