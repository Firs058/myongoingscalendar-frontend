<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-card
            nuxt
            :to="`/title/${anime.tid}`"
            :style="`backgroundColor: ${Object.keys(anime.image.hex).length ? settings.dark ? anime.image.hex.dark : anime.image.hex.light : null}`"
            hover
            tile
            :ripple="!$device.isMobile"
    >
        <v-img
                :src="getImagePath({paths: anime.image.paths, type: 'FULL'})"
                aspect-ratio="0.7"
                :gradient="`to bottom, transparent 0%, transparent 30%, ${Object.keys(anime.image.hex).length ? settings.dark ? anime.image.hex.dark : anime.image.hex.light : 'rgba(0, 0, 0, 0.4)'} 100%`"
                :alt="anime.en ? anime.en : anime.ja"
        >
            <div class="d-flex flex-column justify-end fill-height ma-0">
                <div class="d-flex justify-start mb-auto" v-if="anime.watchingStatus || anime.recommended">
                    <div class="d-flex justify-center align-center" v-if="anime.watchingStatus">
                        <v-chip
                                :color="statusColor"
                                class="text-uppercase ma-4"
                                small
                        >
                            {{$t(`card.watching_status.${anime.watchingStatus}`)}}
                        </v-chip>
                    </div>
                    <div class="d-flex ml-auto" v-if="anime.recommended">
                        <v-tooltip top :disabled="!$device.isDesktop">
                            <template v-slot:activator="{ on }">
                                <v-icon
                                        v-on="on"
                                        size="32"
                                        color="red darken-1"
                                        class="mx-4 my-3"
                                >
                                    {{icons.mdiHeart}}
                                </v-icon>
                            </template>
                            <span class="text-uppercase">{{$t("card.recommended")}}</span>
                        </v-tooltip>
                    </div>
                </div>
                <v-card-title>{{anime.en ? anime.en : anime.ja}}</v-card-title>
                <v-card-subtitle v-if="anime.dateStart">{{$t("card.start", [anime.dateStart])}}</v-card-subtitle>
            </div>
        </v-img>
    </v-card>
</template>

<script>
    import {icons} from '../mixins/icons'
    import {image} from '../mixins/image'
    import {mapGetters} from 'vuex'

    export default {
        props: [
            'anime'
        ],
        mixins: [
            icons,
            image
        ],
        computed: {
            ...mapGetters([
                'settings'
            ]),
            statusColor() {
                switch (this.anime.watchingStatus) {
                    case 'NEW':
                        return `orange ${this.settings.dark ? 'darken-3' : 'lighten-2'}`;
                    case 'WATCHING':
                        return `green ${this.settings.dark ? 'darken-3' : 'lighten-2'}`;
                    case 'WATCHED':
                        return `blue ${this.settings.dark ? 'darken-3' : 'lighten-2'}`;
                    case 'DROPPED':
                        return `red ${this.settings.dark ? 'darken-3' : 'lighten-2'}`;
                }
            }
        }
    }
</script>
