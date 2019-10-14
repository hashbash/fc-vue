<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <v-img></v-img>
        <span>Cheapster.</span>
        <span class="font-weight-light">Travel</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <div v-if="(currency_ready) && (origins_ready)">
        <CurrencyMenu
          v-on:updateCurrencyFromChild="updateCurrencyFromChild"
          v-bind:input_currency="currency"
        ></CurrencyMenu>
      </div>
    </v-app-bar>
    <!--      <v-content></v-content>-->
    <v-content aria-autocomplete="none">
      <UnexpectedError v-if="unexpectedError"></UnexpectedError>
      <v-progress-linear
        :active="!origins_ready"
        :indeterminate="!origins_ready"
        absolute
        top
        color="deep-purple accent-4"
      ></v-progress-linear>
      <OriginSelection
        v-if="origins_ready"
        v-on:updateOriginsFromChild="updateOriginsFromChild"
        v-bind:origins="origins"
        v-bind:api_url="api_url"
      ></OriginSelection>
    </v-content>

    <div v-if="(collections_ready) && (origins_ready) && (currency_ready)" :key="slideGroupDivId">
      <v-content v-for="(collection_name, collection_id, index) in collections" :key="index">
        <intersect @enter="slideGroupEnter(index)" @leave="slideGroupLeave(index)">
          <div>
            <SlideGroup
              v-if="slideGroupShow[index]"
              v-bind:collection_id="parseInt(collection_id)"
              v-bind:collection_name="collection_name"
              v-bind:origins="origins"
              v-bind:api_url="api_url"
              v-bind:currency="currency"
            ></SlideGroup>
            <v-sheet
              v-if="!slideGroupShow[index]"
              class="ma-auto"
              elevation="20"
              max-width="1310"
              min-height="500"
            >
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
            </v-sheet>
          </div>
        </intersect>
      </v-content>
    </div>
    <v-content></v-content>
    <v-content></v-content>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Vue from "vue";
import VueCookies from "vue-cookies";
import Intersect from "vue-intersect";
// import ChipsList from "@/components/ChipsList";
import axios from "axios";
import SlideGroup from "@/components/SlideGroup";
import CurrencyMenu from "@/components/CurrencyMenu";
import Footer from "@/components/Footer";
import OriginSelection from "@/components/OriginSelection";
import UnexpectedError from "@/components/UnexpectedError";

Vue.use(VueCookies);

VueCookies.config("90d");

export default {
  name: "App",
  components: {
    UnexpectedError,
    SlideGroup,
    CurrencyMenu,
    Footer,
    OriginSelection,
    Intersect
  },
  data: () => ({
    slideGroupShow: [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true
    ],
    origins: ["VKO", "SVO", "DME"],
    api_url: "https://api.cheapster.travel/api/v1",
    // api_url: 'http://localhost:5000/api/v1',
    ip_info: null,
    nearby_airports_info: null,
    origins_ready: false,
    collections: null,
    collections_ready: false,
    unexpectedError: false,
    currency: null,
    currency_ready: false,
    slideGroupDivId: 0
  }),
  methods: {
    slideGroupEnter(index) {
      this.$set(this.slideGroupShow, index, true);
      console.log(this.slideGroupShow);
      console.log("Enter " + index);
    },
    slideGroupLeave(index) {
      this.$set(this.slideGroupShow, index, false);
      console.log("Leave " + index);
    },
    updateOriginsFromChild(value) {
      this.origins = value;
      this.origins = this.origins.map(function(x) {
        return x.toUpperCase();
      });
      VueCookies.set("origins", JSON.stringify(this.origins));
    },
    updateCurrencyFromChild(value) {
      this.currency = value;
      VueCookies.set("currency", this.currency);
      this.slideGroupDivId += 1;
    },
    fillOrigins() {
      axios
        .get("https://freegeoip.app/json/")
        .then(response => {
          this.ip_info = response.data;
          VueCookies.set("ip_info", JSON.stringify(this.ip_info));
          return axios.get(
            this.api_url +
              "/nearby-airports?" +
              `lon=${this.ip_info["longitude"]}&lat=${this.ip_info["latitude"]}`
          );
        })
        .then(response => {
          this.nearby_airports_info = response.data.data;
          this.origins = this.nearby_airports_info;
        })
        .catch(() => {
          this.unexpectedError = true;
        })
        .then(() => {
          if (this.ip_info["country_code"] == "RU") {
            this.updateCurrencyFromChild("RUB");
          }
        })
        .finally(() => {
          this.origins_ready = true;
        });
    },
    fetchCollectionMeta() {
      axios
        .get(this.api_url + "/collection-list")
        .then(response => {
          this.collections = response.data;
          this.collections_ready = true;
          this.slideGroupShow = [
            true,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ];
        })
        .catch(() => {
          this.unexpectedError = true;
        });
    }
  },
  created: function() {
    {
      this.fetchCollectionMeta();
      if (VueCookies.isKey("origins")) {
        let origins_cookie = VueCookies.get("origins");
        try {
          let origins_json = JSON.parse(origins_cookie);
          if (origins_json.length > 0) {
            this.origins = origins_json;
            this.origins_ready = true;
          } else {
            this.fillOrigins();
          }
        } catch (e) {
          this.origins = ["HEL", "LED"];
          this.origins_ready = true;
        }
      } else {
        try {
          this.fillOrigins();
        } catch (e) {
          this.origins = ["HEL", "LED", "TLL"];
          this.origins_ready = true;
        }
      }
      // currency
      if (VueCookies.isKey("currency")) {
        this.currency = VueCookies.get("currency");
      } else {
        this.currency = "USD";
      }
      this.currency_ready = true;
    }
  },
  watch: {
    currency() {}
  }
};
</script>

<style>
.v-skeleton-loader__image.v-skeleton-loader__bone {
  height: 386px !important;
}
</style>