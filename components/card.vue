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
                :aspect-ratio="1/1.4"
                max-height="300px"
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
            <v-container fill-height fluid v-if="anime.recommended">
                <v-layout column align-center>
                    <v-flex xs12>
                        <v-chip
                                small
                                disabled
                                class="orange darken-3"
                                text-color="white"
                        >{{$t("card.recommended")}}
                        </v-chip>
                    </v-flex>
                </v-layout>
            </v-container>
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
    import { mapGetters } from 'vuex'

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
