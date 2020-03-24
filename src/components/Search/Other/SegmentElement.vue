<template>
    <v-stepper alt-labels>
        <v-stepper-header>
            <template v-for="(origin, index) in origins"
            >
                <v-stepper-step :key="`${index}-origin`" :step="origin" color="grey"
                >
                    <small class="text-center">{{originNames[index]}}</small>
                </v-stepper-step>
                <v-divider :key="`${index}-divider1`"></v-divider>

                <v-stepper-step :key="`${index}-destination`"
                                :step="destinations[index]"
                >
                    <small class="text-center">{{destinationNames[index]}}</small>
                </v-stepper-step>

                <div :key="`${index}-div`"
                     v-if="(index + 1) < origins.length"
                     class="text-center" style="padding-top: 1.2%;"
                >{{$t('meta.stop')}}
                    <br>{{ prettyInterval(
                    (Date.parse(departures[index+1])
                    -Date.parse(arrivals[index]))/1000
                    )}}
                </div>
            </template>

        </v-stepper-header>
    </v-stepper>
</template>

<script>
    export default {
        name: "SegmentElement",
        methods: {
            prettyInterval(secs) {
                let sec_num = parseInt(secs, 10);
                let hours   = Math.floor(sec_num / 3600);
                let minutes = Math.floor(sec_num / 60) % 60;

                return [hours,minutes]
                    .map(v => v < 10 ? "0" + v : v)
                    .filter((v,i) => v !== "00" || i > 0)
                    .join("h ") + 'm'
            }
        },
        props: {
            origins: Array,
            originNames: Array,
            destinations: Array,
            destinationNames: Array,
            departures: Array,
            arrivals: Array

        }
    }
</script>

<style scoped>

</style>