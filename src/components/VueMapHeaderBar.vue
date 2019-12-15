<template>
    <div>
        <v-form
                ref="form"
                v-model="valid"
                :lazy-validation="false"
        >
        <v-row class="mx-2 pa-0" align="center">
            <v-col style="min-height: 104px">
                <OriginsAutocomplete></OriginsAutocomplete>
            </v-col>
            <v-col style="max-width: 20%">
                <v-dialog
                        ref="pickerMenu"
                        v-model="pickerMenu"
                        :close-on-content-click="false"
                        :return-value.sync="days"
                >
                    <template v-slot:activator="{ on }">
                        <v-combobox
                                v-model="days"
                                multiple
                                chips
                                :label="$i18n.t('forms.selectors.dates') || 'Date selector'"
                                v-on="on"
                                clearable
                                required
                                :rules="dateRules"
                        >
                            <template v-slot:selection="{ item, index }">
                                <v-chip v-if="index === 0"
                                        @click="pickerMenu = true"
                                >
                                    <span>{{ item }}</span>
                                </v-chip>
                                <span
                                        v-if="index === 1"
                                        class="grey--text caption"
                                        @click="pickerMenu = true"
                                >(+{{ $tc('otherDays', days.length - 1)}})</span>
                            </template>
                        </v-combobox>
                    </template>
                    <v-date-picker v-model="days"
                                   multiple
                                   :value="this.getSelectedSearchDays()"
                                   :locale="this.$i18n.locale"
                                   :min="new Date().toISOString().substr(0, 10)"
                                   :max="getMaxDate().toISOString().substr(0, 10)"
                    >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="pickerMenu = false">{{ $t('cancel') }}</v-btn>
                        <v-btn text color="primary" @click="$refs.pickerMenu.save(days)">{{ $t('save') }}</v-btn>
                    </v-date-picker>
                </v-dialog>
            </v-col>
            <v-col style="max-width: 10%">
                <v-switch
                        v-model="directOnly"
                        :label="this.$t('forms.switchers.directOnly')"
                ></v-switch>
            </v-col>
            <v-col style="max-width: 10%">
                <v-switch
                        v-model="visaFreeModel"
                        :disabled="this.getCitizenships().length == 0"
                        :label="this.$t('forms.switchers.visaFree')"
                ></v-switch>
            </v-col>
            <v-col style="max-width: 7%" >
                <v-btn :disabled="!(valid && (originsModel.length > 0))"
                       :loading="loading"
                       @click="this.searchMapData"
                       class="success">{{ $t('navigation.search') }}</v-btn>
            </v-col>
        </v-row>
        </v-form>
    </div>
</template>

<script>
    import OriginsAutocomplete from "@/components/OriginsAutocomplete";
    import i18n from "@/i18n";
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "VueMapHeaderBar",
        components: {OriginsAutocomplete},
        data: () => ({
            pickerMenu: false,
            days: [],
            valid: false,
            directOnly: false,
            loading: false,
            dateRules: [
                v => !!v || 'Dates is required',
                v => (v && v.length > 0) || i18n.t('forms.validations.selectAtLeastOneDay')]
        }),
        methods: {
            ...mapGetters(['getSelectedSearchDays', 'getAllMonthsStr', 'getCitizenships', 'getVisaFree',
                'getOriginItems']),
            ...mapActions(['setSearchDays', 'setMapFieldsSearchClicked', 'setVisaFree', 'fetchOneWayFlights']),
            getMaxDate() {
                let aYearFromNow = new Date();
                aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
                return aYearFromNow
            },
            async searchMapData() {
                this.loading = true;
                await this.fetchOneWayFlights({days: this.days, directOnly: this.directOnly});
                this.loading = false;
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
        mounted() {
            this.days = this.getSelectedSearchDays();
            if (this.days.length < 2) {

                let getDates = function(startDate, endDate) {
                    let dates = [],
                        currentDate = startDate,
                        addDays = function(days) {
                            let date = new Date(this.valueOf());
                            date.setDate(date.getDate() + days);
                            return date;
                        };
                    while (currentDate <= endDate) {
                        dates.push(currentDate);
                        currentDate = addDays.call(currentDate, 1);
                    }
                    return dates;
                };
                let today = new Date();
                let startDate = new Date();
                let endDate = new Date();
                startDate.setDate(today.getDate()+30);
                endDate.setDate(today.getDate()+35);
                let range = getDates(startDate, endDate);
                let range_str = range.map(x => x.toISOString().slice(0,10));
                this.days = range_str;
            }
            this.fetchOneWayFlights(this.days, this.directOnly);
        },
        // watch: {
        //     days(value) {
        //         console.log(value);
        //         this.setSearchDays(value)
        //     }
        // }
    }
</script>

<style scoped>

</style>