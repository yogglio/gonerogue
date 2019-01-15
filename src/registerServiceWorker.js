/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}sw.js`, {
    ready () {
      console.log('Service worker ready');
    },
    registered (reg) {
      console.log('Service worker has been registered.')
      Notification.requestPermission(function(status) {
        console.log('Notification permission status:', status);
        if (status == 'granted') {
          var options = {
            body: 'Here is a notification body!',
            icon: 'images/icons/android-chrome-512x512.png',
            vibrate: [100, 50, 100],
            data: {
              dateOfArrival: Date.now(),
              primaryKey: 1
            }
          };
          reg.showNotification('Hello world!', options);
        }
      });
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
