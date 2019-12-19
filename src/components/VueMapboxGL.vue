<template>
    <div class="map">
    <v-content
            class="ma-0 pa-0"
            style="min-height: 520px; min-width: 100%">
        <mapbox
                :access-token="accessToken"
                :map-options="{
                    style: 'mapbox://styles/mapbox/dark-v9',
                    center: [0, 30],
                    zoom: 2
                  }"
                @map-init="mapInitialized"
                @map-load="loaded"
                @map-click:points="clicked"
                @map-mouseenter:points="mouseEntered"
                @map-mouseleave:points="mouseLeft"
                :scale-control="{
                    show: true,
                    position: 'top-left',
                  }"
                :fullscreen-control="{
                    show: true,
                    position: 'top-right',
                  }"
        />
    </v-content>
    </div>
</template>

<script>
    import AppConfig from "@/AppConfig";
    import Mapbox from 'mapbox-gl-vue'
    import mapboxgl from 'mapbox-gl';
    import VueMapboxPopup from "@/components/VueMapboxPopup";
    import {mapGetters, mapActions} from "vuex";

    export default {
        name: "VueMapboxGL",
        components: { Mapbox },
        data:() => ({
            map: null,
            accessToken: AppConfig.MapBoxAccessToken
        }),
        computed: {
            features: {
                get() {
                    return this.getGeoJson()
                },
            }
        },
        methods: {

            ...mapGetters(['getGeoJson', 'getFixedFlights', 'fetchAndGetFixedFlights']),
            ...mapActions(['fetchFixedFlights', 'setFixedFlights', 'fetchFixedFlightsAsync']),
            mapInitialized(map) {
                this.map = map;
            },
            loaded(map) {
                map.addSource('prices', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: this.features
                    }
                });
                map.addLayer({
                    id: 'points',
                    type: 'symbol',
                    source: 'prices',
                    layout: {
                        // 'icon-image': '{icon}-15',
                        'text-field': '{symbol_title}',
                        // 'text-color': 'white',
                        // 'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                        // 'text-offset': [0, 0.6],
                        // 'text-anchor': 'top',
                    },
                    paint: {
                        "text-color": "#ffffff"
                    }
                });

            },
            async clicked(map, e) {
                if (e.features) {
                    const coordinates = e.features[0].geometry.coordinates.slice();

                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
                    }


                    // console.log(this.fetchAndGetFixedFlights()(e.features[0].properties['destination_city_id']));

                    this.map.flyTo({
                        center: [
                            coordinates[0],
                            coordinates[1]
                        ],
                        speed: 0.5,
                        zoom: this.map.getZoom() > 3 ? this.map.getZoom() : this.map.getZoom() + 1
                    });

                    new mapboxgl.Popup()
                        .setLngLat({ lng: coordinates[0], lat: coordinates[1] })
                        .setHTML('<v-content id="vue-mapbox-popup"></v-content>')
                        .addTo(map);

                    this.setFixedFlights([]);
                    let res = this.fetchFixedFlightsAsync({destination_city_id: e.features[0].properties['destination_city_id']});

                    let i18n = this.$i18n;
                    new VueMapboxPopup({
                        store: this.$store,
                        i18n: this.$i18n,
                        propsData: {
                            feature: e.features[0],
                            flights: res,
                            i18n: i18n
                        },
                    }).$mount('#vue-mapbox-popup');


                }
            },
            mouseEntered(map) {
                map.getCanvas().style.cursor = 'pointer'
            },
            mouseLeft(map) {
                map.getCanvas().style.cursor = ''
            },
        },
        watch: {
            features: function(value) {
                if (this.map.getSource('prices') !== undefined) {
                    // console.log(this.map);
                    // console.log(value);
                    this.map.getSource('prices').setData({
                            type: 'FeatureCollection',
                            features: value
                    });
            }
            }
        }
    }
</script>

<style>
    #map {
        width: 100%;
        height: 520px;
    }
</style>