<template>
    <div class="loading">
        <img src="../assets/loading.gif">
        <h3>GONE ROGUE</h3>
    </div>
</template>

<script>
    import logo from '@/assets/logo.svg';
    export default {
        name: 'loading',
        data() {
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
    .loading {
        height: 100vh;
        width: 100%;
        background-color: $background;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;


        img{
            height: 150px;
            width: 150px;
        }
    }


</style>