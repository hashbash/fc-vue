<template>
    <v-card flat class="mx-auto">
        <v-list>
            <v-card-title>{{$t('forms.names.route')}} ({{this.getRoute.length}})
                <v-spacer></v-spacer>
                <v-card-title v-if="this.getRoute.length">{{$t('forms.numbers.totalPrice')}}
                    {{ calculatePrice() | currency(this.getRoute[0]['converted_currency'], 0, { spaceBetweenAmountAndSymbol: true }) }}
                </v-card-title></v-card-title>

            <v-list-item v-for="(flight, index) in this.getRoute" :key="index">
                <v-list-item-content style="min-width: 300px">
                    <v-list-item-title>{{flight['origin_city_name']
                        + ' (' + flight['origin'] + ')'
                        + (flight['one_way'] === 0 ? ' &#8644; ' : ' &#8594; ')
                        + flight['destination_city_name']
                        + ' (' + flight['destination'] + ')'
                        }}</v-list-item-title>
                    <v-list-item-subtitle>
                        {{(flight['direct'] === 1 ? $t('flight.direct') : $t('flight.withStops'))
                        + ' &#9992; '
                        + flight['outbound_carrier_names'].join(', ')
                        }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                        {{flight['outbound_dt']
                        + (flight['one_way'] === 1 ? '' : ' &#8651; ' + flight['inbound_dt'])}}
                    </v-list-item-subtitle>
                </v-list-item-content>

                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>


                <v-list-item-action class="justify-end align-end">
                    <v-row class="mx-auto">
                        <v-col class="ma-0 pa-0">
                            <v-btn  @click="openK(flight)"
                                    icon>
                                <v-icon color="grey lighten-1">mdi-alpha-k-circle-outline</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col class="ma-0 pa-0">
                            <v-btn  @click="openSk(flight)"
                                    icon>
                                <v-icon color="grey lighten-1">mdi-alpha-s-circle-outline</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col class="ma-0 pa-0">
                            <v-btn  @click="openAS(flight)"
                                    icon>
                                <v-icon color="primary">mdi-alpha-a-circle-outline</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-list-item-action>
                <v-spacer></v-spacer>
                <v-list-item-content>
                    <v-list-item-title style="font-size: 1.3rem">
                        {{ flight['converted_price'] | currency(flight['converted_currency'], 0, { spaceBetweenAmountAndSymbol: true }) }}
                    </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                    <v-btn outlined rounded fab small
                           @click="removeFromRoute(index)"
                    >
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
        </v-list>
        <div v-if="this.getRoute.length">
            <v-card-actions class="justify-end">
                <v-row class="justify-end px-5">
                    <v-btn @click="openComplexK">
                        {{$t('forms.selectors.openRouteOnSource')}} KAYAK
                    </v-btn>
                    <v-btn @click="openComplexSk">{{$t('forms.selectors.openRouteOnSource')}} Skyscanner</v-btn>
                    <v-btn @click="openComplexAS" class="success">{{$t('forms.selectors.openRouteOnSource')}}
                        Aviasales
                    </v-btn>
                </v-row>
            </v-card-actions>
            <v-card-actions class="justify-end pa-0 align-end">
                <v-subheader style="max-width: 40%">
                    {{$t('forms.warnings.complexUnavailable')}}
                </v-subheader>
            </v-card-actions>
        </div>
    </v-card>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import common from "@/common";

    export default {
        name: "VueMapboxRoute",
        computed: {
            ...mapGetters(['getRoute']),
        },
        methods: {
            ...mapActions(['deleteFromRoute']),
            sum(numbers){
                let x = numbers.reduce(function(prev,curr){
                    return curr + prev;
                }, 0);
                return x;
            },
            calculatePrice() {
                return this.sum(this.getRoute.map(x => x['converted_price']))
            },
            openSk(flight) {
                let link = common.skyscannerLink(flight);
                window.open(link, '_blank')
            },
            openComplexSk() {
                let link = common.skyscannerComplexLink(this.getRoute);
                window.open(link, '_blank')
            },
            linkSk(flight) {
                return common.skyscannerLink(flight)
            },
            openAS(flight) {
                let link = common.aviasalesLink(flight);
                window.open(link, '_blank')
            },
            openComplexAS() {
                let link = common.aviasalesComplexLink(this.getRoute);
                window.open(link, '_blank')
            },
            linkAS(flight) {
                return common.aviasalesLink(flight)
            },
            openK(flight) {
                let link = common.kayakLink(flight);
                window.open(link, '_blank')
            },
            openComplexK() {
                let link = common.kayakComplexLink(this.getRoute);
                window.open(link, '_blank')
            },
            linkK(flight) {
                return common.kayakLink(flight)
            },
            removeFromRoute(index) {
                this.deleteFromRoute(index)
            }
        }
    }
</script>

<style scoped>

</style>