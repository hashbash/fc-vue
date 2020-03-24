<template>
    <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                    v-model="date"
                    :label="$t('forms.selectors.inbound')"
                    prepend-inner-icon="mdi-calendar-arrow-left"
                    readonly
                    solo-inverted
                    v-on="on"
                    :rules="[Boolean(date) || $t('forms.warnings.required'),
                    (outboundDate < date) || $t('forms.warnings.inboundAfterInbound')
                    ]"
            ></v-text-field>
        </template>
        <v-date-picker v-model="date" @input="menu = false"
                       :first-day-of-week="1"
                       :locale="this.$i18n.locale"
                       :min="outboundDate || (new Date().toISOString().substr(0, 10))"
                       :max="getMaxDate().toISOString().substr(0, 10)"
        ></v-date-picker>
    </v-menu>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "SingleInboundDatePicker",
        data: () => ({
            date: undefined,
            menu: false,
        }),
        methods: {
            ...mapGetters(['getSearchInboundDate', 'getSearchOutboundDate']),
            ...mapActions(['setSearchInboundDate']),
            getMaxDate() {
                let aYearFromNow = new Date();
                aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
                return aYearFromNow
            },
        },
        computed: {
            outboundDate: {
                get() {
                    return this.getSearchOutboundDate()
                }
            }
        },
        async mounted() {
            if ((new Date().toISOString().substr(0, 10)) <= this.getSearchInboundDate()
            ) {
                this.date = this.getSearchInboundDate()
            }
        },
        watch: {
            date(newValue) {
                if (newValue) {
                    this.setSearchInboundDate(newValue)
                }
            }
        }
    }
</script>

<style scoped>

</style>