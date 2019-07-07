<template>
    <div>
        <loading v-if="loading"></loading>
        <div v-show="!loading" class="places">
            <div id="map"></div>
            <div class="button" @click="showOverview = true"></div>
            <div class="back-btn" @click="openPrefernces"></div>
            <overlay v-on:openPreferences="openPrefernces" v-if="showOverlay" v-bind:text="text"></overlay>
        </div>
        <overview v-on:closeOverview="showOverview = false" v-if="showOverview"></overview>
        <infowindow v-on:skip="skipPlace" v-on:closeInfowindow="closeInfoWindow" v-if="showInfowindow" v-bind:place="place"></infowindow>
    </div>
</template>

<script>
    // @ is an alias to /src
    import {cyberstyle} from '@/style.js';
    import shared from '@/shared.js';
    import Loading from "../components/Loading";
    import Infowindow from "../components/Infowindow";
    import Overlay from "../components/Overlay";
    import Overview from "../components/Overview";

    let id;

    export default {
        name: 'mapView',
        components: {Overlay, Infowindow, Loading,Overview},
        data() {
            return {
                places: [],
                showOverlay: false,
                showInfowindow: false,
                showOverview: false,
                loading: true,
                place: null,
                text:{
                    msg:"",
                    btn: ""
                }
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
                    scaledSize: new google.maps.Size(14, 14),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(7, 7)
                };

                // get the selected preferences
                let selectedRating = shared.ratings.filter(obj => obj.selected === true);
                let selectedCategory = shared.categories.find(obj => obj.fields.selected === true);

                console.log(selectedRating);
                console.log(selectedCategory);

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
                                    if (place != null) {
                                        this.calcAndDisplayRoute(directionsService, directionsDisplay, updatedPos, place)
                                    }
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
                    let skippedPlaces = JSON.parse(sessionStorage.getItem("skippedPlaces"));
                    let place;
                    if (skippedPlaces == null || skippedPlaces.length === 0) {
                        place = this.places[0];
                    } else {
                        place = this.places.find(el => {
                            let isSkipped = false;
                            for (let vP of skippedPlaces) {
                                if (el.sys.id === vP.sys.id) {
                                    isSkipped = true;
                                }
                            }
                            if (!isSkipped) {
                                return el;
                            }
                        })
                    }
                    if (place == null) {
                        this.openOverlay("No place matching your preference", "CHANGE PREFERNCES");
                        return;
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
                        if(this.accelerometer) {
                            this.accelerometer.start();
                        }
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
                    this.addToVisitedPlaces(place);
                    this.addToSkippedPlaces(place);
                    this.openOverlay("You arrived at your destination","NEXT PLACE");
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
            },
            addToSkippedPlaces(place){
                if (sessionStorage.getItem("skippedPlaces") === null) {
                    let skippedPlaces = [];
                    skippedPlaces.push(place);
                    sessionStorage.setItem("skippedPlaces", JSON.stringify(skippedPlaces));
                    //console.log(skippedPlaces)
                } else {
                    let skippedPlaces = JSON.parse(sessionStorage.getItem("skippedPlaces"));
                    skippedPlaces.push(place);
                    sessionStorage.setItem("skippedPlaces", JSON.stringify(skippedPlaces));
                    //console.log(skippedPlaces)
                }
            },
            addToVisitedPlaces(place){
                if (localStorage.getItem("visitedPlaces") === null) {
                    let visitedPlaces = [];
                    visitedPlaces.push(place);
                    localStorage.setItem("visitedPlaces", JSON.stringify(visitedPlaces));
                    //console.log(visitedPlaces)
                } else {
                    let visitedPlaces = JSON.parse(localStorage.getItem("visitedPlaces"));
                    visitedPlaces.push(place);
                    localStorage.setItem("visitedPlaces", JSON.stringify(visitedPlaces));
                    //console.log(visitedPlaces)
                }
            },
            skipPlace() {
                this.closeInfoWindow();
                this.addToSkippedPlaces(this.place);
                console.log("skip");
                navigator.geolocation.clearWatch(id);
                this.initMap();
            },
            closeInfoWindow(){
                this.showInfowindow = false;
                if(this.accelerometer) {
                    this.accelerometer.stop();
                }
            },
            openOverlay(msg, btn){
                this.text.msg = msg;
                this.text.btn = btn;
                this.showOverlay = true;
            },
            initAccelerometer(){
                    let accelerometer = new LinearAccelerationSensor({frequency: 60});
                    accelerometer.addEventListener('reading', () => {
                        this.detectShake(accelerometer);
                        /*console.log("Acceleration along the X-axis " + accelerometer.x);
                        console.log("Acceleration along the Y-axis " + accelerometer.y);
                        console.log("Acceleration along the Z-axis " + accelerometer.z);*/
                    });
                    accelerometer.addEventListener('error', e => {
                        console.log("Cannot fetch data from sensor due to an error." + e)
                    });
                    return accelerometer;
            },
            detectShake(accelerometer){
                const shakeThreshold = 3 * 9.8;
                let magnitude = Math.hypot(accelerometer.x, accelerometer.y, accelerometer.z);
                if (magnitude > shakeThreshold) {
                    console.log("shaking " + magnitude + " > " + shakeThreshold);
                    this.skipPlace();
                }
            }
        },
        mounted() {
            // init accelerometer
            if (window.LinearAccelerationSensor) {
                this.accelerometer = this.initAccelerometer();
            }
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
        .button {
            background-image: url("../assets/logo.svg");
            position: absolute;
            bottom: 16px;
            left: calc(50% - 25px);
            
            width: 50px;
            height: 50px;
            display: flex;
            justify-self: center; 
            align-self: center;
        }

        #map {
            height: 100%;
            width: 100%;
            grid-area: map;
        }
     
    }
</style>
