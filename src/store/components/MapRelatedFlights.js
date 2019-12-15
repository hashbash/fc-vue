import AppConfig from "@/AppConfig";
import Vue2Filters from "vue2-filters";


export default {
    mixins: [Vue2Filters.mixin],
    actions: {
        async fetchOneWayFlights({commit, rootGetters}, {days, directOnly, limit=500}) {
            let request = await fetch(AppConfig.apiUrl + '/one-way', {
                method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "origins": rootGetters.getOriginItems.map(e=>(e['place_code'])),
                    "date_list": days,
                    "visa_free": rootGetters.getVisaFree,
                    "citizenships": rootGetters.getCitizenships,
                    "lang": rootGetters.getLang,
                    "currency": rootGetters.getCurrency,
                    "direct_only": directOnly,
                    "limit": limit})}
            );
            let response = await request.json();
            commit('updateOneWayFlights', response)
        },
        setMapFieldsSearchClicked({commit}) {
            commit('updateMapFieldsSearchClicked', true)
        }
    },
    mutations: {
        updateOneWayFlights(state, value) {
            state.oneWayFlights = value
        },
        updateMapFieldsSearchClicked(state, value) {
            state.mapFieldsSearchClicked = value
        }
    },
    state: {
        oneWayFlights: [],
        mapFieldsSearchClicked: false
    },
    getters: {
        getOneWayFlights(state) {
            return state.oneWayFlights
        },
        getGeoJson(state) {
            return state.oneWayFlights.map(
                x => ({
                    type: "Feature",
                    properties: {
                        ...x,
                        pretty_price: x['converted_price'].toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$& '),
                        symbol_title: x['destination_city_name'] + '\n' +
                            x['converted_price'].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ').slice(0, -3),
                    },
                    geometry: {
                        type: "Point",
                        coordinates: x['destination_city_location']
                    }
                }),
            )
        },
        getMapFieldsSearchClicked(state) {
            return state.mapFieldsSearchClicked
        }
    }
}