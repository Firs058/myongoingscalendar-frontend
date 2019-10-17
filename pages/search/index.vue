<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container article :class="$device.isMobile ? 'grid-list-xs' : 'grid-list-lg pt-0'">
        <v-layout row wrap>
            <v-flex xs12>
                <v-text-field
                        v-model="currentQuery"
                        :label="$t('inputs.search.label.1')"
                        :prepend-inner-icon="icons.mdiMagnify"
                        hide-details
                        solo
                        flat
                />
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 v-if="!!asyncCache && asyncCache.count > 0 && shouldShow">
                <v-subheader class="pr-0">
                    {{$t("search.founded", [asyncCache.count])}}
                    <v-spacer/>
                    <v-btn text icon @click="expand = !expand">
                        <v-icon>{{icons.mdiFilterVariant}}</v-icon>
                    </v-btn>
                </v-subheader>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card flat :color="!expand ? 'transparent' : undefined">
                            <div class="pa-2">
                                <v-chip
                                        v-if="currentQuery"
                                        :color="`teal ${settings.dark ? 'darken-3' : 'lighten-3'}`"
                                        close
                                        @click:close="currentQuery = ''"
                                >
                                    {{`${$t('search.chips.name')}: ${currentQuery}`}}
                                </v-chip>
                                <v-chip
                                        v-for="filter in filters"
                                        :key="filter.name"
                                        v-if="filter.added"
                                        class="ma-2"
                                        :color="`${filter.color} ${settings.dark ? 'darken-3' : 'lighten-3'}`"
                                        close
                                        @click:close="filter.added = false, filter.selected ? filters.genres.selected = [] : null"
                                >
                       <span v-if="filter.range">
                            {{`${$t(`search.chips.${filter.name}`)}: ${$t('search.extension.filters.from')} ${filter.range[0]} ${$t('search.extension.filters.to')} ${filter.range[1]}`}}
                       </span>
                                    <span v-else-if="filter.selected">
                            {{`${$t(`search.chips.${filter.name}`)}: ${getGenresName}`}}
                       </span>
                                </v-chip>
                            </div>
                            <v-expand-transition>
                                <v-card-text v-if="expand">
                                    <v-subheader v-if="!filters.genres.added">{{$t('search.chips.genres')}}
                                    </v-subheader>
                                    <v-layout v-if="!filters.genres.added" row align-center>
                                        <v-flex>
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
                                        <v-flex shrink>
                                            <v-tooltip top>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn
                                                            v-on="on"
                                                            :disabled=!filters.genres.selected.length
                                                            icon
                                                            @click.native="filters.genres.added=true"
                                                    >
                                                        <v-icon>{{icons.mdiPlus}}</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{$t('search.tooltips.add_filter')}}</span>
                                            </v-tooltip>
                                        </v-flex>
                                    </v-layout>
                                    <v-subheader v-if="!filters.scores.added">{{$t('search.chips.scores')}}
                                    </v-subheader>
                                    <v-layout v-if="!filters.scores.added" row>
                                        <v-flex shrink style="width: 50px">
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
                                        <v-flex shrink style="width: 50px">
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
                                                <template v-slot:activator="{ on }">
                                                    <v-btn
                                                            v-on="on"
                                                            icon
                                                            @click.native="filters.scores.added=true"
                                                    >
                                                        <v-icon>{{icons.mdiPlus}}</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{$t('search.tooltips.add_filter')}}</span>
                                            </v-tooltip>
                                        </v-flex>
                                    </v-layout>
                                    <v-subheader v-if="!filters.years.added">{{$t('search.chips.years')}}</v-subheader>
                                    <v-layout v-if="!filters.years.added" row>
                                        <v-flex shrink>
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
                                        <v-flex shrink>
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
                                                <template v-slot:activator="{ on }">
                                                    <v-btn
                                                            v-on="on"
                                                            icon
                                                            @click.native="filters.years.added=true"
                                                    >
                                                        <v-icon>{{icons.mdiPlus}}</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{$t('search.tooltips.add_filter')}}</span>
                                            </v-tooltip>
                                        </v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-expand-transition>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-layout
                v-if="!!asyncCache && asyncCache.count > 0 && shouldShow"
                row wrap justify-left
        >
            <v-flex
                    v-for="anime in asyncCache.animes"
                    :key="anime.tid"
                    xs6 md3 lg2
            >
                <card :anime="anime"/>
            </v-flex>
            <v-container
                    v-if="!!asyncCache && countPages > 1"
                    fluid
            >
                <v-layout align-top justify-center text-center>
                    <v-flex xs12>
                        <v-pagination
                                :length="countPages"
                                v-model="currentPage"
                                :total-visible="!$device.isMobile ? 7 : 4"
                        />
                    </v-flex>
                </v-layout>
            </v-container>
        </v-layout>
        <v-layout
                v-if="!!asyncCache && asyncCache.count === 0"
                align-top justify-center text-center
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
</template>

<script>
    import {
        mdiFilterVariant,
        mdiMagnify,
        mdiPlus
    } from '@mdi/js';
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            countPages: 1,
            expand: false,
            icons:{
                mdiFilterVariant,
                mdiMagnify,
                mdiPlus
            }
        }),
        async asyncData({query, app, store}) {
            if (store.getters.supplyListEmpty) {
                const data = await app.$axios.$post(`api/public/es/supply`);
                store.dispatch('setSearchGlobalSupply', data.payload);
            }
            return {
                currentQuery: typeof query.query !== 'undefined' ? String(query.query) : '',
                currentPage: parseInt(query.page >= 1 ? query.page : 1),
                filters: {
                    genres: {
                        name: 'genres',
                        added: typeof query.genres !== 'undefined' && !!query.genres.length,
                        selected: typeof query.genres === 'string' ? Array(query.genres) : query.genres || [],
                        color: 'green'
                    },
                    scores: {
                        name: 'scores',
                        added: typeof query.scores !== 'undefined' && !!query.scores.length,
                        range: query.scores || ['6', '9'],
                        color: 'purple'
                    },
                    years: {
                        name: 'years',
                        added: typeof query.years !== 'undefined' && !!query.years.length,
                        range: query.years || ['2010', '2025'],
                        color: 'indigo'
                    }
                }
            }
        },
        head() {
            return {
                title: this.currentQuery
                    ? this.$t("meta_info.search.title.1", [this.currentQuery, '| MyOngoingsCalendar'])
                    : this.$t("meta_info.search.title.2", ['| MyOngoingsCalendar']),
                meta: [
                    {
                        name: 'description',
                        content: this.$t("meta_info.search.meta.description", [this.currentQuery])
                    }
                ]
            }
        },
        asyncComputed: {
            asyncCache: {
                lazy: true,
                get() {
                    let payload = {
                        query: this.currentQuery,
                        page: this.currentPage
                    };
                    if (this.filters.genres.added) payload.genres = this.filters.genres.selected;
                    if (this.filters.scores.added) payload.scores = this.filters.scores.range;
                    if (this.filters.years.added) payload.years = this.filters.years.range;

                    return this.$anime.api('es/autocomplete', payload)
                        .then(response => {
                            this.countPages = Math.ceil(response.data.payload.count / 12) || 1;
                            return response.data.payload
                        })
                        .then(cache => {
                            if (this.countPages < this.currentPage) {
                                this.currentPage = 1;
                                this.$anime.api('es/autocomplete', payload)
                                    .then(response => {
                                        this.countPages = Math.ceil(response.data.payload.count / 12) || 1;
                                        return response.data.payload
                                    })
                            } else return cache
                        })
                        .catch(code => this.$toast.showToast(code))
                        .finally(() => {
                            this.$router.replace({query: payload});
                            this.$store.dispatch('setSearchGlobalLastQuery', payload)
                        })
                },
                shouldUpdate() {
                    return this.shouldShow
                }
            }
        },
        computed: {
            ...mapGetters([
                'settings',
                'supply'
            ]),
            selected() {
                return Object.values(this.filters).some(v => v.added) || !!this.currentQuery.length
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
            },
            shouldShow() {
                return !!this.currentQuery || this.filters.genres.added || this.filters.scores.added || this.filters.years.added
            }
        },
        deactivated() {
            this.$destroy()
        }
    }
</script>
<style scoped>
    >>> .v-expansion-panel .v-expansion-panel__container {
        background-color: transparent !important;
    }
</style>
