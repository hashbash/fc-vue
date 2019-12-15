<template>
    <div>
        <VueMapHeaderBar></VueMapHeaderBar>
        <VueMapboxGL></VueMapboxGL>
    </div>
</template>

<script>
    import VueMapboxGL from "@/components/VueMapboxGL";
    // import MapSearchCard from "@/components/MapSearchCard";
    import VueMapHeaderBar from "@/components/VueMapHeaderBar";
    // import {mapGetters} from 'vuex';
    export default {
        name: "VueMapPage",
        components: {VueMapboxGL, VueMapHeaderBar},
        // data:() => ({
        //     // searchClicked: false
        // }),
        // computed: {
        //     ...mapGetters(['getMapFieldsSearchClicked'])
        // }
    }
</script>

<style scoped>

</style>