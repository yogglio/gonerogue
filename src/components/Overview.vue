<template>
    <div class="overview">
        <h3 class="title">Amount of visited places</h3>
            <div class="one">
                <div v-for="place in one" class="icon1"></div>
            </div>
            <div class="two">
                <div v-for="place in two" class="icon2"></div>
            </div>
            <div class="three" >
                <div v-for="place in three" class="icon3"></div>
            </div>

        <div class = "close" v-on:click="$emit('closeOverview')"></div>

    </div>

</template>

<script>
    export default {
        name: 'overview',
        data: function(){
            return {
                one: [],
                two: [],
                three: []
            }
        },
        methods: {
        },
        mounted (){
            if (localStorage.getItem("visitedPlaces") != null) {
                let places = JSON.parse(localStorage.getItem("visitedPlaces"));

                this.one = places.filter((place) => place.fields.rating === 1 );
                this.two = places.filter((place) => place.fields.rating === 2 );
                this.three = places.filter((place) => place.fields.rating === 3 );
            }
        }
    }
</script>

<style scoped lang="scss">
    .overview {
        position: absolute;
        width: 100%;
        height: 100vh;
        background-color: rgba(29, 31, 54, 0.9);
        top: 0;
        left: 0;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 10% 1fr 10%;
        grid-template-areas:
            "header header header"
            "one two three"
            "bottom bottom bottom";

        .title {
            grid-area: header;
        }

        $width:60px;
        $height:60px;
        $margin:5px;

        .one{
            grid-area: one;
            display: flex;
            align-items: start;
            flex-wrap: wrap;
            align-content: flex-start;
            justify-content: center;

            .icon1 {
                background-image: url("../assets/level1.svg");
                background-repeat: no-repeat;
                width: $width;
                height: $height;
                margin: $margin;
            }
        }

        .two{
            grid-area: two;
            display: flex;
            align-items: start;
            flex-wrap: wrap;
            align-content: flex-start;
            justify-content: center;

            .icon2 {
                background-image: url("../assets/level2.svg");
                background-repeat: no-repeat;
                width: $width;
                height: $height;
                margin: $margin;
            }

        }

        .three {
            grid-area: three;
            display: flex;
            align-items: start;
            flex-wrap: wrap;
            align-content: flex-start;
            justify-content: center;

            .icon3 {
                background-image: url("../assets/level3.svg");
                background-repeat: no-repeat;
                width: $width;
                height: $height;
                margin: $margin;

            }
        }

     .close {
        background-image: url("../assets/delete.svg");
        background-repeat: no-repeat;
        width: 40px;
        height: 40px;
        display: flex;
        justify-self: center;
        align-self: center;
         grid-area: bottom;

    }

    }



</style>
