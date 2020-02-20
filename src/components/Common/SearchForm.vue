<template>
    <v-card class="mx-auto justify-center align-center" style="max-width: 85%" elevation="0">
        <v-card-title>{{ $t('forms.names.historySearchFromHeader')}}</v-card-title>
        <v-card-text>
            <v-form
                    ref="form"
                    v-model="valid"
            >
                <OriginsAutocomplete></OriginsAutocomplete>
                <DestinationAutocomplete></DestinationAutocomplete>
                <v-row>
                <v-col style="max-width: 26%">
                    <v-dialog
                            ref="outboundPickerMenu"
                            v-model="outboundPickerMenu"
                            :close-on-content-click="false"
                            :return-value.sync="outboundDays"
                    >
                        <template v-slot:activator="{ on }">
                            <v-combobox
                                    v-model="outboundDays"
                                    multiple
                                    chips
                                    :label="$i18n.t('forms.selectors.outboundDates') || 'Date selector outbound'"
                                    v-on="on"
                                    clearable
                                    :placeholder="$i18n.t('forms.selectors.fillDates')"
                                    :rules="[outboundDays.length > 0 || $i18n.t('forms.validations.requiredField')]"
                                    required
                            >
                                <template v-slot:selection="{ item, index }">
                                    <v-chip v-if="index === 0"
                                            @click="outboundPickerMenu = true"
                                    >
                                        <span>{{ item }}</span>
                                    </v-chip>
                                    <span
                                            v-if="index === 1"
                                            class="grey--text caption"
                                            @click="outboundPickerMenu = true"
                                    >(+{{ $tc('otherDays', outboundDays.length - 1)}})</span>
                                </template>
                            </v-combobox>
                        </template>
                        <v-date-picker v-model="outboundDays"
                                       multiple
                                       :value="this.getOutboundDates"
                                       @input="this.setOutboundDates"
                                       :first-day-of-week="1"
                                       :locale="this.$i18n.locale"
                                       :min="new Date().toISOString().substr(0, 10)"
                                       :max="getMaxDate().toISOString().substr(0, 10)"
                        >
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="outboundPickerMenu = false">{{ $t('cancel') }}</v-btn>
                            <v-btn text color="primary" @click="$refs.outboundPickerMenu.save(outboundDays)">{{ $t('save') }}</v-btn>
                        </v-date-picker>
                    </v-dialog>
                </v-col>

                <v-col style="max-width: 26%">
                    <v-dialog
                            ref="inboundPickerMenu"
                            v-model="inboundPickerMenu"
                            :close-on-content-click="false"
                            :return-value.sync="inboundDays"
                    >
                        <template v-slot:activator="{ on }">
                            <v-combobox
                                    v-model="inboundDays"
                                    multiple
                                    chips
                                    :label="$i18n.t('forms.selectors.inboundDates')"
                                    v-on="on"
                                    clearable
                                    :placeholder="oneWayOnly ? $i18n.t('flight.oneWay') : $i18n.t('forms.selectors.fillDates')"
                                    :disabled="oneWayOnly"
                                    :rules="[(inboundDays.length > 0 || oneWayOnly) ||  $i18n.t('forms.validations.requiredField')
                                    ]"
                                    required
                            >
                                <template v-slot:selection="{ item, index }">
                                    <v-chip v-if="index === 0"
                                            @click="inboundPickerMenu = true"
                                    >
                                        <span>{{ item }}</span>
                                    </v-chip>
                                    <span
                                            v-if="index === 1"
                                            class="grey--text caption"
                                            @click="inboundPickerMenu = true"
                                    >(+{{ $tc('otherDays', inboundDays.length - 1)}})</span>
                                </template>
                            </v-combobox>
                        </template>
                        <v-date-picker v-model="inboundDays"
                                       multiple
                                       :first-day-of-week="1"
                                       :locale="this.$i18n.locale"
                                       :min="new Date().toISOString().substr(0, 10)"
                                       :max="getMaxDate().toISOString().substr(0, 10)"
                        >
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="inboundPickerMenu = false">{{ $t('cancel') }}</v-btn>
                            <v-btn text color="primary" @click="$refs.inboundPickerMenu.save(inboundDays)">{{ $t('save') }}</v-btn>
                        </v-date-picker>
                    </v-dialog>
                </v-col>

                    <v-col style="max-width: 13%">
                        <v-switch
                                v-model="oneWayOnly"
                                :label="this.$t('forms.switchers.oneWayOnly')"
                        ></v-switch>
                    </v-col>
                    <v-col style="max-width: 13%">
                        <v-switch
                                v-model="directOnly"
                                :label="this.$t('forms.switchers.directOnly')"
                        ></v-switch>
                    </v-col>
                    <v-spacer style="max-width: 11%"></v-spacer>
                    <v-col style="max-width: 7%" class="ma-auto justify-end align-end">
                        <v-btn :disabled="!valid"
                               :loading="loading"
                               @click="sendFetchRequest()"
                               class="success">{{ $t('navigation.search') }}</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import OriginsAutocomplete from "../OriginsAutocomplete";
    import DestinationAutocomplete from "./DestinationAutocomplete";

    export default {
        name: "SearchForm",
        components: {OriginsAutocomplete, DestinationAutocomplete},
        data: function () {
            return {
                valid: false,
                outboundDays: [],
                outboundPickerMenu: false,
                inboundDays: [],
                inboundPickerMenu: false,
                directOnly: true,
                oneWayOnly: true,
                loading: false
            }},
        methods: {
            ...mapGetters(['getOutboundDates', 'getInboundDates', 'getCacheFlights', 'getOriginItems', 'getDestinationItems']),
            ...mapActions(['fetchPriceHistory', 'setOutboundDates', 'setInboundDates', 'fetchCachedFlights', 'setOneWayOnly',
            'fetchLiveCacheSearch', 'setOriginItems', 'setDestinationItems']),
            getMaxDate() {
                let aYearFromNow = new Date();
                aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
                return aYearFromNow
            },
            async sendFetchRequest() {
                this.loading = true;
                let priceHistoryRequest = this.fetchPriceHistory({outbound_dates: this.outboundDays,
                    inbound_dates: this.inboundDays,
                    direct_only: this.directOnly,
                    one_way: this.oneWayOnly
                });
                let cachedFlightsRequest = this.fetchCachedFlights({outbound_dates: this.outboundDays,
                    inbound_dates: this.inboundDays,
                    direct_only: this.directOnly,
                    one_way: this.oneWayOnly
                });
                await priceHistoryRequest;
                await cachedFlightsRequest;

                if (this.getCacheFlights().length === 0) {
                    await this.fetchLiveCacheSearch(
                        {
                            outboundDates: this.outboundDays,
                            inboundDates: this.inboundDays || [],
                            oneWay: this.oneWayOnly,
                        }
                    )
                }
                this.loading = false;
                // this.setUrlParams();
            },
            // async setUrlParams() {
            //     await this.$router.push({
            //         path: '/history',
            //         query: {
            //             origin: this.getOriginItems().map(e=>(e['place_code']))[0],
            //             destination: this.getDestinationItems().map(e=>(e['place_code']))[0],
            //             outboundDate: this.outboundDays[0],
            //             inboundDate: this.inboundDays[0],
            //             oneWay: this.oneWayOnly,
            //             directOnly: this.directOnly
            //         }
            //     }).catch(() => {})
            // }
        },
        async mounted() {
            if (Object.keys(this.$route.query).length === 0) {
                if (this.getOutboundDates().length) {
                    this.outboundDays = this.getOutboundDates()
                }
                if (this.getInboundDates().length) {
                    this.inboundDays = this.getInboundDates()
                }
                setTimeout(() => {
                    if (this.valid) {
                        this.sendFetchRequest()
                    }
                }, 2000);
                this.setOneWayOnly(this.oneWayOnly);
            } else {
                this.setOriginItems([{place_code: this.$route.query.origin,
                    place_name: this.$route.query.origin_name}]);
                this.setDestinationItems([{place_code: this.$route.query.destination,
                    place_name: this.$route.query.destination_name}]);
                this.outboundDays = [this.$route.query.outboundDays];
                this.inboundDays = this.$route.query.inboundDays ? [this.$route.query.inboundDays] : [];
                this.directOnly = this.$route.query.directOnly === '1';
                this.oneWayOnly = this.$route.query.oneWayOnly === '1';
                if (this.valid) {
                    this.sendFetchRequest()
                }
            }
        },
        watch: {
            outboundDays: {
                handler: function(newValue) {
                    this.setOutboundDates(newValue)
                },
                deep: true
            },
            inboundDays: {
                handler: function(newValue) {
                    this.setInboundDates(newValue)
                },
                deep: true
            },
            oneWayOnly(newValue) {
                // console.log(newValue);
                this.setOneWayOnly(newValue);
            }
        }
    }
</script>

<style scoped>

</style>