export default {
    skyscannerLink(flight) {
        let link_arr = [
            "https://www.skyscanner.com/transport/flights",
            flight['origin_city_id'],
            flight['destination_city_id'],
            flight['outbound_dt'],
            flight['inbound_dt']
        ];
        return link_arr.join("/");
    },
    skyscannerComplexLink(route) {
        let link = 'https://www.skyscanner.com/transport/d/';
        let query = [];
        function addToQuery(flight) {
            query.push(flight['origin_city_id']);
            query.push(flight['outbound_dt']);
            query.push(flight['destination_city_id']);
        }
        route.forEach(addToQuery);
        return link + query.join('/')
    },
    aviasalesLink(flight) {
        let url = 'https://www.aviasales.com/';
        if (flight['converted_currency'] === 'RUB') {
            url = 'https://www.aviasales.ru/'
        }
        url += '?marker=201249';
        url += `&origin_iata=${flight['origin_city_iata']}`;
        url += `&destination_iata=${flight['destination_city_iata']}`;
        url += `&depart_date=${flight['outbound_dt']}`;
        if (flight['inbound_dt']) {
            url += `&return_date=${flight['inbound_dt']}`;
        }
        url += '&with_request=true';
        url += `&currency=${flight['converted_currency']}`;
        return url
    },
    aviasalesComplexLink(route) {
        let url = 'https://www.aviasales.com/flights/?';
        if (route[0]['converted_currency'] === 'RUB') {
            url = 'https://www.aviasales.ru/flights?'
        }
        let query = [];
        route.forEach(
            function (flight, index) {
                query.push(`segments[${index}][origin_iata]=${flight['origin_city_iata']}`);
                query.push(`segments[${index}][destination_iata]=${flight['destination_city_iata']}`);
                query.push(`segments[${index}][depart_date]=${flight['outbound_dt']}`);
            }
        );
        query.push(`&currency=${route[0]['converted_currency']}`);
        query.push('with_request=true');
        query.push('marker=201249');
        return url + query.join('&')
    },
    kayakLink(flight) {
        let url = 'https://www.kayak.com/flights/';
        if (flight['converted_currency'] === 'RUB') {
            url = 'https://www.kayak.ru/flights/'
        }
        url += `${flight['origin_city_iata']}-${flight['destination_city_iata']}/`;
        url += flight['outbound_dt'];
        url += '/';
        url += flight['inbound_dt'];
        return url
    },
    kayakComplexLink(route) {
        let url = 'https://www.kayak.com/flights/';
        if (route[0]['converted_currency'] === 'RUB') {
            url = 'https://www.kayak.ru/flights/'
        }
        let query = [];
        function addToQuery(flight) {
            query.push(`${flight['origin_city_iata']}-${flight['destination_city_iata']}`);
            query.push(flight['outbound_dt'])
        }
        route.forEach(addToQuery);
        return url + query.join('/')
    },
    getDateRange(sourceDate, gap, len) {
        let parts = sourceDate.split("-");
        let dt = new Date(parts[0], parts[1]-1, parts[2]);
        let res = [];
        for (let x of Array(len).keys()) {
            let currDate = new Date(dt.getTime());
            currDate.setDate(currDate.getDate() + gap + x);
            res.push(currDate)
        }
        return res.map(x => x.toISOString().split('T')[0])
    }
}