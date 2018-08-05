<template>
    <loading v-if="loading"/>
    <div v-else>
        <v-container
                v-if="!!asyncCache && asyncCache.count > 0"
                fluid
                :class="$device.isDesktop ? 'grid-list-lg pa-3' : 'grid-list-sm pa-1'"
        >
            <v-subheader>{{$t("search.founded", [asyncCache.count])}}</v-subheader>
            <v-layout row wrap justify-left>
                <v-flex
                        v-for="anime in asyncCache.animes"
                        :key="anime.tid"
                        xs6 md4 lg3 xl2
                >
                    <card :anime="anime"/>
                </v-flex>
            </v-layout>
        </v-container>
        <v-container
                v-if="!!asyncCache && countPages > 1"
                fluid
        >
            <v-layout align-top justify-center text-xs-center>
                <v-flex xs12>
                    <v-pagination
                            :length="countPages"
                            v-model="currentPage"
                            :total-visible="7"
                    />
                </v-flex>
            </v-layout>
        </v-container>
        <v-container
                v-if="!!asyncCache && asyncCache.count === 0"
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
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        data: () => ({
            loading: false,
            currentPage: 1,
            countPages: 1,
            from: '',
            lastQuery: ''
        }),
        async asyncData(ctx) {
            return {
                query: ctx.query.query,
                page: ctx.query.page
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
            asyncCache() {
                if (this.searchGlobalInput) {
                    this.loading = true;
                    return this.$anime.api('api/es/autocomplete', {
                        query: this.searchGlobalInput,
                        page: this.currentPage
                    })
                        .then(response => {
                            this.countPages = Math.ceil(response.data.payload.count / 10) || 1;
                            return response.data.payload
                        })
                        .then(cache => {
                            if (this.countPages < this.currentPage) {
                                this.currentPage = 1;
                                this.$anime.api('api/es/autocomplete', {
                                    query: this.searchGlobalInput,
                                    page: this.currentPage
                                })
                                    .then(response => {
                                        this.countPages = Math.ceil(response.data.payload.count / 10) || 1;
                                        return response.data.payload
                                    })
                            } else return cache
                        })
                        .then(cache => {
                            this.loading = false;
                            this.$router.replace({
                                path: 'search',
                                query: {'query': this.searchGlobalInput, 'page': this.currentPage}
                            });
                            return cache
                        })
                        .catch(code => this.$toast.showToast(code))
                }
            }
        },
        computed: {
            ...mapState({
                searchGlobalInput: state => state.search.global.input,
                dark: state => state.settings.dark,
            })
        },
        activated() {
            this.$store.dispatch('setSearchGlobalPanel', true);
            if (this.lastQuery) this.$router.replace({path: 'search', query: this.lastQuery});
            if (this.query && this.query.length) {
                this.$store.dispatch('setSearchGlobalInput', String(this.query));
                this.currentPage = parseInt(this.page >= 1 ? this.page : 1);
            }
        },
        deactivated() {
            this.$store.dispatch('setSearchGlobalPanel', false)
        }
    }
</script>
