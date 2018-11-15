<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Preferences</router-link> |
      <router-link to="/map">Map</router-link>
    </div>
    <!--<keep-alive include="preferences">-->
        <router-view/>
    <!--</keep-alive>-->
  </div>
</template>

<style lang="scss">
  @import '../node_modules/snazzy-info-window/dist/snazzy-info-window.scss';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #e60a5e;
  background-color: #11101b
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #d32274;
    &.router-link-exact-active {
      color: #4258b9;
    }
  }
}
</style>
