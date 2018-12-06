<template>
    <v-container fluid pa-0>
        <v-layout align-top justify-center v-if="Object.keys(ongoingsList).length">
            <v-flex xs12 pa-0>
                <div
                        v-for="dateGroup in ongoingsList"
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
                                    xs6 md3 lg2 xl1
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
    import {mapGetters} from 'vuex'

    export default {
        async asyncData({app, store}) {
            if (store.getters.ongoingsListEmpty) {
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
            ...mapGetters([
                'dark',
                'searchListInput',
                'ongoingsList'
            ]),
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
