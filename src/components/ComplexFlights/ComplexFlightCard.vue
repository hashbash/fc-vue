<template>
    <v-card class="pa-2 ma-2">
        <v-card-text class="pa-0 mx-4 ma-0 px-0">{{getUniqCountryNames()}}</v-card-text>
        <v-card-title class="headline justify-start align-start pa-0 mx-4 ma-0 px-0">
            <span>{{getUniqCityNames()}}</span>
            <span></span>
            <v-chip class="mx-2" onclick="">{{$tc('flight.days', cf['total_trip_duration'])}}</v-chip>
        </v-card-title>


        <v-row class="pa-0">
            <v-col style="min-width: 70%">
        <v-card-text class="pa-2">
            <v-row v-for="(f, index) in cf['flights']" :key="index" class="pa-1 ma-2">
                <v-col class="pa-0 ma-0" style="max-width: 30%">
                <span>
                <span>
                        {{f['origin_city_name']}}
                    </span>
                <span class="grey">{{f['origin']}}</span>
                <span>
                        {{ f['one_way'] === 1 ? '&#8677;' : '&#8644;'}}

                    </span>
                    </span>
                <span>
                    <span style="padding-left: 0.4em">
                        <span class="grey">{{f['destination']}}</span>
                        </span>
                        <span>
                            {{f['destination_city_name']}}
                        </span>
                    </span>
                </v-col>

                <v-col class="pa-0 ma-0" style="max-width: 12%">
                    <span>
                        {{f['outbound_dt']}}
                    </span>
                </v-col>
                <v-col class="pa-0 ma-0" style="max-width: 12%">
                    <span>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">{{ f['converted_price'] | currency(f['converted_currency'], 0, { spaceBetweenAmountAndSymbol: true }) }}</span>
                            </template>
                            <span>{{ $t('flight.cached_at') }} {{ f['processing_date'] }} (MSK)</span>
                        </v-tooltip>
                    </span>
                </v-col>
                <v-col class="pa-0 ma-0" style="max-width: 25%">
                    <span>
                        <v-btn
                                x-small
                                class="mx-2"
                                outlined
                                v-on:click="openAS(f)"
                        >{{getLang() === 'ru' ? 'Aviasales' : 'Jetradar'}}
                            <v-icon size="15">mdi-open-in-new</v-icon>
                        </v-btn>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on" outlined
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
                                    outlined
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
        </v-card-text>
            </v-col>
            <v-col style="max-width: 25%">
                <div class="imageWrapper">
                <v-avatar
                        class="overlayImage"
                        size="160"
                        style="left: 130px"
                >
                    <v-img :src="apiUrl + `/image/airports?id=${cf['flights'][1].destination}`"></v-img>
                </v-avatar>
                <v-avatar
                        class="overlayImage"
                        size="160"
                >
                    <v-img :src="apiUrl + `/image/airports?id=${cf['flights'][0].destination}`"></v-img>
                </v-avatar>

                </div>
            </v-col>
        </v-row>
        <v-card-title class="mx-0 px-5 pa-0 ma-0">
            <v-row>
                <v-col style="max-width: 10%">
                    <span>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">{{ cf['total_price_converted'] | currency(cf['converted_currency'], 0, { spaceBetweenAmountAndSymbol: true }) }}</span>
                            </template>
                            <span>{{ $tc('forms.numbers.totalPriceForCount', cf['segment_count'])}}</span>
                        </v-tooltip>
                    </span>
                </v-col>
                <v-col>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                                <span v-on="on">
                        <v-btn class="primary mx-2"
                               elevation="6"
                               :href="complexAS(cf.flights)"
                               target="_blank"
                        >{{$t('forms.selectors.multiCitySearch')}} {{getLang() === 'ru' ? 'Aviasales' : 'Jetradar'}}
                        <v-icon>mdi-open-in-new</v-icon>
                        </v-btn>
                                </span>
                        </template>
                        <span>{{$t('forms.warnings.complexMayBeMoreExpensive')}}</span>
                    </v-tooltip>
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
                                        :href="complexSS(cf.flights)"
                                        target="_blank"
                                >
                                    <v-list-item-icon class="mx-2">
                                        <v-icon>mdi-open-in-new</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>{{ $t('navigation.goTo') }} SKYSCANNER</v-list-item-title>
                                </v-list-item>
                                <v-list-item
                                        :href="complexKA(cf.flights)"
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
                </v-col>


            </v-row>
        </v-card-title>
    </v-card>
</template>

<script>
    import Vue from "vue";
    import Vue2Filters from "vue2-filters";
    import common from "../../common";
    import {mapGetters} from 'vuex';
    import AppConfig from "../../AppConfig";

    Vue.use(Vue2Filters);

    export default {
        name: "ComplexFlightCard",
        mixins: [Vue2Filters.mixin],
        data:() => ({
            apiUrl: AppConfig.apiUrl,
        }),
        methods: {
            historyLink: common.getLinkToHistory,
            complexAS: common.aviasalesComplexLink,
            complexSS: common.skyscannerComplexLink,
            complexKA: common.kayakComplexLink,
            ...mapGetters(['getLang']),
            getUniqCityNames() {
                let arr = [];
                this.cf['flights'].forEach(function(item) {
                    arr.push(item['origin_city_name']);
                    arr.push(item['destination_city_name']);
                });
                return Array.from(new Set(arr.slice(1,-1))).join(', ')
            },
            getUniqCountryNames() {
                let arr = [];
                this.cf['flights'].forEach(function(item) {
                    arr.push(item['origin_country_name']);
                    arr.push(item['destination_country_name']);
                });
                return Array.from(new Set(arr.slice(1,-1))).join(', ')
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
        props: {
            cf: Object
        }
    }
</script>

<style scoped>
    .imageWrapper {
        position: relative;
    }
    .overlayImage {
        position: absolute;
        top: 0;
        left: 0;
    }

</style>