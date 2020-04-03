import Cookies from "js-cookie";
import axios from 'axios'
import AppConfig from "../../AppConfig";

export default {
    actions: {
        setSearchOrigin({commit}, value) {
            Cookies.set('search_origin', JSON.stringify(value), {expires: 10});
            commit('updateSearchOrigin', value)
        },
        setSearchDestination({commit}, value) {
            Cookies.set('search_destination', JSON.stringify(value), {expires: 10});
            commit('updateSearchDestination', value)
        },
        setSearchOutboundDate({commit}, value) {
            Cookies.set('search_outbound', JSON.stringify(value), {expires: 10});
            commit('updateSearchOutboundDate', value)
        },
        setSearchInboundDate({commit}, value) {
            Cookies.set('search_inbound', JSON.stringify(value), {expires: 10});
            commit('updateSearchInboundDate', value)
        },
        setSearchType({commit}, value) {
            Cookies.set('search_type', JSON.stringify(value), {expires: 10});
            commit('updateSearchType', value)
        },
        async fetchCheapestLive({commit, rootGetters}) {
            commit('updateSearchLoadingDetails', {key: 'liveSearch', value: 'processing'});
            await axios.post(AppConfig.apiUrl + '/cheapest-live-flight',{
                    origin: rootGetters.getSearchOrigin['place_code'],
                    destination: rootGetters.getSearchDestination['place_code'],
                    outbound_date: rootGetters.getSearchOutboundDate,
                    inbound_date: rootGetters.getSearchType === 0 ? rootGetters.getSearchInboundDate : undefined,
                    currency: rootGetters.getCurrency,
                    lang: rootGetters.getLang,
                    country: rootGetters.getCitizenships[0]
            }, {headers: {'Access-Control-Allow-Origin': '*'}})
                .then(response => {
                    commit('updateCheapestLiveDirect', response.data['direct']);
                    commit('updateCheapestLiveNonDirect', response.data['non_direct']);
                    commit('updateSearchLoadingDetails', {key: 'liveSearch', value: 'success'});
                })
                .catch(e => {
                    console.log(e);
                    commit('updateSearchLoadingDetails', {key: 'liveSearch', value: 'error'});
                    })
        },
        async fetchCheapestLiveOutboundForRT({commit, rootGetters}) {
            commit('updateSearchLoadingDetails', {key: 'liveSearchOutboundForRT', value: 'processing'});
            await axios.post(AppConfig.apiUrl + '/cheapest-live-flight',{
                origin: rootGetters.getSearchOrigin['place_code'],
                destination: rootGetters.getSearchDestination['place_code'],
                outbound_date: rootGetters.getSearchOutboundDate,
                currency: rootGetters.getCurrency,
                lang: rootGetters.getLang,
                country: rootGetters.getCitizenships[0]
            }, {headers: {'Access-Control-Allow-Origin': '*'}})
                .then(response => {
                    commit('updateCheapestLiveDirectOutboundForRT', response.data['direct']);
                    commit('updateCheapestLiveNonDirectOutboundForRT', response.data['non_direct']);
                    commit('updateSearchLoadingDetails', {key: 'liveSearchOutboundForRT', value: 'success'});
                })
                .catch(e => {
                    console.log(e);
                    commit('updateSearchLoadingDetails', {key: 'liveSearchOutboundForRT', value: 'error'});
                })
        },
        async fetchCheapestLiveInboundForRT({commit, rootGetters}) {
            commit('updateSearchLoadingDetails', {key: 'liveSearchInboundForRT', value: 'processing'});
            await axios.post(AppConfig.apiUrl + '/cheapest-live-flight',{
                origin: rootGetters.getSearchDestination['place_code'],
                destination: rootGetters.getSearchOrigin['place_code'],
                outbound_date: rootGetters.getSearchInboundDate,
                currency: rootGetters.getCurrency,
                lang: rootGetters.getLang,
                country: rootGetters.getCitizenships[0]
            }, {headers: {'Access-Control-Allow-Origin': '*'}})
                .then(response => {
                    commit('updateCheapestLiveDirectInboundForRT', response.data['direct']);
                    commit('updateCheapestLiveNonDirectInboundForRT', response.data['non_direct']);
                    commit('updateSearchLoadingDetails', {key: 'liveSearchInboundForRT', value: 'success'});
                })
                .catch(e => {
                    console.log(e);
                    commit('updateSearchLoadingDetails', {key: 'liveSearchInboundForRT', value: 'error'});
                })
        },
        async fetchSkiplegged({commit, rootGetters}) {
            commit('updateSearchLoadingDetails', {key: 'skiplegged', value: 'processing'});
            await axios.post(AppConfig.apiUrl + '/skiplegged-live-flight',{
                origin: rootGetters.getSearchOrigin['place_code'],
                destination: rootGetters.getSearchDestination['place_code'],
                outbound_date: rootGetters.getSearchOutboundDate,
                inbound_date: rootGetters.getSearchType === 0 ? rootGetters.getSearchInboundDate : undefined,
                one_way: !(rootGetters.getSearchType === 0),
                currency: rootGetters.getCurrency,
                lang: rootGetters.getLang,
                country: rootGetters.getCitizenships[0]
            }, {headers: {'Access-Control-Allow-Origin': '*'}})
                .then(response => {
                    commit('updateSearchSkiplegged', response.data);
                    commit('updateSearchLoadingDetails', {key: 'skiplegged', value: 'success'});
                })
                .catch(e => {
                    console.log(e);
                    commit('updateSearchLoadingDetails', {key: 'skiplegged', value: 'error'});
                })
        },
        setSearchLoading({commit}, value) {
            commit('updateSearchLoading', value)
        },
        setSearchLoadingDetails({commit}, {key, value}) {
            commit('updateSearchLoadingDetails', {key, value})
        }

    },
    mutations: {
        updateSearchOrigin(state, value) {
            state.searchOrigin = value
        },
        updateSearchDestination(state, value) {
            state.searchDestination = value
        },
        updateSearchOutboundDate(state, value) {
            state.searchOutboundDate = value
        },
        updateSearchInboundDate(state, value) {
            state.searchInboundDate = value
        },
        updateSearchType(state, value) {
            state.searchType = value
        },
        updateCheapestLiveDirect(state, value) {
            state.cheapestLiveDirect = value
        },
        updateCheapestLiveNonDirect(state, value) {
            state.cheapestLiveNonDirect = value
        },
        updateCheapestLiveDirectOutboundForRT(state, value) {
            state.cheapestLiveDirectOutboundForRT = value
        },
        updateCheapestLiveNonDirectOutboundForRT(state, value) {
            state.cheapestLiveNonDirectOutboundForRT = value
        },
        updateCheapestLiveDirectInboundForRT(state, value) {
            state.cheapestLiveDirectInboundForRT = value
        },
        updateCheapestLiveNonDirectInboundForRT(state, value) {
            state.cheapestLiveNonDirectInboundForRT = value
        },
        updateSearchSkiplegged(state, value) {
            state.searchSkiplegged = value
        },
        updateSearchLoading(state, value) {
            state.searchLoading = value
        },
        updateSearchLoadingDetails(state, {key, value}) {
            state.searchLoadingDetails[key] = value
        }
    },
    state: {
        searchOrigin: undefined,
        searchDestination: undefined,
        searchOutboundDate: undefined,
        searchInboundDate: undefined,
        searchType: undefined,
        cheapestLiveDirect: undefined,
        cheapestLiveNonDirect: undefined,
        cheapestLiveDirectOutboundForRT: undefined,
        cheapestLiveNonDirectOutboundForRT: undefined,
        cheapestLiveDirectInboundForRT: undefined,
        cheapestLiveNonDirectInboundForRT: undefined,
        searchLoading: false,
        searchLoadingDetails: {},
        searchSkiplegged: undefined
    },
    getters: {
        getSearchOrigin(state) {
            if (state.searchOrigin) {
                return state.searchOrigin
            } else if (Cookies.get('search_origin')) {
                return JSON.parse(Cookies.get('search_origin'))
            }
        },
        getSearchDestination(state) {
            if (state.searchDestination) {
                return state.searchDestination
            } else if (Cookies.get('search_destination')) {
                return JSON.parse(Cookies.get('search_destination'))
            }
        },
        getSearchOutboundDate(state) {
            if (state.searchOutboundDate) {
                return state.searchOutboundDate
            } else if (Cookies.get('search_outbound')) {
                return JSON.parse(Cookies.get('search_outbound'))
            }
        },
        getSearchInboundDate(state) {
            if (state.searchInboundDate) {
                return state.searchInboundDate
            } else if (Cookies.get('search_inbound')) {
                return JSON.parse(Cookies.get('search_inbound'))
            }
        },
        getSearchType(state) {
            if (state.searchType) {
                return state.searchType
            } else if (Cookies.get('search_type')) {
                return JSON.parse(Cookies.get('search_type'))
            }
        },
        getCheapestLiveDirect(state) {
            return state.cheapestLiveDirect
        },
        getCheapestLiveNonDirect(state) {
            return state.cheapestLiveNonDirect
        },
        getCheapestLiveDirectOutboundForRT(state) {
            return state.cheapestLiveDirectOutboundForRT
        },
        getCheapestLiveNonDirectOutboundForRT(state) {
            return state.cheapestLiveNonDirectOutboundForRT
        },
        getCheapestLiveDirectInboundForRT(state) {
            return state.cheapestLiveDirectInboundForRT
        },
        getCheapestLiveNonDirectInboundForRT(state) {
            return state.cheapestLiveNonDirectInboundForRT
        },
        getSearchLoading(state) {
            return state.searchLoading
        },
        getSearchLoadingDetails(state) {
            return state.searchLoadingDetails
        },
        getSearchLoadingDetailByKey: (state) => (key) => {
            return state.searchLoadingDetails[key]
        },
        getSearchSkiplegged(state) {
            return state.searchSkiplegged
        }
    }
}