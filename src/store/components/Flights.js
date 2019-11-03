import AppConfig from "@/AppConfig";
import i18n from "@/i18n";

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
        searchParamsChanged({commit}) {
            commit('updateSearchParamsChanged')
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
        }
    },
    state: {
        collectionHeaders: [],
        collections: {},
        searchParamsChanged: 0
    },
    getters: {
        getCollectionHeaders(state) {
            return state.collectionHeaders.map(e => ({
                id: e['id'],
                title: i18n.locale === 'ru' ? e['title_ru'] : e['title_en']
            }))
        },
        getCollectionFlights: (state) => (id) => {
            return state.collections[id]
        },
        searchParamsChanged(state) {
            return state.searchParamsChanged
        }
    }
}