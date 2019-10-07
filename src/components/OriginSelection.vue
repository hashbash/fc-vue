<template>
    <v-autocomplete
            v-model="selectedOrigins"
            :items="availableOrigins"
            :loading="isLoading"
            clearable
            chips
            dense
            multiple
            deletable-chips
            solo
            hide-selected
            no-data-text="Search for airport, city or country"
            :search-input.sync="search"
            item-value="place_code"
            item-text="place_name"
            label="Origins"
            :menu-props="{closeOnContentClick: true}"
            no-filter
            aria-autocomplete="none"
    >
    </v-autocomplete>
</template>

<script>
    export default {
        name: "OriginSelection",
        data: () => ({
            selectedOrigins: null,
            availableOrigins: [],
            searchResults: [],
            isLoading: false,
            search: null,
        }),
        methods: {
            remove(item) {
                const index = this.selectedOrigins.indexOf(item.name);
                if (index >= 0) this.selectedOrigins.splice(index, 1)
            },
            updateParent() {
                this.$emit('updateFromChild', this.selectedOrigins)
            },
        },
        created: function () {
            this.selectedOrigins = this.origins;
            this.availableOrigins = this.origins;
        },
        updated: function () {
            this.updateParent(this.selectedOrigins)
        },
        props: {
            origins: Array,
            api_url: String,
        },
        watch: {
            search(newValue, oldValue) {
                if (newValue === oldValue) return;
                if (newValue === undefined || newValue.length == 0) {
                    this.availableOrigins = this.selectedOrigins;
                    return;
                }
                this.isLoading = true;
                this.availableOrigins = [];
                fetch(this.api_url + `/autocomplete?query=${newValue}`)
                    .then(res => res.json())
                    .then(res => {
                        this.searchResults = res;
                        this.availableOrigins = res.concat(this.selectedOrigins)
                    })
                    .finally(() => {
                        this.isLoading = false;
                    })
            },
        }
    }
</script>

<style scoped>

</style>