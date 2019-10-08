<template>
    <v-alert
            prominent
            type="error"
    >
        <v-row align="center">
            <v-col class="grow">Something went wrong. Try reloading the page.
            </v-col>
            <v-col class="shrink">
                <v-btn @click="reloadPage">Reload page</v-btn>
            </v-col>
        </v-row>
        <v-row align="center">
            <v-col class="grow"><i>Contact us if the error persists to much time.</i>
            </v-col>
            <v-col class="shrink">
                <v-btn href="tg://t.me/cheapstertravelfans"
                >
                    <v-icon size="24px">mdi-telegram</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-alert>
</template>

<script>
    export default {
        name: "UnexpectedError",
        methods: {
            reloadPage() {
                window.location.reload()
            }
        }
    }
</script>


<style scoped>

</style>