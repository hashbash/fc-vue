<template>
<v-card :key="index"
>
<!--    <div class="overline pa-0 ma-0">{{'#' + (index + 1) }}</div>-->
        <div class="d-flex flex-no-wrap justify-space-between">




            <div>
                <v-card-title
                        class="headline justify-start align-start"
                >
                    <span>{{flight.destination_country_name + ', ' + flight.destination_city_name}}</span>
                    <v-chip class="mx-2" onclick="">{{ flight['one_way'] === 1 ? '&#8677;' : '&#8644;'}}</v-chip>
                    <v-chip class="mx-2" onclick="">{{flight['carrier_names'].join(', ')}}</v-chip>
                    <v-chip :class="'pa-2 mx-1 ' + (flight['direct'] === 1 ? 'success' : 'warning')"
                            onclick=""
                    >{{ flight['direct'] === 1 ? $t('flight.direct') : $t('flight.withStops')}}</v-chip>

                </v-card-title>
                <v-card-text class="px-0 mx-4 pa-0">
                    <span>
                        {{flight['origin_city_name']}}
                    </span>
                    <span class="grey">{{flight['origin']}}</span>
                    <span>
                        {{ flight['one_way'] === 1 ? '&#8677;' : '&#8644;'}}
                    </span>
                    <span>
                        <span class="grey">{{flight['destination']}}</span>
                        <span>
                            {{flight['destination_city_name']}}
                        </span>
                    </span>
                </v-card-text>
                <v-card-text class="px-0 mx-4 pa-0">
                    <span>
                        {{flight['outbound_dt']}}
                    </span>
                    <span v-if="flight['one_way'] === 0">
                        <span>
                        {{ flight['one_way'] === 1 ? '&#8677;' : '&#8644;'}}
                        </span>
                        <span>
                        {{flight['inbound_dt']}}
                        </span>
                    </span>
                    <span>
                        •
                    </span>
                    <span :class="flight['one_way'] === 1 ? 'warning' : 'success'">
                        {{calculateDays(flight['outbound_dt'], flight['inbound_dt'], flight['one_way'])}}
                    </span>
                </v-card-text>
                <v-card-title>
                    <span>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">{{ flight['converted_price'] | currency(flight['converted_currency'], 0, { spaceBetweenAmountAndSymbol: true }) }}</span>
                            </template>
                            <span>{{ $t('flight.cached_at') }} {{ flight['processing_date'] }} (MSK)</span>
                        </v-tooltip>
                    </span>
                    <span class="px-5">
<!--                        <v-btn :href="linkK(flight)"-->
<!--                               target="_blank"-->
<!--                               class="mx-2 secondary"-->
<!--                               elevation="0"-->
<!--                        >KAYAK</v-btn>-->
<!--                        <v-btn  :href="linkSk(flight)"-->
<!--                                target="_blank"-->
<!--                                class="mx-2 secondary"-->
<!--                                elevation="0"-->
<!--                        >Skyscanner</v-btn>-->
                        <v-btn
                                class="primary mx-2"
                                elevation="6"
                                v-on:click="openAS(flight)"
                        >{{getLang() === 'ru' ? 'Aviasales' : 'Jetradar'}}</v-btn>

                        <v-menu>
                          <template v-slot:activator="{ on }">
                            <v-btn
                                    class="mx-2"
                                    v-on="on"
                                    icon
                                    elevation="6"
                            >
                              <v-icon>mdi-dots-horizontal</v-icon>
                            </v-btn>
                          </template>
                            <v-list dense>
                                <v-subheader>{{ $t('forms.names.aggregators') }}</v-subheader>
                                <v-list-item-group>
                                    <v-list-item
                                            v-on:click="openSk(flight)"
                                    >
                                        <v-list-item-icon class="mx-2">
                                            <v-icon>mdi-open-in-new</v-icon>
                                          </v-list-item-icon>
                                        <v-list-item-title>{{ $t('navigation.goTo') }} SKYSCANNER</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item
                                            v-on:click="openK(flight)"
                                    >
                                        <v-list-item-icon class="mx-2">
                                            <v-icon>mdi-open-in-new</v-icon>
                                          </v-list-item-icon>
                                        <v-list-item-title>{{ $t('navigation.goTo') }} KAYAK</v-list-item-title>
                                    </v-list-item>
                                </v-list-item-group>
                                <span v-if="this.getLang() === 'ru'">
                                <v-subheader>Оплата банковскими милями</v-subheader>
                                <v-list-item-group>
                                    <v-list-item
                                            v-on:click="openAT(flight)"
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
                    </v-card-title>
            </div>

            <v-avatar
                    class="ma-0"
                    size="160"

            >
                <v-img :src="apiUrl + `/image/airports?id=${flight.destination}`"></v-img>
            </v-avatar>
        </div>
</v-card>
</template>

<script>
    import AppConfig from "@/AppConfig";
    import Vue2Filters from "vue2-filters";
    import Vue from "vue";
    import common from "../../common";
    import {mapGetters} from 'vuex';
    Vue.use(Vue2Filters);

    export default {
        name: "SimpleFlightCard",
        mixins: [Vue2Filters.mixin],
        data:() => ({
            apiUrl: AppConfig.apiUrl,
        }),
        methods: {
            ...mapGetters(['getLang']),
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
            linkSk(flight) {
                return common.skyscannerLink(flight)
            },
            async openAS(flight) {
                common.logEvent('click_on_flight', flight);
                let link = common.aviasalesLink(flight);
                window.open(link, '_blank')
            },
            linkAS(flight) {
                return common.aviasalesLink(flight)
            },
            async openK(flight) {
                common.logEvent('click_on_flight', flight);
                let link = common.kayakLink(flight);
                window.open(link, '_blank')
            },
            linkK(flight) {
                return common.kayakLink(flight)
            },
            async openAT(flight) {
                common.logEvent('click_on_flight', flight);
                let link = common.travelAlfabankLink(flight);
                window.open(link, '_blank')
            },
            linkAT(flight) {
                return common.travelAlfabankLink(flight)
            },
        },
        props: {
            flight: Object,
            index: Number
        }
    }
</script>

<style scoped>

</style>