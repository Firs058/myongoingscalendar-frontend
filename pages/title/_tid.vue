<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container article :class="$device.isMobile ? 'pa-0' : 'py-0'">
        <v-layout align-center justify-center>
            <v-flex xs12>
                <v-card color="transparent" flat tile>
                    <v-img
                            :lazy-src="title.image.full"
                            aspect-ratio="1"
                            :height="$device.isDesktop ? '50vh' : undefined"
                            width="100%"
                            :alt="globalTitle"
                    >
                        <v-layout
                                align-center
                                justify-center
                                row
                                wrap
                                fill-height
                                :style="`background:linear-gradient(to top, ${settings.dark ? title.image.hex ? title.image.hex.dark : 'rgba(0,0,0,0.5)' : title.image.hex ? title.image.hex.light : 'rgba(255,255,255,0.5)'}, ${settings.dark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'});`"
                        >
                            <v-flex xs12 sm6>
                                <div class="d-flex flex-column align-center text-center">
                                    <h1
                                            :class="`font-weight-bold ma-5 ${$device.isMobile ? 'headline' : 'display-1'}`"
                                            v-text="globalTitle"
                                    />
                                    <v-rating
                                            v-if="title.avgRating"
                                            :value="title.avgRating"
                                            color="yellow darken-3"
                                            background-color="grey"
                                            dense
                                            readonly
                                            half-increments
                                            length="10"
                                            :empty-icon="icons.mdiStarOutline"
                                            :full-icon="icons.mdiStar"
                                            :half-icon="icons.mdiStarHalf"
                                            class="mb-4"
                                    />
                                    <div v-if="!title.outdated">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on }">
                                                <div v-on="on" class="d-inline-block">
                                                    <v-btn
                                                            :color="title && !marked ? 'success' : 'error'"
                                                            @click.native.stop="title && !marked ? toggleTitle() : deletion = true"
                                                            :disabled="!authenticated"
                                                            :loading="button.loading"
                                                            class="ma-1 extended"
                                                    >
                                                        {{title && !marked ? $t('buttons.add') : $t('buttons.remove')}}
                                                    </v-btn>
                                                </div>
                                            </template>
                                            <span>{{authenticated ? marked ? $t('tooltips.remove_from_my_calendar') : $t('tooltips.add_to_my_calendar') : $t('tooltips.you_must_be_logged_in')}}</span>
                                        </v-tooltip>
                                    </div>
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-img>
                    <v-alert
                            tile
                            v-if="title.outdated"
                            class="ma-0"
                            :value="true"
                            color="info"
                            :icon="icons.mdiAlertDecagram"
                    >
                        {{$t('title.information.outdated')}}
                    </v-alert>
                    <v-sheet
                            tile
                            class="py-10 px-4" :light="settings.dark"
                            color="grey lighten-2"
                    >
                        <v-layout wrap>
                            <v-flex xs12 md6>
                                <v-card color="transparent" flat tile>
                                    <h1
                                            class="text-left mb-4"
                                            :class="$device.isMobile ? 'headline font-weight-bold' : 'display-1 font-weight-bold'"
                                            v-text="title.ja"
                                    />
                                    <div class="mb-4" v-if="title.genres && title.genres.length">
                                        <v-chip-group
                                                multiple
                                                column
                                                :dark="settings.dark"
                                        >
                                            <v-tooltip
                                                    top
                                                    v-for="(genre, index) in title.genres"
                                                    :key="index"
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <v-hover v-slot:default="{ hover }">
                                                        <v-chip
                                                                v-on="on"
                                                                link
                                                                nuxt
                                                                :class="`elevation-${hover ? 2 : 0} grey ${settings.dark ? 'darken-1' : 'lighten-1'}`"
                                                                :to="{name: 'search', query: { genres: [genre.id] }}"
                                                        >
                                                            {{genre.name}}
                                                        </v-chip>
                                                    </v-hover>
                                                </template>
                                                <span>{{$t('tooltips.search_by_genre', [genre.name])}}</span>
                                            </v-tooltip>
                                        </v-chip-group>
                                    </div>
                                    <div class="text-left mb-4" v-if="title.episodes">
                                        <v-icon small>{{icons.mdiTelevision}}</v-icon>
                                        {{title.episodes + $t('title.information.episodes')}}
                                    </div>
                                    <div class="text-left mb-4 text-justify"
                                         v-if="title.description !== 'Not have description'">
                                        {{title.description}}
                                    </div>
                                    <div v-if="title.links && title.links.length" class="text-left mb-4">
                                        <v-tooltip
                                                top
                                                v-for="(link, index) in title.links"
                                                :key="index"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <v-avatar
                                                        class="mr-5"
                                                        size="32"
                                                        v-on="on"
                                                        tile
                                                        @click.stop="openLink(link.link)"
                                                >
                                                    <img :src="link.icon" :alt="link.name"/>
                                                </v-avatar>
                                            </template>
                                            <span>{{$t('tooltips.open_link_in_new_window', [link.name])}}</span>
                                        </v-tooltip>
                                    </div>
                                    <social
                                            :url="globalUrl"
                                            :description="globalTitle"
                                    />
                                </v-card>
                            </v-flex>
                            <v-flex xs12 md6>
                                <v-img
                                        :src="title.image.full"
                                        aspect-ratio="0.7"
                                        :class="$device.isMobile ? undefined : 'elevation-20'"
                                        max-width="350px"
                                        class="mx-auto"
                                        :alt="globalTitle"
                                >
                                    <v-layout
                                            slot="placeholder"
                                            fill-height
                                            align-center
                                            justify-center
                                            class="ma-0"
                                    >
                                        <v-progress-circular indeterminate
                                                             color="grey lighten-5"></v-progress-circular>
                                    </v-layout>
                                </v-img>
                            </v-flex>
                            <v-flex xs12 text-center mt-4 v-if="title.trailer">
                                <iframe
                                        :src="title.trailer"
                                        frameborder="0"
                                        width="100%"
                                        height="500px"
                                        allowfullscreen
                                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                                        title="Trailer or PV"
                                />
                            </v-flex>
                        </v-layout>
                    </v-sheet>
                    <v-sheet
                            tile
                            v-if="showChart && title.chartData.datasets.length"
                            class="pa-4"
                            :class="settings.dark ? 'grey darken-1' : 'grey lighten-3'"
                    >
                        <lazy-hydrate when-visible>
                            <line-chart :chartData="title.chartData"/>
                        </lazy-hydrate>
                    </v-sheet>
                    <lazy-hydrate when-visible>
                        <v-sheet tile>
                            <v-toolbar dense text tabs flat>
                                <v-tabs
                                        centered
                                        v-model="broadcast.active"
                                        fixed-tabs
                                        background-color="transparent"
                                        :color="settings.dark ? 'white' : 'black'"
                                >
                                    <v-tabs-slider :color="settings.dark ? 'white' : 'black'"/>
                                    <v-tab
                                            v-for="i in broadcast.tabs"
                                            :key="i.name"
                                            :href="'#tab-' + i.name"
                                    >
                                        {{$t(`title.schedule.tabs.${i.name}`)}}
                                    </v-tab>
                                </v-tabs>
                            </v-toolbar>
                            <v-tabs-items v-model="broadcast.active">
                                <v-tab-item
                                        v-for="i in broadcast.tabs"
                                        :key="i.name"
                                        :value="'tab-' + i.name"
                                >
                                    <v-data-table
                                            :headers="tableHeaders"
                                            :items="i.items"
                                            :items-per-page.sync="i.items.length"
                                            hide-default-footer
                                            :hide-default-header="$device.isMobile"
                                    >
                                        <template
                                                slot="item"
                                                slot-scope="props"
                                        >
                                            <tr class="text-center">
                                                <td>{{ props.item.date }}</td>
                                                <td>{{ [props.item.time, ["HH:mm"]] |
                                                    moment(settings.fullTimeFormat ? 'HH:mm' : 'LT')
                                                    }}
                                                    <span
                                                            v-if="props.item.shift !== '0'"
                                                            class="error--text"
                                                    >
                                                                    {{'&nbsp' + props.item.shift}}
                                                                </span>
                                                </td>
                                                <td>{{ props.item.channel }}</td>
                                                <td>{{ props.item.episode }}</td>
                                                <td>{{ props.item.episodename }}</td>
                                            </tr>
                                        </template>
                                    </v-data-table>
                                </v-tab-item>
                            </v-tabs-items>
                            <v-dialog
                                    v-model="deletion"
                                    max-width="300"
                            >
                                <v-card>
                                    <v-card-title class="headline">{{$t('title.dialogs.deletion.title')}}</v-card-title>
                                    <v-card-text>{{globalTitle}}</v-card-text>
                                    <v-card-actions>
                                        <v-spacer/>
                                        <v-btn color="error" text @click.native="deletion = false">
                                            {{$t('buttons.disagree')}}
                                        </v-btn>
                                        <v-btn color="success" text @click.native="toggleTitle">{{$t('buttons.agree')}}
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-sheet>
                    </lazy-hydrate>
                    <v-sheet
                            tile
                            :color="settings.dark ? 'grey darken-3' : 'grey lighten-4'"
                            class="pb-8"
                    >
                        <lazy-hydrate when-visible>
                            <v-card color="transparent" flat>
                                <v-container fluid class="pa-5">
                                    <v-row align="center" justify="center">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on }">
                                                <div v-on="on" class="d-inline-block">
                                                    <v-btn
                                                            class="success"
                                                            @click.native.stop="openDialog"
                                                            :disabled="!authenticated"
                                                    >
                                                        {{$t('buttons.add_comment')}}
                                                    </v-btn>
                                                </div>
                                            </template>
                                            <span>{{authenticated ? $t('buttons.add_comment') : $t('tooltips.you_must_be_logged_in')}}</span>
                                        </v-tooltip>
                                    </v-row>
                                </v-container>
                                <v-container
                                        v-if="!!comments.nodes && comments.nodes.length"
                                        fluid
                                        :class="!$device.isDesktop ? 'pa-0' : null"
                                >
                                    <div class="d-flex flex-column">
                                        <comment
                                                xs12 v-for="(comment, index) in comments.nodes"
                                                :key="index"
                                                :comment="comment"
                                        />
                                    </div>
                                </v-container>
                                <v-container
                                        fluid
                                        v-if="comments.more > 0"
                                >

                                    <v-row align="center" justify="center">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                        v-on="on"
                                                        text
                                                        @click.native.stop="downloadComments"
                                                        :loading="comments.loading"
                                                >
                                                    <v-icon left>{{icons.mdiArrowDown}}</v-icon>
                                                    {{ $t('comments.show_more.2', [comments.more])}}
                                                    <v-icon right>{{icons.mdiArrowDown}}</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>{{$t('comments.show_more.1')}}</span>
                                        </v-tooltip>
                                    </v-row>
                                </v-container>
                                <comment-dialog/>
                            </v-card>
                        </lazy-hydrate>
                    </v-sheet>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {icons} from '../../mixins/icons'
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            deletion: false,
            button: {
                loading: false
            },
            showChart: false
        }),
        validate({params}) {
            return /^\d+$/.test(params.tid)
        },
        async asyncData({params, app, store}) {
            const data = await app.$axios.$post(store.getters.authenticated ? `api/user/title/${params.tid}` : `api/public/title/${params.tid}`, {timezone: store.getters.settings.timezone});
            return {
                tid: params.tid,
                title: data.payload.title,
                marked: data.payload.marked,
                broadcast: {
                    tabs: data.payload.broadcast.tabs,
                    active: 'tab-next',
                    headers: [
                        {sortable: false, value: 'date', align: 'center'},
                        {sortable: false, value: 'time', align: 'center'},
                        {sortable: false, value: 'channel', align: 'center'},
                        {sortable: false, value: 'episode', align: 'center'},
                        {sortable: false, value: 'episodename', align: 'center'}
                    ]
                },
                comments: {
                    nodes: data.payload.comments.nodes,
                    total: data.payload.comments.total,
                    more: data.payload.comments.fromPath - data.payload.comments.nodes.length,
                    offset: 0,
                    loading: false
                }
            }
        },
        head() {
            return {
                title: this.globalTitle,
                titleTemplate: '%s | MyOngoingsCalendar',
                meta: [
                    {
                        name: 'description',
                        content: this.globalDescription
                    },
                    {
                        property: 'og:title',
                        content: this.globalTitle,
                        template: '%s | MyOngoingsCalendar'
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
                        content: this.globalTitle,
                        template: '%s | MyOngoingsCalendar'
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
            openLink: url => window.open(url),
            toggleTitle() {
                this.deletion = false;
                this.button.loading = true;
                this.$anime.userApi(`title/${this.tid}/toggle`)
                    .then(result => {
                        this.marked = !this.marked;
                        this.$toast.showToast({code: result.data.status.code});
                    })
                    .catch(code => this.$toast.showToast(code))
                    .finally(() => this.button.loading = false)
            },
            openDialog() {
                this.$store.dispatch('setComment', {
                    dialog: true,
                    id: null,
                    tid: Number(this.tid)
                })
            },
            downloadComments() {
                this.comments.offset += 10;
                this.comments.loading = true;
                this.authenticated
                    ? this.$anime.userApi(`title/${this.tid}/comments/root/${this.comments.offset}`)
                        .then(result => {
                            this.comments.nodes.length ? result.data.payload.nodes.forEach(e => this.comments.nodes.push(e)) : this.comments.nodes = result.data.payload.nodes;
                            this.comments.more = result.data.payload.fromPath - this.comments.nodes.length;
                        })
                        .catch(code => this.$toast.showToast(code))
                        .finally(() => this.comments.loading = false)
                    : this.$anime.api(`title/${this.tid}/comments/root/${this.comments.offset}`)
                        .then(result => {
                            this.comments.nodes.length ? result.data.payload.nodes.forEach(e => this.comments.nodes.push(e)) : this.comments.nodes = result.data.payload.nodes;
                            this.comments.more = result.data.payload.fromPath - this.comments.nodes.length;
                        })
                        .catch(code => this.$toast.showToast(code))
                        .finally(() => this.comments.loading = false)
            }
        },
        mixins: [
            icons
        ],
        computed: {
            ...mapGetters([
                'settings',
                'authenticated'
            ]),
            globalTitle() {
                return this.title.en ? this.title.en : this.title.ja
            },
            globalUrl() {
                return `${process.env.baseUrl}${this.$route.fullPath}`
            },
            globalDescription() {
                return this.$t("meta_info.title.meta.description", [this.title.en ? this.title.en : this.title.ja, this.title.firstYear])
            },
            globalImage() {
                return `${process.env.baseUrl}${this.title.image.full}`
            },
            tableHeaders() {
                let headers = this.broadcast.headers;
                headers.forEach(header => header.text = this.$t(`title.schedule.headers.${header.value}`));
                return headers;
            }
        },
        mounted() {
            this.$vuetify.goTo(0);
            this.showChart = true;
        }
    }
</script>

<style scoped>
    .v-btn.extended {
        min-width: 225px;
        height: 50px;
    }

    .v-avatar {
        cursor: pointer;
    }

    .v-responsive.v-image >>> .v-image__image.v-image__image--preload.v-image__image--cover {
        -webkit-filter: blur(10px);
        -ms-filter: blur(10px);
        filter: blur(10px);
        transform: scale(1.1);
    }
</style>
