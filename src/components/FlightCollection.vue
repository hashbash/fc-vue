<template>
    <div>
        <v-sheet class="mx-auto"
                 elevation="8"
                 max-width="1265"
                 min-height="500"
                 v-if="show"
        >
            <v-toolbar flat>
                <v-progress-linear
                        :active="!flightsLoaded"
                        :indeterminate="!flightsLoaded"
                        absolute
                        top
                        color="deep-purple accent-6"
                ></v-progress-linear>
                <router-link
                        :to="'#collection'+collectionId"
                        @click.native="scrollTo('#collection'+collectionId)"
                        tag="div"
                >
                <v-toolbar-title class="ml-2" v-ripple>
                    <a class="custom-a">{{ collectionTitle }}</a>
                </v-toolbar-title>
                </router-link>
                <div class="flex-grow-1"></div>
                <Share
                        :link="siteUrl + '#collection' + collectionId"
                        :text="collectionTitle"
                ></Share>
            </v-toolbar>
            <v-slide-group
                    v-model="model"
                    v-if="flightsLoaded"
                    style="transition-duration: 3s"
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
                     <FlightCard v-if="kind === 'simple'" :key="'coll' + collectionId + 'flightIdx' + index"
                                 :flight="flight">
                     </FlightCard>
                     <ComplexFlightCard v-else-if="kind === 'complex'" :key="'coll2' + collectionId + 'flightIdx' + index"
                                        :flight="flight"></ComplexFlightCard>

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
        <v-sheet class="mx-auto"
                 elevation="8"
                 max-width="1265"
                 min-height="500"
                 v-else-if="!show"
        >
            <v-toolbar flat>
                <v-progress-linear
                        :active="!flightsLoaded"
                        :indeterminate="!flightsLoaded"
                        absolute
                        top
                        color="deep-purple accent-6"
                ></v-progress-linear>
                <router-link
                        :to="'#collection'+collectionId"
                        @click.native="scrollTo('#collection'+collectionId)"
                        tag="div"
                >
                    <v-toolbar-title class="ml-2" v-ripple>
                        <a class="custom-a">{{ collectionTitle }}</a>
                    </v-toolbar-title>
                </router-link>
                <div class="flex-grow-1"></div>
                <Share
                        :link="siteUrl + '#collection' + collectionId"
                        :text="collectionTitle"
                ></Share>
            </v-toolbar>
            <div>
                <v-content></v-content>
                <v-content></v-content>
                <v-content></v-content>
                <v-row
                        align="center"
                        justify="center"
                        class="justify-center align-center"
                >
                <v-icon x-large>mdi-emoticon-dead-outline</v-icon>
                <v-icon x-large>mdi-emoticon-dead-outline</v-icon>
                <v-icon x-large>mdi-emoticon-dead-outline</v-icon>
                </v-row>
                <v-row
                        align="center"
                        justify="center"
                >
                    <div>{{$t('empty')}}</div>
                </v-row>
                <v-content></v-content>
                <v-content></v-content>
                <v-content></v-content>
                </div>
        </v-sheet>
    </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import FlightCard from "@/components/FlightCard";
import ComplexFlightCard from "@/components/ComplexFlightCard";
import Share from "@/components/Share";
import AppConfig from "@/AppConfig";


export default {
    name: "FlightCollection",
    components: {FlightCard, Share, ComplexFlightCard},
    data:() => ({
        flightsLoaded: false,
        flights: [],
        model: true,
        siteUrl: AppConfig.siteUrl,
        show: true
    }),
    methods: {
        ...mapGetters(['getCollectionFlights', 'getSelectedSearchMonths']),
        ...mapActions(['fetchCollectionFlights', 'fetchComplexCollectionFlights']),
        scrollTo: function (hash) {
            setTimeout(() => { location.href = hash }, 150)
        }
    },
    async mounted() {
        if (this.kind === 'simple') {
            this.flightsLoaded = await this.fetchCollectionFlights({collectionId: this.collectionId});
        } else if (this.kind === 'complex') {
            this.flightsLoaded = await this.fetchComplexCollectionFlights({collectionId: this.collectionId});
        }
        this.flights = await this.getCollectionFlights()(this.collectionId);
        if (this.flights.length === 0) {
            this.show = false;
        }
    },
    props: {
        collectionId: Number,
        collectionTitle: String,
        kind: String
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
    .custom-a {
        color: inherit;
        text-decoration: none;
    }

</style>