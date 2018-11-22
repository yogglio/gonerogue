<template>
    <div>
        <loading v-if="loading"></loading>
        <div v-show="!loading" class="places">
            <div id="map"></div>
            <overlay v-on:openPreferences="openPrefernces" v-if="showOverlay"></overlay>
            <div class="back-btn" @click="openPrefernces"></div>
        </div>
        <infowindow v-on:closeInfowindow="showInfowindow = false" v-if="showInfowindow" v-bind:place="place"></infowindow>
    </div>
</template>

<script>
    // @ is an alias to /src
    import {cyberstyle} from '@/style.js';
    import shared from '@/shared.js';
    import Loading from "../components/Loading";
    import Infowindow from "../components/Infowindow";
    import Overlay from "../components/Overlay";

    let id;

    export default {
        name: 'mapView',
        components: {Overlay, Infowindow, Loading},
        data() {
            return {
                places: [],
                showOverlay: false,
                showInfowindow: false,
                loading: true,
                place: null
            }
        },
        methods: {
            initMap() {
                console.log("initMap");
                let startPos;
                let userMarker;

                // custom Icon setup
                let icon = {
                    url: require('../assets/location.svg'),
                    scaledSize: new google.maps.Size(10, 10),
                    origin: new google.maps.Point(0, 0),
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
                    styles: cyberstyle,
                    disableDefaultUI: true
                };
                this.map = new google.maps.Map(element, options);

                // direction API
                let directionsService = new google.maps.DirectionsService;
                let directionsDisplay = new google.maps.DirectionsRenderer({
                    polylineOptions: {
                        strokeColor: "#ea00d9",
                        strokeWeight: 5
                    }, suppressMarkers: true
                });
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
                            //strokeColor: '#3BACAA'
                        });
                        circle.bindTo('center', userMarker, 'position');
                        if (selectedCategory != null && selectedRating != null) {
                            this.findPlace(startPos, selectedCategory, selectedRating).then((place) => {
                                id = navigator.geolocation.watchPosition((position) => {
                                    let updatedPos = {
                                        lat: position.coords.latitude,
                                        lng: position.coords.longitude
                                    };
                                    userMarker.setPosition(updatedPos);
                                    circle.setRadius(position.coords.accuracy);
                                    console.log("update position");
                                    this.calcAndDisplayRoute(directionsService, directionsDisplay, updatedPos, place)
                                }, function () {
                                    this.handleLocationError(true, infoWindow, map.getCenter());
                                });
                                this.loading = false;
                            });
                        } else {
                            this.loading = false;
                        }
                    }, function () {
                        this.handleLocationError(true, infoWindow, map.getCenter());
                    });
                } else {
                    // Browser doesn't support Geolocation
                    this.handleLocationError(false, infoWindow, map.getCenter());
                }
            },
            // get the closest place to the user location with matching preferences
            findPlace(pos, selectedCategory, selectedRating) {
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
                    let visitedPlaces = JSON.parse(sessionStorage.getItem("visitedPlaces"));
                    if (this.places.length === 0) {
                        this.showOverlay = true;
                        return;
                    }
                    let place;
                    if (visitedPlaces == null || visitedPlaces.length === 0) {
                        place = this.places[0];
                    } else {
                        place = this.places.find(el => {
                            let isVisited = false;
                            for (let vP of visitedPlaces) {
                                if (el.sys.id === vP.sys.id) {
                                    isVisited = true;
                                }
                            }
                            if (!isVisited) {
                                return el;
                            }
                        })
                    }

                    this.place = place;

                    let markerlevel;
                    if (place.fields.rating === 1) {
                        markerlevel = require('../assets/marker1.svg')
                    } else if(place.fields.rating === 2) {
                        markerlevel = require('../assets/marker2.svg')
                    } else if(place.fields.rating === 3){
                        markerlevel = require('../assets/marker3.svg')
                    }

                    let markerIcon = {
                        url: markerlevel,
                        size: new google.maps.Size(50, 75),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(10, 70),
                        scaledSize: new google.maps.Size(50, 75)
                    };


                    let marker = new google.maps.Marker({
                        position: {lat: place.fields.location.lat, lng: place.fields.location.lon},
                        map: this.map,
                        icon: markerIcon
                    });

                    marker.addListener('click', () => {
                        this.showInfowindow = true;
                        console.log("show")
                    });

                    return place;
                });
                return promise;
            },
            // Show the route from the user location to the desired location
            calcAndDisplayRoute(directionsService, directionsDisplay, startPos, place) {
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
                }, (response, status) => {
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
            checkIfArrived(direction, place) {
                //console.log(place);
                if (direction.routes[0].legs[0].distance.value < 20) {
                    console.log("arrived");
                    if (sessionStorage.getItem("visitedPlaces") === null) {
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
            openPrefernces() {
                this.$router.push('/preferences');
            }
        },
        mounted() {
            this.initMap();
        },
        destroyed() {
            // clear the watch Position, so it loads again correctly
            navigator.geolocation.clearWatch(id);
        },

    }
</script>

<style scoped lang="scss">


    .places {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 100%;
        min-height: 100vh;
        grid-template-areas: "map";

        .back-btn {
            background-image: url("../assets/backarrow.svg");
            height: 25px;
            width: 25px;
            cursor: pointer;
            position: absolute;
            margin: 10px;
            top: 0;
            left: 0;
        }

        #map {
            height: 100%;
            width: 100%;
            grid-area: map;
        }

    }
</style>
