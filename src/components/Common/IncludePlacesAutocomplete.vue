<template>
    <v-autocomplete
            :label="$i18n.t('includePlaces') || 'Autocomplete'"
            v-model="includedPlacesModel"
            :items="includedPlacesItems.concat(this.suggestions)"
            :search-input.sync="search"
            @input="this.setIncludedPlacesItems"
            :menu-props="{ closeOnContentClick: true }"
            item-value="place_code"
            item-text="place_name"
            multiple
            chips
            deletable-chips
            no-filter
            clearable
            hide-selected
            hide-details
            :key="'include'"
            return-object
            :no-data-text="$i18n.t('autocomplete') || 'Autocomplete'"
    >
        <template v-slot:item="data">
            <v-list max-width="300">
                <template v-if="typeof data.item !== 'object'">
                    <v-list-item-content v-text="data.item"></v-list-item-content>
                </template>
                <template v-else>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{data.item['place_name'] + ` (${data.item['place_code']})`}}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{data.item['place_country_name']}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </template>
            </v-list>
        </template>
    </v-autocomplete>
</template>

<script>
    import {mapGetters, mapActions } from 'vuex';
    import AppConfig from "../../AppConfig";


    export default {
        name: "IncludePlacesAutocomplete",
        data: () => ({
            search: null,
            suggestions: [],
            model: false,
        }),
        methods: {
            ...mapActions(['setIncludedPlacesItems']),
            ...mapGetters(['getUserCountry', 'getCurrency', 'getLang']),
            ...mapGetters(['getIncludedPlacesItems']),
        },
        computed: {
            ...mapGetters({includedPlacesItems: 'getIncludedPlacesItems'}),
            includedPlacesModel: {
                get() {
                    return this.getIncludedPlacesItems();
                },
                async set(value) {
                    this.setIncludedPlacesItems(value)
                },
            },
        },
        async mounted() {
            this.model = this.getIncludedPlacesItems();
        },
        watch: {
            async search(val) {
                if (!val) {
                    return
                }
                let res = await fetch(AppConfig.apiUrl + '/autocomplete?'
                    + `query=${val}`
                    + `&country=${this.getUserCountry()}`
                    + `&currency=${this.getCurrency()}`
                    + `&locale=${this.getLang()+'-'+this.getLang().toUpperCase()}`);
                this.suggestions = await res.json();
                this.model = this.model;
            },
        }
    }
</script>

<style scoped>

</style>