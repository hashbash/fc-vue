<template>
    <v-flex class="my-2 mx-auto ">
        <v-card width="258" height="424"
                class="ma-4 "
                @click="overlay = !overlay"
        >
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="headline">
                        {{ Array.from(new Set([flight.f1_destination_city_name, flight.a_origin_city_name,
                            flight.a_destination_city_name, flight.f2_origin_city_name])).join(' + ') }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ Array.from(new Set([flight.f1_destination_country_name,
                        flight.a_origin_country_name, flight.a_destination_country_name,
                        flight.f2_origin_country_name])).join(' + ') }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <template>
            <div>
                <VueCompareImage
                :leftImage="apiUrl + `/image/airports?id=${flight.f1_destination}`"
                :rightImage="apiUrl + `/image/airports?id=${flight.f2_origin}`"
                hover
                :sliderLineWidth="3"
                :handleSize="20"
                class="card-image-custom"
                />
            </div>
            </template>

            <template>
                <v-card-text>
                    <div class="headline caption">
                        <v-col>
                            <v-row>
                                <div class="caption d-inline-block text-truncate" style="max-width: 70%;">{{flight.origin_city_name}} ✈ {{ flight.f1_destination_city_name }}</div>
                                <v-spacer></v-spacer>
                                <div class="caption">{{flight.f1_outbound_dt}}</div>
                            </v-row>
                            <v-row>
                                <div class="caption d-inline-block text-truncate" style="max-width: 70%;">{{flight.a_origin_city_name}} ✈ {{ flight.a_destination_city_name }}</div>
                                <v-spacer></v-spacer>
                                <div class="caption">{{flight.a_outbound_dt}}</div>
                            </v-row>
                            <v-row>
                                <div class="caption d-inline-block text-truncate" style="max-width: 70%;">{{flight.f2_origin_city_name}} ✈ {{ flight.f2_destination_city_name }}</div>
                                <v-spacer></v-spacer>
                                <div class="caption">{{flight.f2_outbound_dt}}</div>
                            </v-row>
                        <div class="caption">
                            {{ flight.outbound_dt }}
                        </div>
                        </v-col>
                    </div>
                    <v-chip-group column class="v-size--x-small" disabled="true">
                        <v-chip key="complex" disabled small>{{ $t('flight.complex')}}</v-chip>
                        <v-chip key="complex-city-count" disabled small>
                            {{ $tc('flight.city_count', this.cityCount())}}
                        </v-chip>
                    </v-chip-group>
                </v-card-text>
                <v-card-actions >
                    <v-btn
                            class="primary"
                    >{{ flight['total_price'] | currency(flight.f1_currency, 0, { spaceBetweenAmountAndSymbol: true }) }}
                    </v-btn>
                    <v-spacer></v-spacer>
                    <div>
                            <v-row>
                                <v-subheader class="">{{ $tc('flight.complex_price', 3) }}</v-subheader>
                            </v-row>
                    </div>
                </v-card-actions>
            </template>
            <template>
            <v-overlay
                    absolute
                    :value="overlay"
                    opacity="0.9"
            >
                <v-container fluid class="mx-auto">
                    <v-list dense>
                        <v-subheader>Skyscanner</v-subheader>
                        <v-list-item-group v-model="item">
                            <v-list-item
                                    v-for="(item, i) in this.getComplexFlightData()"
                                    :key="i"
                                    :href="skyscannerLink(item.origin_city_id, item.destination_city_id, item.outbound_dt)"
                                    target="_blank"
                                    @click="overlay = !overlay"
                            >
                                <v-list-item-icon>
                                    <v-icon v-text="'mdi-open-in-new'"></v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{item.origin_city_name + ' - ' + item.destination_city_name }}</v-list-item-title>
                                    <v-list-item-title class="caption">{{item['price'] | currency(flight.f1_currency, 0, { spaceBetweenAmountAndSymbol: true })}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                        <v-subheader>Aviasales</v-subheader>
                        <v-list-item-group v-model="item" color="primary">
                            <v-list-item
                                    v-for="(item, i) in this.getComplexFlightData()"
                                    :key="i"
                                    :href="aviasalesLink(item.origin_city_iata, item.destination_city_iata, item.outbound_dt)"
                                    target="_blank"
                                    @click="overlay = !overlay"
                            >
                                <v-list-item-icon>
                                    <v-icon v-text="'mdi-open-in-new'"></v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{item.origin_city_name + ' - ' + item.destination_city_name }}</v-list-item-title>
                                    <v-list-item-title class="caption">{{item['price'] | currency(flight.f1_currency, 0, { spaceBetweenAmountAndSymbol: true })}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-container>
            </v-overlay>
            </template>
        </v-card>
    </v-flex>
</template>

<script>
    import {mapGetters} from 'vuex';
    import Vue2Filters from "vue2-filters";
    import AppConfig from "@/AppConfig";
    import Vue from "vue";
    Vue.use(Vue2Filters);
    import VueCompareImage from 'vue-compare-image';

    export default {
        name: "ComplexFlightCard",
        mixins: [Vue2Filters.mixin],
        components: { VueCompareImage },
        data:() => ({
            apiUrl: AppConfig.apiUrl,
            toggle: null,
            active: false,
            overlay: false,
            overlaySkyscannerItem: 1,
            overlayAviasalesItem: 1,
            item: 1
        }),
        methods: {
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
            cityCount() {
                let cities = [this.flight.f1_destination_city_name,
                    this.flight.a_origin_city_name,
                    this.flight.a_destination_city_name,
                    this.flight.f2_origin_city_name];
                let uniq = Array.from(new Set(cities));
                return uniq.length
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
                let url = 'https://www.aviasales.com/';
                if (this.getLang === 'ru') {
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
                url += `&locale=${this.getLang}`;
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
            },
            getComplexFlightData() {
                let res = [];
                res.push({
                    origin_city_name: this.flight.origin_city_name,
                    origin_city_iata: this.flight.origin_city_iata,
                    origin_city_id: this.flight.origin_city_id,
                    destination_city_name: this.flight.f1_destination_city_name,
                    destination_city_iata: this.flight.f1_destination_city_iata,
                    destination_city_id: this.flight.f1_destination_city_id,
                    outbound_dt: this.flight.f1_outbound_dt,
                    price: this.flight.f1_price
                });
                res.push({
                    origin_city_name: this.flight.a_origin_city_name,
                    origin_city_iata: this.flight.a_origin_city_iata,
                    origin_city_id: this.flight.a_origin_city_id,
                    destination_city_name: this.flight.a_destination_city_name,
                    destination_city_iata: this.flight.a_destination_city_iata,
                    destination_city_id: this.flight.a_destination_city_id,
                    outbound_dt: this.flight.a_outbound_dt,
                    price: this.flight.a_price
                });
                res.push({
                    origin_city_name: this.flight.f2_origin_city_name,
                    origin_city_iata: this.flight.f2_origin_city_iata,
                    origin_city_id: this.flight.f2_origin_city_id,
                    destination_city_name: this.flight.f2_destination_city_name,
                    destination_city_iata: this.flight.f2_destination_city_iata,
                    destination_city_id: this.flight.f2_destination_city_id,
                    outbound_dt: this.flight.f2_outbound_dt,
                    price: this.flight.f2_price
                });
                return res
            }
        },
        computed: {
            ...mapGetters(['getLang', 'getCurrency']),
        },
        props: {
            flight: Object
        }
    }
    //
    // target="_blank"
</script>

<style scoped>
    .card-actions {
        position: absolute;
        bottom: 0;
        margin: 50;
    }
    .card-image-custom {
        max-height: 140px;
        min-height: 140px;
    }
</style>