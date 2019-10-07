<template>
    <div>
        <v-sheet
                class="mx-auto"
                elevation="8"
                max-width="1200"
                min-height="180"
        >

            <v-toolbar
                    flat>
                <v-progress-linear
                        :active="!flights_loaded"
                        :indeterminate="!flights_loaded"
                        absolute
                        top
                        color="deep-purple accent-4"
                ></v-progress-linear>
                <v-toolbar-title href="ya.ru">
                    {{ collection_name }}
                </v-toolbar-title>
                <div class="flex-grow-1"></div>
                <v-btn icon>
                    <v-icon>mdi-export-variant</v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon>mdi-heart</v-icon>
                </v-btn>
            </v-toolbar>
            <v-slide-group
                    v-model="model"
                    class="pa-4"
                    :prev-icon="prevIcon ? 'mdi-minus' : undefined"
                    :next-icon="nextIcon ? 'mdi-plus' : undefined"
                    :multiple="multiple"
                    :mandatory="mandatory"
                    :show-arrows="showArrows"
                    :center-active="centerActive"
                    :key="collection_id"
                    :loading="true"
            >

                <v-slide-item
                        v-for="f in flights"
                        :key="collection_id + f.destination"
                        v-slot:default="{ active, toggle }"

                >
                    <v-card
                            width="170"
                            hover
                            class="ma-2 card-outer"
                    >
                        <v-img
                                class="white--text"
                                height="150px"
                                weight="150px"
                                :src="getCardImagePath(f.destination)"
                        >
                            <v-card-title
                                    class="align-end fill-height text-break"
                            >
                                {{ f.destination_city_name }}
                            </v-card-title>
                        </v-img>

                        <v-card-text>
                            <div>
                                <div>{{ f.destination_country_name }}</div>
                                <div class="caption">{{f.origin}} ✈ {{ f.destination }}</div>
                                <div class="caption">{{ f.outbound_dt }} {{calculateDays(f.outbound_dt, f.inbound_dt,
                                    f.one_way)}}
                                </div>
                            </div>
                            <v-chip-group
                                    column
                                    active-class="primary--text"
                                    class="v-size--x-small"
                            >
                                <v-chip
                                        v-if="Boolean(Number(f.one_way))"
                                        key="one_way"
                                        disabled
                                        small
                                >
                                    One way
                                </v-chip>
                                <v-chip
                                        v-if="!Boolean(Number(f.one_way))"
                                        key="one_way"
                                        disabled
                                        small
                                >
                                    Round trip
                                </v-chip>
                                <v-chip
                                        v-if="Boolean(Number(f.direct))"
                                        key="direct"
                                        disabled
                                        small
                                >
                                    Direct
                                </v-chip>
                            </v-chip-group>
                        </v-card-text>
                        <v-card-actions
                                v-if="actions"
                                class="card-actions"
                        >
                            <v-container
                                    class="pa-0">
                                <v-btn
                                        :href="getExternalLink(f.origin_city_id, f.destination_city_id,
                                                           f.outbound_dt, f.inbound_dt)"
                                        target="_blank"
                                >✈️ {{f.price}} {{ f.currency }}
                                </v-btn>
                            </v-container>
                        </v-card-actions>
                    </v-card>
                </v-slide-item>
            </v-slide-group>
        </v-sheet>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "SlideGroup",
        data: () => ({
            model: null,
            multiple: false,
            mandatory: false,
            showArrows: false,
            prevIcon: false,
            nextIcon: false,
            centerActive: false,
            toggle: false,
            active: null,
            flights: [],
            actions: true,
            flights_loaded: false,
        }),
        created() {
            this.getFlights();
        },
        methods: {
            getFlights() {
                this.flights_loaded = false;
                axios
                    .get(this.api_url + `/collections?id=${this.collection_id.toString()}&origins=${this.origins.join(',')}`)
                    .then((response) => {
                        this.flights = response.data.data;
                        this.flights_loaded = true;
                    });
            },
            calculateDays(outbound, inbound, one_way) {
                if (!one_way) {
                    let date1 = new Date(outbound);
                    let date2 = new Date(inbound);
                    let timeDiff = Math.abs(date2.getTime() - date1.getTime());
                    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    return ' • ' + diffDays + ' days'
                }
            },
            getExternalLink(origin_city_id, destination_city_id, outbound, inbound) {
                let link_arr = ['https://www.skyscanner.ru/transport/flights',
                    origin_city_id, destination_city_id, outbound, inbound];
                return link_arr.join('/')
            }, getCardImagePath(destination) {
                return this.api_url + '/image/airports?id=' + destination
            }
        },
        props: {
            collection_id: Number,
            collection_name: String,
            api_url: String,
            origins: Array,
        },
        watch: {
            origins(newValue, oldValue) {
                // console.error(newValue, oldValue)
                if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return;
                if (newValue.length > 0) {
                    this.getFlights()
                }
            }
        }
    }
</script>

<style scoped>
    .card-outer {
        position: relative;
        padding-bottom: 50px;
    }

    .card-actions {
        position: absolute;
        bottom: 0;
    }
</style>