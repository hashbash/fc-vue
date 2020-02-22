<template>
    <div>
        <ComplexFlightsHeader></ComplexFlightsHeader>
        <v-content>
            <ComplexFlightCard
                    v-for="cf in complexFlights"
                    :key="cf['uuid']"
                    :cf="cf"
            ></ComplexFlightCard>
        </v-content>
    </div>
</template>

<script>
    import ComplexFlightsHeader from "./ComplexFlightsHeader";
    import {mapGetters} from 'vuex';
    import ComplexFlightCard from "./ComplexFlightCard";
    export default {
        name: "ComplexFlightsPage",
        components: {ComplexFlightsHeader, ComplexFlightCard},
        methods: {
            ...mapGetters(['getComplexFlights'])
        },
        computed: {
            complexFlights: {
                get() {
                    return this.getComplexFlights()
                }
            }
        }
    }
</script>

<style scoped>

</style>