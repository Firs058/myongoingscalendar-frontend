<template>
    <lazy-hydrate when-visible>
        <v-container
                slot-scope="{ hydrated }"
                v-if="hydrated"
                article
                :class="$device.isMobile ? 'grid-list-lg' : 'grid-list-lg pt-0'"
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
            <v-layout
                    row
                    wrap
                    v-if="!ongoingsListIsEmpty"
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
                            xs12
                            sm6
                            :md4="$device.isDesktop"
                            lg4
                            :xl2="$device.isDesktop"
                    >
                        <card :anime="anime"/>
                    </v-flex>
                </v-layout>
            </v-layout>
            <infinite-loading @infinite="infiniteHandler"/>
            <v-layout
                    v-if="!Object.keys(filteredOngoingsList).length"
                    align-center justify-center text-center
            >
                <v-flex xs12>
                    <v-alert tile type="info" :value="true">
                        {{$t("alerts.nothing_found")}}
                    </v-alert>
                </v-flex>
            </v-layout>
        </v-container>
    </lazy-hydrate>
</template>

<script>
    import {icons} from '../mixins/icons'

    export default {
        data: () => ({
            showCount: 3,
            filterInput: ''
        }),
        async asyncData({app}) {
            const {ongoingsList} = await app.$anime.getOngoingsList();
            return {ongoingsList};
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
                if (!this.ongoingsListIsEmpty) {
                    if (this.filteredOngoingsList.slice(0, this.showCount).length < this.filteredOngoingsList.length) {
                        this.showCount++;
                        $state.loaded();
                    } else $state.complete()
                } else $state.complete()
            }
        },
        mixins: [
            icons
        ],
        computed: {
            ongoingsListIsEmpty() {
                return !!this.ongoingsList && !Object.keys(this.ongoingsList).length
            },
            filteredOngoingsList() {
                let list = this.ongoingsList;
                let input = this.filterInput;
                if (input) {
                    input = input.trim().toLowerCase();
                    return list.reduce((filtered, item) => {
                        let found = item.animes.filter(e => (e.en ? e.en : e.ja).toLowerCase().includes(input) || (e.ja ? e.ja : e.en).toLowerCase().includes(input));
                        if (found.length) filtered.push({dateStart: item.dateStart, animes: found});
                        return filtered
                    }, []);
                }
                return list
            },
            globalUrl() {
                return `${process.env.BASE_URL}${this.$route.fullPath}`
            },
            globalImage() {
                return `${process.env.BASE_URL}${this.$store.getters.webpIsSupported ? '/images/webp/empty.webp' : '/images/empty.png'}`
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
