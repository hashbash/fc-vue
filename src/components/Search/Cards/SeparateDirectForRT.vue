<template>
    <v-card>
        <v-card-title>{{$t('meta.separateDirectForRTCard')}}
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
                                :outbound-distinct-carrier-codes="outboundDistinctCarrierCodes"
                                :outbound-distinct-carriers="outboundDistinctCarriers"
                        ></CarrierLogo>
                    </v-col>
                    <v-col>
                        <SegmentElement
                                :origins="outbound['outbound_segments.origin']"
                                :origin-names="outbound['outbound_segments.origin_name']"
                                :destinations="outbound['outbound_segments.destination']"
                                :destination-names="outbound['outbound_segments.destination_name']"
                                :departures="outbound['outbound_segments.departure']"
                                :arrivals="outbound['outbound_segments.arrival']"
                                :flight="outbound"
                                kind="ow"
                        ></SegmentElement>
                    </v-col>
                </v-row>

                <v-divider v-if="outbound && inbound"></v-divider>

                <v-row v-if="inbound" :key="'inbound_skip'">
                    <v-col style="max-width: 10%" class="text-center">
                        <CarrierLogo
                                :outbound-distinct-carrier-codes="inboundDistinctCarrierCodes"
                                :outbound-distinct-carriers="inboundDistinctCarriers"
                        ></CarrierLogo>
                    </v-col>
                    <v-col>
                        <SegmentElement
                                :origins="inbound['outbound_segments.origin']"
                                :origin-names="inbound['outbound_segments.origin_name']"
                                :destinations="inbound['outbound_segments.destination']"
                                :destination-names="inbound['outbound_segments.destination_name']"
                                :departures="inbound['outbound_segments.departure']"
                                :arrivals="inbound['outbound_segments.arrival']"
                                :flight="inbound"
                                kind="ow"
                        ></SegmentElement>
                    </v-col>
                </v-row>

            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    import {mapGetters} from 'vuex';
    import SegmentElement from "../Other/SegmentElement";
    import CarrierLogo from "../Other/CarrierLogo";

    export default {
        name: "SeparateDirectForRT",
        components: {SegmentElement, CarrierLogo},
        data: () => ({
            outbound: undefined,
            inbound: undefined,
            outboundDistinctCarriers: [],
            outboundDistinctCarrierCodes: [],
            inboundDistinctCarriers: [],
            inboundDistinctCarrierCodes: []
        }),
        methods: {
            ...mapGetters(['getCheapestLiveDirectOutboundForRT', 'getCheapestLiveDirectInboundForRT', 'getSearchType'])
        },
        mounted() {
            let outboundFlight = this.getCheapestLiveDirectOutboundForRT();
            let inboundFlight = this.getCheapestLiveDirectInboundForRT();
            if (outboundFlight) {
                this.outbound = outboundFlight;
                this.outboundDistinctCarriers = Array.from(
                    new Set(outboundFlight['outbound_segments.carrier_name']));
                this.outboundDistinctCarrierCodes = Array.from(
                    new Set(outboundFlight['outbound_segments.carrier_code']));
            }
            if (inboundFlight) {
                this.inbound = inboundFlight;
                this.inboundDistinctCarriers = Array.from(
                    new Set(inboundFlight['outbound_segments.carrier_name']));
                this.inboundDistinctCarrierCodes = Array.from(
                    new Set(inboundFlight['outbound_segments.carrier_code']));
            }
        }
    }
</script>

<style scoped>

</style>