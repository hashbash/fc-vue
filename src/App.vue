<template>
  <v-app>
    <div>
    <v-app-bar app>
      <AppBarNavMenu></AppBarNavMenu>
      <v-toolbar-title class="headline text-uppercase">
        <span>Cheapster.</span>
        <span class="font-weight-light">Travel</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-spacer></v-spacer>
      <v-switch v-if="$route.name !== 'search'"
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
  import AppBarNavMenu from "./components/AppBarNavMenu";

export default {
  name: 'App',
  components: {
    UserProfile,
    Footer,
    AppBarNavMenu
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