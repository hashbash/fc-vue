import AppConfig from "./AppConfig";

export default {
    skyscannerLink(flight) {
        let link_arr = [
            "https://www.skyscanner.com/transport/flights",
            flight['origin_city_id'],
            flight['destination_city_id'],
            flight['outbound_dt'],
            flight['inbound_dt']
        ];
        let url = link_arr.join("/");
        if (flight['direct'] === 1) {
            url += '?preferdirects=true'
        }
        return url;
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
        let url = 'https://www.jetradar.com/';
        if ((flight['converted_currency'] || flight['currency']) === 'RUB') {
            url = 'https://www.aviasales.ru/'
        }
        url += '?marker=201249';
        url += `&origin_iata=${flight['origin_city_iata'] || flight['origin']}`;
        url += `&destination_iata=${flight['destination_city_iata'] || flight['destination']}`;
        url += `&depart_date=${flight['outbound_dt']}`;
        if (flight['inbound_dt']) {
            url += `&return_date=${flight['inbound_dt']}`;
        }
        url += '&with_request=true';
        url += `&currency=${flight['converted_currency'] || flight['currency']}`;
        return url
    },
    aviasalesComplexLink(route) {
        let url = 'https://www.jetradar.com/flights/?';
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
    travelAlfabankLink(route) {
        let url = 'https://travel.alfabank.ru/avia/results/ALFA0000RTE100000009';
        let outbound = route['origin_city_iata'] + route['destination_city_iata'] +
            route['outbound_dt'].replace(/-/g, '');
        let inbound = '';
        if (route['one_way'] === 0) {
            inbound = route['destination_city_iata'] + route['origin_city_iata'] +
                route['inbound_dt'].replace(/-/g, '');
        }
        return url + outbound + inbound
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
    },
    getRangeBetweenDates(startDate, endDate) {
        let result = [];
        let day = 1000*60*60*24;
        let date1 = new Date(startDate);
        let date2 = new Date(endDate);

        let diff = (date2.getTime()- date1.getTime())/day;
        for(let i=0;i<=diff; i++)
        {
            let xx = date1.getTime()+day*i;
            let yy = new Date(xx);
            result.push(yy.toISOString().slice(0,10));
        }
        return result
    },
    getMaxDate() {
        let aYearFromNow = new Date();
        aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
        return aYearFromNow
    },
    getMaxDateISO() {
        let aYearFromNow = new Date();
        aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
        return aYearFromNow.toISOString().substr(0, 10)
    },
    async logEvent(event_name, body) {
        await fetch(AppConfig.apiUrl + '/log?event_name=' + event_name, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
        );
    },
    getLinkToHistory(flight) {
        let url = '/history?';
        url += `origin=${flight['origin_city_id']}&origin_name=${flight['origin_city_name']}&`;
        url += `destination=${flight['destination_city_id']}&destination_name=${flight['destination_city_name']}&`;
        url += `outboundDays=${flight['outbound_dt']}&`;
        if (flight['one_way'] === 0) {
            url += `inboundDays=${flight['inbound_dt']}&`
        }
        url += `oneWayOnly=${flight['one_way']}&`;
        url += `directOnly=${flight['direct']}`;
        return url
    }
}