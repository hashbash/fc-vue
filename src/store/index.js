import Vue from 'vue'
import Vuex from 'vuex'
import userSettings from "@/store/components/userSettings";
import Flights from "@/store/components/Flights";
import MapRelatedFlights from "@/store/components/MapRelatedFlights";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    userSettings, Flights, MapRelatedFlights
  }
})
