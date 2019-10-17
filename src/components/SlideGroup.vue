<template>
  <div>
    <v-sheet class="ma-auto" elevation="20" max-width="1310" min-height="500">
      <div v-if="flights_loaded">
        <v-toolbar flat>
          <v-progress-linear
            :active="!flights_loaded"
            :indeterminate="!flights_loaded"
            absolute
            top
            color="deep-purple accent-4"
          ></v-progress-linear>
          <v-toolbar-title href="ya.ru" class="ml-2"><h3>{{ collection_name }}</h3></v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-btn icon>
            <v-icon>mdi-export-variant</v-icon>
          </v-btn>
          <!--                <v-btn icon>-->
          <!--                    <v-icon>mdi-heart</v-icon>-->
          <!--                </v-btn>-->
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
        >
          <v-slide-item
            v-for="f in flights"
            :key="collection_id + f.destination"
            v-slot:default="{ active, toggle }"
          >
            <v-card width="180" class="ma-2 card-outer">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="headline">{{ f.destination_city_name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ f.destination_country_name }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <template>
                <v-img
                  class="black--text"
                  height="150px"
                  weight="150px"
                  :src="api_url + `/image/airports?id=${f.destination}`"
                  lazy-src="/logo.png"
                >
                  <!--                            <v-card-title-->
                  <!--                                    class="align-end fill-height text-break shades"-->
                  <!--                            >-->
                  <!--                                <strong>{{ f.destination_city_name }}</strong>-->
                  <!--                            </v-card-title>-->
                  <!-- <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                  </template> -->
                </v-img>
              </template>

              <v-card-text>
                <div>
                  <!--                                <div>{{ f.destination_country_name }}</div>-->
                  <div class="caption">{{f.origin}} ✈ {{ f.destination }}</div>
                  <div class="caption">
                    {{ f.outbound_dt }} {{calculateDays(f.outbound_dt, f.inbound_dt,
                    f.one_way)}}
                  </div>
                </div>
                <v-chip-group column class="v-size--x-small" disabled="true">
                  <v-chip v-if="Boolean(Number(f.one_way))" key="one_way" disabled small>One way</v-chip>
                  <v-chip v-if="!Boolean(Number(f.one_way))" key="one_way" disabled small>Round trip</v-chip>
                  <v-chip v-if="Boolean(Number(f.direct))" key="direct" small disabled>Direct</v-chip>
                </v-chip-group>
              </v-card-text>
              <v-card-actions v-if="actions" class="card-actions">
                <v-container class="pa-0">
                  <v-btn
                    :href="getExternalLink(f.origin_city_id, f.destination_city_id,
                                                            f.outbound_dt, f.inbound_dt)"
                    target="_blank"
                  >✈️ {{ f.price | currency(f.currency, 0, { spaceBetweenAmountAndSymbol: true }) }}</v-btn>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </div>
      <SlideSkeleton v-else></SlideSkeleton>
      <!-- <div v-else>
        <v-toolbar height="0px" flat>
          <v-progress-linear
            :active="true"
            :indeterminate="true"
            absolute
            top
            color="deep-purple accent-4"
          ></v-progress-linear>
        </v-toolbar>
        <v-skeleton-loader class="ml-4 pt-5" type="heading"></v-skeleton-loader>
        <div class="px-12 mx-8 mt-10">
          <v-row dense>
            <v-col v-for="(itemTour, indexTour) in 6" :key="indexTour" class="mr-1">
              <v-skeleton-loader
                :width="180"
                type="image"
                class="tour-card-skeleton"
                transition="fade-transition"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </div>
      </div> -->
    </v-sheet>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import Vue2Filters from "vue2-filters";
import SlideSkeleton from "@/components/SlideSkeleton";

Vue.use(Vue2Filters);

export default {
  name: "SlideGroup",
  components: {
    SlideSkeleton
  },
  mixins: [Vue2Filters.mixin],
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
    flights_loaded: false
  }),
  created() {
    this.getFlights();
  },
  methods: {
    getFlights() {
      this.flights_loaded = false;
      axios
        .get(
          this.api_url +
            `/collections?id=${this.collection_id.toString()}&` +
            `origins=${this.origins.join(",")}&` +
            `currency=${this.currency}&` +
            "limit=48"
        )
        .then(response => {
          this.flights = response.data.data;
          this.flights_loaded = true;
          this.$emit('dataLoaded', this.collection_id)
        });
    },
    calculateDays(outbound, inbound, one_way) {
      if (!one_way) {
        let date1 = new Date(outbound);
        let date2 = new Date(inbound);
        let timeDiff = Math.abs(date2.getTime() - date1.getTime());
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return " • " + diffDays + " days";
      }
    },
    getExternalLink(origin_city_id, destination_city_id, outbound, inbound) {
      let link_arr = [
        "https://www.skyscanner.ru/transport/flights",
        origin_city_id,
        destination_city_id,
        outbound,
        inbound
      ];
      return link_arr.join("/");
    }
  },
  props: {
    collection_id: Number,
    collection_name: String,
    api_url: String,
    origins: Array,
    currency: String
  },
  watch: {
    origins(newValue, oldValue) {
      // console.error(newValue, oldValue)
      if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return;
      if (newValue.length > 0) {
        this.getFlights();
      }
    }
  }
};
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

.v-skeleton-loader__image.v-skeleton-loader__bone {
  height: 386px !important;
}
</style>