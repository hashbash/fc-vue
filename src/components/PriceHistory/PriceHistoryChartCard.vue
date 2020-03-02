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
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                legend: {
                    display: true,
                    position: 'bottom',
                },
                tooltips: {
                    enabled: true,
                    // mode: 'nearest',
                    callbacks: {
                        mode: 'x-axis',
                        intersect: false,
                        title: function() {
                            return undefined
                        },
                        beforeLabel: function(tooltipItem, parsedData) {
                            if (tooltipItem.datasetIndex === 0) {
                                return parsedData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].formattedCacheDate
                            } else if (tooltipItem.datasetIndex === 1) {
                                return parsedData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].predictionForDate
                            }
                        },
                        label: function(t, d) {
                            if (t.datasetIndex === 0) {
                                return [
                                    d.datasets[t.datasetIndex].data[t.index].places,
                                    d.datasets[t.datasetIndex].data[t.index].formattedDates,
                                    d.datasets[t.datasetIndex].data[t.index].carriers,
                                    d.datasets[t.datasetIndex].data[t.index].direct, '',
                                    d.datasets[t.datasetIndex].data[t.index].prettyPrice
                                ]
                            } else if (t.datasetIndex === 1) {
                                return [
                                    d.datasets[t.datasetIndex].data[t.index].places,
                                    d.datasets[t.datasetIndex].data[t.index].formattedDates,
                                    d.datasets[t.datasetIndex].data[t.index].direct, '',
                                    d.datasets[t.datasetIndex].data[t.index].prettyPrice
                                ]
                            }
                        },
                    },
                }
            },
            parsedData: [],
            parsedPredictions: [],
            chartData: null,
        }),
        props: {
            flights: Array,
            predictions: Array
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

            this.parsedPredictions = this.predictions.map(element => {
               return {
                   x: new Date(element['future_date']),
                   y: element['converted_price_rounded'],
                   predictionForDate: `${this.$t('flight.predictionFor')} ${element['future_date']}`,
                   places: `${element['origin']} - ${element['destination']}`,
                   formattedDates: `${element['outbound_dt']}${element['inbound_dt'] ? ' - ' + element['inbound_dt'] : ''}`,
                   direct: `${this.$t('forms.tables.headers.direct')}: ${element['direct'] === 1 ? '✓' : '✗'}`,
                   prettyPrice: `${element['converted_price_rounded']} ${element['converted_currency']}`
               }
            });

            this.chartData = {
                datasets: [{
                    label: `${this.$t('forms.labels.history')}`,
                    data: this.parsedData,
                    borderColor: "#3e95cd",
                    fill: false,
                }, {
                    label: `${this.$t('forms.labels.prediction')}`,
                    data: this.parsedPredictions,
                    borderColor: "#808080",
                    fill: false,
                    borderDash: [10,2],
                    pointRadius: 0,

                }
                ]
            };
            this.loaded = true;
        }
    }
</script>

<style scoped>

</style>