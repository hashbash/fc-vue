<template>
    <div>
        <VueMapHeaderBar></VueMapHeaderBar>
        <VueMapboxGL></VueMapboxGL>
        <VueMapboxRoute></VueMapboxRoute>
    </div>
</template>

<script>
    import VueMapboxGL from "@/components/VueMapboxGL";
    import VueMapHeaderBar from "@/components/VueMapHeaderBar";
    import VueMapboxRoute from "@/components/VueMapboxRoute";
    export default {
        name: "VueMapPage",
        components: {VueMapboxGL, VueMapHeaderBar, VueMapboxRoute},
    }
</script>

<style scoped>

</style>