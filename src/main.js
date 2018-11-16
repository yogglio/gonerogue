import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {createClient} from 'contentful'

Vue.config.productionTip = false;

window.contentfulClient = createClient({
    accessToken: '76315850d37454a8de92a5affb94cb59beb62982d768811fd0c4a05fc5bee229',
    space: 'cupfip093pb1'
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');



