<template>
    <v-container
            fluid
            :class="$device.isDesktop ? 'grid-list-lg pa-3' : 'grid-list-sm pa-1'"
    >
        <v-layout
                v-if="!!asyncCache && asyncCache.count > 0"
                row wrap justify-left
        >
            <v-flex xs12>
                <v-subheader>{{$t("search.founded", [asyncCache.count])}}</v-subheader>
                <v-chip
                        v-if="searchGlobalInput"
                        color="teal lighten-3"
                        close
                        @input="$store.dispatch('setSearchGlobalInput', '')"
                >
                    {{`${$t('search.chips.name')}: ${searchGlobalInput}`}}
                </v-chip>
                <v-chip
                        v-for="filter in filters"
                        :key="filter.name"
                        v-if="filter.added"
                        :color="`${filter.color} lighten-3`"
                        close
                        @input="filter.added = false, filter.selected ? filters.genres.selected = [] : null"
                >
                       <span v-if="filter.range">
                            {{`${$t(`search.chips.${filter.name}`)}: ${$t('search.extension.filters.from')} ${filter.range[0]} ${$t('search.extension.filters.to')} ${filter.range[1]}`}}
                       </span>
                    <span v-else-if="filter.selected">
                            {{`${$t(`search.chips.${filter.name}`)}: ${getGenresName}`}}
                       </span>
                </v-chip>
                <v-tooltip top>
                    <v-btn
                            slot="activator"
                            v-if="available"
                            icon
                            @click.native="()=> $store.dispatch('setSearchGlobalExtension', true)"
                    >
                        <v-icon>add</v-icon>
                    </v-btn>
                    <span>{{$t('search.tooltips.add_filter')}}</span>
                </v-tooltip>
            </v-flex>
            <v-flex
                    v-for="anime in asyncCache.animes"
                    :key="anime.tid"
                    xs6 md4 lg3 xl2
            >
                <card :anime="anime"/>
            </v-flex>
            <v-layout
                    v-if="!!asyncCache && countPages > 1"
                    align-top justify-center text-xs-center
            >
                <v-flex xs12>
                    <v-pagination
                            :length="countPages"
                            v-model="currentPage"
                            :total-visible="$device.isDesktop ? 7 : 4"
                    />
                </v-flex>
            </v-layout>
        </v-layout>
        <v-layout
                v-if="!!asyncCache && asyncCache.count === 0"
                align-top justify-center text-xs-center
        >
            <v-alert
                    color="info"
                    icon="info"
                    value="true"
            >
                {{$t("alerts.nothing_found")}}
            </v-alert>
        </v-layout>
        <v-dialog
                :fullscreen="!$device.isDesktop"
                persistent
                v-model="extension"
                max-width="50%"
        >
            <v-card>
                <v-toolbar card>
                    <v-toolbar-title class="headline">{{$t('search.extension.headline')}}</v-toolbar-title>
                    <v-spacer/>
                </v-toolbar>
                <v-card-text v-if="selected">
                    <v-chip
                            v-if="searchGlobalInput"
                            color="teal lighten-3"
                            close
                            @input="$store.dispatch('setSearchGlobalInput', '')"
                    >
                        {{`${$t('search.chips.name')}: ${searchGlobalInput}`}}
                    </v-chip>
                    <v-chip
                            v-for="filter in filters"
                            :key="filter.name"
                            v-if="filter.added"
                            :color="`${filter.color} lighten-3`"
                            close
                            @input="filter.added = false, filter.selected ? filters.genres.selected = [] : null"
                    >
                       <span v-if="filter.range">
                            {{`${$t(`search.chips.${filter.name}`)}: ${$t('search.extension.filters.from')} ${filter.range[0]} ${$t('search.extension.filters.to')} ${filter.range[1]}`}}
                       </span>
                        <span v-else-if="filter.selected">
                            {{`${$t(`search.chips.${filter.name}`)}: ${getGenresName}`}}
                       </span>
                    </v-chip>
                </v-card-text>
                <v-card-text>
                    <v-subheader v-if="!filters.genres.added">{{$t('search.chips.genres')}}</v-subheader>
                    <v-layout v-if="!filters.genres.added" row align-center>
                        <v-flex>
                            <v-flex xs12>
                                <v-select
                                        v-model="filters.genres.selected"
                                        :items="genresList"
                                        attach
                                        chips
                                        :label="$t('search.extension.select_genres')"
                                        multiple
                                        item-text="name"
                                        item-value="id"
                                        clearable
                                        deletable-chips
                                ></v-select>
                            </v-flex>
                        </v-flex>
                        <v-flex shrink>
                            <v-tooltip top>
                                <v-btn
                                        slot="activator"
                                        v-if="available"
                                        :disabled=!filters.genres.selected.length
                                        icon
                                        @click.native="filters.genres.added=true"
                                >
                                    <v-icon>add</v-icon>
                                </v-btn>
                                <span>{{$t('search.tooltips.add_filter')}}</span>
                            </v-tooltip>
                        </v-flex>
                    </v-layout>
                    <v-subheader v-if="!filters.scores.added">{{$t('search.chips.scores')}}</v-subheader>
                    <v-layout v-if="!filters.scores.added" row>
                        <v-flex shrink style="width: 40px">
                            <v-text-field
                                    v-model="filters.scores.range[0]"
                                    class="mt-0"
                                    hide-details
                                    single-line
                                    type="number"
                            ></v-text-field>
                        </v-flex>
                        <v-flex class="px-3">
                            <v-range-slider
                                    v-model="filters.scores.range"
                                    :max="supply.scores[1]"
                                    :min="supply.scores[0]"
                                    step="0.1"
                            ></v-range-slider>
                        </v-flex>
                        <v-flex shrink style="width: 40px">
                            <v-text-field
                                    v-model="filters.scores.range[1]"
                                    class="mt-0"
                                    hide-details
                                    single-line
                                    type="number"
                            ></v-text-field>
                        </v-flex>
                        <v-flex shrink>
                            <v-tooltip top>
                                <v-btn
                                        slot="activator"
                                        v-if="available"
                                        icon
                                        @click.native="filters.scores.added=true"
                                >
                                    <v-icon>add</v-icon>
                                </v-btn>
                                <span>{{$t('search.tooltips.add_filter')}}</span>
                            </v-tooltip>
                        </v-flex>
                    </v-layout>
                    <v-subheader v-if="!filters.years.added">{{$t('search.chips.years')}}</v-subheader>
                    <v-layout v-if="!filters.years.added" row>
                        <v-flex shrink style="width: 60px">
                            <v-text-field
                                    v-model="filters.years.range[0]"
                                    class="mt-0"
                                    hide-details
                                    single-line
                                    mask="####"
                                    type="number"
                            ></v-text-field>
                        </v-flex>
                        <v-flex class="px-3">
                            <v-range-slider
                                    v-model="filters.years.range"
                                    :max="supply.years[1]"
                                    :min="supply.years[0]"
                                    step="1"
                            ></v-range-slider>
                        </v-flex>
                        <v-flex shrink style="width: 60px">
                            <v-text-field
                                    v-model="filters.years.range[1]"
                                    class="mt-0"
                                    hide-details
                                    single-line
                                    mask="####"
                                    type="number"
                            ></v-text-field>
                        </v-flex>
                        <v-flex shrink>
                            <v-tooltip top>
                                <v-btn
                                        slot="activator"
                                        v-if="available"
                                        icon
                                        @click.native="filters.years.added=true"
                                >
                                    <v-icon>add</v-icon>
                                </v-btn>
                                <span>{{$t('search.tooltips.add_filter')}}</span>
                            </v-tooltip>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="success" @click.native="()=> $store.dispatch('setSearchGlobalExtension', false)">
                        {{$t('buttons.close')}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        data: () => ({
            countPages: 1
        }),
        async asyncData({query, app, store}) {
            if (!Object.keys(store.state.search.global.supply).length) {
                const data = await app.$axios.$post(`api/es/supply`);
                store.dispatch('setSearchGlobalSupply', data.payload)
            }
            return {
                query: query.query,
                currentPage: parseInt(query.page >= 1 ? query.page : 1),
                filters: {
                    genres: {
                        name: 'genres',
                        added: !!query.genres,
                        selected: typeof query.genres === 'string' ? Array(query.genres) : query.genres || [],
                        color: 'green'
                    },
                    scores: {
                        name: 'scores',
                        added: !!query.scores,
                        range: query.scores || ['6', '9'],
                        color: 'purple'
                    },
                    years: {
                        name: 'years',
                        added: !!query.years,
                        range: query.years || ['2010', '2020'],
                        color: 'indigo'
                    }
                }
            }
        },
        head() {
            return {
                title: this.searchGlobalInput
                    ? this.$t("meta_info.search.title.1", [this.searchGlobalInput, '| MyOngoingsCalendar'])
                    : this.$t("meta_info.search.title.2", ['| MyOngoingsCalendar']),
                meta: [
                    {
                        name: 'description',
                        content: this.$t("meta_info.search.meta.description", [this.searchGlobalInput])
                    }
                ]
            }
        },
        asyncComputed: {
            asyncCache: {
                lazy: true,
                get() {
                    const payload = {
                        query: this.searchGlobalInput,
                        page: this.currentPage
                    };
                    if (this.filters.genres.added) payload.genres = this.filters.genres.selected;
                    if (this.filters.scores.added) payload.scores = this.filters.scores.range;
                    if (this.filters.years.added) payload.years = this.filters.years.range;

                    return this.$anime.api('api/es/autocomplete', payload)
                        .then(response => {
                            this.countPages = Math.ceil(response.data.payload.count / 10) || 1;
                            return response.data.payload
                        })
                        .then(cache => {
                            if (this.countPages < this.currentPage) {
                                this.currentPage = 1;
                                this.$anime.api('api/es/autocomplete', payload)
                                    .then(response => {
                                        this.countPages = Math.ceil(response.data.payload.count / 10) || 1;
                                        return response.data.payload
                                    })
                            } else return cache
                        })
                        .then(cache => {
                            this.$router.replace({path: 'search', query: payload});
                            return cache
                        })
                        .catch(code => this.$toast.showToast(code))
                },
                shouldUpdate() {
                    return this.searchGlobalInput || this.filters.genres.added || this.filters.scores.added || this.filters.years.added
                }
            }
        },
        computed: {
            ...mapState({
                searchGlobalInput: state => state.search.global.input,
                supply: state => state.search.global.supply,
                dark: state => state.settings.dark
            }),
            extension: {
                get() {
                    return this.$store.state.search.global.extension
                },
                set(value) {
                    this.$store.dispatch('setSearchGlobalExtension', value)
                }
            },
            selected() {
                return Object.values(this.filters).some(v => v.added) || !!this.searchGlobalInput.length
            },
            available() {
                return !Object.values(this.filters).every(v => v.added)
            },
            genresList() {
                return this.supply.genres.sort((a, b) => a.name.localeCompare(b.name))
            },
            getGenresName() {
                let arr = [];
                this.filters.genres.selected.forEach(id => arr.push(` ${this.genresList.find(item => item.id === parseInt(id)).name}`));
                return arr;
            }
        },
        activated() {
            if (this.query) this.$store.dispatch('setSearchGlobalInput', String(this.query));
        }
    }
</script>
