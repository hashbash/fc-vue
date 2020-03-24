<template>
    <v-stepper alt-labels>

        <v-stepper-header>
            <template v-for="(origin, index) in origins"
            >
                <v-stepper-step :key="`${index}-origin`" :step="origin" v-if="index === 0">
                    <div class="text-center">{{originNames[index]}}</div>
                </v-stepper-step>
                <v-divider :key="`${index}-divider1`" v-if="index === 0"></v-divider>
                <v-stepper-step :key="`${index}-destination`"
                                :step="destinations[index]"
                                v-if="index===0"
                >
                    <div class="text-center">{{destinationNames[index]}}</div>
                </v-stepper-step>
                <v-stepper-step :key="`${index}-destination`"
                                :step="destinations[index]"
                                v-else
                                complete
                                complete-icon="mdi-debug-step-over"
                                color="orange"
                >
                    <small class="text-center">{{destinationNames[index]}}</small>
                </v-stepper-step>
                <div :key="`${index}-btn`" v-if="(index + 1) === origins.length"
                     style="padding-top: 6.5%; position: relative"
                >
                    <v-btn elevation="0"
                           :href="aviasalesLink(flight)"
                           target="_blank"
                    >{{ flight.price | currency(flight.currency, 0, { spaceBetweenAmountAndSymbol: true }) }}</v-btn>
                </div>
            </template>
        </v-stepper-header>
    </v-stepper>
</template>

<script>
    import common from "../../../common";

    export default {
        name: "SkipleggedSegmentElement",
        methods: {
            aviasalesLink: common.aviasalesLink
        },
        props: {
            origins: Array,
            originNames: Array,
            destinations: Array,
            destinationNames: Array,
            flight: Object
        }
    }
</script>

<style scoped>

</style>