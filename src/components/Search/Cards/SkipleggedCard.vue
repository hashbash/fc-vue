<template>
    <v-card>
        <v-card-title>{{$t('meta.skiplegged')}}
            <v-spacer></v-spacer>
            <div class="overline" style="color: gray">
                <div v-if="this.getSearchType() === 1">{{(this.outbound) ? '' : $t('meta.noData')}}</div>
                <div v-if="this.getSearchType() === 0">{{this.outbound || this.inbound
                    ? (this.outbound && this.inbound) ? '' : $t('meta.partiallyNoData')
                    : $t('meta.noData')}}</div>
            </div>
        </v-card-title>
        <v-card-text class="pa-0" v-if="(this.outbound || this.inbound)">
            <v-container fluid>
                <v-row v-if="outbound" :key="'outbound_skip'">
                    <v-col style="max-width: 10%" class="text-center">
                        <CarrierLogo
                                     :outbound-distinct-carrier-codes="outbound['outbound_segments.carrier_code'].slice(0, 1)"
                                     :outbound-distinct-carriers="outbound['outbound_segments.carrier_name'].slice(0, 1)"
                        ></CarrierLogo>
                    </v-col>
                    <v-col>
                        <SkipleggedSegmentElement
                                :origins="outbound['outbound_segments.origin']"
                                :origin-names="outbound['outbound_segments.origin_name']"
                                :destinations="outbound['outbound_segments.destination']"
                                :destination-names="outbound['outbound_segments.destination_name']"
                                :flight="outbound"
                        ></SkipleggedSegmentElement>
                    </v-col>
                </v-row>

                    <v-divider v-if="outbound && inbound"></v-divider>

                <v-row v-if="inbound" :key="'inbound_skip'">
                    <v-col style="max-width: 10%" class="text-center">
                        <CarrierLogo
                                :outbound-distinct-carrier-codes="inbound['outbound_segments.carrier_code'].slice(0, 1)"
                                :outbound-distinct-carriers="inbound['outbound_segments.carrier_name'].slice(0, 1)"
                        ></CarrierLogo>
                    </v-col>
                    <v-col>
                        <SkipleggedSegmentElement
                                :origins="inbound['outbound_segments.origin']"
                                :origin-names="inbound['outbound_segments.origin_name']"
                                :destinations="inbound['outbound_segments.destination']"
                                :destination-names="inbound['outbound_segments.destination_name']"
                                :flight="inbound"
                        ></SkipleggedSegmentElement>
                    </v-col>
                </v-row>

            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    import {mapGetters} from 'vuex';
    import SkipleggedSegmentElement from "../Other/SkipleggedSegmentElement";
    import CarrierLogo from "../Other/CarrierLogo";

    export default {
        name: "SkipleggedCard",
        components: {SkipleggedSegmentElement, CarrierLogo},
        data: () => ({
            outbound: undefined,
            inbound: undefined
        }),
        methods: {
            ...mapGetters(['getSearchSkiplegged', 'getSearchType'])
        },
        mounted() {
            let flight = this.getSearchSkiplegged();
            if (flight) {
                this.outbound = flight['outbound'];
                this.inbound = flight['inbound'];
            }
        }
    }
</script>

<style scoped>

</style>