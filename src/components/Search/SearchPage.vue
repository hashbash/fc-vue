<template>
    <div>
    <v-content></v-content>
    <div>
        <v-fade-transition>
        <v-form v-model="valid">
            <v-container style="min-width: 95%">
                <v-tabs background-color="#ffffff00" v-model="searchType">
                    <v-tab :disabled="searchLoading">{{$t('flight.roundTrip')}}</v-tab>
                    <v-tab :disabled="searchLoading">{{$t('flight.oneWay')}}</v-tab>
                </v-tabs>
                <v-row>
                    <v-col>
                        <SingleOriginAutocomplete></SingleOriginAutocomplete>
                    </v-col>
                    <v-col>
                        <SingleDestinationAutocomplete></SingleDestinationAutocomplete>
                    </v-col>
                    <v-col style="max-width: 12%">
                        <SingleOutboundDatePicker></SingleOutboundDatePicker>
                    </v-col>
                    <v-col style="max-width: 12%" v-if="this.searchType !== 1">
                        <SingleInboundDatePicker></SingleInboundDatePicker>
                    </v-col>
                    <v-col style="max-width: 11%">
                        <v-btn outlined x-large max-height="48px" elevation="5" color="green" :disabled="searchLoading || !valid"
                               :loading="searchLoading"
                               @click="search"
                               style="max-width: 98%"
                        >
                            <v-icon>mdi-map-search-outline</v-icon>
                            <v-spacer style="min-width: 10px"></v-spacer>
                            {{$t('navigation.search')}}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
        </v-fade-transition>
    </div>
        <v-container fluid style="max-width: 95%">
            <v-item-group>
                <v-item class="mb-2" v-if="searchLoading">
                    <LoadingCard></LoadingCard>
                </v-item>
                <div :key="cardsKey" v-if="searchCount > 0">
                    <v-item class="mb-2">
                        <LiveCheapestCard kind="direct"></LiveCheapestCard>
                    </v-item>
                    <v-item class="mb-2">
                        <LiveCheapestCard kind="non_direct"></LiveCheapestCard>
                    </v-item>
                    <v-item class="mb-2">
                        <SkipleggedCard></SkipleggedCard>
                    </v-item>
                    <v-item class="mb-2" v-if="!searchLoading">
                        <LoadingCard></LoadingCard>
                    </v-item>
                </div>
            </v-item-group>

        </v-container>
    </div>
</template>

<script>
    import SingleOriginAutocomplete from "./Autocomplete/SingleOriginAutocomplete";
    import SingleDestinationAutocomplete from "./Autocomplete/SingleDestinationAutocomplete";
    import SingleOutboundDatePicker from "./DatePickers/SingleOutboundDatePicker";
    import SingleInboundDatePicker from "./DatePickers/SingleInboundDatePicker";
    import {mapActions, mapGetters} from "vuex";
    import LoadingCard from "./Cards/LoadingCard";
    import LiveCheapestCard from "./Cards/LiveCheapestCard";
    import SkipleggedCard from "./Cards/SkipleggedCard";

    export default {
        name: "SearchPage",
        components: {SingleOriginAutocomplete, SingleDestinationAutocomplete, SingleOutboundDatePicker,
            SingleInboundDatePicker, LoadingCard, LiveCheapestCard, SkipleggedCard},
        data: () => ({
            valid: false,
            cardsKey: 0,
            showLoadingCard: false,
            searchCount: 0
        }),
        methods: {
            ...mapGetters(['getSearchType', 'getSearchLoading']),
            ...mapActions(['setSearchType', 'fetchCheapestLive', 'setSearchLoading', 'fetchSkiplagged']),
            async search() {
                this.searchLoading = true;
                let cl = this.fetchCheapestLive();
                let sl = this.fetchSkiplagged();
                await cl;
                await sl;
                this.searchLoading = false;
                this.searchCount ++;
                this.cardsKey ++;
            }
        },
        computed: {
            searchType: {
                get() {
                    return this.getSearchType()
                },
                set(value) {
                    this.setSearchType(value)
                }
            },
            searchLoading: {
                get() {
                    return this.getSearchLoading()
                },
                set(value) {
                    this.setSearchLoading(value)
                }
            }
        },
        async mounted() {
            if (this.$vuetify.theme.dark === false) {
                this.$vuetify.theme.dark = true
            }
        }
    }
</script>

<style scoped>

</style>