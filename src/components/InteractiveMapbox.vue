<template>
    <v-content
            class="ma-0 pa-0"
            style="min-height: 520px; min-width: 100%">
        <MglMap
                container="interactiveMap"
                :mapStyle.sync="mapStyle"
                :accessToken="accessToken"
                :zoom="zoom"
                :center="center"
                style="min-width: 100%; min-height: 100%"
        >
            <MglNavigationControl :showCompass="false"></MglNavigationControl>
            <MglFullscreenControl></MglFullscreenControl>
            <MglPopup :coordinates="[45.48383155304096, 47.82882682974591]">
                <VCard>
                    <div>Hello, I'm popup!</div>
                </VCard>
            </MglPopup>
            <MglGeojsonLayer
                    sourceId="places"
                    layerId="places"
                    :layer="geoJsonLayer"
                    @click="logClick"
            ></MglGeojsonLayer>

        </MglMap>
    </v-content>
</template>

<script>
    import AppConfig from "@/AppConfig";
    import Mapbox from 'mapbox-gl';
    import { mapActions, mapGetters } from 'vuex';
    import { MglMap, MglNavigationControl, MglFullscreenControl, MglGeojsonLayer, MglPopup
         } from 'vue-mapbox';
    import Vue2Filters from "vue2-filters";
    import Vue from "vue";
    Vue.use(Vue2Filters);

    export default {
        name: "InteractiveMapbox",
        mixins: [Vue2Filters.mixin],
        components: {
            MglMap,
            MglNavigationControl, MglFullscreenControl, MglGeojsonLayer, MglPopup
            //, MglPopup
        },
        data:() => ({
            mapStyle: 'mapbox://styles/mapbox/dark-v9',
            accessToken: AppConfig.MapBoxAccessToken,
            zoom: 4,
            center: [50.48383155304096, 47.82882682974591],
            geoJsonSource: {
                id: "points",
                type: 'geojson',
                data: {
                    "type": "FeatureCollection",
                    "features": []
                }
            },
            geoJsonLayer:
                {
                    "id": "places",
                    "type": "symbol",
                    "source": {
                        type: 'geojson',
                        data: {
                            "type": "FeatureCollection",
                            "features": []
                        }
                    },
                    "layout": {
                        "text-field": ['format',
                            ['get', 'destination_city_name'], {
                                'font-scale': 1.2,
                                'text-color': "#392990"
                            },
                            '\n', {},
                            ['get', "pretty_price"], {}
                        ],
                        "text-size": 14,
                        "symbol-sort-key": ['get', 'converted_price']
                    },
                    "paint": {
                        "text-color": ['get', 'text-color']
                    }
                }
        }),
        created() {
            this.map = null;
            this.mapbox = Mapbox;
        },
        methods: {
            ...mapActions(['fetchOneWayFlights']),
            ...mapGetters(['getOneWayFlights', 'getGeoJson']),
            logClick(event) {
                console.log(event);
            }
        },
        async mounted() {
            await this.fetchOneWayFlights();
            this.geoJsonLayer.source.data.features = this.getGeoJson().map(x => (
                {
                    type: x['type'],
                    properties: {
                        ...x['properties'],
                        pretty_price: this.$options.filters.currency(
                            x['properties']['converted_price'],
                            '',
                            0 ,
                            { thousandsSeparator: ' ' }),
                        "text-color": "#ffffff"
                    },
                    geometry: {
                        ...x['geometry']
                    }

                }
            ));
        },
    }

</script>

<style scoped>

</style>