
import { register } from 'register-service-worker'

const publicVapidKey = "BFMeLiaQT76-yscl8uao2RjeTqplSGcRrN6YiBN3ltVeeNvLVSsa6lu3aV2u_vFwk8eLh0CdqabJxgP5sjODvK0";

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}sw.js`, {
    ready () {
      console.log('Service worker ready');
    },
    registered (registration) {
      console.log('Service worker has been registered.')
      Notification.requestPermission(function(status) {
        console.log('Notification permission status:', status);
        subscribe(registration).catch(err => console.error(err));
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


async function subscribe(registration) {

    await registration.ready;
    console.log('A service worker is active:', registration.active);
  // Register Push
    console.log("Registering Push...");
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    console.log("Push Registered...");

    // Send Push Notification
    console.log("Sending Push...");
    await fetch("/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "content-type": "application/json"
      }
    });
    console.log("Push Sent...");

}


function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

