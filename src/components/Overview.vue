<template>
    <div class="overview">
    <div class="icon1"></div>
    <div class="icon2"></div>
    <div class="icon3"></div>
    <div class = "close" v-on:click="$emit('closeoverview')"></div>


    </div>

</template>

<script>
    export default {
        name: 'overview',
        data: function(){
            return {

            }
        },
        methods: {
        },
        mounted (){
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
        grid-template-columns: 100%;
        grid-template-rows: 10% 20% 40% 20% 5% 5%;

    }
    .icon1 {
        background-image: url("../assets/level1.svg");
        background-repeat: no-repeat;
        width: 60px;
        height: 60px;
        display: absolute;
        justify-self: flex; 
        align-self: center;
        position: absolute;
        left: 30px;
        top: 100px;
    }
    .icon2 {
        background-image: url("../assets/level2.svg");
        background-repeat: no-repeat;
        width: 60px;
        height: 60px;
        display: flex;
        justify-self: center; 
        align-self: center;
        position: absolute;
        top: 100px;
    }
    .icon3 {
        background-image: url("../assets/level3.svg");
        background-repeat: no-repeat;
        width: 60px;
        height: 60px;
        display: flex;
        justify-self: center; 
        align-self: center;
        position: absolute;
        top: 100px;
        right: 30px;
    }
     .close {
        background-image: url("../assets/delete.svg");
        width: 50px;
        height: 50px;
        display: flex;
        position: absolute;
        bottom: 16px;
        left: calc(50% - 25px);
        display: flex;
        justify-self: center; 
        align-self: center;

    }
    
       



</style>