import AppConfig from "../../AppConfig";
import Cookies from "js-cookie";

export default {
    actions: {
        async fetchComplexSchemas({commit}) {
            let res = await fetch(AppConfig.apiUrl + '/complex-flights-schemas');
            let schemas = await res.json();
            commit('updateComplexSchemas', schemas)
        },
        fetchCombinatorFlights({commit, rootGetters}, {outboundRange, inboundRange, oneWay,
            directIntermediateFlights, visaFreeSegments, stopDurationDays, maxPrice, radius, flightSchema
        }) {
            fetch(AppConfig.apiUrl + '/combinator', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "origins": rootGetters.getOriginItems.map(e=>(e['place_code'])),
                    "destinations": rootGetters.getDestinationItems.map(e=>(e['place_code'])),
                    "exclude_places": rootGetters.getExcludedPlacesItems.map(e=>(e['place_code'])),
                    "outbound_range": outboundRange,
                    "inbound_range": inboundRange,
                    "one_way": oneWay,
                    "direct_only_segments": directIntermediateFlights,
                    "stops_duration": stopDurationDays,
                    "radius": radius,
                    "schema": flightSchema,
                    "max_price_converted": maxPrice,
                    "currency": rootGetters.getCurrency,
                    "visa_free_segments": visaFreeSegments,
                    "citizenships": rootGetters.getCitizenships,
                    "lang": rootGetters.getLang,
                    "limit": 50
                })
            }).then((response) => {
                return response.json().then((json) => {
                    commit('updateCombinatorFlights', json);
                })
            });
        },
        async fetchComplexFlights({commit, rootGetters}, {outboundRange, directIntermediateFlights,
            tripTotalDuration, visaFree, stopDurationDays, radius
        }) {
            commit('updateLoading', true);
            fetch(AppConfig.apiUrl + '/combinator', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "origins": rootGetters.getOriginItems.map(e=>(e['place_code'])),
                    "include_places": rootGetters.getIncludedPlacesItems.map(e=>(e['place_code'])),
                    "exclude_places": rootGetters.getExcludedPlacesItems.map(e=>(e['place_code'])),
                    "outbound_range": outboundRange,
                    "one_way": true,
                    "direct_only_segments": directIntermediateFlights,
                    "stops_duration": stopDurationDays,
                    "total_trip_duration": tripTotalDuration,
                    "radius": radius,
                    "schema": "A->b->c->A",
                    "max_price_converted": rootGetters.getMaxPriceForCurrency,
                    "currency": rootGetters.getCurrency,
                    "visa_free_segments": visaFree,
                    "citizenships": rootGetters.getCitizenships,
                    "lang": rootGetters.getLang,
                    "limit": 100,
                    "kind": "triangle"
                })
            }).then((response) => {
                return response.json().then((json) => {
                    commit('updateComplexFlights', json);
                    commit('updateLoading', false);
                })
            });

        },
        clearCombinatorFlights({commit}) {
            commit('clearMutationCombinatorFlights', [])
        },
        setOutboundDateRange({commit}, outboundDateRange) {
            let _outboundDateRange = [];
            if (outboundDateRange) {
                _outboundDateRange = outboundDateRange
            }
            Cookies.set('outboundDateRange', JSON.stringify(_outboundDateRange), {expires: 10});
            commit('updateOutboundDateRange', _outboundDateRange)
        },
        setInboundDateRange({commit}, inboundDateRange) {
            let _inboundDateRange = [];
            if (inboundDateRange) {
                _inboundDateRange = inboundDateRange
            }
            Cookies.set('inboundDateRange', JSON.stringify(_inboundDateRange), {expires: 10});
            commit('updateInboundDateRange', _inboundDateRange)
        },
        setLoading({commit}, value) {
            commit('updateLoading', value)
        },
    },
    mutations: {
        updateComplexSchemas(state, value) {
            state.complexSchemas = value
        },
        updateOutboundDateRange(state, value) {
            state.outboundDateRange = value;
        },
        updateInboundDateRange(state, value) {
            state.inboundDateRange = value;
        },
        updateLoading(state, value) {
            state.loading = value
        },
        updateCombinatorFlights(state, value) {
            state.combinatorFlights = state.combinatorFlights.concat(value)
        },
        updateComplexFlights(state, value) {
            state.complexFlights = value
        },
        clearMutationCombinatorFlights(state, value) {
            state.combinatorFlights = value
        }
    },
    state: {
        complexSchemas: undefined,
        outboundDateRange: [],
        inboundDateRange: [],
        loading: false,
        combinatorFlights: [],
        complexFlights: []
    },
    getters: {
        getComplexSchemas(state) {
            return state.complexSchemas
        },
        getOutboundDateRange(state) {
            if (state.outboundDateRange && state.outboundDateRange.length > 0) {
                return state.outboundDateRange
            } else if (Cookies.get('outboundDateRange')) {
                return JSON.parse(Cookies.get('outboundDateRange'))
            } else {
                return []
            }
        },
        getInboundDateRange(state) {
            if (state.inboundDateRange && state.inboundDateRange.length > 0) {
                return state.inboundDateRange
            } else if (Cookies.get('inboundDateRange')) {
                return JSON.parse(Cookies.get('inboundDateRange'))
            } else {
                return []
            }
        },
        getLoading(state) {
            return state.loading
        },
        getCombinatorFlightsBySchema: (state) => (schema) => {
            return state.combinatorFlights.filter(el => el['schema'] === schema)
        },
        getCombinatorFlights(state) {
            return state.combinatorFlights
        },
        getComplexFlights(state) {
            return state.complexFlights
        }
    }
}