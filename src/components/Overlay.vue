<template>
    <div class="overlay">
        <div class="text">No place matching your preference</div>
        <div class="overlay-btn" v-on:click="$emit('openPreferences')">CHANGE PREFERNCES</div>
    </div>
    
</template>

<script>
    export default {
        name: "overlay"
    }
</script>

<style scoped lang="scss">

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100%;
        background-color: rgba(9,24,51, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;


    .text {
        color: white;
        margin: 20px;
    }

    .overlay-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid $accent_color_one;
        background-color: $accent_color_one;
        color: white;
        border-radius: 500px;
        padding: 16px 48px;
        cursor: pointer;
    }


    }

</style>