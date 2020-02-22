<template>
    <div>
        <v-form
                ref="form"
                v-model="valid"
                :lazy-validation="false"
        >
            <v-col class="mx-0 px-0">
                <v-row class="mx-2 pa-0" align="center" style="max-height: 55px">
                    <v-col style="min-height: 104px; max-height: 70%">
                        <OriginsAutocomplete></OriginsAutocomplete>
                    </v-col>
                    <v-col style="max-width: 20%">
                        <v-dialog
                                ref="tripDaysPickerMenu"
                                v-model="tripDaysPickerMenu"
                                :close-on-content-click="false"
                                :return-value.sync="tripDays"
                        >
                            <template v-slot:activator="{ on }">
                                <v-combobox
                                        v-model="tripDays"
                                        multiple
                                        chips
                                        :label="$i18n.t('forms.selectors.tripDateRange') || 'Date selector'"
                                        v-on="on"
                                        required
                                        :rules="[ (getRangeBetweenDates(tripDays[0], tripDays[1]).length >= 3)
                                    || $t('forms.warnings.minimum3Dates'),
                                    (getRangeBetweenDates(tripDays[0], tripDays[1]).length <= 30)
                                    || $t('forms.validations.maxRangeLength')
                                    ]"
                                >
                                    <template v-slot:selection="{ item, index }">
                                        <span
                                                v-if="index === 1"
                                                class="grey--text caption"
                                                @click="tripDaysPickerMenu = true"
                                        >
                                            <v-chip label>
                                                <v-icon left>mdi-calendar</v-icon>
                                                {{dateRangeText}}
                                            </v-chip>
                                        </span>
                                    </template>
                                </v-combobox>
                            </template>
                            <v-date-picker v-model="tripDays"
                                           range
                                           :first-day-of-week="1"
                                           :locale="this.$i18n.locale"
                                           :min="new Date().toISOString().substr(0, 10)"
                                           :max="getMaxDate().toISOString().substr(0, 10)"
                            >
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="tripDaysPickerMenu = false">{{ $t('cancel') }}</v-btn>
                                <v-btn text color="primary" @click="$refs.tripDaysPickerMenu.save(tripDays)">{{ $t('save') }}</v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-col>
                </v-row>
                <v-row class="mx-2 pa-0 align-center" align="center" style="max-height: 75px">
                    <v-col style="max-width: 40%">
                        <!--                    #bug https://github.com/vuetifyjs/vuetify/issues/6843-->
                        <v-range-slider
                                v-model="tripTotalDuration"
                                thumb-label="always"
                                min="3"
                                max="30"
                                :label="$t('forms.selectors.tripTotalDuration')"
                                hide-details
                        ></v-range-slider>
                    </v-col>

                    <v-col style="max-width: 30%">
                        <!--                    #bug https://github.com/vuetifyjs/vuetify/issues/6843-->
                        <v-range-slider
                                v-model="stopDurationDays"
                                thumb-label="always"
                                min="1"
                                max="15"
                                :label="$t('forms.selectors.intermediateStopsDays')"
                                hide-details
                        ></v-range-slider>
                    </v-col>

                    <v-col style="max-width: 14%">
                        <v-switch
                                v-model="directIntermediateFlights"
                                :label="$t('forms.switchers.directOnlySegments')"
                        ></v-switch>
                    </v-col>
                    <v-col style="max-width: 10%">
                        <v-switch
                                v-model="visaFree"
                                :label="this.$t('forms.switchers.visaFree')"
                        ></v-switch>
                    </v-col>
                    <v-col style="max-width: 20%;">
                        <v-select
                                v-model="selectedRadiusVariant"
                                :items="radiusVariants"
                                item-value="code"
                                item-text="name"
                                :label="$t('forms.selectors.radius')"
                        ></v-select>
                    </v-col>
                </v-row>

                <v-row class="mx-2 align-center" align="center" style="max-height: 55px">
                    <v-col style="max-width: 30%">
                        <IncludePlacesAutocomplete class="pa-0 ma-0"></IncludePlacesAutocomplete>
                    </v-col>

                    <v-col style="max-width: 63%">
                        <ExcludePlacesAutocomplete class="pa-0 ma-0"></ExcludePlacesAutocomplete>
                    </v-col>
                    <v-col style="max-width: 7%" class="align-end justify-end">
                        <v-btn :disabled="!(valid && (originsModel.length > 0))"
                               :loading="loading"
                               @click="handleSearchClick"
                               class="success">{{ $t('navigation.search') }}</v-btn>
                    </v-col>


                </v-row>
            </v-col>
        </v-form>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import OriginsAutocomplete from "../OriginsAutocomplete";
    import common from "../../common";
    import ExcludePlacesAutocomplete from "../Common/ExcludePlacesAutocomplete";
    import IncludePlacesAutocomplete from "../Common/IncludePlacesAutocomplete";
    export default {
        name: "ComplexFlightsHeader",
        components: {OriginsAutocomplete, ExcludePlacesAutocomplete, IncludePlacesAutocomplete},
        data: () => ({
            valid: false,
            tripDays: [
                (new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))).toISOString().substr(0, 10),
                (new Date(Date.now() + (34 * 24 * 60 * 60 * 1000))).toISOString().substr(0, 10)],
            tripDaysPickerMenu: false,
            visaFree: false,
            stopDurationDays: [4, 7],
            directIntermediateFlights: true,
            tripTotalDuration: [7, 15],
            stopDurationRange: [5, 10],
            // loading: false,
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
            price: 0,
            minPrice: 0,
            maxPrice: 200000,
        }),
        computed: {
            dateRangeText () {
                return this.tripDays.join(' ~ ')
            },
            originsModel: {
                get() {
                    return this.getOriginItems()
                }
            },
            loading: {
                get() {
                    return this.getLoading()
                }
            }
        },
        methods: {
            ...mapActions({fetchComplexFlights: 'fetchComplexFlights'}),
            ...mapGetters(['getOriginItems', 'getLoading']),
            getMaxDate() {
                let aYearFromNow = new Date();
                aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
                return aYearFromNow
            },
            getRangeBetweenDates: common.getRangeBetweenDates,
            async handleSearchClick() {
                this.tripTotalDuration.sort((a, b) => a - b);
                this.stopDurationRange.sort((a, b) => a - b);
                try {
                    this.fetchComplexFlights({
                        outboundRange: this.tripDays,
                        directIntermediateFlights: this.directIntermediateFlights,
                        tripTotalDuration: this.tripTotalDuration,
                        visaFree: this.visaFree,
                        stopDurationDays: this.stopDurationDays,
                        radius: this.selectedRadiusVariant
                    });
                } catch (e) {
                    console.log(e)
                }

            }
        },
        async mounted() {
            this.radiusVariants = this.radiusVariantsCodes.map(item => (
                {
                    "code": item,
                    "name": this.$t('forms.switchers.' + item)
                }));

            if (this.valid) {
                setTimeout(function () {
                    this.handleSearchClick();
                }.bind(this), 1000);
            }

        },
        watch: {
            tripDaysPickerMenu() {
                this.tripDays.sort()
            }
        }
    }
</script>

<style scoped>

</style>