<template>
    <div class="start">
        <video-player v-if="animation"
                :options="playerOptions"
                @ended="onPlayerEnded()">
        </video-player>
        <div class="text" v-html="text" v-show="!animation"></div>
        <div v-if="!animation" @click="openPreferences" class="btn">Start</div>
    </div>
</template>

<script>
    import 'video.js/dist/video-js.css';
    import { videoPlayer }from 'vue-video-player';
    export default {
        name: "start",
        components: {videoPlayer},
        data() {
            return {
                // videojs options
                playerOptions: {
                    height: window.innerHeight,
                    responsive: true,
                    autoplay: true,
                    muted: true,
                    controls: false,
                    preload: 'auto',
                    sources: [{
                        type: "video/mp4",
                        // mp4
                        src: require('../assets/glitch_logo_animation.mp4'),
                    }]
                },
                    animation: true,
                    text: '',
                    message: "Welcome to the World of Gone Rogue<br>" +
                        "<br>" +
                        "Travel in a new environment by going to places that aren't the norm.<br>" +
                        "Select a Rogue Level to take on a journey based on your preference."
                }
            },
        methods: {
                showTutorial(){
                    this.animation = false;
                    this.showText(50)
                },
                onPlayerEnded() {
                    this.animation = false;
                    this.showTutorial();
                },
                showText(speed){
                    let i = 0;
                    let interval = setInterval(()=>{
                        if (this.message.charAt(i) === '<') {
                            this.text += this.message.charAt(i);
                            this.text += this.message.charAt(i+1);
                            this.text += this.message.charAt(i+2);
                            this.text += this.message.charAt(i+3);
                            i += 4;
                        } else {
                            this.text += this.message.charAt(i);
                            i++;
                        }

                        if (i > this.message.length){
                            clearInterval(interval);
                        }
                    }, speed);
                },
                openPreferences(){
                    this.$router.push('/preferences');
                }
        }
    }
</script>

<style scoped lang="scss">

    .start {
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 1fr 80px;
        justify-items: center;
        align-items: center;
        padding: 0 20px;
        min-height: 100vh;
        overflow: hidden;

        .text {
            grid-row: 1/1;
        }

        .btn {
            grid-row: 2/2;
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
