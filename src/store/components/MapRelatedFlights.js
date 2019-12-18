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
        setFixedFlights({commit}, {value=[]}) {
            commit('updateFixedFlights', value)
        },
        async fetchFixedFlightsAsync({commit, rootGetters}, {destination_city_id, limit=500}) {
            let request = await fetch(AppConfig.apiUrl + '/one-way', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "type": 'fixed',
                    "destination_city_id": destination_city_id,
                    "origins": rootGetters.getOriginItems.map(e=>(e['place_code'])),
                    "date_list": rootGetters.getSearchDays,
                    "visa_free": rootGetters.getVisaFree,
                    "citizenships": rootGetters.getCitizenships,
                    "lang": rootGetters.getLang,
                    "currency": rootGetters.getCurrency,
                    "direct_only": rootGetters.getSearchDirectOnly,
                    "limit": limit})}
            );
            let response = await request.json();
            commit('updateFixedFlights', response);
            return response
        },
        fetchFixedFlights({commit, rootGetters}, {destination_city_id, limit=500}) {
            fetch(AppConfig.apiUrl + '/one-way', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "type": 'fixed',
                    "destination_city_id": destination_city_id,
                    "origins": rootGetters.getOriginItems.map(e=>(e['place_code'])),
                    "date_list": rootGetters.getSearchDays,
                    "visa_free": rootGetters.getVisaFree,
                    "citizenships": rootGetters.getCitizenships,
                    "lang": rootGetters.getLang,
                    "currency": rootGetters.getCurrency,
                    "direct_only": rootGetters.getSearchDirectOnly,
                    "limit": limit})}
            ).then((response) => {
                    return response.json().then((json) => {
                        console.log(33);
                        console.log(json);
                        commit('updateFixedFlights', json);
                    })
            });
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
        },
        updateFixedFlights(state, value) {
            state.fixedFlights = value
        }
    },
    state: {
        oneWayFlights: [],
        mapFieldsSearchClicked: false,
        fixedFlights: []
    },
    getters: {
        getOneWayFlights(state) {
            return state.oneWayFlights
        },
        getGeoJson(state) {
            if (state.oneWayFlights.length) {
                return state.oneWayFlights.map(
                    x => ({
                        type: "Feature",
                        properties: {
                            ...x,
                            pretty_price: x['converted_currency'] + ' ' +
                                x['converted_price'].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').slice(0, -3),
                            symbol_title: x['destination_city_name'] + '\n' + x['converted_currency'] + ' ' +
                                x['converted_price'].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ').slice(0, -3),
                        },
                        geometry: {
                            type: "Point",
                            coordinates: x['destination_city_location']
                        }
                    }),
                )
            } else {
                return []
            }
        },
        getMapFieldsSearchClicked(state) {
            return state.mapFieldsSearchClicked
        },
        getFixedFlights(state) {
            return state.fixedFlights
        },
        fetchAndGetFixedFlights: (state, getters, rootState, rootGetters) => (destination_city_id) => {
            fetch(AppConfig.apiUrl + '/one-way', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    "type": 'fixed',
                    "destination_city_id": destination_city_id,
                    "origins": rootGetters.getOriginItems.map(e=>(e['place_code'])),
                    "date_list": rootGetters.getSelectedSearchDays,
                    "visa_free": rootGetters.getVisaFree,
                    "citizenships": rootGetters.getCitizenships,
                    "lang": rootGetters.getLang,
                    "currency": rootGetters.getCurrency,
                    "direct_only": rootGetters.getSearchDirectOnly,
                    "limit": 500})}
            ).then((response) => {
                response.json().then((json) => {
                    return json
                })
            });
        },
        fetchAndGetFixedFlights2(state, getters, rootState, rootGetters) {
            return (destination_city_id) => {
            let serverResponse = undefined;
            fetch(AppConfig.apiUrl + '/one-way', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    "type": 'fixed',
                    "destination_city_id": destination_city_id,
                    "origins": rootGetters.getOriginItems.map(e=>(e['place_code'])),
                    "date_list": rootGetters.getSelectedSearchDays,
                    "visa_free": rootGetters.getVisaFree,
                    "citizenships": rootGetters.getCitizenships,
                    "lang": rootGetters.getLang,
                    "currency": rootGetters.getCurrency,
                    "direct_only": rootGetters.getSearchDirectOnly,
                    "limit": 500})}
            ).then((response) => {
                response.json().then((json) => {
                    serverResponse = json
                })
            });
            return serverResponse
        }},
    }
}