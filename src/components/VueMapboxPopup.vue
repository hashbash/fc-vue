<template>
    <div>
        <v-card elevation="0">
        <h3>Test</h3>
        <h3>{{ feature.properties.title }}</h3>
        <button @click="popupClicked">Learn more</button>

            <v-icon>mdi-facebook</v-icon>
        </v-card>
    </div>
</template>

<script>
    import Vue from 'vue'
    export default Vue.extend({
        name: "VueMapboxPopup",
        props: {
            feature: {
                required: true,
                type: Object,
            },
        },
        methods: {
            popupClicked() {
                alert('Learn more clicked')
            },
        },
    })
</script>