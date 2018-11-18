<template>
  <div class="places">
    <!--<ul v-for="place in places">
      <li>{{place.fields.name}}</li>
      <li>{{place.fields.description}}</li>
      <li>{{place.fields.location}}</li>
      <li>Time spent: {{place.fields.time}}</li>
      <li>Rogue rating: {{place.fields.rating}}</li>
      <img height="150px" width="200px" v-bind:src=place.fields.photos[0].fields.file.url />
    </ul>-->
    <div id="map"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import SnazzyInfoWindow from 'snazzy-info-window'
import {roguestyle, cyberstyle, redstyle} from '@/style.js';
import shared from '@/shared.js';
import image from '@/assets/dot.png';

var id;

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
      initMap() {
          console.log("initMap");
          let startPos;
          let userMarker;

          let icon = {
              url: image , // url
              scaledSize: new google.maps.Size(10, 10), // scaled size
              origin: new google.maps.Point(0,0), // origin
              anchor: new google.maps.Point(0, 0) // anchor
          };

          let selectedRating = shared.ratings.filter(obj => obj.selected === true);
          let selectedCategory = shared.categories.find(obj => obj.fields.selected === true);

          const element = document.getElementById("map");

          const options = {
              zoom: 14,
              center: new google.maps.LatLng(47.071467, 8.277621),
              styles: roguestyle
          };

          this.map = new google.maps.Map(element, options);

          let directionsService = new google.maps.DirectionsService;
          let directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions:{strokeColor:"#ff2efc",strokeWeight:5}, suppressMarkers:true });
          directionsDisplay.setMap(this.map);

          let infoWindow = new google.maps.InfoWindow;

          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                  console.log("current position");
                  startPos = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                  };
                  this.map.setCenter(startPos);
                      userMarker = new google.maps.Marker({
                      position: {lat: position.coords.latitude, lng: position.coords.longitude},
                      map: this.map,
                      icon: icon

                  });
                  this.findPlace(startPos, selectedCategory, selectedRating).then((place)=>{
                     id = navigator.geolocation.watchPosition((position) => {
                          let updatedPos = {
                              lat: position.coords.latitude,
                              lng: position.coords.longitude
                          };
                          userMarker.setPosition(updatedPos);
                          console.log("update position");
                          this.calcAndDisplayRoute(directionsService,directionsDisplay,updatedPos,place)
                      },  function(){
                          this.handleLocationError(true, infoWindow, map.getCenter());
                      });
                  });

              }, function () {
                  this.handleLocationError(true, infoWindow, map.getCenter());
              });
          } else {
              // Browser doesn't support Geolocation
              this.handleLocationError(false, infoWindow, map.getCenter());
          }
       },
      findPlace(pos,selectedCategory,selectedRating){
          let stringRating = '';

          for (let i = 0; i < selectedRating.length; i++) {
              stringRating += selectedRating[i].rating;
              if (i !== selectedRating.length - 1) {
                  stringRating += ','
              }
          }
          //console.log(stringRating);
          //console.log(selectedCategory.fields.name);
          let promise = window.contentfulClient.getEntries({
              'content_type': 'place',
              'fields.category[all]': selectedCategory.fields.name,
              'fields.rating[in]': stringRating,
              'fields.location[near]': pos.lat + "," + pos.lng
          }).then((entries) => {
              this.places = entries.items;
              //console.log(this.places);
          }).then(() => {
              let visitedPlaces = JSON.parse(sessionStorage.getItem("visitedPlaces"));
              if (this.places.length === 0) {
                  window.alert('No place matching your preference ');
                  return;
              }
              let place;
              if (visitedPlaces == null || visitedPlaces.length === 0){
                  place = this.places[0];
              } else {
                  place = this.places.find(el => {
                      let isVisited = false;
                      for(let vP of visitedPlaces){
                          if (el.sys.id === vP.sys.id) {
                              isVisited = true;
                          }
                      }
                      if (!isVisited){
                          return el;
                      }
                  })
              }

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
              return place;
          });
          return promise;
      },
      calcAndDisplayRoute(directionsService, directionsDisplay, startPos, place){
          let endPos = {
              lat: place.fields.location.lat,
              lng: place.fields.location.lon
          };
          directionsService.route({
              origin: startPos,
              destination: endPos,
              travelMode: 'WALKING'
          },(response, status) => {
              if (status === 'OK') {
                  //console.log(response);
                  directionsDisplay.setDirections(response);
                  this.checkIfArrived(response, place);
              } else {
                  window.alert('Directions request failed due to ' + status);
              }
          });
      },
      checkIfArrived(direction, place){
          //console.log(place);
          if(direction.routes[0].legs[0].distance.value < 50){
              console.log("arrived");
              if(sessionStorage.getItem("visitedPlaces") === null){
                  let visitedPlaces = [];
                  visitedPlaces.push(place);
                  sessionStorage.setItem("visitedPlaces", JSON.stringify(visitedPlaces));
                  //console.log(visitedPlaces)
              } else {
                  let visitedPlaces = sessionStorage.getItem("visitedPlaces");
                  visitedPlaces.push(place);
                  sessionStorage.setItem("visitedPlaces", JSON.stringify(visitedPlaces));
                  //console.log(visitedPlaces)
              }
          }
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
      this.initMap();
    },
    destroyed(){
      navigator.geolocation.clearWatch(id);
    }
}
</script>

<style scoped lang="scss">
  #map {
    height: 80vh;
    width: 80vw;
  }
</style>
