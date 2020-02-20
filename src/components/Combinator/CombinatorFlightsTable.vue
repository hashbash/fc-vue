<template>
    <v-data-table
            :headers="headers"
            :items="combinatorFlightsPrettified"
            :options="{
                            sortBy: ['total_price']
                        }"
            :items-per-page="15"
            :expanded.sync="expanded"
            show-expand
            item-key="uuid"
            @click:row="handleRowClick"
            :no-data-text="$t('forms.messages.noData')"
    >
        <template v-slot:item.total_price_converted="{ item }">
                        <span>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">{{ item['total_price_converted'] | currency(item['converted_currency'], 0, { spaceBetweenAmountAndSymbol: true }) }}</span>
                            </template>
                            <span>{{ $tc('forms.numbers.totalPriceForCount', item['segment_count'])}}</span>
                        </v-tooltip>
                    </span>
        </template>
        <template v-slot:item.destinationsCityList="{ item }">
            <v-chip-group>
                <v-chip v-for="(city, index) in item.destinationsCityList"
                :key="index"
                >
                    {{city}}
                </v-chip>
            </v-chip-group>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
                <v-card elevation="0">
                    <v-card-text>
                        <div v-for="(f, f_index) in item.flights"
                             :key="f_index">
                            <v-row>
                                <v-col class="overline" style="max-width: 2%">
                                    {{f_index + 1}}
                                </v-col>
                                <v-col style="max-width: 35%; min-width: 30%">
                                    {{`${f['origin_city_name']}`}}
                                    <span class="grey">{{`${f['origin']}`}}</span>
                                    <span>
                                        {{ f['one_way'] === 1 ? '&#8677;' : '&#8644;'}}
                                    </span>
                                    <span>
                                        <span class="grey">{{f['destination']}}</span>
                                        <span>
                                            {{f['destination_city_name']}}
                                        </span>
                                    </span>
                                </v-col>

                                <v-col style="max-width: 55%; min-width: 30%">
                                    <span>
                                        {{f['outbound_dt']}}
                                    </span>
                                                    <span v-if="f['one_way'] === 0">
                                        <span>
                                        {{ f['one_way'] === 1 ? '&#8677;' : '&#8644;'}}
                                        </span>
                                        <span>
                                        {{f['inbound_dt']}}
                                        </span>
                                    </span>
                                                    <span>
                                        •
                                    </span>
                                                    <span :class="f['one_way'] === 1 ? 'gray' : 'success'">
                                        {{calculateDays(f['outbound_dt'], f['inbound_dt'], f['one_way'])}}
                                    </span>
                                    <span>
                                        •
                                    </span>
                                    <span>
                                        {{ f['direct'] === 1 ? $t('flight.direct') : $t('flight.withStops') }}
                                    </span>
                                </v-col>
                                <v-col style="max-width: 10%" class="justify-end align-end align-right">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">{{ f['converted_price'] | currency(f['converted_currency'], 0, { spaceBetweenAmountAndSymbol: true }) }}</span>
                                        </template>
                                        <span>{{ $t('flight.cached_at') }} {{ f['processing_date'] }} (MSK)</span>
                                    </v-tooltip>
                                </v-col>

                                <v-col style="max-width: 20%" class="justify-end align-right">
                        <span>
                        <v-btn
                                x-small
                                class="primary mx-2"
                                elevation="6"
                                v-on:click="openAS(f)"
                        >{{getLang() === 'ru' ? 'Aviasales' : 'Jetradar'}}
                            <v-icon size="15">mdi-open-in-new</v-icon>
                        </v-btn>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on" elevation="3"
                                       :href="historyLink(f)"
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
                                            v-on:click="openSk(f)"
                                    >
                                        <v-list-item-icon class="mx-2">
                                            <v-icon>mdi-open-in-new</v-icon>
                                          </v-list-item-icon>
                                        <v-list-item-title>{{ $t('navigation.goTo') }} SKYSCANNER</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item
                                            v-on:click="openK(f)"
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
                                            v-on:click="openAT(f)"
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
                                </v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                    <v-card-actions class="justify-end align-right align-end">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">
                        <v-btn class="primary mx-2"
                               elevation="6"
                               :href="complexAS(item.flights)"
                               target="_blank"
                        >{{$t('forms.selectors.multiCitySearch')}} {{getLang() === 'ru' ? 'Aviasales' : 'Jetradar'}}
                        <v-icon>mdi-open-in-new</v-icon>
                        </v-btn>
                                </span>
                            </template>
                            <span>{{$t('forms.warnings.complexMayBeMoreExpensive')}}</span>
                        </v-tooltip>
                        <div>
                            <v-menu>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                            class="mx-2"
                                            v-on="on"
                                            icon
                                            elevation="1"
                                    >
                                        <v-icon>mdi-dots-horizontal</v-icon>
                                    </v-btn>
                                </template>

                                <v-list dense>
                                    <v-subheader>{{ $t('forms.names.aggregators') }}</v-subheader>
                                    <v-list-item-group>
                                        <v-list-item
                                                :href="complexSS(item.flights)"
                                                target="_blank"
                                        >
                                            <v-list-item-icon class="mx-2">
                                                <v-icon>mdi-open-in-new</v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-title>{{ $t('navigation.goTo') }} SKYSCANNER</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item
                                                :href="complexKA(item.flights)"
                                                target="_blank"
                                        >
                                            <v-list-item-icon class="mx-2">
                                                <v-icon>mdi-open-in-new</v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-title>{{ $t('navigation.goTo') }} KAYAK</v-list-item-title>
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                            </v-menu>
                        </div>
                    </v-card-actions>
                </v-card>
            </td>
        </template>
    </v-data-table>
</template>

<script>
    import {mapGetters} from 'vuex';
    import common from "../../common";
    import Vue2Filters from "vue2-filters";

    export default {
        name: "CombinatorFlightsTable",
        mixins: [Vue2Filters.mixin],
        data: function () {
            return {
                headers: [],
                expanded: [],
            }
        },
        methods: {
            ...mapGetters(['getLang']),
            historyLink: common.getLinkToHistory,
            handleRowClick(e) {
                if (this.expanded.filter(el => el['uuid'] === e['uuid']).length > 0) {
                    this.expanded = this.expanded.filter(el => el['uuid'] !== e['uuid'])
                } else {
                    this.expanded.push(e);
                }
            },
            complexAS: common.aviasalesComplexLink,
            complexSS: common.skyscannerComplexLink,
            complexKA: common.kayakComplexLink,
            calculateDays(outbound, inbound, one_way) {
                if (one_way === 0) {
                    let date1 = new Date(outbound);
                    let date2 = new Date(inbound);
                    let timeDiff = Math.abs(date2.getTime() - date1.getTime());
                    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    return this.$i18n.tc('flight.days', diffDays);
                } else {
                    return this.$i18n.t('flight.oneWay')
                }
            },
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
            ...mapGetters({
                combinatorFlights: 'getCombinatorFlights'
            }),
            combinatorFlightsPrettified() {
                return this.combinatorFlights.map(el => {
                    return {
                        ...el,
                        firstSegmentDate: el['flights'][0]['outbound_dt'],
                        prettyOrigin: el['flights'][0]['origin_city_name'] + ` (${el['flights'][0]['origin']})`,
                        destinationsCityList: Array.from(new Set(el['flights'].map(item => {
                            return {
                                originCountry: item['origin_city_name'],
                                destinationCountry: item['destination_city_name']
                            }
                        }).map(item => [
                            item.originCountry, item.destinationCountry
                        ]).flat().filter(function (item) {
                            return item !== el['flights'][0]['origin_city_name']
                        })))
                    }
                })
            }
        },
        async mounted() {
            this.headers = [
                {text: this.$t('forms.tables.headers.schema'), value: 'schema'},
                {text: this.$t('forms.tables.headers.firstSegmentDate'), value: 'firstSegmentDate'},
                {text: this.$t('forms.tables.headers.origin'), value: 'prettyOrigin'},
                {text: this.$t('forms.tables.headers.cities'), value: 'destinationsCityList', filterable: true},
                {text: this.$t('forms.tables.headers.totalPrice'), value: 'total_price_converted'},
            ];
        },
    }
</script>

<style scoped>

</style>