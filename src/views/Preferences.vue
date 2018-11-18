<template>
  <div class="categories">
      <h2>Rogue Rating</h2>
        <button v-for="(r,i) in ratings" v-on:click="toggle(i)" v-bind:class="{selected: r.selected}">{{r.rating}}</button>
      <h2>Categories</h2>
      <button v-for="(p,i) in categories" v-on:click="select(i)" v-bind:class="{selected: p.fields.selected}">{{p.fields.name}}</button>
      <div @click="openMap">Show</div>
      <div v-if="errors.length">
          <ul>
              <li v-for="error in errors">{{error}}</li>
          </ul>
      </div>
  </div>
</template>

<script>
    import shared from '@/shared.js';
export default {
  name: 'categories',
  data() {
      return {
          ratings: [],
          categories:[],
          errors:[]
      }
  },
  methods: {
      toggle(i){
          shared.ratings[i].selected = !shared.ratings[i].selected;
          console.log(shared.ratings[i].selected)
      },
      select(i){
          shared.categories.forEach((p) => {
              p.fields.selected = false;
          });
          shared.categories[i].fields.selected = true;
      }
      ,openMap(){
          this.errors.length = 0;
          let hasCategories = shared.categories.filter(obj => obj.fields.selected === true).length;
          let hasRating = shared.ratings.filter(obj => obj.selected === true).length;
          if (hasCategories === 1 && hasRating > 0) {
              this.$router.push('/map');
          } else {
              if (hasCategories !== 1) {
                  this.errors.push("Select a preference")
              }
              if (hasRating === 0) {
                  this.errors.push("Select a rating")
              }
          }



      }
  },
    mounted (){
      this.ratings = shared.ratings;

      if (shared.categories.length === 0) {
          window.contentfulClient.getEntries({
              'content_type': 'categories'
          }).then((entries) => {
              shared.categories = entries.items;
              this.categories = shared.categories;
          })
      } else {
          this.categories = shared.categories;
      }

    }
}
</script>

<style scoped lang="scss">
  .selected {
    background-color: cyan;
  }


</style>
