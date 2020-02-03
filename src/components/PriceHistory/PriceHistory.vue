<template>
    <div>
        <v-content class="px-0 mx-0 pa-2 justify-center align-center">
            <SearchForm></SearchForm>
        </v-content>
        <v-content class="pa-0" v-if="this.items.length">
            <PriceHistoryChartCard class="mx-auto justify-center align-center" style="max-width: 85%"
                                   :flights="this.items"
                                   :key="chartKey"
            ></PriceHistoryChartCard>
        </v-content>
        <v-content class="px-0 mx-0 pa-2">
        <v-card class="mx-auto justify-center align-center" style="max-width: 85%">
            <v-card-title>{{$t('forms.names.priceHistoryTable')}}</v-card-title>
            <v-data-table
                    :headers="headers"
                    :items="items"
                    dense
                    class="mx-auto justify-center align-center"
                    style="max-width: 97%"
                    :no-data-text="noDataFound ? $t('forms.messages.noData') : $t('forms.messages.waitingForFillingForm')"
            >
            </v-data-table>
        </v-card>
        </v-content>
        <v-content class="px-0 mx-0 pa-0">
            <v-card class="mx-auto justify-center align-center" style="max-width: 85%">
                <v-card-title>{{$t('forms.names.latestPricesFromCache')}}</v-card-title>
                <v-data-table
                        :headers="currentVariantsHeader"
                        :items="currentVariantsItems"
                        dense
                        class="mx-auto justify-center align-center"
                        style="max-width: 97%"
                        :no-data-text="currentVariantsNoDataFound ? $t('forms.messages.noData') : $t('forms.messages.waitingForFillingForm')"
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
                        >Aviasales
                            <v-icon size="15">mdi-open-in-new</v-icon>
                        </v-btn>

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
            </v-card>
        </v-content>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import SearchForm from "../Common/SearchForm";
    import PriceHistoryChartCard from "./PriceHistoryChartCard";
    import common from "../../common";
    import Vue2Filters from "vue2-filters";

    export default {
        name: "PriceHistory",
        components: {SearchForm, PriceHistoryChartCard},
        mixins: [Vue2Filters.mixin],
        data: function () {
            return {
                noDataFound: false,
                items: [],
                headers: [
                    {text: this.$t('forms.tables.headers.cacheDatetime'), value: 'processing_dt'},
                    {text: this.$t('forms.tables.headers.origin'), value: 'prettyOrigin'},
                    {text: this.$t('forms.tables.headers.destination'), value: 'prettyDestination'},
                    {text: this.$t('forms.tables.headers.outboundDate'), value: 'outbound_dt'},
                    {text: this.$t('forms.tables.headers.inboundDate'), value: 'prettyInboundDate'},
                    {text: this.$t('forms.tables.headers.carriers'), value: 'carrier_names', filterable: true},
                    {text: this.$t('forms.tables.headers.direct'), value: 'direct'},
                    {text: this.$t('forms.tables.headers.currency'), value: 'converted_currency'},
                    {text: this.$t('forms.tables.headers.price'), value: 'converted_price_rounded'},
                ],
                currentVariantsNoDataFound: false,
                currentVariantsItems: [],
                currentVariantsHeader: [
                    {text: this.$t('forms.tables.headers.origin'), value: 'prettyOrigin'},
                    {text: this.$t('forms.tables.headers.destination'), value: 'prettyDestination'},
                    {text: this.$t('forms.tables.headers.outboundDate'), value: 'outbound_dt'},
                    {text: this.$t('forms.tables.headers.inboundDate'), value: 'prettyInboundDate'},
                    {text: this.$t('forms.tables.headers.carriers'), value: 'carrier_names_joined', filterable: true},
                    {text: this.$t('forms.tables.headers.direct'), value: 'prettyDirect'},
                    // {text: this.$t('forms.tables.headers.currency'), value: 'converted_currency'},
                    {text: this.$t('forms.tables.headers.price'), value: 'converted_price_rounded'},
                    {text: this.$t('forms.tables.headers.link'), value: 'origin_city_id'},
                ],
                chartKey: 0
            }
        },
        methods: {
            ...mapGetters(['getLang']),
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
            }
        },
        computed: {
            ...mapGetters({loading: 'getPriceHistoryLoading',
                flightHistory: 'getPriceHistory',
                cachedFlights: 'getCacheFlights'
            })
        },
        async mounted() {
            this.headers = [
                {text: this.$t('forms.tables.headers.cacheDatetime'), value: 'processing_dt'},
                {text: this.$t('forms.tables.headers.origin'), value: 'prettyOrigin'},
                {text: this.$t('forms.tables.headers.destination'), value: 'prettyDestination'},
                {text: this.$t('forms.tables.headers.outboundDate'), value: 'outbound_dt'},
                {text: this.$t('forms.tables.headers.inboundDate'), value: 'prettyInboundDate'},
                {text: this.$t('forms.tables.headers.carriers'), value: 'carrier_names', filterable: true},
                {text: this.$t('forms.tables.headers.direct'), value: 'prettyDirect'},
                {text: this.$t('forms.tables.headers.currency'), value: 'converted_currency'},
                {text: this.$t('forms.tables.headers.price'), value: 'converted_price_rounded'},
            ];
            this.currentVariantsHeader = [
                {text: this.$t('forms.tables.headers.origin'), value: 'prettyOrigin'},
                {text: this.$t('forms.tables.headers.destination'), value: 'prettyDestination'},
                {text: this.$t('forms.tables.headers.outboundDate'), value: 'outbound_dt'},
                {text: this.$t('forms.tables.headers.inboundDate'), value: 'prettyInboundDate'},
                {text: this.$t('forms.tables.headers.carriers'), value: 'carrier_names_joined', filterable: true},
                {text: this.$t('forms.tables.headers.direct'), value: 'prettyDirect'},
                // {text: this.$t('forms.tables.headers.currency'), value: 'converted_currency'},
                {text: this.$t('forms.tables.headers.price'), value: 'converted_price_rounded'},
                {text: this.$t('forms.tables.headers.link'), value: 'origin_city_id', sortable: false},
            ];
        },
        watch: {
            loading(newValue, oldValue) {
                if (newValue === false && oldValue === true) {
                    this.items = this.flightHistory.map(element => {
                        return {
                            ...element,
                            prettyOrigin: element['origin_city_name'] + ` (${element['origin']})`,
                            prettyDestination: element['destination_city_name'] + ` (${element['destination']})`,
                            prettyInboundDate: element['inbound_dt'] === null ? '—' : element['inbound_dt'],
                            prettyDirect: element['direct'] === 1 ? '✓' : '✗'
                        };
                    });
                    this.noDataFound = this.items.length === 0;
                    this.chartKey++;

                    this.currentVariantsItems = this.cachedFlights.map(element => {
                        return {
                            ...element,
                            prettyOrigin: element['origin_city_name'] + ` (${element['origin']})`,
                            prettyDestination: element['destination_city_name'] + ` (${element['destination']})`,
                            prettyInboundDate: element['inbound_dt'] === null ? '—' : element['inbound_dt'],
                            prettyDirect: element['direct'] === 1 ? '✓' : '✗'
                        };
                    });
                    this.currentVariantsNoDataFound = this.items.length === 0;

                }
            }
        }
    }
</script>

<style scoped>

</style>