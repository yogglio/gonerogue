<template>
    <div class="overview">


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
        background-color: rgba(29, 31, 54, 0.7);
        top: 0;
        left: 0;
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 10% 20% 40% 20% 5% 5%;

    }
    



</style>