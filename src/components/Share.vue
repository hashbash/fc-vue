<template>
    <div>
        <v-row>
            <template v-if="shareActive">
                <v-col>
                    <v-btn icon
                           :href="`https://telegram.me/share/url?url=${link}&text=${text}`"
                           target="_blank"
                    >
                        <v-icon>mdi-telegram</v-icon>
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn icon
                           :href="`https://reddit.com/submit?url=${link}&title=${text}`"
                           target="_blank"
                    >
                        <v-icon>mdi-reddit</v-icon>
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn icon
                           :href="`https://www.facebook.com/sharer.php?u=${link}`"
                           target="_blank"
                    >
                        <v-icon>mdi-facebook</v-icon>
                    </v-btn>
                </v-col>
            </template>
            <v-col>
                <v-btn icon @click="shareActive = !shareActive">
                    <v-icon>mdi-share-variant</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
        name: "Share",
        data:() => ({
            shareActive: false
        }),
        props: {
            link: String,
            text: String,
        }
    }
</script>

<style scoped>

</style>