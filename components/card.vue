<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-card
            nuxt
            :to="`/title/${anime.tid}`"
            :style="`backgroundColor: ${this.anime.image.hex ? this.settings.dark ? this.anime.image.hex.dark : this.anime.image.hex.light : null}`"
            hover
            ripple
            tile
    >
        <v-img
                :src="anime.image.full"
                aspect-ratio="0.7"
                :gradient="`to bottom, transparent 0%, transparent 40%, ${this.anime.image.hex ? this.settings.dark ? this.anime.image.hex.dark : this.anime.image.hex.light : 'rgba(0, 0, 0, 0.4)'} 100%`"
                :alt="anime.en ? anime.en : anime.ja"
        >
            <v-layout align-start justify-end column fill-height class="ma-0">
                <v-flex v-if="anime.recommended">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-icon
                                    v-on="on"
                                    x-large
                                    color="red darken-1"
                                    class="ma-3"
                            >
                                {{icons.mdiHeart}}
                            </v-icon>
                        </template>
                        <span class="text-uppercase">{{$t("card.recommended")}}</span>
                    </v-tooltip>
                </v-flex>
                <v-card-title class="subtitle-1 font-weight-bold">{{anime.en ? anime.en : anime.ja}}</v-card-title>
                <v-card-subtitle
                        v-if="anime.dateStart"
                        class="d-flex align-center justify-space-between"
                        style="width: 100%"
                >
                    {{$t("card.start", [anime.dateStart])}}
                    <v-chip
                            v-if="anime.watchingStatus"
                            x-small
                            :color="watchingStatusColor(anime.watchingStatus)"
                            class="ml-auto text-uppercase"
                    >
                        {{$t(`card.watching_status.${anime.watchingStatus}`)}}
                    </v-chip>
                </v-card-subtitle>
            </v-layout>
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
