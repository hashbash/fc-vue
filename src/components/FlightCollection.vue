<template>
    <div>
        <v-sheet class="mx-auto" elevation="8" max-width="1265" min-height="500"
        >
            <v-toolbar flat>
                <v-progress-linear
                        :active="!flightsLoaded"
                        :indeterminate="!flightsLoaded"
                        absolute
                        top
                        color="deep-purple accent-6"
                ></v-progress-linear>
                <v-toolbar-title class="ml-2" v-ripple>
                    <h4>{{ collectionTitle }}</h4>
                </v-toolbar-title>
                <div class="flex-grow-1"></div>
                <Share
                        :link="siteUrl + '#collection' + collectionId"
                        :text="collectionTitle"
                ></Share>
            </v-toolbar>
            <v-slide-group
                    v-model="model"
                    v-if="flightsLoaded"
                    style="transition-duration: 5s"
                    show-arrows
                    prev-icon="mdi-arrow-left"
                    next-icon="mdi-arrow-right"
                    class="mx-auto"
            >
                <v-slide-item
                        v-for="(flight, index) in flights"
                        :key="index"
                        v-slot:default="{ toggle, active }"
                >
                 <FlightCard :key="'coll' + collectionId + 'flightIdx' + index"
                             :flight="flight"></FlightCard>
                </v-slide-item>
            </v-slide-group>
            <v-overlay
                    v-else
                    absolute
                    :opasity=".9"
            >
                <v-progress-circular
                        indeterminate
                        size="60"
                ></v-progress-circular>
            </v-overlay>
        </v-sheet>
    </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import FlightCard from "@/components/FlightCard";
import Share from "@/components/Share";
import AppConfig from "@/AppConfig";


export default {
    name: "FlightCollection",
    components: {FlightCard, Share},
    data:() => ({
        flightsLoaded: false,
        flights: [],
        model: true,
        siteUrl: AppConfig.siteUrl
    }),
    methods: {
        ...mapGetters(['getCollectionFlights', 'getSelectedSearchMonths']),
        ...mapActions(['fetchCollectionFlights']),
    },
    async mounted() {
        this.flightsLoaded = await this.fetchCollectionFlights({collectionId: this.collectionId});
        this.flights = await this.getCollectionFlights()(this.collectionId);
    },
    props: {
        collectionId: Number,
        collectionTitle: String,
    },
    watch: {
        async getLang(newValue, oldValue) {
            if (newValue && oldValue) {
                if (newValue !== oldValue) {
                    this.flightsLoaded = false;
                    await this.fetchCollectionFlights({collectionId: this.collectionId});
                    this.flights = await this.getCollectionFlights()(this.collectionId);
                    this.flightsLoaded = true;
                }
            }
        }
    }
}

</script>


<style scoped>

</style>