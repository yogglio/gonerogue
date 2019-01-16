<template>
    <button v-if="subscribed" v-on:click="unsubscribe()">Unsubscribe</button>
    <button v-else v-on:click="subscribe()">Subscribe</button>
</template>

<script>
    export default {
        name: "subscription",
        data() {
            return {
                subscribed: false
            }
        },
        methods: {
            subscribe(){
                navigator.serviceWorker.ready
                    .then(async function(registration) {
                        const response = await fetch('/vapidPublicKey');
                        const vapidPublicKey = await response.text();
                        const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);

                        return registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: convertedVapidKey
                            });
                        }).then((subscription) => {
                        console.log('Subscribed', subscription.endpoint);
                        return fetch('/register', {
                            method: 'post',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                subscription: subscription
                            })
                        });
                    }).then(()=> this.subscribed = true)
            },
            unsubscribe(){
                navigator.serviceWorker.ready
                    .then(function(registration) {
                        return registration.pushManager.getSubscription();
                    }).then(function(subscription) {
                    return subscription.unsubscribe()
                        .then(() => {
                            console.log('Unsubscribed', subscription.endpoint);
                            return fetch('/unregister', {
                                method: 'post',
                                headers: {
                                    'Content-type': 'application/json'
                                },
                                body: JSON.stringify({
                                    subscription: subscription
                                })
                            });
                        });
                }).then(() => this.subscribed = false);
            },
            urlBase64ToUint8Array(base64String) {
                const padding = "=".repeat((4 - base64String.length % 4) % 4);
                const base64 = (base64String + padding)
                    .replace(/\-/g, "+")
                    .replace(/_/g, "/");

                const rawData = window.atob(base64);
                const outputArray = new Uint8Array(rawData.length);

                for (let i = 0; i < rawData.length; ++i) {
                    outputArray[i] = rawData.charCodeAt(i);
                }
                return outputArray;
            }
        },
        mounted() {
            navigator.serviceWorker.ready
                .then(function(registration) {
                    console.log('service worker registered');
                    return registration.pushManager.getSubscription();
                }).then((subscription) =>{
                if (subscription) {
                    console.log('Already subscribed', subscription.endpoint);
                    this.subscribed = true;
                } else {
                    this.subscribed = false;
                }
            });
        }
    }
</script>

<style scoped>

</style>