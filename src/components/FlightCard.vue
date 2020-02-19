<template>
    <v-flex class="my-2 mx-auto ">
        <v-card width="200" height="424"
                class="ma-4 "
                @click="overlay = !overlay"
        >
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="headline">{{ flight.destination_city_name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ flight.destination_country_name }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <template>
                <v-img
                        :src="apiUrl + `/image/airports?id=${flight.destination}`"
                        lazy-src="../assets/logo.svg"
                        height="150px"
                        weight="150px"
                >
                </v-img>
            </template>
            <template>
                <v-card-text>
                    <div>
                        <div class="caption">{{flight.origin}} ✈ {{ flight.destination }} {{calculateDays(flight.outbound_dt, flight.inbound_dt,
                            flight.one_way)}}</div>
                        <div class="caption">
                            {{ flight.outbound_dt }}
                        </div>
                    </div>
                    <v-chip-group column class="v-size--x-small" disabled="true">
                        <v-chip v-if="Boolean(Number(flight.one_way))" key="one_way" disabled small>{{ $t('flight.oneWay') }}</v-chip>
                        <v-chip v-if="!Boolean(Number(flight.one_way))" key="one_way" disabled small>{{ $t('flight.roundTrip') }}</v-chip>
                        <v-chip v-if="Boolean(Number(flight.direct))" key="direct" small disabled>{{ $t('flight.direct') }}</v-chip>
                    </v-chip-group>
                </v-card-text>
                <v-card-actions class="justify-center align-content-end card-actions">
                    <v-btn
                            class="primary"
                    >{{ flight.price | currency(flight.currency, 0, { spaceBetweenAmountAndSymbol: true }) }}</v-btn>
                </v-card-actions>
            </template>
            <v-overlay
                    absolute
                    :value="overlay"
            >
                <v-container fluid class="mx-auto">
                    <v-row>
                        <v-col class="text-center" cols="12">
<!--                            kayak-->
                            <div class="my-2">
                                <v-btn :href="kayakLink(flight.origin_city_iata, flight.destination_city_iata,
                                                        flight.outbound_dt, flight.inbound_dt)"
                                       target="_blank"
                                       class="secondary"
                                       outlined
                                       style="opacity: 90%"
                                       block
                                       @click="overlay=!overlay"
                                >
                                    <v-col>
                                        <div>
                                            <v-row style="font-size: x-small">
                                                <span>{{$t('navigation.goTo')}}</span>
                                            </v-row>
                                            <v-row>
                                                <span>Kayak     </span>
                                            </v-row>
                                        </div>
                                    </v-col>
                                    <v-col>
                                        <v-row class="justify-end">
                                            <v-icon right>mdi-open-in-new</v-icon>
                                        </v-row>
                                    </v-col>
                                </v-btn>
                            </div>
<!--                            skyscanner-->
                            <div class="my-2">
                                <v-btn :href="skyscannerLink(flight.origin_city_id, flight.destination_city_id,
                                                             flight.outbound_dt, flight.inbound_dt)"
                                       target="_blank"
                                       class="secondary"
                                       outlined
                                       style="opacity: 90%"
                                       block
                                       @click="overlay=!overlay"
                                >
                                    <v-col>
                                        <div>
                                            <v-row style="font-size: x-small">
                                                <span>{{$t('navigation.goTo')}}</span>
                                            </v-row>
                                            <v-row class="justify-center">
                                                <span>Skyscanner</span>
                                            </v-row>
                                        </div>
                                    </v-col>
                                    <v-col>
                                        <v-row class="justify-end">
                                        <v-icon right>mdi-open-in-new</v-icon>
                                        </v-row>
                                    </v-col>
                                </v-btn>
                            </div>
                            <div class="my-2">
                                <v-btn target="_blank"
                                       class="primary"
                                       outlined
                                       block
                                       @click="overlay=!overlay"
                                       :href="aviasalesLink(flight.origin_city_iata, flight.destination_city_iata,
                                                            flight.outbound_dt, flight.inbound_dt)"
                                >
                                    <v-col>
                                    <div>
                                        <v-row style="font-size: x-small">
                                            <span>{{$t('navigation.goTo')}}</span>
                                        </v-row>
                                        <v-row class="justify-center">
                                            <span>{{getLang() === 'ru' ? 'Aviasales' : 'Jetradar'}}</span>
                                        </v-row>
                                    </div>
                                    </v-col>

                                    <v-col>
                                        <v-row class="justify-end">
                                            <v-icon right>mdi-open-in-new</v-icon>
                                        </v-row>
                                    </v-col>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>

                    <v-col class="align-end">
                        <v-row>
                            <div class="justify-end align-content-end text-center">
                                <v-icon>mdi-history</v-icon>
                                <span class="caption"> {{ $t('cacheAge.'+ cacheAge(flight['cache_age_hours'])) }}</span>
                            </div>
                        </v-row>
                        <v-row>
                            <v-sheet height="30"></v-sheet>
                        </v-row>
                    <v-row class="justify-center">
                        <v-icon>mdi-close</v-icon>
                    </v-row>
                    </v-col>
                </v-container>
            </v-overlay>
        </v-card>
    </v-flex>
</template>

<script>
import {mapGetters} from 'vuex';
import Vue2Filters from "vue2-filters";
import AppConfig from "@/AppConfig";
import Vue from "vue";
Vue.use(Vue2Filters);

export default {
    name: "FlightCard",
    mixins: [Vue2Filters.mixin],
    data:() => ({
        apiUrl: AppConfig.apiUrl,
        toggle: null,
        active: false,
        overlay: false
    }),
    methods: {
        ...mapGetters(['getLang']),
        cacheAge(age) {
            if (age < 6) {
                return '6'
            } else if (age < 12) {
                return '12'
            } else if (age < 24) {
                return '24'
            } else if (age < 48) {
                return '48'
            } else {
                return 'more_that_48'
            }
        },
        calculateDays(outbound, inbound, one_way) {
            if (!one_way) {
                let date1 = new Date(outbound);
                let date2 = new Date(inbound);
                let timeDiff = Math.abs(date2.getTime() - date1.getTime());
                let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                return " • " + this.$i18n.tc('flight.days', diffDays);
            }
        },
        skyscannerLink(origin_city_id, destination_city_id, outbound, inbound) {
            let link_arr = [
                "https://www.skyscanner.ru/transport/flights",
                origin_city_id,
                destination_city_id,
                outbound,
                inbound
            ];
            return link_arr.join("/");
        },
        aviasalesLink(origin_city_iata, destination_city_iata, outbound, inbound) {
            let url = 'https://www.jetradar.com/';
            if (this.getLang() === 'ru') {
                url = 'https://www.aviasales.ru/'
            }
            url += '?marker=201249';
            url += `&origin_iata=${origin_city_iata}`;
            url += `&destination_iata=${destination_city_iata}`;
            url += `&depart_date=${outbound}`;
            if (inbound) {
                url += `&return_date=${inbound}`;
            }
            url += '&with_request=true';
            url += `&locale=${this.getLang()}`;
            url += `&currency=${this.getCurrency.toLowerCase()}`;
            return url
        },
        kayakLink(origin_city_iata, destination_city_iata, outbound, inbound) {
            let url = 'https://www.kayak.com/flights/';
            url += `${origin_city_iata}-${destination_city_iata}/`;
            url += outbound;
            url += '/';
            url += inbound;
            return url
        }
    },
    computed: {
        ...mapGetters(['getCurrency']),
    },
    props: {
        flight: Object
    }
}
//
// target="_blank"
</script>

<style scoped>
    .flexcard {
        flex-direction: column;
    }
    .card-outer {
        position: relative;
        padding-bottom: 50px;
    }
    .card-actions {
        position: absolute;
        bottom: 0;
        margin: 50;
    }
</style>