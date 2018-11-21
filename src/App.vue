<template>
  <div id="app">
    <!--<div id="nav">
      <router-link to="/">Preferences</router-link> |
      <router-link to="/map">Map</router-link>
    </div>-->
    <!--<keep-alive include="categories">-->
        <router-view/>
    <!--</keep-alive>-->
  </div>
</template>

<style lang="scss">
  @import "../node_modules/normalize-scss";
  @include normalize();
  @import '../node_modules/snazzy-info-window/dist/snazzy-info-window.scss';
  @import url('https://fonts.googleapis.com/css?family=Open+Sans|Orbitron');


  html{
    width: 100%;
    min-height: 100vh;
  }
  body{
    min-height: 100vh;
    width: 100%;
  }
  #app {
  font-family: 'Orbitron', sans-serif;
    letter-spacing: 0.2em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $accent_color_one;
  background-color: $background;
  min-height: 100vh;
  p {
    font-family: 'Open Sans', sans-serif;
  }
}



#nav {
    font-size: 8px;
  }
</style>
