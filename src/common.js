export default {
        skyscannerLink(flight) {
            let link_arr = [
                "https://www.skyscanner.ru/transport/flights",
                flight['origin_city_id'],
                flight['destination_city_id'],
                flight['outbound_dt'],
                flight['inbound_dt']
            ];
            return link_arr.join("/");
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
        kayakLink(flight) {
            let url = 'https://www.kayak.com/flights/';
            url += `${flight['origin_city_iata']}-${flight['destination_city_iata']}/`;
            url += flight['outbound_dt'];
            url += '/';
            url += flight['inbound_dt'];
            return url
        }
}