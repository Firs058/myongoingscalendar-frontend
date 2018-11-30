<template>
    <v-container fluid pa-0>
        <v-layout align-top justify-center v-if="Object.keys(asyncList).length">
            <v-flex xs12 sm10 lg8 pa-0>
                <div
                        v-for="dateGroup in asyncList"
                        :key="dateGroup.dateStart"
                >
                    <v-container
                            fluid
                            :class="$device.isDesktop ? 'grid-list-lg pa-3' : 'grid-list-sm pa-1'"
                    >
                        <v-subheader>{{dateGroup.dateStart}}</v-subheader>
                        <v-layout row wrap justify-left>
                            <v-flex
                                    v-for="anime in dateGroup.animes"
                                    :key="anime.tid"
                                    xs6 md4 lg3 xl2
                            >
                                <card :anime="anime"/>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </div>
            </v-flex>
        </v-layout>
        <v-container
                v-else
                fluid
        >
            <v-alert
                    color="info"
                    icon="info"
                    value="true"
            >
                {{$t("alerts.nothing_found")}}
            </v-alert>
        </v-container>
    </v-container>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        async asyncData({app, store}) {
            if (!Object.keys(store.state.ongoingsList).length) {
                const data = await app.$axios.$post('api/title/list');
                store.dispatch('setOngoingsList', data.payload)
            }
        },
        head() {
            return {
                title: this.globalTitle,
                meta: [
                    {
                        name: 'description',
                        content: this.globalDescription
                    },
                    {
                        property: 'og:title',
                        content: this.globalTitle
                    },
                    {
                        property: 'og:description',
                        content: this.globalDescription
                    },
                    {
                        property: 'og:type',
                        content: 'website'
                    },
                    {
                        property: 'og:url',
                        content: this.globalUrl
                    },
                    {
                        property: 'og:image',
                        content: this.globalImage
                    },
                    {
                        name: 'twitter:card',
                        content: 'summary'
                    },
                    {
                        name: 'twitter:site',
                        content: '@myongoingscale1'
                    },
                    {
                        name: 'twitter:title',
                        content: this.globalTitle
                    },
                    {
                        name: 'twitter:description',
                        content: this.globalDescription
                    },
                    {
                        property: 'twitter:image',
                        content: this.globalImage
                    }
                ]
            }
        },
        computed: {
            ...mapState({
                dark: state => state.settings.dark,
                searchListInput: state => state.search.list.input
            }),
            asyncList() {
                const list = this.$store.state.ongoingsList;
                if (this.searchListInput) {
                    let filtered = [];
                    list.forEach(e => {
                        let input = this.searchListInput.trim().toLowerCase();
                        let found = e.animes.filter(e => (e.en ? e.en : e.ja).toLowerCase().includes(input) || (e.ja ? e.ja : e.en).toLowerCase().includes(input));
                        if (found.length) filtered.push({dateStart: e.dateStart, animes: found})
                    });
                    return filtered
                }
                return list
            },
            globalUrl() {
                return `${process.env.baseUrl}${this.$route.fullPath}`
            }
            ,
            globalImage() {
                return `${process.env.baseUrl}/images/empty.png`
            }
            ,
            globalDescription() {
                return this.$t("meta_info.list.meta.description")
            }
            ,
            globalTitle() {
                return this.$t("meta_info.list.title", ['| MyOngoingsCalendar'])
            }
        }
    }
</script>
