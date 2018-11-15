<template>
  <div class="places">
    <ul v-for="place in places">
      <li>{{place.fields.name}}</li>
      <li>{{place.fields.description}}</li>
      <li>{{place.fields.location}}</li>
      <li>Time spent: {{place.fields.time}}</li>
      <li>Rogue rating: {{place.fields.rating}}</li>
      <img height="150px" width="200px" v-bind:src=place.fields.photos[0].fields.file.url />
    </ul>
    <div id="map"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import SnazzyInfoWindow from 'snazzy-info-window'
import {roguestyle, cyberstyle, redstyle} from '@/style.js';

export default {
  name: 'mapView',
  components: {
    HelloWorld
  },
  data() {
      return {
          places: []
      }
  },
  methods:{
      init(){
          console.log(window.$rating[0].fields.selected)

          const element = document.getElementById("map");

          const options = {
              zoom: 14,
              //center: new google.maps.LatLng(47.071467, 8.277621),
              styles: roguestyle
          };
          this.map = new google.maps.Map(element, options);

          let infoWindow = new google.maps.InfoWindow;

          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                  let pos = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                  };

                  infoWindow.setPosition(pos);
                  infoWindow.setContent('Location found.');
                  infoWindow.open(this.map);
                  this.map.setCenter(pos);
              }, function() {
                  this.handleLocationError(true, infoWindow, map.getCenter());
              });
          } else {
              // Browser doesn't support Geolocation
              this.handleLocationError(false, infoWindow, this.map.getCenter());
          }

          let markers = [];
          window.contentfulClient.getEntries({
              'content_type': 'place'
          }).then((entries) => {
              this.places = entries.items;
              //console.log(this.places[0].fields.photos[0].fields.file.url)
          }).then(() => {
              this.places.map(place => {
                  let marker = new google.maps.Marker({
                      position: {lat: place.fields.location.lat, lng: place.fields.location.lon},
                      map: this.map

                  });
                  new SnazzyInfoWindow({
                      marker: marker,
                      content:'<h1>'+place.fields.name+'</h1>'+
                              '<p>'+place.fields.description+'</p>'+
                              '<p>Time spent: '+place.fields.time+'</p>'+
                              '<p>Rogue rating: '+place.fields.rating+'</p>' +
                              '<img src="'+ place.fields.photos[0].fields.file.url+'" height="100px" width="100px" />'

                  });
                  markers.push(marker)
              });

              //console.log(markers)
          });





      },
    handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
          'Error: The Geolocation service failed.' :
          'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(map);
      }
    },
    mounted (){
      this.init();
    }
}
</script>

<style scoped lang="scss">
  #map {
    height: 80vh;
    width: 80vw;
  }
</style>
