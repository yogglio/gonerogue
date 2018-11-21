<template>
  <div>
    <loading v-if="loading"></loading>
  <div v-show="!loading" class="places">
    <!--<ul v-for="place in places">
      <li>{{place.fields.name}}</li>
      <li>{{place.fields.description}}</li>
      <li>{{place.fields.location}}</li>
      <li>Time spent: {{place.fields.time}}</li>
      <li>Rogue rating: {{place.fields.rating}}</li>
      <img height="150px" width="200px" v-bind:src=place.fields.photos[0].fields.file.url />
    </ul>-->
    <div class="back-btn" @click="openPrefernces">&lt;</div>
    <div id="map"></div>
    <div class="overlay" v-if="showOverlay">
      <div class="text">No place matching your preference</div>
      <div class="overlay-btn" @click="openPrefernces">CHANGE PREFERNCES</div>
    </div>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SnazzyInfoWindow from 'snazzy-info-window'
import {cyberstyle} from '@/style.js';
import shared from '@/shared.js';
import image from '@/assets/dot.png';
import Loading from "../components/Loading";

let id;

export default {
  name: 'mapView',
  components: {Loading},
  data() {
      return {
          places: [],
          showOverlay: false,
          loading: true
      }
  },
  methods:{
      initMap() {
          console.log("initMap");
          let startPos;
          let userMarker;

          // custom Icon setup
          let icon = {
              url: image ,
              scaledSize: new google.maps.Size(10, 10),
              origin: new google.maps.Point(0,0),
              anchor: new google.maps.Point(5, 5)
          };

          // get the selected preferences
          let selectedRating = shared.ratings.filter(obj => obj.selected === true);
          let selectedCategory = shared.categories.find(obj => obj.fields.selected === true);

          // init map
          const element = document.getElementById("map");
          const options = {
              zoom: 14,
              center: new google.maps.LatLng(47.071467, 8.277621),
              styles: cyberstyle
          };
          this.map = new google.maps.Map(element, options);

          // direction API
          let directionsService = new google.maps.DirectionsService;
          let directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions:{strokeColor:"#ff2efc",strokeWeight:5}, suppressMarkers:true });
          directionsDisplay.setMap(this.map);

          let infoWindow = new google.maps.InfoWindow;

          // get User location
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
                  let circle = new google.maps.Circle({
                      map: this.map,
                      radius: position.coords.accuracy,
                      fillColor: '#89858c',
                      strokeWeight: 0
                  });
                  circle.bindTo('center', userMarker, 'position');
                  this.findPlace(startPos, selectedCategory, selectedRating).then((place)=>{
                     id = navigator.geolocation.watchPosition((position) => {
                          let updatedPos = {
                              lat: position.coords.latitude,
                              lng: position.coords.longitude
                          };
                          userMarker.setPosition(updatedPos);
                          circle.setRadius(position.coords.accuracy);
                          console.log("update position");
                          this.calcAndDisplayRoute(directionsService,directionsDisplay,updatedPos,place)
                      },  function(){
                          this.handleLocationError(true, infoWindow, map.getCenter());
                      });
                     this.loading = false;
                  });

              }, function () {
                  this.handleLocationError(true, infoWindow, map.getCenter());
              });
          } else {
              // Browser doesn't support Geolocation
              this.handleLocationError(false, infoWindow, map.getCenter());
          }
       },
      // get the closest place to the user location with matching preferences
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
          if (selectedCategory !== null) {
          let promise = window.contentfulClient.getEntries({
              'content_type': 'place',
              'fields.category[all]': selectedCategory.fields.name,
              'fields.rating[in]': stringRating,
              'fields.location[near]': pos.lat + "," + pos.lng
          }).then((entries) => {
              this.places = entries.items;
              let visitedPlaces = JSON.parse(sessionStorage.getItem("visitedPlaces"));
              if (this.places.length === 0) {
                  this.showOverlay = true;
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
      }
      },
      // Show the route from the user location to the desired location
      calcAndDisplayRoute(directionsService, directionsDisplay, startPos, place){
          if (this.places.length === 0) {
              return;
          }
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
      // store the place in the session, when the user arrived => won't show up again in search
      checkIfArrived(direction, place){
          //console.log(place);
          if(direction.routes[0].legs[0].distance.value < 20){
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
      },
      openPrefernces(){
          this.$router.push('/');
      }
    },
    mounted (){
      this.initMap();
    },
    destroyed(){
      // clear the watch Position, so it loads again correctly
      navigator.geolocation.clearWatch(id);
    },

}
</script>

<style scoped lang="scss">
  $back_button_color: #e03f75;

  .places {
    display: grid;
    grid-template-rows: max-content 1fr;
    grid-template-columns: 100%;
    min-height: 100vh;
    grid-template-areas:
            "header"
            "map";

    .back-btn {
      color: $back_button_color;
      height: 40px;
      font-size: 40px;
      justify-self: start;
      padding: 0 20px;
      cursor: pointer;
    }

    #map {
      height: 100%;
      width: 100%;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100%;
      background-color: rgba(9,24,51, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column;


      .text {
        color: white;
        margin: 20px;
      }

      .overlay-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid $back_button_color;
        background-color: $back_button_color;
        color: white;
        border-radius: 500px;
        padding: 16px 48px;
        cursor: pointer;
      }


    }

  }
</style>
