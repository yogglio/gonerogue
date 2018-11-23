<template>
  <div id="app">
        <router-view/>
  </div>
</template>

<style lang="scss">
  @import "../node_modules/normalize-scss";
  @include normalize();
  @import '../node_modules/snazzy-info-window/dist/snazzy-info-window.scss';
  //@import url('https://fonts.googleapis.com/css?family=Open+Sans|Orbitron');

  *:focus {
      outline:none;
      outline: 0;
  }

  *{
      -webkit-tap-highlight-color: transparent;
  }

  textarea:focus, input:focus {
      outline:none;
      outline: 0;
  }

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
    letter-spacing: 0.1em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $accent_color_one;
  background-color: $background;
  min-height: 100vh;
}
</style>
