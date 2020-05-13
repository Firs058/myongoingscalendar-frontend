<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container article :class="$device.isMobile ? 'grid-list-lg' : 'grid-list-lg pt-0'">
        <v-layout row wrap>
            <v-flex xs12>
                <v-text-field
                        v-model="currentQuery"
                        :label="$t('inputs.search.label.1')"
                        :prepend-inner-icon="icons.mdiMagnify"
                        hide-details
                        solo
                        flat
                >
                    <template slot="append" v-if="notSelected">
                        <v-menu offset-y>
                            <template v-slot:activator="{ on: onMenu }">
                                <v-tooltip
                                        :bottom="!$device.isMobile"
                                        :left="$device.isMobile"
                                        :disabled="!$device.isDesktop"
                                >
                                    <template v-slot:activator="{ on: onTooltip }">
                                        <v-icon v-on="{ ...onMenu, ...onTooltip }">
                                            {{icons.mdiFilterVariant}}
                                        </v-icon>
                                    </template>
                                    <span>{{$t('search.tooltips.add_filter')}}</span>
                                </v-tooltip>
                            </template>
                            <v-list>
                                <v-subheader>{{$t('search.tooltips.add_filter')}}</v-subheader>
                                <v-list-item
                                        v-for="(filter, index) in filters"
                                        v-if="!filter.added"
                                        :key="index"
                                        @click="dialog = {open: true, type: filter.name}"
                                >
                                    <v-list-item-title>{{$t(`search.chips.${filter.name}`)}}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                </v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-chip-group
                                v-if="shouldShow"
                                multiple
                                column
                                :dark="settings.dark"
                        >
                            <v-chip
                                    v-if="currentQuery"
                                    :color="`teal ${settings.dark ? 'darken-3' : 'lighten-3'}`"
                                    close
                                    class="ma-2"
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
                            {{`${$t(`search.chips.${filter.name}`)}: ${$t('search.dialog.filters.from')} ${filter.range[0]} ${$t('search.dialog.filters.to')} ${filter.range[1]}`}}
                       </span>
                                <span v-else-if="filter.selected">
                            {{`${$t(`search.chips.${filter.name}`)}: ${getGenresName}`}}
                       </span>
                            </v-chip>
                        </v-chip-group>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-subheader v-if="!!asyncCache && asyncCache.count > 0 && shouldShow" class="pr-0">
            {{$t("search.founded", [asyncCache.count])}}
        </v-subheader>
        <v-layout
                v-if="!!asyncCache && asyncCache.count > 0 && shouldShow"
                row wrap justify-left
        >
            <v-flex
                    v-for="anime in asyncCache.animes"
                    :key="anime.tid"
                    xs12
                    sm6
                    :md4="$device.isDesktop"
                    lg4
                    :xl2="$device.isDesktop"
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
                                :color="settings.dark ? 'info' : undefined"
                        />
                    </v-flex>
                </v-layout>
            </v-container>
        </v-layout>
        <v-layout
                v-if="!!asyncCache && asyncCache.count === 0"
                align-top justify-center text-center
        >
            <v-flex xs12>
                <v-alert
                        tile
                        type="info"
                        :icon="icons.mdiAlertDecagram"
                >
                    {{$t("alerts.nothing_found")}}
                </v-alert>
            </v-flex>
        </v-layout>
        <v-dialog
                v-model="dialog.open"
                max-width="500"
        >
            <v-card>
                <v-card-title class="headline">{{$t('search.dialog.headline')}} {{!!dialog.type ?
                    $t(`search.dialog.filters.${dialog.type}`) : ''}}
                </v-card-title>
                <v-card-text>
                    <v-chip-group
                            v-if="dialog.type === 'genres'"
                            multiple
                            column
                            :dark="settings.dark"
                            v-model="filters.genres.selected"
                    >
                        <v-chip
                                v-for="(genre, i) in supply.genres"
                                :key="i"
                                :value="genre.id"
                                filter
                        >
                            {{translateGenre(genre)}}
                        </v-chip>
                    </v-chip-group>
                    <v-range-slider
                            v-else-if="dialog.type === 'scores'"
                            v-model="filters.scores.range"
                            :max="supply.scores[1]"
                            :min="supply.scores[0]"
                            step="0.1"
                            hide-details
                            class="align-center"
                    >
                        <template v-slot:prepend>
                            <v-text-field
                                    v-model="filters.scores.range[0]"
                                    hide-details
                                    single-line
                                    type="number"
                                    hide-details
                            />
                        </template>
                        <template v-slot:append>
                            <v-text-field
                                    v-model="filters.scores.range[1]"
                                    hide-details
                                    single-line
                                    type="number"
                                    hide-details
                            />
                        </template>
                    </v-range-slider>
                    <v-range-slider
                            v-else-if="dialog.type === 'years'"
                            v-model="filters.years.range"
                            :max="supply.years[1]"
                            :min="supply.years[0]"
                            step="1"
                            hide-details
                            class="align-center"
                    >
                        <template v-slot:prepend>
                            <v-text-field
                                    v-model="filters.years.range[0]"
                                    hide-details
                                    single-line
                                    mask="####"
                                    type="number"
                                    hide-details
                                    label="Min"
                            />
                        </template>
                        <template v-slot:append>
                            <v-text-field
                                    v-model="filters.years.range[1]"
                                    hide-details
                                    single-line
                                    mask="####"
                                    type="number"
                                    hide-details
                            />
                        </template>
                    </v-range-slider>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn
                            color="error"
                            text
                            @click="dialog.open = false"
                            :aria-label="$t('buttons.close')"
                    >
                        {{$t('buttons.close')}}
                    </v-btn>
                    <v-btn
                            color="success"
                            text
                            @click="dialog.open = false, filters[dialog.type].added=true"
                            :aria-label="$t('buttons.add')"
                            :disabled="dialog.type === 'genres' && !filters.genres.selected.length"
                    >
                        {{$t('buttons.add')}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import {icons} from '../../mixins/icons'
    import {translate} from '../../mixins/translate'
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            countPages: 1,
            expand: false,
            dialog: {
                open: false,
                type: ''
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

                    return new Promise((resolve, reject) =>
                        this.authenticated
                            ? this.$anime.userApi('es/autocomplete', payload).then(r => resolve(r)).catch(c => reject(c))
                            : this.$anime.api('es/autocomplete', payload).then(r => resolve(r)).catch(c => reject(c)))
                        .then(response => {
                            this.countPages = Math.ceil(response.data.payload.count / 12) || 1;
                            return response.data.payload
                        })
                        .then(cache => {
                            if (this.countPages < this.currentPage) {
                                this.currentPage = 1;
                                new Promise((resolve, reject) =>
                                    this.authenticated
                                        ? this.$anime.userApi('es/autocomplete', payload).then(r => resolve(r)).catch(c => reject(c))
                                        : this.$anime.api('es/autocomplete', payload).then(r => resolve(r)).catch(c => reject(c)))
                                    .then(response => {
                                        this.countPages = Math.ceil(response.data.payload.count / 12) || 1;
                                        return response.data.payload
                                    })
                            } else return cache
                        })
                        .catch(code => this.$toast.showToast(code))
                        .finally(() => {
                            this.$router.replace({query: payload}).catch(err => {
                            });
                            this.$store.dispatch('setSearchGlobalLastQuery', payload)
                        })

                }
            }
        },
        mixins: [
            icons,
            translate
        ],
        computed: {
            ...mapGetters([
                'settings',
                'supply',
                'authenticated'
            ]),
            selected() {
                return Object.values(this.filters).some(v => v.added) || !!this.currentQuery.length
            },
            notSelected() {
                return Object.values(this.filters).some(v => !v.added)
            },
            genresList() {
                return this.supply.genres.sort((a, b) => a.name.localeCompare(b.name))
            },
            getGenresName() {
                let arr = [];
                this.filters.genres.selected.forEach(id => arr.push(` ${this.translateGenre(this.genresList.find(item => item.id === parseInt(id)))}`));
                return arr;
            },
            shouldShow() {
                return !!this.currentQuery || this.filters.genres.added || this.filters.scores.added || this.filters.years.added
            }
        }
    }
</script>
