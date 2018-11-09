<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <div id="map"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import styleRogue from '@/style.js';

export default {
  name: 'home',
  components: {
    HelloWorld
  },
    mounted: function(){
        const element = document.getElementById("map");

        const options = {
            zoom: 14,
            center: new google.maps.LatLng(47.071467, 8.277621),
            styles: styleRogue
        }
        this.map = new google.maps.Map(element, options);

        const locations = [
            {lat: 47.071978, lng: 8.262165 },
            {lat: 47.072978, lng: 8.292165 },
            {lat: 47.073978, lng: 8.292165 },
            {lat: 47.074978, lng: 8.282165 }
        ];
        let markers = [];
        locations.map(loc => {
            markers.push(new google.maps.Marker({
                position: {lat: loc.lat, lng: loc.lng},
                map: this.map
            }));
        });
    }
}
</script>

<style scoped lang="scss">
  #map {
    height: 80vh;
    width: 80vw;
  }
</style>