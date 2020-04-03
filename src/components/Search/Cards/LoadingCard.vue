<template>
    <v-card>
        <v-card-title>{{$t('meta.loadingCard')}}</v-card-title>
        <v-card-text>
            <v-container fluid>
                <v-row>
                    <v-col style="min-width: 20%; max-width: 20%">
                        {{$t('meta.fetchLiveFlights')}}
                    </v-col>
                    <v-col>
                        <v-progress-linear rounded
                                           striped
                                           :indeterminate="statuses['liveSearch'] === 'processing'"
                                           :color="getColor(statuses['liveSearch'])"
                                           height="22px"
                                           :key="key"
                        >
                            {{$t('meta.status.' + statuses['liveSearch'] )}}
                        </v-progress-linear>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col style="min-width: 20%; max-width: 20%">
                        {{$t('meta.fetchSkiplegged')}}
                    </v-col>
                    <v-col>
                        <v-progress-linear rounded
                                           striped
                                           :indeterminate="statuses['skiplegged'] === 'processing'"
                                           :color="getColor(statuses['skiplegged'])"
                                           height="22px"
                                           :key="key"
                        >
                            {{$t('meta.status.' + statuses['skiplegged'] )}}
                        </v-progress-linear>
                    </v-col>
                </v-row>
                <div v-if="this.getSearchType() === 0">

                    <v-row>
                        <v-col style="min-width: 20%; max-width: 20%">
                            {{$t('meta.fetchOutboundForRT')}}
                        </v-col>
                        <v-col>
                            <v-progress-linear rounded
                                               striped
                                               :indeterminate="statuses['liveSearchOutboundForRT'] === 'processing'"
                                               :color="getColor(statuses['liveSearchOutboundForRT'])"
                                               height="22px"
                                               :key="key"
                            >
                                {{$t('meta.status.' + statuses['liveSearchOutboundForRT'] )}}
                            </v-progress-linear>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col style="min-width: 20%; max-width: 20%">
                            {{$t('meta.fetchInboundForRT')}}
                        </v-col>
                        <v-col>
                            <v-progress-linear rounded
                                               striped
                                               :indeterminate="statuses['liveSearchInboundForRT'] === 'processing'"
                                               :color="getColor(statuses['liveSearchInboundForRT'])"
                                               height="22px"
                                               :key="key"
                            >
                                {{$t('meta.status.' + statuses['liveSearchInboundForRT'] )}}
                            </v-progress-linear>
                        </v-col>
                    </v-row>
                </div>
                <div v-if="this.getSearchType() === 1">
                    <v-row>
                        <v-col style="min-width: 20%; max-width: 20%">
                            {{$t('meta.checkRTCheaperThanOW')}}
                        </v-col>
                        <v-col>
                            <v-progress-linear rounded
                                               striped
                                               :indeterminate="statuses['cachedFlights'] === 'processing'"
                                               :color="getColor(statuses['cachedFlights'])"
                                               height="22px"
                                               :key="key"
                            >
                                {{$t('meta.status.' + statuses['cachedFlights'] )}}
                            </v-progress-linear>
                        </v-col>
                    </v-row>
                </div>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>

    import {mapGetters} from 'vuex';
    export default {
        name: "LoadingCard",
        data: () => ({
            statuses: {},
            key: 0
        }),
        methods: {
            ...mapGetters(['getSearchLoadingDetails', 'getSearchType']),
            getColor(status) {
                if (['success', 'error'].includes(status)) {
                    return status
                } else if (status === 'n/a') {
                    return 'grey'
                }
            }
        },
        beforeCreate() {
            this.$store.subscribe((mutation) => {
                if (mutation.type === 'updateSearchLoadingDetails') {
                    this.statuses[mutation.payload.key] = mutation.payload.value;
                    this.key ++;
                }

            })
        },
        mounted() {
            this.statuses = this.getSearchLoadingDetails();
        }
    }
</script>

<style scoped>

</style>