<template>
    <v-card>
        <v-card-title>{{$t('meta.cheapestRTForOWCard')}}
            <v-spacer></v-spacer>
            <div class="overline" style="color: gray">
                <div>{{this.flights.length ? '' : $t('meta.noData')}}</div>
            </div>
        </v-card-title>
        <v-card-text v-if="flights.length" class="pa-0">
            <v-container fluid>
                <v-data-table
                        :headers="currentVariantsHeader"
                        :items="cachedFlights"
                        hide-default-footer
                        disable-sort
                        dense
                        :options="{
                            sortBy: ['converted_price_rounded'],
                            itemsPerPage: 20
                        }"
                        loading-text="Loading"
                        multi-sort
                        class="mx-auto justify-center align-center mx-10"
                        :no-data-text="$t('forms.messages.noData')"
                >
                    <template v-slot:item.converted_price_rounded="{ item }">
                        <span>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">{{ item['converted_price'] | currency(item['converted_currency'], 0, { spaceBetweenAmountAndSymbol: true }) }}</span>
                            </template>
                            <span>{{ $t('flight.cached_at') }} {{ item['processing_date'] }} (MSK)</span>
                        </v-tooltip>
                    </span>
                    </template>
                    <template v-slot:item.origin_city_id="{ item }">
                        <span>
                        <v-btn
                                x-small
                                class="primary mx-2"
                                elevation="6"
                                v-on:click="openAS(item)"
                        >{{getLang() === 'ru' ? 'Aviasales' : 'Jetradar'}}
                            <v-icon size="15">mdi-open-in-new</v-icon>
                        </v-btn>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on" elevation="3"
                                       :href="historyLink(item)"
                                       target="_blank"
                                       x-small
                                > <v-icon>mdi-history</v-icon></v-btn>
                              </template>
                              <span>{{$t('navigation.goToHistory')}}</span>
                        </v-tooltip>

                        <v-menu>
                          <template v-slot:activator="{ on }">
                            <v-btn
                                    class="mx-2"
                                    v-on="on"
                                    icon
                                    elevation="6"
                                    x-small
                            >
                              <v-icon>mdi-dots-horizontal</v-icon>
                            </v-btn>
                          </template>
                            <v-list dense>
                                <v-subheader>{{ $t('forms.names.aggregators') }}</v-subheader>
                                <v-list-item-group>
                                    <v-list-item
                                            v-on:click="openSk(item)"
                                    >
                                        <v-list-item-icon class="mx-2">
                                            <v-icon>mdi-open-in-new</v-icon>
                                          </v-list-item-icon>
                                        <v-list-item-title>{{ $t('navigation.goTo') }} SKYSCANNER</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item
                                            v-on:click="openK(item)"
                                    >
                                        <v-list-item-icon class="mx-2">
                                            <v-icon>mdi-open-in-new</v-icon>
                                          </v-list-item-icon>
                                        <v-list-item-title>{{ $t('navigation.goTo') }} KAYAK</v-list-item-title>
                                    </v-list-item>
                                </v-list-item-group>
                                <span v-if="getLang() === 'ru'">
                                <v-subheader>Оплата банковскими милями</v-subheader>
                                <v-list-item-group>
                                    <v-list-item
                                            v-on:click="openAT(item)"
                                    >
                                        <v-list-item-icon class="mx-2">
                                            <v-icon>mdi-open-in-new</v-icon>
                                          </v-list-item-icon>
                                        <v-list-item-title>{{ $t('navigation.goTo') }} TRAVEL.ALFABANK</v-list-item-title>
                                    </v-list-item>
                                </v-list-item-group>
                                </span>
                            </v-list>
                        </v-menu>
                    </span>
                    </template>

                </v-data-table>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    import {mapGetters} from 'vuex';
    import common from "../../../common";
    export default {
        name: "CheapestRTForOW",
        data: () => ({
            flights: [],
            currentVariantsHeader: []
        }),
        methods: {
            ...mapGetters(['getCacheFlights', 'getLang']),
            historyLink: common.getLinkToHistory,
            async openSk(flight) {
                common.logEvent('click_on_flight', flight);
                let link = common.skyscannerLink(flight);
                window.open(link, '_blank')
            },
            async openAS(flight) {
                common.logEvent('click_on_flight', flight);
                let link = common.aviasalesLink(flight);
                window.open(link, '_blank')
            },
            async openK(flight) {
                common.logEvent('click_on_flight', flight);
                let link = common.kayakLink(flight);
                window.open(link, '_blank')
            },
            async openAT(flight) {
                common.logEvent('click_on_flight', flight);
                let link = common.travelAlfabankLink(flight);
                window.open(link, '_blank')
            },
        },
        computed: {
            cachedFlights() {
                return this.flights.map(element => {
                    return {
                        ...element,
                        prettyOrigin: element['origin_city_name'] + ` (${element['origin']})`,
                        prettyDestination: element['destination_city_name'] + ` (${element['destination']})`,
                        prettyInboundDate: element['inbound_dt'] === null ? '—' : element['inbound_dt'],
                        prettyDirect: element['direct'] === 1 ? '✓' : '✗'
                    }
                })
            }
        },
        mounted() {
            this.flights = this.getCacheFlights();
            this.currentVariantsHeader = [
                {text: this.$t('forms.tables.headers.origin'), value: 'prettyOrigin'},
                {text: this.$t('forms.tables.headers.destination'), value: 'prettyDestination'},
                {text: this.$t('forms.tables.headers.outboundDate'), value: 'outbound_dt'},
                {text: this.$t('forms.tables.headers.inboundDate'), value: 'prettyInboundDate'},
                {text: this.$t('forms.tables.headers.carriers'), value: 'carrier_names_joined', filterable: true},
                {text: this.$t('forms.tables.headers.direct'), value: 'prettyDirect'},
                {text: this.$t('forms.tables.headers.price'), value: 'converted_price_rounded'},
                {text: this.$t('forms.tables.headers.link'), value: 'origin_city_id', sortable: false},
            ];
        }
    }
</script>

<style scoped>

</style>