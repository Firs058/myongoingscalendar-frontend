<template>
    <v-card
            nuxt
            :to="`/title/${anime.tid}`"
            :style="`backgroundColor: ${this.anime.image.hex ? this.settings.dark ? this.anime.image.hex.dark : this.anime.image.hex.light : null}`"
            hover
            ripple
    >
        <v-img
                :src="anime.image.full"
                aspect-ratio="0.7"
                :gradient="`to bottom, transparent 0%, transparent 40%, ${this.anime.image.hex ? this.settings.dark ? this.anime.image.hex.dark : this.anime.image.hex.light : 'rgba(0, 0, 0, 0.4)'} 100%`"
        >
            <v-layout align-start justify-end column fill-height class="ma-0">
                <v-flex v-if="anime.recommended">
                    <v-tooltip top>
                        <v-icon
                                slot="activator"
                                large
                                color="red darken-1"
                                class="ma-3"
                                style="font-size: 48px;"
                        >favorite
                        </v-icon>
                        <span>{{$t("card.recommended")}}</span>
                    </v-tooltip>
                </v-flex>
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
            </v-layout>
        </v-img>
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
                'settings'
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
