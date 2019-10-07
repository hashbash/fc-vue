<template>
    <div>
        <v-combobox
                v-model="chips"
                :items="items"
                chips
                label="Origin airport codes (example: LAX, LHR, BKK...)"
                multiple
                solo
                clearable
                hint="Start typing airport, city or country"
                :search-input.sync="search"
                :loading="loading"
                :menu-props="menu_props"
                :item-text="`place_name`"
                :item-value="`place_code`"
                :return-object="false"
                :cache-items="true"
                no-data-text="Start typing airport, city or country"
                v-on:click="search=null"

        >
            <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip
                        v-bind="attrs"
                        close
                        @click:close="remove(item)"
                >
                    <strong>{{ item.toUpperCase() }}</strong>
                </v-chip>
            </template>
        </v-combobox>
    </div>
</template>

<script>
    export default {
        name: 'ChipList',
        props: {
            origins: Array,
            api_url: String,
        },
        data: () => ({
            chips: [],
            items: [],
            loading: false,
            search: null,
            menu_props: {
                "closeOnClick": true,
                "closeOnContentClick": true,
                "openOnClick": true,
            }
        }),
        methods: {
            remove(item) {
                this.chips.splice(this.chips.indexOf(item), 1);
                this.chips = [...this.chips];
                this.updateParent(this.chips)
            },
            append(item) {
                this.search = null;
                this.chips.append(item);
                this.updateParent(this.chips);

            },
            updateParent(val) {
                this.$emit('updateFromChild', val)
            },
        },
        mounted: function () {
            this.chips = this.origins
        },
        updated: function () {
            this.updateParent(this.chips)
        },
        watch: {
            search(newValue, oldValue) {
                if (newValue === oldValue) return;
                if (newValue === undefined || newValue.length == 0) {
                    this.items = [];
                    return;
                }
                if (this.loading) return;
                this.loading = true;
                fetch(this.api_url + '/autocomplete?query=' + newValue)
                    .then(res => res.json())
                    .then(res => {
                        this.items = res
                    })
                    .catch(err => {
                        // eslint-disable-next-line
                        console.log(err)
                    })
                    .finally(() => (this.loading = false))
            }
        }
    }
</script>

<style scoped>

</style>