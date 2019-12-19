<template>
    <div v-if="showElement">
        <v-card elevation="0" class="overflow-y-auto" style="max-height: 230px; max-width: 800px">
            <v-list-item two-line>
                <v-list-item-content>
                    <v-list-item-title class="headline">{{this.feature.properties['destination_city_name'] + ', ' +
                        this.feature.properties['destination_country_name']}}</v-list-item-title>
                    <v-list-item-subtitle>{{ $t('flight.priceFrom')}} {{this.feature.properties['pretty_price']}}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-spacer></v-spacer>



            <v-fade-transition>
                <div v-if="flightsIter === undefined" class="justify-center align-center">
                    <v-progress-linear
                            :size="50"
                            indeterminate
                    ></v-progress-linear>
                </div>

                <v-list class="mx-2" v-else-if="(flightsIter !== undefined) && (flightsIter.length > 0)">

                    <v-list-item v-for="(flight, index) in flightsIter"
                                 :key="index"
                    >
                        <v-list-item-content style="min-width: 300px">
                            <v-list-item-title>{{flight['origin_city_name']
                                + ' (' + flight['origin'] + ')'
                                + (flight['one_way'] == 0 ? ' &#8644; ' : ' &#8594; ')
                                + flight['destination_city_name']
                                + ' (' + flight['destination'] + ')'
                                }}</v-list-item-title>
                            <v-list-item-subtitle>
                                {{(flight['direct'] == 1 ? $t('flight.direct') : $t('flight.withStops'))
                                + ' &#9992; '
                                + flight['outbound_carrier_names'].join(', ')
                                }}
                            </v-list-item-subtitle>
                            <v-list-item-subtitle>
                                {{flight['outbound_dt']
                                + (flight['one_way'] == 1 ? '' : ' 	&#8651; ' + flight['inbound_dt'])}}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-content style="max-width: 220px">
                            <v-list-item-title style="font-size: 1.3rem" class="pa-0 ma-0">
                                {{ flight['converted_price'] | currency(flight['converted_currency'], 0, { spaceBetweenAmountAndSymbol: true }) }}
                            </v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-action>
                            <v-row>
                                <v-col class="ma-0 pa-0">
                                    <v-btn  @click="openK(flight)"
                                            icon>
                                        <v-icon color="grey lighten-1">mdi-alpha-k-circle-outline</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col class="ma-0 pa-0">
                                    <v-btn  @click="openSk(flight)"
                                            icon>
                                        <v-icon color="grey lighten-1">mdi-alpha-s-circle-outline</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col class="ma-0 pa-0">
                                    <v-btn  @click="openAS(flight)"
                                            icon>
                                        <v-icon color="grey lighten-1">mdi-alpha-a-circle-outline</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-list-item-action>
                        <v-list-item-action>
                            <template>
                                <v-btn  @click="addToRoute(flight, index)"
                                >
                                    {{$t('forms.selectors.addToRoute')}}
                                </v-btn>
                            </template>

                            <v-subheader class="caption pa-0 ma-0" style="max-height: 20px;">
                                <v-icon size="12" class="ma-1">mdi-history</v-icon>
                                {{flight['processing_date']}}</v-subheader>
                        </v-list-item-action>

                        </v-list-item>

                </v-list>
                <v-card v-else>
                    <v-card-text class="pa-2">
                        <v-col>
                        <v-row>Sorry. All caches for current conditions are expired.</v-row>
                        <v-row>Please check prices in source:</v-row>
                        </v-col>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn :href="linkK(this.feature.properties)"
                               target="_blank"
                        >KAYAK</v-btn>
                        <v-btn  :href="linkSk(this.feature.properties)"
                                target="_blank"
                        >Skyscanner</v-btn>
                        <v-btn  :href="linkAS(this.feature.properties)"
                                target="_blank"
                                class="success"
                        >Aviasales</v-btn>
                    </v-card-actions>
                </v-card>

            </v-fade-transition>


        </v-card>
    </div>
</template>

<script>

    import Vue from 'vue';
    import Vue2Filters from "vue2-filters";
    import common from "@/common";

    export default Vue.extend({
        name: "VueMapboxPopup",
        mixins: [Vue2Filters.mixin],
        data:() => ({
            flightsIter: undefined,
            showElement: true
        }),
        methods: {
            openSk(flight) {
                let link = common.skyscannerLink(flight);
                window.open(link, '_blank')
            },
            linkSk(flight) {
                return common.skyscannerLink(flight)
            },
            openAS(flight) {
                let link = common.aviasalesLink(flight);
                window.open(link, '_blank')
            },
            linkAS(flight) {
                return common.aviasalesLink(flight)
            },
            openK(flight) {
                let link = common.kayakLink(flight);
                window.open(link, '_blank')
            },
            linkK(flight) {
                return common.kayakLink(flight)
            },
            addToRoute(flight, index) {
                this.flightsIter[index]['clicked'] = true;
                this.$store.dispatch('addToRoute', flight);
                let origin = [{'place_code': flight['destination_city_id'],
                    'place_name': flight['destination_city_name']}];
                this.$store.dispatch('setOriginItems', origin);
                let futureDates = common.getDateRange(flight['outbound_dt'], 7, 4);
                this.$store.dispatch('setSearchDays', futureDates);
                this.showElement = false;
            }
        },
        props: {
            feature: {
                required: true,
                type: Object,
            },
            flights: {
                required: true,
                type: Promise,
            }
        },
        async created() {
            this.flightsIter = await this.flights
        }
    })
</script>