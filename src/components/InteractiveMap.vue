<template>
    <div>
        <v-content>
                    <MglMap :accessToken="accessToken"
                            :mapStyle.sync="mapStyle"
                            :scrollZoom="false"
                            :center="mapCenter"
                            :zoom="defaultZoom"
                            @load="onMapLoaded"
                    />
            </v-content>
    </div>
</template>

<script>

import Mapbox from "mapbox-gl";
import { MglMap } from "vue-mapbox";

    export default {
        name: "InteractiveMap",
        components: {
            MglMap
        },
        data() {
            return {
                accessToken: 'pk.eyJ1IjoiYnJhaW40bW9ua2V5IiwiYSI6ImNrMzBnNWM2czBuemkzbXMwd24zYzA4cmYifQ.brnSEahYdRNXMhE54aXfwg', // your access token. Needed if you using Mapbox maps
                mapStyle: 'mapbox://styles/mapbox/light-v10', // your map style
                defaultZoom: 1,
                mapCenter: [-71.038887, 42.364506],
                // mapStyle: 'mapbox://styles/mapbox/light-v9',
                markerColor: 'blue',
                useCustomMarker: false,
                buttonDisabled: false,
                counter: 0,
                selectedMarker: null,
                payload: [],
                // Geocoder
                address: '',
            };
        },
        methods: {
            onMapLoaded(event) {
                this.map = event.map;
                // this.addMarkers();
                // this.addGeocoder();
            },
        },

        created() {
            // We need to set mapbox-gl library here in order to use it in template
            this.map = null;
            this.mapbox = Mapbox;
        }
    }
</script>

<style scoped>

</style>