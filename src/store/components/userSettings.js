import Cookies from 'js-cookie';
import AppConfig from "@/AppConfig";
import i18n from "@/i18n";

export default {
    actions: {
        async setDarkTheme({commit}, value) {
            Cookies.set('darkTheme', value ? 1 : 0, {expires: 365});
            commit('updateDarkTheme', value);
        },
        setVisaFree({commit}, value) {
            Cookies.set('visaFree', value ? 1 : 0, {expires: 365});
            commit('updateVisaFree', value);
        },
        setLang({commit}, value) {
            Cookies.set('lang', value, {expires: 365});
            commit('updateLang', value);

        },
        setCurrency({commit}, value) {
            Cookies.set('currency', value, {expires: 365});
            commit('updateCurrency', value)
        },
        async fetchCountries({commit}, lang) {
            let res = await fetch(AppConfig.apiUrl + '/countries?lang=' + lang);
            let countries = await res.json();
            commit('updateCountries', countries)
            return true
        },
        setCitizenships({commit}, value) {
            Cookies.set('citizenships', JSON.stringify(value), {expires: 365});
            commit('updateCitizenships', value)
        },
        setSearchMonths({commit}, value) {
            Cookies.set('searchMonths', JSON.stringify(value), {expires:365});
            commit('updateSearchMonths', value)
        },
        setSearchDays({commit}, value) {
            Cookies.set('searchDays', JSON.stringify(value), {expires:365});
            commit('updateSearchDays', value)
        },
        setMinMaxDuration({commit}, value) {
            Cookies.set('minMaxDuration', value, {expires: 365});
            commit('updateMinMaxDuration', value)
        },
        async fetchIpInfo({commit, dispatch}) {
            try {
                let res = await fetch(AppConfig.ipInfoUrl);
                let ipInfo = await res.json();
                commit('updateIpInfo', ipInfo);
                Cookies.set('ipInfo', JSON.stringify(ipInfo), {expires: 365});
                dispatch('setGeo', {
                    longitude: ipInfo['longitude'],
                    latitude: ipInfo['latitude']
                });
                if (!Cookies.get('citizenships') && ipInfo['country_code']) {
                    dispatch('setCitizenships', [ipInfo['country_code']]);
                    if (!Cookies.get('lang')) {
                        if (ipInfo['country_code'] === "RU") {
                            dispatch('setLang', 'ru');
                            i18n.locale = 'ru';
                            dispatch('fetchCountries', 'ru');
                            dispatch('setCurrency', 'RUB');
                        }
                    }
                }
                return ipInfo
            } catch (e) {
                console.error(e)
                let res = "{\"ip\":\"217.12.97.173\",\"country_code\":\"RU\",\"country_name\":\"Россия\",\"region_code\":\"MOW\",\"region_name\":\"Москва\",\"city\":\"Москва\",\"zip_code\":\"129223\",\"time_zone\":\"Europe/Moscow\",\"latitude\":55.7527,\"longitude\":37.6172,\"metro_code\":0}";
                let ipInfo = JSON.parse(res);
                commit('updateIpInfo', ipInfo);
                Cookies.set('ipInfo', JSON.stringify(ipInfo), {expires: 365});
                dispatch('setGeo', {
                    longitude: ipInfo['longitude'],
                    latitude: ipInfo['latitude']
                });
                return ipInfo
            }
        },
        setGeo({commit, longitude, latitude}) {
            commit('updateGeo', {longitude: longitude, latitude: latitude})
        },
        async fetchNearbyAirports({commit}, {longitude, latitude}) {
            let res = await fetch(AppConfig.apiUrl + '/nearby-airports?'
                                        + `lon=${longitude}&lat=${latitude}`);
            let airports_res = await res.json();
            let airports = airports_res['data'];
            Cookies.set('nearbyAirports', JSON.stringify(airports), {expires: 365});
            commit('updateNearbyAirports', airports);
            commit('updateOriginsStatus', true);
            return true
        },
        async recoverFromCookiesNearbyAirports({commit}) {
            if (Cookies.get('nearbyAirports')) {
                commit('updateNearbyAirports', JSON.parse( Cookies.get('nearbyAirports')));
                commit('updateOriginsStatus', true)
            }
            return true
        },
        setOriginItems({commit}, value) {
            if (value.length) {
                Cookies.set('originItems', JSON.stringify(value), {expires: 365})
            } else {
                Cookies.remove('originItems')
            }
            commit('updateOriginItems', value)
        },
        setLocationSnackbarSeen({commit}, value=true) {
            Cookies.set('locationSnackbarSeen', Number(value), {expires: 365});
            commit('updateLocationSnackbarSeen', value)
        }
    },
    mutations: {
        updateDarkTheme(state, value) {
            state.darkTheme = value;
        },
        updateVisaFree(state, value) {
            state.visaFree = value;
        },
        updateLang(state, value) {
            state.lang = value;
        },
        updateCurrency(state, value) {
            state.currency = value
        },
        updateCountries(state, value) {
            state.allCountries = value
        },
        updateCitizenships(state, value) {
            state.citizenships = value
        },
        updateSearchMonths(state, value) {
            state.searchMonths = value
        },
        updateSearchDays(state, value) {
            state.searchDays = value
        },
        updateMinMaxDuration(state, value) {
            state.minMaxDuration = value
        },
        updateIpInfo(state, value) {
            state.ipInfo = value
        },
        updateGeo(state, longitude, latitude) {
            state.longitude = longitude;
            state.latitude = latitude
        },
        updateNearbyAirports(state, value) {
            state.nearbyAirports = value
        },
        updateOriginItems(state, value) {
            state.originItems = value
        },
        updateOriginsStatus(state, value) {
            state.originsStatus = value
        },
        updateLocationSnackbarSeen(state, value) {
            state.locationSnackbarSeen = value
        }
    },
    state: {
        darkTheme: undefined,
        visaFree: false,
        lang: undefined,
        allLangs: ["en", "ru"],
        currency: undefined,
        allCurrencies: [
            { title: "USD", symbol: "$" },
            { title: "EUR", symbol: "€" },
            { title: "RUB", symbol: "₽" },
            { title: "AUD", symbol: "A$" },
            { title: "CAD", symbol: "C$" },
            { title: "JPY", symbol: "¥" },
            { title: "CNY", symbol: "¥" }
        ],
        allCountries: [],
        citizenships: [],
        today: new Date(),
        searchMonths: undefined,
        searchDays: [],
        minMaxDuration: undefined,
        ipInfo: undefined,
        longitude: undefined,
        latitude: undefined,
        nearbyAirports: undefined,
        originItems: undefined,
        originsStatus: false,
        locationSnackbarSeen: false
    },
    getters: {
        getDarkTheme(state) {
            if (state.darkTheme !== undefined) {
                return state.darkTheme
            }
            else if (Cookies.get('darkTheme') !== undefined) {
                return !!Number(Cookies.get('darkTheme'))
            }
            else {
                return true
            }
        },
        getVisaFree(state) {
            return state.visaFree || !!Number(Cookies.get('visaFree'))
        },
        getLang(state) {
            return state.lang || Cookies.get('lang') || 'en'
        },
        getAllLangs(state) {
            return state.allLangs
        },
        getCurrency(state) {
            return state.currency || Cookies.get('currency') || 'USD'
        },
        getAllCurrencies(state) {
            return state.allCurrencies
        },
        getAllCountries(state) {
            return state.allCountries
        },
        getCitizenships(state) {
            if (state.citizenships.length) {
                return state.citizenships
            }
            else if (Cookies.get('citizenships')) {
                return JSON.parse(Cookies.get('citizenships'))
            } else {
                return []
            }
        },
        getAllMonthsStr(state) {
            let months = [];
            for (let i = 0; i <= 12; i++) {
                let today = new Date(+state.today);
                today.setDate(1);
                today.setMonth(today.getMonth() + i)
                months.push(today.toISOString().substr(0,7));
            }
            return months
        },
        getSelectedSearchMonths(state, getters) {
            if ( state.searchMonths ) {
                if (state.searchMonths.every(element => getters.getAllMonthsStr.includes(element))) {
                    return state.searchMonths
                } else {
                    return getters.getAllMonthsStr
                }
            }
            else if ( Cookies.get('searchMonths')) {
                let cookieMonths = JSON.parse(Cookies.get('searchMonths'));
                if (cookieMonths.every(element => getters.getAllMonthsStr.includes(element))) {
                    return cookieMonths
                } else {
                    return getters.getAllMonthsStr
                }
            } else {
                return getters.getAllMonthsStr
            }
        },
        getSelectedSearchDays(state) {
            if (Cookies.get('searchDays')) {
                let cookieDays = JSON.parse(Cookies.get('searchDays'));
                return cookieDays
            } else {
                return state.searchDays
            }
        },
        getMinMaxDuration(state) {
            if (state.minMaxDuration) {
                return state.minMaxDuration
            } else if (Cookies.get('minMaxDuration')) {
                return JSON.parse(Cookies.get('minMaxDuration'))
            } else {
                return [0, 365]
            }
        },
        getIpInfo(state) {
            if (state.ipInfo) {
                return state.ipInfo
            } else if (Cookies.get('ipInfo')) {
                return JSON.parse(Cookies.get('ipInfo'))
            } else {
                return undefined
            }
        },
        getNearbyAirports(state) {
            return state.nearbyAirports || JSON.parse( Cookies.get('nearbyAirports') || '["LED", "FL"]')
        },
        getUserCountry(state) {
            if (state.citizenships.length) {
                return state.citizenships[0]
            } else if (Cookies.get('citizenships')
                   && JSON.parse(Cookies.get('citizenships')).length) {
                return JSON.parse(Cookies.get('citizenships'))[0]
            } else {
                return "UK"
            }
        },
        getOriginItems(state, getters) {
            if (state.originItems) {
                return state.originItems
            } else if (Cookies.get('originItems')) {
                return JSON.parse(Cookies.get('originItems'))
            } else if (state.nearbyAirports) {
               return  state.nearbyAirports.map(e => ({'place_code': e, 'type': 'airport', 'place_name': e}))
            } else if (Cookies.get('nearbyAirports')) {
                let nearby  = getters.getNearbyAirports;
                let res = nearby.map(e => ({'place_code': e, 'type': 'airport', 'place_name': e}));
                return res
            } else {
                return []
            }
        },
        getLocationSnackbarSeen(state) {
            return state.locationSnackbarSeen || Boolean(Cookies.get('locationSnackbarSeen'))
        },
        // getUserSettingsLoadingStatus() {
        //     return Boolean(Cookies.get('lang') || false)
        // },
        originsStatus(state) {
            return state.originsStatus
        },
    }
}