<template>
    <div>
    <loading v-if="loading"></loading>
  <div v-else class="preferences">
      <h1 class="header">GONE ROGUE</h1>
      <h3 id="t1" class="title">HOW ROGUE ARE YOU?</h3>
      <div class="levels">
        <div class="icon" v-for="(r,i) in ratings">
            <img class="enabled" v-show="r.selected" v-bind:src="r.enabled" v-on:click="toggle(i)">
            <img class="disabled" v-show="!r.selected" v-bind:src="r.disabled" v-on:click="toggle(i)">
        </div>
      </div>
      <h3 id="t2" class="title">WHAT IS YOUR NEXT STEP?</h3>
      <div class="categories">
          <div class="category" v-for="(p,i) in categories" v-on:click="select(i)" v-bind:class="{selected: p.fields.selected}">{{p.fields.name.toUpperCase()}}</div>
      </div>
      <div v-if="errors.length">
          <ul class="errors">
              <li v-for="error in errors">{{error}}</li>
          </ul>
      </div>
      <div class="bottom">
          <div class="go-btn" @click="openMap">GO</div>
      </div>
  </div>
  </div>
</template>

<script>
    import shared from '@/shared.js';
    import Loading from "../components/Loading";
export default {
  name: 'preferences',
    components: {Loading},
    data() {
      return {
          ratings: [],
          categories:[],
          errors:[],
          loading: true
      }
  },
  methods: {
      toggle(i){
          shared.ratings[i].selected = !shared.ratings[i].selected;
          //console.log(shared.ratings[i].selected)
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

        this.loading = false;
    }
}
</script>

<style scoped lang="scss">

    .preferences {
        display: grid;
        grid-template-rows: repeat(4, minmax(min-content, max-content)) 1fr minmax(min-content, max-content) 80px ;
        grid-template-columns: 100%;
        min-height: 100vh;
        padding: 0 20px;
        grid-template-areas:
                "header"
                "title1"
                "levels"
                "title2"
                "categories"
                "error"
                "bottom";

    .header{
        grid-area: header;
        margin: 0.5em 0;
    }

    #t1 {
        grid-area: title1;
    }
    #t2 {
        grid-area: title2;
        margin-top: 2em
    }

    .levels {
        grid-area: levels;
        display: grid;
        grid-gap: 20px;
        grid-template-columns: repeat(auto-fit, minmax(80px,1fr));
        align-self: center;
        margin: 10px 0;
        justify-items: center;


        .icon {
            height: 60px;
            width: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            cursor: pointer;

            .enabled {
                width: 100%;
                height: 100%;
            }

            .disabled {
                width: 80%;
                height: 80%;
            }
        }
    }

    .categories {
        display: grid;
        grid-gap: 20px;
        grid-template-columns: repeat(auto-fit, minmax(120px,1fr));
        grid-area: categories;
        align-self: start;
        padding-bottom: 20px;

        .category {
            border: 2px solid $accent_color_two;
            border-radius: 500px;
            padding: 16px 48px;
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 1;
            color: white;
            cursor: pointer;
        }

    }

    .bottom {
        width: 100%;
        grid-area: bottom;
        display: flex;
        justify-content: center;
        align-items: center;

        .go-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 2px solid $accent_color_one;
            background-color: $accent_color_one;
            color: white;
            border-radius: 500px;
            padding: 16px 48px;
            width: 100%;
            max-width: 500px;
            cursor: pointer;
        }
    }

    .errors {
        grid-area: error;
        padding: 0;
        margin: 10px 0;

        li {
            list-style: none;
            padding: 10px 0;
        }
    }

    .selected {
        background-color: $accent_color_two;
    }

    }

</style>
