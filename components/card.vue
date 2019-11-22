<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-card
            nuxt
            :to="`/title/${anime.tid}`"
            :style="`backgroundColor: ${this.anime.image.hex ? this.settings.dark ? this.anime.image.hex.dark : this.anime.image.hex.light : null}`"
            hover
            tile
    >
        <v-img
                :src="anime.image.full"
                aspect-ratio="0.7"
                :gradient="`to bottom, transparent 0%, transparent 30%, ${this.anime.image.hex ? this.settings.dark ? this.anime.image.hex.dark : this.anime.image.hex.light : 'rgba(0, 0, 0, 0.4)'} 100%`"
                :alt="anime.en ? anime.en : anime.ja"
        >
            <div class="d-flex flex-column justify-end fill-height ma-0">
                <div class="d-flex justify-start mb-auto" v-if="anime.watchingStatus || anime.recommended">
                    <div class="d-flex justify-center align-center" v-if="anime.watchingStatus">
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-chip
                                        :color="watchingStatusColor(anime.watchingStatus)"
                                        class="text-uppercase ma-4"
                                        small
                                >
                                    {{$t(`card.watching_status.${anime.watchingStatus}`)}}
                                </v-chip>
                            </template>
                            <span class="text-uppercase">{{$t("card.recommended")}}</span>
                        </v-tooltip>
                    </div>
                    <div class="d-flex ml-auto" v-if="anime.recommended">
                        <v-tooltip top>
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
    import {
        mdiHeart
    } from '@mdi/js';
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            icons: {
                mdiHeart
            }
        }),
        props: [
            'anime'
        ],
        methods: {
            watchingStatusColor(status) {
                switch (status) {
                    case 'NEW':
                        return `orange ${this.settings.dark ? 'darken-1' : 'lighten-2'}`;
                    case 'WATCHING':
                        return `green ${this.settings.dark ? 'darken-1' : 'lighten-2'}`;
                    case 'WATCHED':
                        return `primary ${this.settings.dark ? 'darken-1' : 'lighten-2'}`;
                    case 'DROPPED':
                        return `red ${this.settings.dark ? 'darken-1' : 'lighten-2'}`;
                }
            }
        },
        computed: {
            ...mapGetters([
                'settings'
            ])
        }
    }
</script>
