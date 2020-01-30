<template>
    <div>
        <v-form
                ref="form"
                v-model="valid"
                :lazy-validation="false"
        >
            <v-col class="mx-0 px-0">
            <v-row class="mx-2 pa-0" align="center" style="max-height: 55px">
                <v-col style="min-height: 104px">
                    <OriginsAutocomplete></OriginsAutocomplete>
                </v-col>
                <v-col style="max-width: 20%">
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
                                    :placeholder="$i18n.t('forms.selectors.anytime')"
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

                <v-col style="max-width: 20%">
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
                                    :placeholder="$i18n.t('forms.selectors.anytime')"
                                    :disabled="oneWayOnly"
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
            </v-row>


            <v-row class="mx-2 pa-0" align="center" style="max-height: 50px" justify="center">
                <v-col style="max-width: 10%">
                    <v-switch
                            v-model="directOnly"
                            :label="this.$t('forms.switchers.directOnly')"
                    ></v-switch>
                </v-col>
                <v-col style="max-width: 10%">
                    <v-switch
                            v-model="visaFree"
                            :disabled="this.getCitizenships().length == 0"
                            :label="this.$t('forms.switchers.visaFree')"
                    ></v-switch>
                </v-col>
                <v-col style="max-width: 10%">
                    <v-switch
                            v-model="oneWayOnly"
                            :label="this.$t('forms.switchers.oneWayOnly')"
                    ></v-switch>
                </v-col>
                <v-col style="max-width: 49%">
                    <v-chip-group
                            v-model="selectedTags"
                            multiple
                            active-class="primary--text"
                            show-arrows
                    >
                        <v-chip
                                v-for="tag in tags"
                                :key="tag.id"
                                filter
                                outlined
                                :value="tag.id"
                        >{{ getLang() === 'ru' ? tag['title_ru'] : tag['title_en']}}</v-chip>
                    </v-chip-group>
                </v-col>
                <v-col style="max-width: 12%">
                    <v-select
                            v-model="orderBy"
                            :items="orderByOptions"
                            item-text="text"
                            item-value="code"
                            :label="this.$t('forms.names.order')"
                            :placeholder="this.$t('forms.choices.orderBy.price')"
                    ></v-select>
                </v-col>
                <v-col style="max-width: 7%" >
                    <v-btn :disabled="!(valid && (originsModel.length > 0))"
                           :loading="loading"
                           @click="getFlights"
                           class="success">{{ $t('navigation.search') }}</v-btn>
                </v-col>
            </v-row>
            </v-col>
        </v-form>

        <v-content>

            <SimpleFlightCard
                    v-for="(flight, index) in flights"
                    :key="index"
                    class="mx-2 pa-2 ma-2"
                    v-bind:index="index"
                    v-bind:flight="flight"
            ></SimpleFlightCard>

        </v-content>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import OriginsAutocomplete from "../OriginsAutocomplete";
    import SimpleFlightCard from "./SimpleFlightCard";

    export default {
        name: "SearchHeader",
        components: {OriginsAutocomplete, SimpleFlightCard},
        data: function () {
            return {
                valid: true,
                outboundDays: [],
                outboundPickerMenu: false,
                inboundDays: [],
                inboundPickerMenu: false,
                directOnly: false,
                oneWayOnly: false,
                visaFree: false,
                loading: false,
                orderBy: null,
                orderByOptions: [
                    {code: 'price', text: this.$i18n.t('forms.choices.orderBy.price')},
                    {code: 'price_per_km', text: this.$i18n.t('forms.choices.orderBy.pricePerKm')},
                ],
                tags: [],
                selectedTags: [],
                flights: [],
                lazyActive: true
        }},
        methods: {
            ...mapGetters(['getCitizenships', 'getOriginItems', 'getTags', 'getLang', 'getSimpleFlights']),
            ...mapActions(['setVisaFree', 'fetchTags', 'fetchSimpleFlights']),
            getMaxDate() {
                let aYearFromNow = new Date();
                aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
                return aYearFromNow
            },
            async getFlights() {
                this.loading = true;
                await this.fetchSimpleFlights({outbound_dates: this.outboundDays,
                    inbound_dates: this.inboundDays,
                    visa_free: this.visaFree,
                    direct_only: this.directOnly,
                    one_way: this.oneWayOnly,
                    order_by: this.orderBy,
                    tags: this.selectedTags
                });
                this.loading = false;
                this.flights = this.getSimpleFlights()
            }
        },
        computed: {
            visaFreeModel: {
                get() {
                    return this.getVisaFree()
                },
                set(value) {
                    this.setVisaFree(value)
                },
            },
            originsModel: {
                get() {
                    return this.getOriginItems()
                }
            },
        },
        async created() {
            await this.fetchTags();
            this.tags = this.getTags();
            this.selectedTags = this.getTags().filter(function(item) {
                return item['apply_by_default'] === true;
            }).map(item => item.id);
            if (this.getOriginItems().length) {
                await this.getFlights()
            } else {
                setTimeout(this.getFlights, 2000);
            }
        },
        async mounted() {
            this.orderByOptions = [
                {code: 'price', text: this.$i18n.t('forms.choices.orderBy.price')},
                {code: 'price_per_km', text: this.$i18n.t('forms.choices.orderBy.pricePerKm')},
            ]
        }
    }
</script>

<style scoped>

</style>