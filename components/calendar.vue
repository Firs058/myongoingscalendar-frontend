<template>
    <lazy-hydrate when-visible>
        <v-layout
                slot-scope="{ hydrated }"
                v-if="hydrated"
                row
                wrap
                justify-center
        >
            <v-flex
                    v-for="(each, index) in showAll ? calendar : calendar.slice(0, showCount)"
                    :key="index"
                    xs12 md6 lg4 xl3
            >
                <v-subheader
                        :class="each.day.today ? 'orange--text text-capitalize' : each.day.weekend ? 'red--text text-capitalize' : 'text-capitalize'">
                    {{each.day.today ? $t('calendar.today') : each.day.date}}
                </v-subheader>
                <v-card flat>
                    <v-list
                            three-line
                            subheader
                            class="pa-0"
                    >
                        <template v-for="(anime, index) in each.anime">
                            <v-list-tile
                                    avatar
                                    :ripple="{ class: 'grey--text' }"
                                    :key="index"
                                    nuxt
                                    :to="`/title/${anime.tid}`"
                            >
                                <v-list-tile-avatar>
                                    <img :src="anime.image">
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{anime.titleen ? anime.titleen : anime.title}}
                                    </v-list-tile-title>
                                    <v-list-tile-sub-title>{{$t('calendar.episode', [anime.episode])}}
                                    </v-list-tile-sub-title>
                                    <v-list-tile-sub-title>{{$t('calendar.channel', [anime.channel])}}
                                    </v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-list-tile-action-text :class="dark ? 'white--text' : 'black--text'">
                                        {{[anime.time, ["HH:mm"]] | moment(fullTimeFormat)}}
                                        <span
                                                v-if="anime.shift !== '0'"
                                                class="error--text"
                                        >
                                        {{'&nbsp' + anime.shift}}
                                    </span>
                                    </v-list-tile-action-text>
                                </v-list-tile-action>
                            </v-list-tile>
                            <v-divider v-if="index + 1 < each.anime.length"/>
                        </template>
                    </v-list>
                </v-card>
            </v-flex>
            <infinite-loading v-if="!showAll" @infinite="infiniteHandler"/>
        </v-layout>
    </lazy-hydrate>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            showCount: 4
        }),
        props: ['calendar', 'showAll'],
        methods: {
            infiniteHandler($state) {
                if (this.calendar.slice(0, this.showCount).length < this.calendar.length) {
                    this.showCount += this.raiseCount;
                    $state.loaded();
                } else {
                    $state.complete();
                }
            }
        },
        computed: {
            ...mapGetters([
                'dark',
                'fullTimeFormat'
            ]),
            raiseCount() {
                switch (this.$vuetify.breakpoint.name) {
                    case 'xs':
                        return 1;
                    case 'sm':
                        return 2;
                    case 'md':
                        return 3;
                    case 'lg':
                        return 3;
                    case 'xl':
                        return 4
                }
            }
        }
    }
</script>
