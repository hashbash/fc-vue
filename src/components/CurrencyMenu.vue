<template>
  <div class="text-center">
    <v-menu top offset-y>
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">
          {{ currency }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in currencies"
          :key="index"
          v-on:click="currency = currencies[index].title"
          @click="updateParent"
        >
          <v-list-item-title
            >{{ item.title }}
            <strong>{{ item.symbol }}</strong></v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "CurrencyMenu",
  data: () => ({
    currencies: [
      { title: "USD", symbol: "$" },
      { title: "EUR", symbol: "€" },
      { title: "RUB", symbol: "₽" },
      { title: "AUD", symbol: "A$" },
      { title: "CAD", symbol: "C$" },
      { title: "JPY", symbol: "¥" },
      { title: "CNY", symbol: "元" }
    ],
    currency: null
  }),
  methods: {
    updateParent() {
      this.$emit("updateCurrencyFromChild", this.currency);
    }
  },
  updated: function() {
    this.updateParent(this.currency);
  },
  created: function() {
    this.currency = this.input_currency;
  },
  props: {
    input_currency: String
  }
};
</script>

<style scoped>
</style>