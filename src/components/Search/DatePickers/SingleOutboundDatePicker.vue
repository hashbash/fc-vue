<template>
    <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                    v-model="date"
                    :label="$t('forms.selectors.outbound')"
                    prepend-inner-icon="mdi-calendar-arrow-right"
                    readonly
                    solo-inverted
                    v-on="on"
                    :rules="[Boolean(date) || $t('forms.warnings.required'),
                    (new Date().toISOString().substr(0, 10)) <= date || $t('forms.warnings.required')
                    ]"
            ></v-text-field>
        </template>
        <v-date-picker v-model="date" @input="menu = false"
                       :first-day-of-week="1"
                       :locale="this.$i18n.locale"
                       :min="new Date().toISOString().substr(0, 10)"
                       :max="getMaxDate().toISOString().substr(0, 10)"
        ></v-date-picker>
    </v-menu>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    export default {
        name: "SingleOutboundDatePicker",
        data: () => ({
            date: undefined,
            menu: false,
        }),
        methods: {
            ...mapGetters(['getSearchOutboundDate']),
            ...mapActions(['setSearchOutboundDate']),
            getMaxDate() {
                let aYearFromNow = new Date();
                aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
                return aYearFromNow
            },
        },
        async mounted() {
            if ((new Date().toISOString().substr(0, 10)) <= this.getSearchOutboundDate()) {
                this.date = this.getSearchOutboundDate()
            }
        },
        watch: {
            date(newValue) {
                if (newValue) {
                    this.setSearchOutboundDate(newValue)
                }
            }
        }
    }
</script>

<style scoped>

</style>