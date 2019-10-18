<template>
  <v-card :max-width="180" class="card-outer skeleton-card">
    <v-skeleton-loader class="ml-3 pt-3" type="heading"></v-skeleton-loader>
    <v-skeleton-loader
      class="ml-3 pt-3"
      type="text"
      :max-width="100"
    ></v-skeleton-loader>
    <v-skeleton-loader
      class="pt-3"
      type="image"
      :max-height="180"
    ></v-skeleton-loader>
    <v-skeleton-loader
      class="ml-3 pt-3"
      type="text"
      :max-width="80"
    ></v-skeleton-loader>
    <v-skeleton-loader
      class="ml-3"
      type="text"
      :max-width="80"
    ></v-skeleton-loader>
    <v-row class="ml-3">
      <v-skeleton-loader
        class="slidegroup-skeleton-chip mr-2"
        type="chip"
      ></v-skeleton-loader>
      <v-skeleton-loader
        class="slidegroup-skeleton-chip"
        type="chip"
      ></v-skeleton-loader>
    </v-row>
    <v-skeleton-loader
      class="mt-5 ml-3 slidegroup-skeleton-button"
      type="button"
    ></v-skeleton-loader>
  </v-card>
</template>

<script>
export default {
  name: "CardSkeleton"
};
</script>

<style>
.skeleton-card{
  height: 386px !important;
}
</style>