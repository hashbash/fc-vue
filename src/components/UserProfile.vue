<template>
    <v-lazy :key="userMenuKey">
    <div class="text-center">
        <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-width="200"
                class="overflow-y-auto"
                max-height="800"
        >
            <template v-slot:activator="{ on }">
                <v-btn icon
                        v-on="on"
                >
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </template>

            <v-card>
                <v-list>
                    <v-list-item>
                        <v-list-item-avatar>
                            <v-icon>mdi-duck</v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title>{{ $t('user.unknownUser') }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>
                <v-list v-if="$route.path != '/map'">
                    <v-list-item>
                        <OriginsAutocomplete></OriginsAutocomplete>
                    </v-list-item>
                </v-list>

                <v-list>
                    <v-list-item>
                        <v-autocomplete
                                :key="citizenshipsKey"
                                :items="this.getAllCountries()"
                                :value="this.getCitizenships()"
                                item-text="name"
                                item-value="id"
                                :label="this.$i18n.t('user.citizenship') || 'Citizenship'"
                                @input="this.setCitizenships"
                                multiple
                                @change="citizenshipsKey++"
                                clearable
                        >
                            <!--                                menu-props="auto"  // poor performance-->
                        </v-autocomplete>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-action>
                            <v-switch
                                    v-model="visaFreeModel"
                                    :disabled="this.getCitizenships().length == 0"
                            ></v-switch>
                        </v-list-item-action>
                        <v-list-item-title>{{ $t('user.visaFree') }}</v-list-item-title>
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                    <v-list-item>
                        <v-select
                                :items="this.getAllLangs().map(function(item) {
                                    return {
                                        'code': item,
                                        'value': $i18n.t('user.langName.'+item)}
                                })"
                                :value="this.getLang()"
                                item-text="value"
                                item-value="code"
                                :label="this.$i18n.t('user.lang') || 'Language'"
                                @input="localSetLocale"
                                append-outer-icon="mdi-translate"
                        ></v-select>
                    </v-list-item>

                    <v-list-item>
                        <v-select
                                :items="this.getAllCurrencies()"
                                :value="this.getCurrency()"
                                item-text="title"
                                item-value="title"
                                :label="this.$i18n.t('user.currency') || 'Currency'"
                                @input="this.setCurrency"
                                append-outer-icon="mdi-cash-multiple"
                        ></v-select>
                    </v-list-item>
                <div v-if="$route.path != '/map'">
                <v-divider></v-divider>
                <v-list>
                    <v-list-item>
                        <v-dialog
                                ref="pickerMenu"
                                v-model="pickerMenu"
                                :close-on-content-click="false"
                                :return-value.sync="months"
                        >
                            <template v-slot:activator="{ on }">
                                <v-combobox
                                        v-model="months"
                                        multiple
                                        chips
                                        :label="$i18n.t('user.monthSelector') || 'Months selector'"
                                        v-on="on"
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
                                        >(+{{ $tc('otherMonths', months.length - 1)}})</span>
                                    </template>
                                </v-combobox>
                            </template>
                            <v-date-picker v-model="months"
                                           multiple
                                           :value="this.getSelectedSearchMonths"
                                           @input="this.setSearchMonths"
                                           type="month"
                                           :locale="this.$i18n.locale"
                                           :min="new Date().toISOString().substr(0, 10)"
                                           :max="this.getMaxMonthDate().toISOString().substr(0, 10)"
                            >
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="pickerMenu = false">{{ $t('cancel') }}</v-btn>
                                <v-btn text color="primary" @click="$refs.pickerMenu.save(months)">{{ $t('save') }}</v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-list-item>


                    <v-list-item>
                        <v-range-slider
                                v-model="minMaxRange"
                                :max="max"
                                :min="min"
                                step="1"
                                hide-details
                                class="align-center"
                                thumb-label="always"
                                thumb-size="22"
                                @input="this.setMinMaxDuration"
                        >
                        </v-range-slider>
                    </v-list-item>
                </v-list>
                </div>

                </v-list>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="menu = false">{{ $t('cancel') }}</v-btn>
                    <v-btn color="primary" text @click="menu = false; changeParams()">{{ $t('save')}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
    </v-lazy>
</template>

<script>
import {mapGetters, mapActions } from 'vuex';
import OriginsAutocomplete from "@/components/OriginsAutocomplete";

export default {
    name: "UserProfile",
    components: {
        OriginsAutocomplete
    },
    data: () => ({
        userMenuKey: 0,
        citizenshipsKey: 0,
        menu: false,
        pickerMenu: false,
        months: [],
        minMaxRange: [0, 365],
        min: 0,
        max: 365,
        ipInfoLoaded: false,
        countriesLoaded: false,
        originsReady: false
    }),
    methods: {
        ...mapGetters(['getVisaFree', 'getLang', 'getAllLangs', 'getCurrency', 'getAllCurrencies', 'getAllCountries',
                       'getCitizenships', 'getSelectedSearchMonths', 'getMinMaxDuration', 'getIpInfo',
                       'getOriginsStatus', 'getOriginItems'
                       ]),
        ...mapActions(['setVisaFree', 'setLang', 'setCurrency', 'fetchCountries', 'setCitizenships', 'setSearchMonths',
                       'setMinMaxDuration', 'fetchIpInfo', 'fetchNearbyAirports', 'recoverFromCookiesNearbyAirports',
                       'searchParamsChanged']),
        async localSetLocale(value) {
            let oldValue = this.getLang();
            this.setLang(value);
            this.$i18n.locale = value;
            if (value != oldValue) {
                this.userMenuKey++;
                this.fetchCountries(this.getLang());
            }
        },
        getMaxMonthDate() {
            let dt = new Date();
            dt.setMonth( dt.getMonth() + 12 );
            return dt
        },
        changeParams() {
            this.searchParamsChanged()
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
    },
    async mounted() {
        this.$i18n.locale = this.getLang();
        this.countriesLoaded = await this.fetchCountries(this.getLang());
        this.months = this.getSelectedSearchMonths();
        this.minMaxRange = this.getMinMaxDuration();
    },
}
</script>

<style scoped>

</style>