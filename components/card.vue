<template>
    <v-card
            nuxt
            :to="`/title/${anime.tid}`"
            :style="`backgroundColor: ${this.anime.image.hex ? this.dark ? this.anime.image.hex.dark : this.anime.image.hex.light : null}`"
            hover
            ripple
    >
        <v-img
                :src="anime.image.full"
                aspect-ratio="0.7"
        >
            <v-layout
                    slot="placeholder"
                    fill-height
                    align-center
                    justify-center
                    ma-0
            >
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-layout>
            <v-layout align-start justify-start fill-height v-if="anime.recommended">
                <v-flex xs12>
                    <v-tooltip top>
                        <v-icon
                                slot="activator"
                                large
                                color="red darken-1"
                                class="ma-4"
                                style="font-size: 48px;"
                        >favorite
                        </v-icon>
                        <span>{{$t("card.recommended")}}</span>
                    </v-tooltip>
                </v-flex>
            </v-layout>
        </v-img>
        <v-card-title primary-title>
            <v-layout text-xs-left>
                <v-flex>
                    <h3>{{anime.en ? anime.en : anime.ja}}</h3>
                    <span
                            v-if="anime.dateStart"
                            :class="$device.isDesktop ? null : 'caption'"
                    >
            {{$t("card.start", [anime.dateStart])}}
          </span>
                </v-flex>
            </v-layout>
        </v-card-title>
    </v-card>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        props: [
            'anime'
        ],
        computed: {
            ...mapGetters([
                'dark'
            ])
        }
    }
</script>

<style scoped>
    .recommended {
        padding-left: 70px;
        position: absolute !important;
        left: -70px;
        top: 20px;
    }
</style>
