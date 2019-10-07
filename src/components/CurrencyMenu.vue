<template>
    <div class="text-center">
        <v-menu top offset-y>
            <template v-slot:activator="{ on }">
                <v-btn
                        color="primary"
                        dark
                        v-on="on"
                >
                    {{currency}}
                </v-btn>
            </template>

            <v-list>
                <v-list-item
                        v-for="(item, index) in currencies"
                        :key="index"
                        v-on:click="currency = currencies[index].title"
                >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
    export default {
        name: "CurrencyMenu",
        data: () => ({
            currency: "USD",
            currencies: [
                {title: "USD", symbol: "$"},
                {title: "RUB", symbol: "₽"},
            ],
        }),
    }
</script>

<style scoped>

</style>