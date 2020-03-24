<template>
    <v-card>
        <v-card-title>{{this.kind === 'direct' ? $t('meta.cheapestDirect') : $t('meta.cheapestNonDirect')}}
        <v-spacer></v-spacer>
         <div class="overline" style="color: gray">
             <div>{{this.flight ? '' : $t('meta.noData')}}</div>
         </div>
        </v-card-title>
        <v-card-text v-if="flight" class="pa-0">
            <v-container fluid>
            <v-row>
                <v-col style="max-width: 10%" class="text-center">
                    <CarrierLogo v-if="outboundDistinctCarriers.length > 0"
                                 :outbound-distinct-carrier-codes="outboundDistinctCarrierCodes"
                                 :outbound-distinct-carriers="outboundDistinctCarriers"
                    ></CarrierLogo>
                </v-col>
                <v-col>
                    <SegmentElement
                            :origins="flight['outbound_segments.origin']"
                            :origin-names="flight['outbound_segments.origin_name']"
                            :destinations="flight['outbound_segments.destination']"
                            :destination-names="flight['outbound_segments.destination_name']"
                            :departures="flight['outbound_segments.departure']"
                            :arrivals="flight['outbound_segments.arrival']"
                    ></SegmentElement>
                </v-col>
            </v-row>
                <v-row v-if="flight['one_way'] === 0">
                    <v-col style="max-width: 10%" class="text-center">
                        <CarrierLogo v-if="inboundDistinctCarriers.length > 0"
                                     :outbound-distinct-carrier-codes="inboundDistinctCarrierCodes"
                                     :outbound-distinct-carriers="inboundDistinctCarriers"
                        ></CarrierLogo>
                    </v-col>
                    <v-col>
                        <SegmentElement
                                :origins="flight['inbound_segments.origin']"
                                :origin-names="flight['inbound_segments.origin_name']"
                                :destinations="flight['inbound_segments.destination']"
                                :destination-names="flight['inbound_segments.destination_name']"
                                :departures="flight['inbound_segments.departure']"
                                :arrivals="flight['inbound_segments.arrival']"
                        ></SegmentElement>
                    </v-col>
                </v-row>
                </v-container>
        </v-card-text>
        <v-card-actions class="justify-end" v-if="flight">
            <v-btn
                    :href="aviasalesLink(flight)"
                    target="_blank"
                    class="primary"
            >{{ flight.price | currency(flight.currency, 0, { spaceBetweenAmountAndSymbol: true }) }}</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {mapGetters} from 'vuex';
    import CarrierLogo from "../Other/CarrierLogo";
    import SegmentElement from "../Other/SegmentElement";
    import common from "../../../common";
    export default {
        name: "LiveCheapestCard",
        components: {CarrierLogo, SegmentElement},
        data: () => ({
            flight: undefined,
            outboundDistinctCarriers: [],
            outboundDistinctCarrierCodes: [],
            inboundDistinctCarriers: [],
            inboundDistinctCarrierCodes: []
        }),
        methods: {
            ...mapGetters(['getCheapestLiveDirect', 'getCheapestLiveNonDirect']),
            aviasalesLink: common.aviasalesLink
        },
        mounted() {
            let getCheapestFlight = this.getCheapestLiveDirect;
            if (this.kind === 'non_direct') {
                getCheapestFlight = this.getCheapestLiveNonDirect;
            }
            if (getCheapestFlight()) {
                this.flight = getCheapestFlight();
                this.outboundDistinctCarriers = Array.from(
                    new Set(this.flight['outbound_segments.carrier_name']));
                this.outboundDistinctCarrierCodes = Array.from(
                    new Set(this.flight['outbound_segments.carrier_code']));
                if (this.flight['one_way'] === 0) {
                    this.inboundDistinctCarriers = Array.from(
                        new Set(this.flight['inbound_segments.carrier_name']));
                    this.inboundDistinctCarrierCodes = Array.from(
                        new Set(this.flight['inbound_segments.carrier_code']));
                }
            }
        },
        props: {
            kind: String
        }
    }
</script>

<style scoped>
</style>