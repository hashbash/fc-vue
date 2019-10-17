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
    <div class="-px-lg-12 mx-lg-8 px-md-0 mx-md-4 mt-10">
      <v-row dense>
          <v-col v-for="(itemTour, indexTour) in respElementsNum" :key="indexTour" class="mr-1">
            <v-card :max-width="180" class="card-outer skeleton-card">
              <CardSkeleton/>
            </v-card>
          </v-col>
      </v-row>
    </div>
  </v-sheet>
</template>

<script>
import CardSkeleton from "@/components/CardSkeleton";

export default {
  name: "SlideSkeleton",
  components: {
    CardSkeleton,
  },
  props: {
    linearProgressShow: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    respElementsNum: function () {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return 6
      } else if (this.$vuetify.breakpoint.smAndUp) {
        return 4
      } else {
        return 2
      }
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