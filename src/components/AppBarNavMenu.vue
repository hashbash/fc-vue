<template>
    <div class="text-xs-center pa-0 ma-0 align-start justify-start">
        <v-menu top offset-y>

            <template v-slot:activator="{ on }">
                <v-btn icon
                       v-on="on"
                >
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
            </template>
            <v-card>
                <v-card-actions>
                    <v-btn
                            to="/collections"
                            :elevation="0"
                    >
                        <v-icon left>mdi-group</v-icon> {{ $t('collections')}}
                    </v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-btn
                            to="/map"
                            :elevation="0"
                    >
                        <v-icon left>mdi-earth</v-icon> {{ $t('map')}}
                    </v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-btn
                            to="/simple"
                            :elevation="0"
                    >
                        <v-icon left>mdi-routes</v-icon> {{ $t('simpleFlights')}}
                    </v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-btn
                            to="/complex"
                            :elevation="0"
                    >
                        <v-icon left>mdi-vector-triangle</v-icon> {{ $t('complexFlights')}}
                    </v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-btn
                            to="/history"
                            :elevation="0"
                    >
                        <v-icon left>mdi-history</v-icon> {{ $t('priceHistory')}}
                    </v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-btn
                            to="/combinator"
                            :elevation="0"
                    >
                        <v-icon left>mdi-shape-plus</v-icon> {{ $t('combinator')}}
                    </v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-btn
                            to="/search"
                            :elevation="0"
                    >
                        <v-icon left>mdi-map-search-outline</v-icon> {{ $t('search')}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
    export default {
        name: "AppBarNavMenu",
        data: () => ({
            menu: true,
        })
    }
</script>

<style scoped>

</style>