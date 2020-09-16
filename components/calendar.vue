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
                        :class="{
                            'text-capitalize': true,
                            'orange--text': each.day.today && settings.dark,
                            'deep-orange--text': each.day.today && !settings.dark,
                            'red--text': each.day.weekend,
                            'text--lighten-3': settings.dark,
                            'text--darken-4': !settings.dark,
                        }"
                >
                    {{each.day.today ? $t('calendar.today') : each.day.date}}
                </v-subheader>
                <v-list
                        three-line
                        subheader
                        class="pa-0"
                >
                    <v-list-item-group v-for="(anime, index2) in each.anime" :key="index2">
                        <v-list-item
                                :ripple="!$device.isMobile ? { class: 'grey--text' } : false"
                                nuxt
                                :to="`/title/${anime.tid}`"
                        >
                            <v-list-item-avatar>
                                <img
                                        :src="getImagePath({paths: anime.image.paths, type: 'THUMBNAIL'})"
                                        :alt="anime.titleen ? anime.titleen : anime.title"
                                >
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>{{anime.titleen ? anime.titleen : anime.title}}
                                </v-list-item-title>
                                <v-list-item-subtitle>{{$t('calendar.episode', [anime.episode])}}
                                </v-list-item-subtitle>
                                <v-list-item-subtitle>{{$t('calendar.channel', [anime.channel])}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action class="d-flex flex-column align-center">
                                <v-list-item-action-text :class="settings.dark ? 'white--text' : 'black--text'">
                                    {{ $dayjs(anime.time, "HH:mm").format(settings.fullTimeFormat ? 'HH:mm' : 'LT') }}
                                </v-list-item-action-text>
                                <v-list-item-action-text
                                        v-if="anime.shift !== '0'"
                                        :class="{
                                            'red--text': true,
                                            'text--lighten-3': settings.dark,
                                            'text--darken-4' : !settings.dark,
                                        }"
                                >
                                    {{anime.shift}}
                                </v-list-item-action-text>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider v-if="index2 + 1 < each.anime.length"/>
                    </v-list-item-group>
                </v-list>
            </v-flex>
            <infinite-loading v-if="!showAll" @infinite="infiniteHandler"/>
        </v-layout>
    </lazy-hydrate>
</template>

<script>
    import {image} from '../mixins/image'
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            showCount: 4
        }),
        props: ['calendar', 'showAll'],
        methods: {
            infiniteHandler($state) {
                if (!this.calendarIsEmpty) {
                    if (this.calendar.slice(0, this.showCount).length < this.calendar.length) {
                        this.showCount += this.raiseCount;
                        $state.loaded();
                    } else $state.complete();
                } else $state.complete()
            }
        },
        mixins: [
            image
        ],
        computed: {
            ...mapGetters([
                'settings'
            ]),
            calendarIsEmpty() {
                return !!this.calendar && !Object.keys(this.calendar).length
            },
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
<style scoped>
    >>> .v-list-item__action {
        align-self: center !important;
        margin: 0 0 0 16px !important;
    }

    >>> .v-list {
        border-radius: 0 !important;
    }
</style>
