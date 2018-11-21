<template>
    <div class="infowindow">
        <div>{{place.fields.name}}</div>
        <div>{{place.fields.description}}</div>
        <div>{{place.fields.location}}</div>
        <div>Rogue rating: {{place.fields.rating}}</div>
        <img height="150px" width="200px" v-bind:src=place.fields.photos[0].fields.file.url />
        <div v-on:click="$emit('closeInfowindow')">close</div>
    </div>
</template>

<script>
    export default {
        name: 'infowindow',
        props: {
            place: Object
        },
        methods: {
        },
        mounted (){

        }
    }
</script>

<style scoped lang="scss">
    .infowindow {
        position: absolute;
        width: 100%;
        height: 100vh;
        background-color: rgba(255,255,255,0.7);
        top: 0;
        left: 0;
    }


</style>