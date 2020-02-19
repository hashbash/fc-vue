<template>
<v-card class="mx-auto justify-center align-center" style="max-width: 85%" elevation="0"
>
    <v-card-title>{{$t('forms.names.complexFLightsCombinator')}}</v-card-title>
    <v-card-text>
        <v-form
                ref="form"
                v-model="valid"
        >
            <div>
            <OriginsAutocomplete></OriginsAutocomplete>
            <DestinationAutocomplete></DestinationAutocomplete>
            </div>
            <v-row dense style="max-height: 85px">
                <v-col style="max-width: 21%">
                    <v-menu
                            v-model="outboundRangeMenu"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                    v-model="outboundRangeText"
                                    v-on="on"
                                    readonly
                                    :label="$t('forms.selectors.outboundDatesRange')"
                                    required
                                    :rules="[ Array.from(new Set(outboundRange || [])).length > 1
                                    || $t('forms.warnings.minimumTwoDates'),
                                    (getRangeBetweenDates(outboundRange[0], outboundRange[1]).length <= 30)
                                    || $t('forms.validations.maxRangeLength')
                                    ]"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                                v-model="outboundRange"
                                range
                                :min="minOutboundDate"
                                :max="maxOutboundDate"
                                first-day-of-week="1"
                                :locale="this.getLang()"
                        >
                        </v-date-picker>
                    </v-menu>
                </v-col>
<!--                -->
                <v-col style="max-width: 21%">
                    <v-menu
                            v-model="inboundRangeMenu"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                            :disabled="oneWay"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                    v-model="inboundRangeText"
                                    v-on="on"
                                    readonly
                                    :label="oneWay ? $t('flight.oneWay') : $t('forms.selectors.inboundDatesRange')"
                                    required
                                    :disabled="oneWay"
                                    :rules="[ (Array.from(new Set(inboundRange || [])).length > 1 || oneWay)
                                    || $t('forms.warnings.minimumTwoDates'),
                                    (outboundRange[0] < inboundRange[0] || oneWay) || $t('forms.validations.dateOverlapping'),
                                    (getRangeBetweenDates(inboundRange[0], inboundRange[1]).length <= 30)
                                    || $t('forms.validations.maxRangeLength')
                                    ]"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                                v-model="inboundRange"
                                range
                                :min="minInboundDate"
                                :max="maxInboundDate"
                                first-day-of-week="1"
                                :locale="this.getLang()"
                        >
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col style="max-width: 14%">
                    <v-switch
                            v-model="oneWay"
                            :label="this.$t('forms.switchers.oneWayOnly')"
                    ></v-switch>
                </v-col>
                <v-spacer style="max-width: 7.4%"></v-spacer>
                <v-col  style="max-width: 40%" class="pa-7 align-end justify-end">
                    <v-slider
                            v-model="price"
                            :max="maxPrice"
                            :min="minPrice"
                            :rules="[(price > 0) || $t('forms.warnings.maxPrice')]"
                            :label="$t('forms.numbers.maxPrice') + ', ' + this.getCurrency"
                            inverse-label
                            thumb-size="50"
                            thumb-label="always"
                            class="align-center align-sm-center"
                    >
                    </v-slider>
                </v-col>
            </v-row>

            <v-divider></v-divider>
            <v-subheader class="overline pa-0" style="max-height: 30px">{{$t('forms.names.intermediateStops')}}</v-subheader>
            <v-row dense class="justify-start align-center">
                <v-col style="max-width: 30%">
<!--                    #bug https://github.com/vuetifyjs/vuetify/issues/6843-->
                    <v-range-slider
                            v-model="stopDurationDays"
                            thumb-label="always"
                            min="1"
                            max="10"
                            :label="$t('forms.selectors.intermediateStopsDays')"
                            hide-details
                    ></v-range-slider>
                </v-col>
                <v-col style="max-width: 18%">
                    <v-switch
                            v-model="directIntermediateFlights"
                            :label="$t('forms.switchers.directOnlySegments')"
                    ></v-switch>
                </v-col>
                <v-col style="max-width: 18%">
                    <v-switch
                            v-model="visaFree"
                            :label="this.$t('forms.switchers.visaFreeSegments')"
                    ></v-switch>
                </v-col>
                <v-col>
                    <ExcludePlacesAutocomplete class="pa-0 ma-0"></ExcludePlacesAutocomplete>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col style="max-width: 20%">
                    <v-select
                            v-model="selectedRadiusVariant"
                            :items="radiusVariants"
                            item-value="code"
                            item-text="name"
                            :label="$t('forms.selectors.radius')"
                    ></v-select>
                </v-col>
                <v-col style="max-width: 20%">
                    <v-select
                            v-model="selectedComplexFlightsSchemas"
                            :items="complexFlightsSchemas"
                            item-text="code"
                            item-value="code"
                            multiple
                            :rules="[selectedComplexFlightsSchemas.length > 0 || 'Select at least one rule']"
                            required
                            :label="$t('forms.selectors.complexFlightSchema')"
                    >
                        <template v-slot:selection="{ item, index }">
                            <v-chip v-if="index === 0" small>
                                <span>
                                    <span v-if="selectedComplexFlightsSchemas.length === complexFlightsSchemas.length">
                                        {{$t('forms.messages.all')}}
                                    </span>
                                    <span v-else="">{{ item.code }}</span>
                                </span>
                            </v-chip>
                            <span
                                    v-if="(index === 1) &&
                                    (selectedComplexFlightsSchemas.length !== complexFlightsSchemas.length)"
                                    class="grey--text caption"
                            >(+{{$tc('otherDays', selectedComplexFlightsSchemas.length - 1)}})</span>
                        </template>
                    </v-select>
                </v-col>
                <v-col style="max-width: 20%">
                    <v-select
                            v-model="selectedPriceChangeRule"
                            :items="priceChangeRules"
                            item-value="code"
                            item-text="text"
                            :label="$t('forms.selectors.priceMinimizeRule')"
                    ></v-select>
                </v-col>
                <v-spacer style="max-width: 44%"></v-spacer>
                <v-col style="max-width: 7%" class="ma-auto justify-end align-end">
                    <v-btn :disabled="!valid"
                           :loading="loading"
                           @click="handleClick"
                           class="success">{{ $t('navigation.search') }}</v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-card-text>
</v-card>
</template>

<script>
    import OriginsAutocomplete from "../OriginsAutocomplete";
    import DestinationAutocomplete from "../Common/DestinationAutocomplete";
    import common from "../../common";
    import ExcludePlacesAutocomplete from "../Common/ExcludePlacesAutocomplete";
    import {mapGetters, mapActions} from 'vuex';

    export default {
        name: "CombinatorSearchForm",
        components: {OriginsAutocomplete, DestinationAutocomplete,
            ExcludePlacesAutocomplete
        },
        data: () => ({
            valid: false,
            outboundRange: [],
            outboundRangeMenu: false,
            inboundRange: [],
            inboundRangeMenu: false,
            oneWay: true,
            stopDurationRange: [1, 10],
            price: 0,
            minPrice: 0,
            maxPrice: 200000,
            minOutboundDate: new Date().toISOString().substr(0, 10),
            maxOutboundDate: common.getMaxDateISO(),
            minInboundDate: new Date().toISOString().substr(0, 10),
            maxInboundDate: common.getMaxDateISO(),
            priceChangeRules: [],
            selectedPriceChangeRule: undefined,
            visaFree: false,
            stopDurationDays: [],
            directIntermediateFlights: true,
            radiusIndex: 1,
            radiusVariants: [],
            radiusVariantsCodes: [
                "same_airport",
                "same_city",
                "200km",
                "400km",
                "600km"
            ],
            selectedRadiusVariant: "same_city",
            complexFlightsSchemas: [],
            selectedComplexFlightsSchemas: [],
            loading: false
        }),
        methods: {
            ...mapActions(['fetchLiveCacheSearch', 'setLoading', 'fetchCombinatorFlights', 'clearCombinatorFlights']),
            ...mapGetters(['getMaxPriceForCurrency', 'getComplexSchemas', 'getLang', 'getCombinatorFlightsBySchema',
            'getOutboundDateRange', 'getInboundDateRange', 'getCacheFlights', 'getLoading']),
            ...mapActions(['fetchComplexSchemas', 'setOutboundDateRange', 'setInboundDateRange', 'fetchCachedFlights']),
            getRangeBetweenDates: common.getRangeBetweenDates,
            async sendFetchRequest() {
                this.outboundRange.sort();
                let outboundDates = common.getRangeBetweenDates(
                    this.outboundRange[0],
                    this.outboundRange[1]
                );
                let inboundDates = [];
                if (this.inboundRange) {
                    this.inboundRange.sort();
                    inboundDates = common.getRangeBetweenDates(
                        this.inboundRange[0],
                        this.inboundRange[1]
                    );
                }

                let fetchCachedPromise = this.fetchCachedFlights({
                    outbound_dates: outboundDates,
                    inbound_dates: inboundDates,
                    direct_only: false,
                    one_way: this.oneWay
                });
                await fetchCachedPromise;
                if (this.getCacheFlights().length === 0) {
                    let fetchLiveCachedPromise = this.fetchLiveCacheSearch({
                        outboundDates: outboundDates,
                        inboundDates: inboundDates,
                        oneWay: this.oneWay
                    });
                    await fetchLiveCachedPromise;
                }
                // else if (this.getCacheFlights().length > 0 && this.selectedPriceChangeRule === 'minimize_after_step'
                // ) {
                //     let arr = this.getCacheFlights();
                //     arr.sort((a, b) => (a.price - b.price));
                //     this.price = arr[0]['converted_price_rounded'] || this.getMaxPriceForCurrency();
                // }
            },
            async sendFetchCombinatorFlights() {
                this.clearCombinatorFlights();
                for (let cfs in this.selectedComplexFlightsSchemas) {
                    try {
                        let i = this.selectedComplexFlightsSchemas[cfs];
                        let schemaValue = undefined;
                        let oneWaySchema = undefined;
                        if (typeof i === 'string') {
                            schemaValue = i;
                            oneWaySchema = this.complexFlightsSchemas.filter(function(el) {
                                return el.code === i
                            })[0].one_way
                        } else if (typeof i === 'object') {
                            schemaValue = i.code;
                            oneWaySchema = i.one_way;
                        }
                        if (oneWaySchema === this.oneWay) {
                            await this.fetchCombinatorFlights({
                                outboundRange: this.outboundRange,
                                inboundRange: this.inboundRange,
                                oneWay: this.oneWay,
                                directIntermediateFlights: this.directIntermediateFlights,
                                visaFreeSegments: this.visaFree,
                                stopDurationDays: this.stopDurationDays,
                                maxPrice: this.price,
                                radius: this.selectedRadiusVariant,
                                flightSchema: schemaValue
                            });
                            await new Promise(r => setTimeout(r, 2000));
                            if (this.getCombinatorFlightsBySchema()(schemaValue).length > 0 && this.selectedPriceChangeRule === 'minimize_after_step'
                                ) {
                                    let arr = this.getCombinatorFlightsBySchema()(schemaValue);
                                    arr.sort((a, b) => (a['total_price'] - b['total_price']));
                                    this.price = arr[0]['total_price_converted'] || this.getMaxPriceForCurrency();
                                }
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            },
            async handleClick() {
                this.setLoading(true);
                this.loading = true;

                await this.sendFetchRequest();
                await this.sendFetchCombinatorFlights();

                setTimeout(function () {
                    this.setLoading(false);
                    this.loading = false;
                }.bind(this), 500);
            }
        },
        computed: {
            ...mapGetters(['getCurrency']),
            outboundRangeText () {
                return Array.from(new Set(Array.prototype.slice.call(this.outboundRange))).sort().join(' ~ ')
            },
            inboundRangeText () {
                return Array.from(new Set(Array.prototype.slice.call(this.inboundRange))).sort().join(' ~ ')
            },
        },
        async mounted() {
            this.priceChangeRules = [
                {code: 'fixed', text: this.$t('forms.choices.priceChanges.fixed') },
                {code: 'minimize_after_step', text: this.$t('forms.choices.priceChanges.minimize_after_step')}
            ];
            this.selectedPriceChangeRule = 'minimize_after_step';
            let complexSchemasPromise = this.fetchComplexSchemas();
            this.maxPrice = this.getMaxPriceForCurrency();
            this.price = this.maxPrice;
            this.stopDurationDays = [1, 4];
            this.radiusVariants = this.radiusVariantsCodes.map(item => (
                {
                    "code": item,
                    "name": this.$t('forms.switchers.' + item)
                }));
            await complexSchemasPromise;
            this.complexFlightsSchemas = this.getComplexSchemas();
            this.selectedComplexFlightsSchemas = this.complexFlightsSchemas;
            this.outboundRange = this.getOutboundDateRange();
            this.inboundRange = this.getInboundDateRange();
        },
        watch: {
            getCurrency(newValue, oldValue) {
                if (newValue !== oldValue) {
                    this.maxPrice = this.getMaxPriceForCurrency()
                }
            },
            outboundRange: {
                handler(newValue) {
                    if (newValue) {
                        this.setOutboundDateRange(Array.prototype.slice.call(newValue).sort());
                    }
                },
                deep: true
            },
            inboundRange: {
                handler(newValue) {
                    if (newValue) {
                        this.setInboundDateRange(Array.prototype.slice.call(newValue).sort());
                    }
                },
                deep: true
            },
        }
    }
</script>

<style scoped>

</style>