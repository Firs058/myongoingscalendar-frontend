<template>
    <lazy-hydrate when-visible>
        <v-container
                slot-scope="{ hydrated }"
                v-if="hydrated"
                article
                :class="$device.isMobile ? 'grid-list-xs' : 'grid-list-lg pt-0'"
        >
            <v-layout row wrap>
                <v-flex xs12>
                    <v-text-field
                            v-model="filterInput"
                            :label="$t('inputs.search.label.2')"
                            :prepend-inner-icon="icons.mdiFilterVariant"
                            hide-details
                            clearable
                            solo
                            flat
                    />
                </v-flex>
            </v-layout>
            <v-layout row wrap
                      v-if="Object.keys(filteredOngoingsList).length"
                      v-for="dateGroup in filteredOngoingsList.slice(0, showCount)"
                      :key="dateGroup.dateStart"
            >
                <v-flex xs12>
                    <v-subheader>{{dateGroup.dateStart}}</v-subheader>
                </v-flex>
                <v-layout row wrap justify-left class="ma-0">
                    <v-flex
                            v-for="anime in dateGroup.animes"
                            :key="anime.tid"
                            xs6 md3 lg2
                    >
                        <card :anime="anime"/>
                    </v-flex>
                </v-layout>
            </v-layout>
            <infinite-loading @infinite="infiniteHandler"/>
            <v-layout
                    v-if="!Object.keys(filteredOngoingsList).length"
                    fluid
            >
                <v-alert
                        color="info"
                        icon="info"
                        value="true"
                >
                    {{$t("alerts.nothing_found")}}
                </v-alert>
            </v-layout>
        </v-container>
    </lazy-hydrate>
</template>

<script>
    import {
        mdiFilterVariant
    } from '@mdi/js';
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            showCount: 4,
            filterInput: '',
            icons:{
                mdiFilterVariant
            }
        }),
        async asyncData({app, store}) {
            if (store.getters.ongoingsListEmpty) {
                const data = await app.$axios.$post('api/public/title/list');
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
        methods: {
            infiniteHandler($state) {
                if (this.filteredOngoingsList.slice(0, this.showCount).length < this.filteredOngoingsList.length) {
                    this.showCount++;
                    $state.loaded();
                } else {
                    $state.complete();
                }
            }
        },
        computed: {
            ...mapGetters([
                'ongoingsList'
            ]),
            filteredOngoingsList() {
                let list = this.ongoingsList;
                let input = this.filterInput;
                if (input) {
                    let filtered = [];
                    input = input.trim().toLowerCase();
                    list.forEach(e => {
                        let found = e.animes.filter(e => (e.en ? e.en : e.ja).toLowerCase().includes(input) || (e.ja ? e.ja : e.en).toLowerCase().includes(input));
                        if (found.length) filtered.push({dateStart: e.dateStart, animes: found})
                    });
                    return filtered
                }
                return list
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
        }
    }
</script>
