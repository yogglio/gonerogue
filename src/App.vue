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

body, html {
  height: 100%;
  width: 100%;
}
#app {
  font-family: 'Orbitron', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #e03f75;
  background-color: #091833;
  height: 100%;
  padding: 0 20px;
  p {
    font-family: 'Open Sans', sans-serif;
  }
}



#nav {
    font-size: 8px;
  }
</style>
