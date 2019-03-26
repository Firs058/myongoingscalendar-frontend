<template>
    <v-container article class="grid-list-lg pt-0">
        <v-layout row wrap>
            <v-flex xs12>
                <v-text-field
                        v-model="filterInput"
                        :label="$t('inputs.search.label.2')"
                        prepend-icon="filter_list"
                        hide-details
                        clearable
                        solo
                        flat
                />
            </v-flex>
        </v-layout>
        <v-layout row wrap
                  v-if="Object.keys(filteredOngoingsList).length"
                  v-for="dateGroup in showAll ? filteredOngoingsList : filteredOngoingsList.slice(0, showCount)"
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
        <v-container
                fluid
                :class="$device.isDesktop ? 'grid-list-lg pa-3' : 'grid-list-sm pa-1'"
                v-if="!showAll && filteredOngoingsList.slice(0, showCount).length >= showCount"
                pb-5
        >
            <v-layout row wrap align-center justify-center>
                <v-flex xs12>
                    <v-tooltip top>
                        <v-btn
                                :class="dark ? 'grey darken-3' : 'grey lighten-3'"
                                block
                                slot="activator"
                                flat
                                @click.native="showAll = !showAll"
                        >
                            <v-icon left>arrow_drop_down</v-icon>
                            {{$t('list.show_old')}}
                            <v-icon right>arrow_drop_down</v-icon>
                        </v-btn>
                        <span>{{$t('list.show_old')}}</span>
                    </v-tooltip>
                </v-flex>
            </v-layout>
        </v-container>
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
        data: () => ({
            showCount: 10,
            showAll: false,
            filterInput: ''
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
        computed: {
            ...mapGetters([
                'dark',
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
