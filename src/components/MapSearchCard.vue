<template>
    <v-app>
    <v-row
            justify="center" align="center"
    >
                <div style="min-width: 30%">
                    <v-form
                            ref="form"
                            v-model="valid"
                            :lazy-validation="false"
                    >
                <v-card>
                    <v-card-title>{{ $t('forms.names.mapSearch') }}</v-card-title>
                    <v-list>
                        <v-list-item>
                            <OriginsAutocomplete
                            ></OriginsAutocomplete>
                        </v-list-item>
                        <v-list-item>
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
                                            :label="$i18n.t('forms.selectors.startDates') || 'Date selector'"
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
                                               @input="this.setSearchDays"
                                               :locale="this.$i18n.locale"
                                               :min="new Date().toISOString().substr(0, 10)"
                                               :max="getMaxDate().toISOString().substr(0, 10)"
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="pickerMenu = false">{{ $t('cancel') }}</v-btn>
                                    <v-btn text color="primary" @click="$refs.pickerMenu.save(days)">{{ $t('save') }}</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-list-item>
                    </v-list>
                    <v-card-actions>
                        <v-list-item>
                            <v-row align="center" justify="end">
                        <v-btn class="success" :disabled="!valid" @click="this.setMapFieldsSearchClicked"
                        >{{ $t('navigation.search') }}</v-btn>
                            </v-row>
                        </v-list-item>
                    </v-card-actions>
                </v-card>
                    </v-form>
                </div>
    </v-row>
    </v-app>
</template>

<script>
    import OriginsAutocomplete from "@/components/OriginsAutocomplete";
    import {mapGetters, mapActions } from 'vuex';
    import i18n from "@/i18n";

    export default {
        name: "MapSearchCard",
        components: {OriginsAutocomplete},
        data: () => ({
            pickerMenu: false,
            days: [],
            valid: true,
            dateRules: [
                v => !!v || 'Dates is required',
                v => (v && v.length > 0) || i18n.t('forms.validations.selectAtLeastOneDay')]
        }),
        methods: {
            ...mapGetters(['getSelectedSearchDays', 'getAllMonthsStr']),
            ...mapActions(['setSearchDays', 'setMapFieldsSearchClicked']),
            getMaxDate() {
                let aYearFromNow = new Date();
                aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
                return aYearFromNow
            }
        }
    }
</script>

<style scoped>

</style>