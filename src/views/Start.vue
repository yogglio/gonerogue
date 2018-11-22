<template>
    <div class="start">
        <img v-if="animation" src="../assets/loading.gif">
        <div class="text" v-html="text" v-show="!animation"></div>
        <div v-if="!animation" @click="openPreferences" class="btn">Jakuhl</div>
    </div>
</template>

<script>
    export default {
        name: "start",
        data() {
            return {
                animation: true,
                text:'',
                message: "Welcome to the World of Gone Rogue <br>"+
                "<br>" +
                "Travel in a new environment by going to places that aren't the 'norm'.<br>" +
                "Select a Rogue Level to take on a challenge based on your preferences."
            }
        },
        methods: {
                showTutorial(){
                    this.animation = false;
                    this.showText(50)
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
        },
        mounted(){
            setTimeout(this.showTutorial, 2500)
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

        img {
            grid-row: 1/1;
            width: 100%;
        }

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