<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <v-img></v-img>
        <span>Cheapster.</span>
        <span class="font-weight-light">Travel</span>
      </v-toolbar-title>

      <v-spacer>
      </v-spacer>
      <CurrencyMenu></CurrencyMenu>
    </v-app-bar>
    <!--      <v-content></v-content>-->
    <v-content>
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
              v-on:updateFromChild="updateFromChild"
              v-bind:origins="origins"
              v-bind:api_url="api_url"
      ></OriginSelection>
    </v-content>



    <div
            v-if="(collections_ready) && (origins_ready)"
    >
      <v-content
              v-for="(collection_name, collection_id) in collections"
              :key="collection_id"

      >
        <SlideGroup
                v-bind:collection_id="parseInt(collection_id)"
                v-bind:collection_name="collection_name"
                v-bind:origins="origins"
                v-bind:api_url="api_url">
        </SlideGroup>
      </v-content>

    </div>
    <v-content></v-content>
    <v-content></v-content>
    <Footer></Footer>
  </v-app>
</template>

<script>
  import Vue from 'vue';
  import VueCookies from 'vue-cookies';
  // import ChipsList from "@/components/ChipsList";
  import axios from 'axios';
  import SlideGroup from "@/components/SlideGroup";
  import CurrencyMenu from "@/components/CurrencyMenu";
  import Footer from "@/components/Footer";
  import OriginSelection from "@/components/OriginSelection";
  import UnexpectedError from "@/components/UnexpectedError";

  Vue.use(VueCookies);
  VueCookies.config('90d');


  export default {
    name: 'App',
    components: {
      UnexpectedError,
      SlideGroup, CurrencyMenu, Footer, OriginSelection,
    },
    data: () => ({
      origins: ['VKO', 'SVO', 'DME'],
      api_url: 'https://api.cheapster.travel/api/v1',
      ip_info: null,
      nearby_airports_info: null,
      origins_ready: false,
      collections: null,
      collections_ready: false,
      unexpectedError: false,
    }),
    methods: {
      updateFromChild(value) {
        this.origins = value;
        this.origins = this.origins.map(function (x) {
          return x.toUpperCase()
        });
        VueCookies.set('origins', JSON.stringify(this.origins));
      },
      fillOrigins() {
        axios
                .get('http://ip-api.com/json/?fields=49361')
                .then((response) => {
                  this.ip_info = response.data;
                  return axios
                          .get(this.api_url + '/nearby-airports?' +
                                  `lon=${this.ip_info['lon']}&lat=${this.ip_info['lat']}`);
                })
                .then((response) => {
                  this.nearby_airports_info = response.data.data;
                  this.origins = this.nearby_airports_info;
                  this.origins_ready = true
                })
                .catch(() => {
                  this.unexpectedError = true;
                });
      },
      fetchCollectionMeta() {
        axios
                .get(this.api_url + '/collection-list')
                .then((response) => {
                  this.collections = response.data;
                  this.collections_ready = true;
                })
      }
    },
    created: function () {
      {
        this.fetchCollectionMeta();
        if (VueCookies.isKey('origins')) {
          let origins_cookie = VueCookies.get('origins');
          try {
            let origins_json = JSON.parse(origins_cookie);
            if (origins_json.length > 0) {
              this.origins = origins_json;
              this.origins_ready = true
            } else {
              this.fillOrigins()
            }
          } catch (e) {
            this.origins = ['HEL', 'LED'];
            this.origins_ready = true
          }
        } else {
          try {
            this.fillOrigins()
          } catch (e) {
            this.origins = ['HEL', 'LED', 'TLL'];
            this.origins_ready = true
          }
        }
      }
    },
  }
</script>
