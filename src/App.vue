<template>
  <v-app>
    <div>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Cheapster.</span>
        <span class="font-weight-light">Travel</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div>
        <v-row>
          <v-col>
        <v-btn
                to="/collections"
                :elevation="0"
        >
          <v-icon left>mdi-group</v-icon> {{ $t('collections')}}
        </v-btn>
          </v-col>
          <v-col>
        <v-btn
                to="/map"
                :elevation="0"
        >
          <v-icon left>mdi-earth</v-icon> {{ $t('map')}}
        </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-spacer></v-spacer>
      <v-switch
                hide-details
                v-model="darkThemeModel"
                :label="this.$i18n.t('darkTheme')"
      ></v-switch>
      <UserProfile></UserProfile>
    </v-app-bar>
      <v-content>
      <router-view></router-view>
      </v-content>
    <v-content></v-content>
    <Footer></Footer>
  </div>
  </v-app>
</template>

<script>
  import { mapActions,  mapGetters } from 'vuex';
  import UserProfile from "@/components/UserProfile";
  import Footer from "@/components/Footer";

export default {
  name: 'App',
  components: {
    UserProfile,
    Footer,
  },
  data: () => ({
  }),
  methods: {
    ...mapGetters(['getDarkTheme', 'getIpInfo']),
    ...mapActions(['setDarkTheme', 'fetchIpInfo', 'fetchNearbyAirports', 'recoverFromCookiesNearbyAirports']),
  },
  async created() {
    if (!this.getIpInfo()) {
      let ipInfo = await this.fetchIpInfo();
      await this.fetchNearbyAirports({longitude: ipInfo['longitude'],
                                      latitude: ipInfo['latitude']});
    } else {
      await this.recoverFromCookiesNearbyAirports()
    }
  },
  computed: {
    darkThemeModel: {
      get() {
        return this.getDarkTheme()
      },
      async set(value) {
        this.$vuetify.theme.dark = value;
        this.setDarkTheme(value);
      }
    },
  },
  async mounted() {
    this.$vuetify.theme.dark = this.getDarkTheme()
  },
};
</script>