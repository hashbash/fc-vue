<template>
<div v-if="originItems.length">
    <div :key="div">
        <v-list>
            <v-list-group
                    v-for="item in collectionHeaders"
                    :key="item.title"
                    v-model="item.active"
                    :prepend-icon="item.icon"
            >
                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.title">
                        </v-list-item-title>
                    </v-list-item-content>
<!--                    <v-list-item-action>-->
<!--                        <v-btn icon-->
<!--                        >-->
<!--                            <v-icon>mdi-share-variant</v-icon>-->
<!--                        </v-btn>-->
<!--                    </v-list-item-action>-->
<!--                    <v-list-item-action>-->
<!--                        <v-btn icon-->

<!--                        >-->
<!--                            <v-icon>mdi-heart</v-icon>-->
<!--                        </v-btn>-->
<!--                    </v-list-item-action>-->
                </template>

                <v-list-item
                        :key="item.id + 'x'"
                >
                    <v-list-item-content>
                                    <FlightCollection
                                            :collectionId="item.id"
                                            :collectionTitle="item.title"
                                            :kind="item['kind']"
                                    ></FlightCollection>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>
        </v-list>

    </div>
    <v-snackbar
            v-model="snackbar"
            :timeout="snackbarTimeout"
            multi-line
    >
        {{ $t('locationSnackbar', { country: this.getIpInfo['country_name'], city: this.getIpInfo['city']}) }}
        <v-btn
                color="blue"
                text
                @click="snackbar = false; snackbarHasClosed=true"
        >
            {{ $t('close') }}
            <v-progress-circular
                    indeterminate
                    :value="snackbarValue"
            >{{snackbarValue}}</v-progress-circular>
        </v-btn>
    </v-snackbar>
    <v-content></v-content>
</div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import FlightCollection from "@/components/FlightCollection";
    let TIMEOUT = 1000;
    export default {
        name: "CollectionPage",
        components: {
            FlightCollection
        },
        data: () => ({
            collectionHeaders: [],
            collectionsLoaded: false,
            isActive: false,
            div: 0,
            snackbarTimeout: 30000,
            snackbarValue: 30,
            snackbar: false,
            snackbarHasClosed: false,
            interval: {},
            // loadedOrigins: undefined
        }),
        methods: {
            ...mapActions(['fetchCollections', 'setLocationSnackbarSeen']),
            ...mapGetters(['getCollectionHeaders', 'getOriginItems', 'getLocationSnackbarSeen']),
            scrollTo: function (hash) {
                setTimeout(() => { location.href = hash }, TIMEOUT)
            }

        },
        beforeDestroy () {
            clearInterval(this.interval)
        },
        computed: {
            ...mapGetters({originItems: 'getOriginItems'}),
            ...mapGetters(['searchParamsChanged', 'getLang', 'getIpInfo'])
        },
        async mounted() {
            await this.fetchCollections();
            this.collectionHeaders = await this.getCollectionHeaders();
            this.collectionsLoaded = true;
            // this.loadedOrigins = this.getOriginItems()
            // From testing, without a brief timeout, it won't work.
            if (this.$route.hash) {
                setTimeout(() => this.scrollTo(this.$route.hash), TIMEOUT)
            }
            this.interval = setInterval(() => {
                this.snackbarValue -= 1
                if (this.snackbarValue === 0) {
                    this.setLocationSnackbarSeen(true);
                }
            }, 1000);
            this.snackbar = !this.getLocationSnackbarSeen();
            if (this.collectionHeaders.length) {
                this.collectionHeaders[2].active = true;
            }
        },
        watch: {
            searchParamsChanged(newValue) {
                if (newValue) {
                    this.div++
                }
            },
            getLang(newValue, oldValue) {
                if (newValue && oldValue) {
                    if (newValue !== oldValue) {
                        this.collectionHeaders = this.getCollectionHeaders();
                    }
                }
            },
            snackbarHasClosed(newValue) {
                if (newValue === true) {
                    this.setLocationSnackbarSeen(true);
                }
            }
        }
    }
</script>

<style scoped>

</style>