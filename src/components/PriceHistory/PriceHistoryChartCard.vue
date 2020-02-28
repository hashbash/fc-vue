<template>
    <div>
    <v-card class="mx-auto justify-center align-center">
        <v-card-title>{{ $t('forms.names.priceHistoryChart')}}</v-card-title>
        <template>
            <div class="container">
                <LineChart
                        v-if="loaded"
                        :chartdata="chartData"
                        type="line"
                        :data="chartData"
                        :options="options"
                        style="min-height: 300px"
                >

                </LineChart>
            </div>
        </template>

    </v-card>
    </div>
</template>

<script>
    import LineChart from 'vue-chart-js'

    //:options="options"

    export default {
        name: 'LineChartContainer',
        components: { LineChart },
        data: () => ({
            loaded: false,
            options: {
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'month'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                legend: false,
                tooltips: {
                    enabled: true,
                    mode: 'label',
                    callbacks: {
                        title: function() {
                            return undefined
                        },
                        beforeLabel: function(tooltipItem, parsedData) {
                            return parsedData.datasets[0].data[tooltipItem.index].formattedCacheDate
                        },
                        label: function(tooltipItem, parsedData) {
                            return [
                                parsedData.datasets[0].data[tooltipItem.index].places,
                                parsedData.datasets[0].data[tooltipItem.index].formattedDates,
                                parsedData.datasets[0].data[tooltipItem.index].carriers,
                                parsedData.datasets[0].data[tooltipItem.index].direct, '',
                                parsedData.datasets[0].data[tooltipItem.index].prettyPrice
                            ]
                        },
                    },
                }
            },
            parsedData: [],
            chartData: null,
        }),
        props: {
            flights: Array
        },
        async mounted() {
            this.loaded = false;
            this.parsedData = this.flights.map(element => {
                return {
                    x: new Date(element['processing_dt']),
                    y: element['converted_price_rounded'],
                    formattedCacheDate: `${this.$t('flight.cached_at')} ${element['processing_dt']}`,
                    places: `${element['origin']} - ${element['destination']}`,
                    formattedDates: `${element['outbound_dt']}${element['inbound_dt'] ? ' - ' + element['inbound_dt'] : ''}`,
                    carriers: `${element['carrier_names']}`,
                    direct: `${this.$t('forms.tables.headers.direct')}: ${element['direct'] === 1 ? '✓' : '✗'}`,
                    prettyPrice: `${element['converted_price_rounded']} ${element['converted_currency']}`

                }
            });
            this.chartData = {
                datasets: [{
                    data: this.parsedData,
                    borderColor: "#3e95cd",
                    fill: false
                }]
            };
            this.loaded = true;
        }
    }
</script>

<style scoped>

</style>