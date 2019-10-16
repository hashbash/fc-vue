<template>
  <v-sheet
    class="ma-auto"
    elevation="20"
    max-width="1310"
    min-height="500"
  >
    <v-toolbar height="0px" flat> 
      <v-progress-linear
        v-if="linearProgressShow"
        :active="true"
        :indeterminate="true"
        absolute
        top
        color="deep-purple accent-4"
      ></v-progress-linear>
    </v-toolbar>
    <v-skeleton-loader class="ml-4 pt-5 slidegroup-skeleton-heading" type="heading"></v-skeleton-loader>
    <div class="px-12 mx-8 mt-10">
      <v-row dense>
        <v-col v-for="(itemTour, indexTour) in 6" :key="indexTour" class="mr-1">
          <v-card width="180" class="card-outer skeleton-card">
          <v-skeleton-loader class="ml-3 pt-3" type="heading"></v-skeleton-loader>
          <v-skeleton-loader class="ml-3 pt-3" type="text" :max-width="100"></v-skeleton-loader>
          <v-skeleton-loader class="pt-3" type="image" :max-height="180"></v-skeleton-loader>
          <v-skeleton-loader class="ml-3 pt-3" type="text" :max-width="80"></v-skeleton-loader>
          <v-skeleton-loader class="ml-3" type="text" :max-width="80"></v-skeleton-loader>
          <v-row class="ml-3">
            <v-skeleton-loader class="slidegroup-skeleton-chip mr-2" type="chip"></v-skeleton-loader>
            <v-skeleton-loader class="slidegroup-skeleton-chip" type="chip"></v-skeleton-loader>
          </v-row>
          <v-skeleton-loader class="mt-5 ml-3 slidegroup-skeleton-button" type="button"></v-skeleton-loader>
          <!--<v-skeleton-loader
            :width="180"
            type="image"
            class="tour-card-skeleton"
            transition="fade-transition"
          ></v-skeleton-loader> -->
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-sheet>
</template>

<script>
export default {
  name: "SlideGroup",
  props: {
    linearProgressShow: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style>
.skeleton-card{
  height: 386px !important;
}
.slidegroup-skeleton-chip > .v-skeleton-loader__chip.v-skeleton-loader__bone{
  width: 60px;
  height: 20px;
}
.slidegroup-skeleton-button > .v-skeleton-loader__button.v-skeleton-loader__bone{
  width: 110px;
}
.slidegroup-skeleton-heading > .v-skeleton-loader__heading.v-skeleton-loader__bone{
  width: 200px;
}

</style>