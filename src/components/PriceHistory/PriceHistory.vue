<template>
    <div>
        <v-content class="px-0 mx-0 pa-4 justify-center align-center">
            <SearchForm></SearchForm>
        </v-content>
        <v-card class="mx-auto justify-center align-center" style="max-width: 85%">
            <v-card-title>{{$t('forms.names.priceHistoryTable')}}</v-card-title>
            <v-data-table
                    :headers="headers"
                    :items="items"
                    dense
                    class="mx-auto justify-center align-center"
                    style="max-width: 97%"
                    :no-data-text="noDataFound ? $t('forms.messages.noData') : $t('forms.messages.waitingForFillingForm')"
            >

            </v-data-table>
        </v-card>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import SearchForm from "../Common/SearchForm";

    export default {
        name: "PriceHistory",
        components: {SearchForm},
        data: function () {
            return {
                noDataFound: false,
                items: [],
                headers: [
                    {text: this.$t('forms.tables.headers.cacheDatetime'), value: 'processing_dt'},
                    {text: this.$t('forms.tables.headers.origin'), value: 'prettyOrigin'},
                    {text: this.$t('forms.tables.headers.destination'), value: 'prettyDestination'},
                    {text: this.$t('forms.tables.headers.outboundDate'), value: 'outbound_dt'},
                    {text: this.$t('forms.tables.headers.inboundDate'), value: 'prettyInboundDate'},
                    {text: this.$t('forms.tables.headers.carriers'), value: 'carrier_names', filterable: true},
                    {text: this.$t('forms.tables.headers.direct'), value: 'direct'},
                    {text: this.$t('forms.tables.headers.currency'), value: 'converted_currency'},
                    {text: this.$t('forms.tables.headers.price'), value: 'converted_price_rounded'},
                ]
            }},

        computed: {
            ...mapGetters({loading: 'getPriceHistoryLoading', flightHistory: 'getPriceHistory'})
        },
        async mounted() {
            this.headers = [
                {text: this.$t('forms.tables.headers.cacheDatetime'), value: 'processing_dt'},
                {text: this.$t('forms.tables.headers.origin'), value: 'prettyOrigin'},
                {text: this.$t('forms.tables.headers.destination'), value: 'prettyDestination'},
                {text: this.$t('forms.tables.headers.outboundDate'), value: 'outbound_dt'},
                {text: this.$t('forms.tables.headers.inboundDate'), value: 'prettyInboundDate'},
                {text: this.$t('forms.tables.headers.carriers'), value: 'carrier_names', filterable: true},
                {text: this.$t('forms.tables.headers.direct'), value: 'prettyDirect'},
                {text: this.$t('forms.tables.headers.currency'), value: 'converted_currency'},
                {text: this.$t('forms.tables.headers.price'), value: 'converted_price_rounded'},
            ]
        },
        watch: {
            loading(newValue, oldValue) {
                if (newValue === false && oldValue === true) {
                    this.items = this.flightHistory.map(element => {
                        return {
                            ...element,
                            prettyOrigin: element['origin_city_name'] + ` (${element['origin']})`,
                            prettyDestination: element['destination_city_name'] + ` (${element['destination']})`,
                            prettyInboundDate: element['inbound_dt'] === null ? '—' : element['inbound_dt'],
                            prettyDirect: element['direct'] === 1 ? '✓' : '✗'
                        };
                    });
                    this.noDataFound = this.items.length === 0;
                }
            }
        }
    }
</script>

<style scoped>

</style>