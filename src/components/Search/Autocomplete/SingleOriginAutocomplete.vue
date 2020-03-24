<template>
    <v-autocomplete
            v-model="select"
            :loading="loading"
            :items="items"
            item-value="place_code"
            item-text="place_name"
            :search-input.sync="search"
            no-filter
            hide-no-data
            :label="$t('forms.selectors.origin')"
            solo-inverted
            prepend-inner-icon="mdi-circle-outline"
            autocomplete="off"
            spellcheck="false"
            required
            :rules="[ Boolean(select) || $t('forms.warnings.required')]"
            :suffix="select ? (select.length === 3 ? select : this.getSearchOrigin()['place_country_name']) : ''"
    >
        <template v-slot:item="{ item }">
            <v-icon class="headline">{{ item.type === 'airport' ? 'mdi-airport' : 'mdi-city' }}</v-icon>
            <v-spacer style="max-width: 10px"></v-spacer>
            <v-list-item-content>
                    <v-list-item-title v-text="item.type === 'airport' ? item.place_name + ' (' + item.place_code + ')' : item.place_name">
                    </v-list-item-title>
                <v-list-item-subtitle v-text="item['place_country_name']"></v-list-item-subtitle>
            </v-list-item-content>
        </template>
    </v-autocomplete>
</template>

<script>
    import {mapGetters, mapActions} from "vuex";
    import AppConfig from "../../../AppConfig";

    export default {
        name: "SingleOriginAutocomplete",
        data: () => ({
            select: null,
            loading: false,
            search: null,
            items: [],
        }),
        watch: {
            search (val) {
                if (val && val !== this.select) {
                    this.querySelections(val)
                }
            },
            select: {
                handler(newValue) {
                    if (newValue) {
                        this.setSearchOrigin(this.items.filter(e => {
                            return e.place_code === newValue
                            })[0]
                        );
                        this.setOriginItems(this.items.filter(e => {
                            return e.place_code === newValue
                        }))
                    }
                },
                deep: true
            }
        },
        methods: {
            ...mapActions({setSearchOrigin: 'setSearchOrigin', setOriginItems: 'setOriginItems'}),
            ...mapGetters(['getUserCountry', 'getCurrency', 'getLang', 'getSearchOrigin']),
            async querySelections (val) {
                this.loading = true;
                let res = await fetch(AppConfig.apiUrl + '/autocomplete?'
                    + `query=${val}`
                    + `&country=${this.getUserCountry()}`
                    + `&currency=${this.getCurrency()}`
                    + `&locale=${this.getLang()+'-'+this.getLang().toUpperCase()}`)
                    .catch((error) => {
                        console.error(error)
                });
                let places = await res.json();
                this.items = places.filter(e => {
                    return e.type !== 'country'
                });
                this.loading = false;
            },
        },
        async mounted() {
            if (this.getSearchOrigin()) {
                this.items = [this.getSearchOrigin()];
                this.select = this.getSearchOrigin()['place_code']
            }
        }
    }
</script>

<style scoped>

</style>