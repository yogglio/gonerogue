<template>
  <div class="preferences">
      <h2>Rogue Rating</h2>
        <button v-for="(r,i) in rating" v-on:click="toggle(i)" v-bind:class="{selected: r.fields.selected}">{{r.fields.rating}}</button>
      <h2>Preferences</h2>
      <button v-for="(p,i) in preferences" v-on:click="select(i)" v-bind:class="{selected: p.fields.selected}">{{p.fields.option}}</button>
      <div @click="openMap">Show</div>
      <div v-if="errors.noPreferences">{{errors.noPreferences}}</div>
  </div>
</template>

<script>
    import shared from '@/shared.js';
export default {
  name: 'preferences',
  data() {
      return {
          rating: [],
          preferences:[],
          errors:{
              noPreferences: ''
          }
      }
  },
  methods: {
/*          if (localStorage.getItem("rating") === null) {
              window.contentfulClient.getEntries({
                  'content_type': 'rogueRating'
              }).then((entries) => {
                  localStorage.setItem("rating", JSON.stringify(entries.items));
                  this.rating = entries.items;
                  console.log(this.rating)
              })
          } else {
              this.rating = JSON.parse(localStorage.getItem("rating"))
          }*/

      toggle(i){
          shared.rating[i].fields.selected = !shared.rating[i].fields.selected;
          console.log(shared.rating[i].fields.selected)
          /*this.rating[i].fields.selected = !this.rating[i].fields.selected;
          localStorage.setItem("rating",JSON.stringify(this.rating));
          console.log(this.rating[i].fields.selected);*/
      },
      select(i){
          shared.preferences.forEach((p) => {
              p.fields.selected = false;
          });
          shared.preferences[i].fields.selected = true;
          this.errors.noPreferences = '';
      }
      ,openMap(){
          if (shared.preferences.filter(obj => obj.fields.selected === true).length === 1) {
              this.$router.push('/map');
          } else {
              this.errors.noPreferences = "Select a preference"
          }
      }
  },
    mounted (){
      if (shared.rating.length === 0){
          window.contentfulClient.getEntries({
              'content_type': 'rogueRating'
          }).then((entries)=> {
              shared.rating = entries.items;
              this.rating = shared.rating;
              console.log(shared.rating)
          })
      } else {
          this.rating = shared.rating;
      }

      if (shared.rating.length === 0) {
          window.contentfulClient.getEntries({
              'content_type': 'prefernces'
          }).then((entries) => {
              shared.preferences = entries.items;
              this.preferences = shared.preferences;
          })
      } else {
          this.preferences = shared.preferences;
      }

    }
}
</script>

<style scoped lang="scss">
  .selected {
    background-color: cyan;
  }


</style>
