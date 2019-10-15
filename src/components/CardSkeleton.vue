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

<style scoped>
</style>