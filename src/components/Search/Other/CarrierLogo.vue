<template>
    <div>
        <v-img :src="'https://pics.avs.io/al_square/72/72/' + outboundDistinctCarrierCodes[0] + '.png'"
               height="72px" width="72px"
               class="ma-auto"
               v-if="outboundDistinctCarriers.length === 1"
        ></v-img>
        <div v-else-if="outboundDistinctCarriers.length > 1">
            <v-row align="center" justify="center">
                <v-col v-for="(code, index) in outboundDistinctCarrierCodes" :key="index">
                    <v-img
                            :src="'https://pics.avs.io/al_square/32/32/' + code + '@2x.png'"
                            height="32px" width="32px"
                            class="ma-0"
                    ></v-img>
                </v-col>
            </v-row>

        </div>
        {{outboundDistinctCarriers.join(' + ')}}
    </div>
</template>

<script>
    export default {
        name: "CarrierLogo",
        props: {
            outboundDistinctCarrierCodes: Array,
            outboundDistinctCarriers: Array
        }
    }
</script>

<style scoped>

</style>