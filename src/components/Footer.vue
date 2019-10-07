<template>
    <v-footer
            padless
            class="font-weight-light"
    >
        <v-card
                flat
                tile
                class="lighten-1 white--text text-center"
                width="100%"
        >
            <v-card-text>
                <v-btn
                        v-for="icon in icons"
                        :key="icon[0]"
                        class="mx-4"
                        icon
                        :href="icon[1]"
                        target="_blank"
                >
                    <v-icon size="24px">{{ icon[0] }}</v-icon>
                </v-btn>
            </v-card-text>
            <v-card-text class="pt-0">
                Keep in touch with us <strong class="black--text">❤️</strong>
            </v-card-text>
        </v-card>
    </v-footer>
</template>

<script>
    export default {
        name: "Footer",
        data: () => ({
            icons: [
                ['mdi-facebook', 'https://www.facebook.com/profile.php?id=100013718824496'],
                ['mdi-telegram', 'tg://t.me/cheapstertravelfans'],
                ['mdi-instagram', 'https://www.instagram.com/senya_vinnyj/'],
                ['mdi-email', 'mailto:brain4monkey@gmail.com'],
            ],
        })
    }
</script>

<style scoped>

</style>