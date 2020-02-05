import AppConfig from "@/AppConfig";
import i18n from "@/i18n";
import Cookies from 'js-cookie'

export default {
    actions: {
        async fetchCollections({commit}) {
            let res = await fetch(AppConfig.apiUrl + '/collection-headers');
            let collectionHeaders = await res.json();
            commit('updateCollectionHeaders', collectionHeaders)
        },
        async fetchCollectionFlights({commit, rootGetters}, {collectionId, limit=48}) {
            let url = AppConfig.apiUrl + '/collections'
                + `?id=${collectionId}`
                + `&origins=${rootGetters.getOriginItems.map(e=>(e['place_code'])).join()}`
                + `&currency=${rootGetters.getCurrency}`
                + `&months_YYYYMM=${ rootGetters.getSelectedSearchMonths.map(e=>(Number(e.replace('-', ''))))}`
                + `&lang=${rootGetters.getLang}`
                + `&limit=${limit}`;
            if (rootGetters.getVisaFree === true) {
                url += `&visa_free=${rootGetters.getVisaFree}`;
                url += `&citizenships=${rootGetters.getCitizenships.join()}`
            }
            if (rootGetters.getMinMaxDuration[0] !== 0 || rootGetters.getMinMaxDuration[1] !== 365) {
                url += `&trip_duration=${rootGetters.getMinMaxDuration.join()}`
            }
            let res = await fetch(url);
            let flights = await res.json();
            commit('updateCollection', {id: collectionId, flights: flights['data']})
            return true
        },
        async fetchComplexCollectionFlights({commit, rootGetters}, {collectionId, limit=80}) {
            let request = await fetch(AppConfig.apiUrl + '/complex-collections', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "collection_id": collectionId,
                    "origins": rootGetters.getOriginItems.map(e=>(e['place_code'])),
                    "months_YYYYMM": rootGetters.getSelectedSearchMonths.map(e=>(Number(e.replace('-', '')))),
                    "lang": rootGetters.getLang,
                    "currency": rootGetters.getCurrency,
                    "visa_free": rootGetters.getVisaFree,
                    "citizenships": rootGetters.getCitizenships,
                    "trip_duration": rootGetters.getMinMaxDuration,
                    "limit": limit})}
                );
            let response = await request.json();
            commit('updateCollection', {id: collectionId, flights: response});
            return true
        },
        async fetchSimpleFlights({commit, rootGetters}, {outbound_dates, inbound_dates, visa_free, direct_only, one_way, order_by='price', tags=[], limit=100}) {
            let request = await fetch(AppConfig.apiUrl + '/simple-flights', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "origins": rootGetters.getOriginItems.map(e=>(e['place_code'])),
                    "outbound_dates": outbound_dates,
                    "inbound_dates": inbound_dates,
                    "direct_only": direct_only,
                    "one_way": one_way,
                    "tags": tags,
                    "lang": rootGetters.getLang,
                    "currency": rootGetters.getCurrency,
                    "visa_free": visa_free,
                    "citizenships": rootGetters.getCitizenships,
                    "order_by": order_by === null ? 'price' : order_by,
                    "limit": limit
                })
            });
            let response = await request.json();
            commit('updateSimpleFlights', response);
        },
        async fetchPriceHistory({commit, rootGetters}, {outbound_dates, inbound_dates, direct_only, one_way, limit=365}) {
            commit('updatePriceHistoryLoading', true);
            let request = await fetch(AppConfig.apiUrl + '/price-history', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "origins": rootGetters.getOriginItems.map(e=>(e['place_code'])),
                    "destinations": rootGetters.getDestinationItems.map(e=>(e['place_code'])),
                    "outbound_dates": outbound_dates,
                    "inbound_dates": inbound_dates,
                    "one_way": one_way,
                    "direct_only": direct_only,
                    "lang": rootGetters.getLang,
                    "currency": rootGetters.getCurrency,
                    "limit": limit
                })
            });
            let response = await request.json();
            commit('updatePriceHistory', response);
            commit('updatePriceHistoryLoading', false);
        },
        async fetchCachedFlights({commit, rootGetters}, {outbound_dates, inbound_dates, direct_only, one_way, limit=365}) {
            commit('updateCachedFlightsLoading', true);
            let request = await fetch(AppConfig.apiUrl + '/cached-flights', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "origins": rootGetters.getOriginItems.map(e=>(e['place_code'])),
                    "destinations": rootGetters.getDestinationItems.map(e=>(e['place_code'])),
                    "outbound_dates": outbound_dates,
                    "inbound_dates": inbound_dates,
                    "one_way": one_way,
                    "direct_only": direct_only,
                    "lang": rootGetters.getLang,
                    "currency": rootGetters.getCurrency,
                    "limit": limit
                })
            });
            let response = await request.json();
            commit('updateCachedFlights', response);
            commit('updateCachedFlightsLoading', false);
        },
        fetchLiveCacheSearch({commit, rootGetters}) {
            fetch(AppConfig.apiUrl + '/live-cache-search', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "origins": rootGetters.getOriginItems.map(e=>(e['place_code'])),
                    "destinations": rootGetters.getDestinationItems.map(e=>(e['place_code'])),
                    "outbound_dates": rootGetters.getOutboundDates,
                    "inbound_dates": rootGetters.getInboundDates,
                    "requests_limit": 20
                })
            }).then((response) => {
                return response.json().then((json) => {
                    commit('updateLiveCacheSearch', json);
                })
            });
        },
        async fetchTags({commit}) {
            let request = await fetch(AppConfig.apiUrl + '/tags');
            let response = await request.json();
            commit('updateTags', response);
        },
        searchParamsChanged({commit}) {
            commit('updateSearchParamsChanged')
        },
        setOutboundDates({commit}, outboundDates) {
            let _outboundDates = [];
            if (outboundDates) {
                _outboundDates = outboundDates
            }
            Cookies.set('outboundDates', JSON.stringify(_outboundDates), {expires: 10});
            commit('updateOutboundDates', _outboundDates)
        },
        setInboundDates({commit}, inboundDates) {
            let _inboundDates = [];
            if (inboundDates) {
                _inboundDates = inboundDates
            }
            Cookies.set('inboundDates', JSON.stringify(_inboundDates), {expires: 10});
            commit('updateInboundDates', _inboundDates)
        },
        setOneWayOnly({commit}, {oneWayOnly}) {
            commit('updateOneWayOnly', oneWayOnly)
        }

    },
    mutations: {
        updateCollectionHeaders(state, value) {
            state.collectionHeaders = value
        },
        updateCollection(state, {id, flights}) {
            state.collections = {...state.collections, ...{[id]: flights}}
        },
        updateSearchParamsChanged(state) {
            state.searchParamsChanged++
        },
        updateTags(state, value) {
            state.tags = value
        },
        updateSimpleFlights(state, value) {
            state.simpleFlights = value
        },
        updatePriceHistory(state, value){
            state.priceHistory = value;
        },
        updatePriceHistoryLoading(state, value) {
            state.priceHistoryLoading = value
        },
        updateCachedFlights(state, value){
            state.cachedFlights = value;
        },
        updateCachedFlightsLoading(state, value) {
            state.cachedFlightsLoading = value
        },
        updateLiveCacheSearch(state, value) {
            state.liveCacheSearch = value
        },
        updateOutboundDates(state, value) {
            state.outboundDates = value;
        },
        updateInboundDates(state, value) {
            state.inboundDates = value;
        },
        updateOneWayOnly(state, value) {
            state.oneWayOnly = value;
        }
    },
    state: {
        collectionHeaders: [],
        collections: {},
        searchParamsChanged: 0,
        tags: [],
        simpleFlights: [],
        priceHistory: [],
        priceHistoryLoading: false,
        cachedFlights: [],
        cachedFlightsLoading: false,
        outboundDates: [],
        inboundDates: [],
        oneWayOnly: [],
        liveCacheSearch: []
    },
    getters: {
        getCollectionHeaders(state) {
            return state.collectionHeaders.map(e => ({
                id: e['id'],
                kind: e['kind'],
                icon: e['icon'],
                title: i18n.locale === 'ru' ? e['title_ru'] : e['title_en']
            }))
        },
        getCollectionFlights: (state) => (id) => {
            return state.collections[id]
        },
        searchParamsChanged(state) {
            return state.searchParamsChanged
        },
        getTags(state) {
            return state.tags
        },
        getSimpleFlights(state) {
            return state.simpleFlights
        },
        getPriceHistory(state) {
            return state.priceHistory
        },
        getPriceHistoryLoading(state) {
            return state.priceHistoryLoading
        },
        getCacheFlights(state) {
            return state.cachedFlights
        },
        getCacheFlightsLoading(state) {
            return state.cachedFlightsLoading
        },
        getLiveCacheSearch(state) {
            return state.liveCacheSearch
        },
        getOutboundDates(state) {
            if (state.outboundDates && state.outboundDates.length > 0) {
                return state.outboundDates
            } else if (Cookies.get('outboundDates')) {
                return JSON.parse(Cookies.get('outboundDates'))
            } else {
                return []
            }
        },
        getInboundDates(state) {
            if (state.inboundDates && state.inboundDates.length > 0) {
                return state.inboundDates
            } else if (Cookies.get('inboundDates')) {
                return JSON.parse(Cookies.get('inboundDates'))
            } else {
                return []
            }
        },
        getOneWayOnly(state) {
            return state.oneWayOnly
        }
    }
}