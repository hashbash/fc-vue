<template>
    <v-card>
        <v-card-title>{{$t('meta.loadingCard')}}</v-card-title>
        <v-card-text>
            <v-container fluid>
                <v-row>
                    <v-col style="max-width: 15%">
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
                    <v-col style="max-width: 15%">
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
            ...mapGetters(['getSearchLoadingDetails']),
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