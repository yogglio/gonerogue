import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {createClient} from 'contentful'
import './registerServiceWorker'

Vue.config.productionTip = false;

window.contentfulClient = createClient({
    accessToken: '76315850d37454a8de92a5affb94cb59beb62982d768811fd0c4a05fc5bee229',
    space: 'cupfip093pb1'
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
});

Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
});


new Vue({
  router,
  render: h => h(App)
}).$mount('#app');



