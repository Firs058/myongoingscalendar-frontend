<template>
    <div v-if="Object.keys(asyncList).length">
        <v-container
                fluid
                :class="$device.isDesktop ? 'grid-list-lg pa-3' : 'grid-list-sm pa-1'"
                v-for="dateGroup in asyncList"
                :key="dateGroup.start"
        >
            <v-subheader>{{dateGroup.start}}</v-subheader>
            <v-layout row wrap justify-left>
                <v-flex
                        v-for="anime in dateGroup.values"
                        :key="anime.tid"
                        xs6 md4 lg3 xl2
                >
                    <card :anime="anime"/>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
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
                return list
                    .filter(each => this.searchListInput ? (each.en ? each.en : each.ja).toLowerCase().includes(this.searchListInput.trim().toLowerCase()) : list)
                    .reduce((rv, x) => {
                        let v = x['dateStart'],
                            el = rv.find(r => r && r.start === v);
                        el
                            ? el.values.push(x)
                            : rv.push({
                                start: v,
                                values: [x]
                            });
                        return rv;
                    }, [])
                    .sort((a, b) => (a.start === null) - (b.start === null) || -(a.start > b.start) || +(a.start < b.start))
            },
            globalUrl() {
                return `${process.env.baseUrl}${this.$route.fullPath}`
            },
            globalImage() {
                return `${process.env.baseUrl}/images/empty.png`
            },
            globalDescription() {
                return this.$t("meta_info.list.meta.description")
            },
            globalTitle() {
                return this.$t("meta_info.list.title", ['| MyOngoingsCalendar'])
            }
        },
        activated() {
            this.$store.dispatch('setSearchListPanel', true);
        },
        deactivated() {
            this.$store.dispatch('setSearchListPanel', false)
        }
    }
</script>
