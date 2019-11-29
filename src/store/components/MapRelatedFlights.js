import AppConfig from "@/AppConfig";


export default {
    actions: {
        async fetchOneWayFlights({commit, rootGetters}, limit=30000) {
            let request =  await fetch(AppConfig.apiUrl + '/one-way', {
                method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "origins": rootGetters.getOriginItems.map(e=>(e['place_code'])),
                    "lang": rootGetters.getLang,
                    "currency": rootGetters.getCurrency,
                    "direct_only": false,
                    "limit": limit})}
            );
            let response = await request.json()
            commit('updateOneWayFlights', response)
        }
    },
    mutations: {
        updateOneWayFlights(state, value) {
            state.oneWayFlights = value
        }
    },
    state: {
        oneWayFlights: []
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
                        ...x
                    },
                    geometry: {
                        type: "Point",
                        coordinates: x['destination_city_location']
                    }
                }),
            )
        }
    }
}
//
// type: "Feature",
//
//     "type": "Feature",
//     "properties": {
//     "title": "Test2"
// },
// "geometry": {
//     "type": "Point",
//         "coordinates": [53.48383155304096, 47.82882682974591],
// }