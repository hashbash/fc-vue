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
                @map-click="clicked"
        >

            <MglNavigationControl :showCompass="false"></MglNavigationControl>
            <MglFullscreenControl></MglFullscreenControl>

            <MglPopup :coordinates="center" anchor="top" :showed="true">
                <VCard> <div>Hello, I'm popup!</div> </VCard>
            </MglPopup>
            <MglGeojsonLayer
                    sourceId="places"
                    layerId="places"
                    :layer="geoJsonLayer"
            >

            </MglGeojsonLayer>


<!--            <MglMarker-->
<!--                    :coordinates="[10,10]"-->
<!--            ></MglMarker>-->
<!--            <MglMarker-->
<!--                    v-if="showSelectedSymbolMarker"-->
<!--                    :coordinates="selectedSymbolMarkerCoordinates"-->

<!--            >-->
<!--                <MglPopup :showed="true">-->
<!--                    <v-card>-->
<!--                        <div>Hello, I'm popup!</div>-->
<!--                    </v-card>-->

<!--                </MglPopup>-->
<!--            </MglMarker>-->

<!--            <MglPopup :coordinates="center" :showed="true">-->
<!--                <v-card>-->
<!--                    <div>dsdsfds</div>-->
<!--                </v-card>-->
<!--            </MglPopup>-->


        </MglMap>
    </v-content>
</template>

<script>
    import AppConfig from "@/AppConfig";
    import Mapbox from 'mapbox-gl';
    import { mapActions, mapGetters } from 'vuex';
    import { MglMap, MglPopup,
        MglNavigationControl, MglFullscreenControl
         , MglGeojsonLayer
         } from 'vue-mapbox';
    import Vue2Filters from "vue2-filters";
    import mapboxgl from 'mapbox-gl'
    import Vue from "vue";
    Vue.use(Vue2Filters);

    export default {
        name: "InteractiveMapbox",
        mixins: [Vue2Filters.mixin],
        components: {
            MglMap, MglPopup,
            MglNavigationControl, MglFullscreenControl
            , MglGeojsonLayer

        },
        data:() => ({
            mapStyle: 'mapbox://styles/mapbox/dark-v9',
            accessToken: AppConfig.MapBoxAccessToken,
            zoom: 0,
            center: [50.48383155304096, 47.82882682974591],
            showSelectedSymbolMarker: false,
            selectedSymbolMarkerCoordinates: [0, 0],
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
                                'font-scale': 1,
                            },
                            '\n', {},
                            ['get', "pretty_price"], {
                                'font-scale': .8,
                            }
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
            clicked(map, e) {
                console.log(map, e)
                if (e.features) {
                    const coordinates = e.features[0].geometry.coordinates.slice()

                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                    }

                    new mapboxgl.Popup()
                        .setLngLat({ lng: coordinates[0], lat: coordinates[1] })
                        .setHTML('<div id="vue-popup-content"></div>')
                        .addTo(map)
                    //
                    // new PopupContent({
                    //     propsData: { feature: e.features[0] },
                    // }).$mount('#vue-popup-content')
                }
            },
            getColor(price_per_km, direct) {
                if (price_per_km < .04 && direct) {
                    return '#008000'
                } else if (price_per_km < .04 && !direct) {
                    return '#808000'
                } else if (direct) {
                    return '#FFFFFF'
                } else {
                    return '#000000'
                }
            }
        },
        async mounted() {
            await this.fetchOneWayFlights();
            this.showPopup = true;
            this.geoJsonLayer.source.data.features = this.getGeoJson().map(x => (
                {
                    type: x['type'],
                    properties: {
                        ...x['properties'],
                        pretty_price: this.$options.filters.currency(
                            x['properties']['converted_price'],
                            x['properties']['converted_currency'],
                            0 ,
                            { thousandsSeparator: ' ', spaceBetweenAmountAndSymbol: true }),
                        "text-color": this.getColor(
                            x['properties']['price_per_km_base_currency'],
                            Boolean(x['properties']['direct'])
                        )
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