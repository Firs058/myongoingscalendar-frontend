<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container article :class="$device.isMobile ? 'pa-0' : 'py-0'">
        <v-layout align-center justify-center>
            <v-flex xs12>
                <v-card color="transparent" flat tile>
                    <v-img
                            :lazy-src="titleImagePath"
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
                                :style="layoutStyle"
                        >
                            <v-flex xs12 sm6>
                                <div class="d-flex flex-column align-center text-center">
                                    <h1
                                            :class="`font-weight-bold ma-5 ${$device.isMobile ? 'headline' : 'display-1'}`"
                                            v-text="globalTitle"
                                    />
                                    <v-tooltip top :disabled="!$device.isDesktop">
                                        <template v-slot:activator="{ on }">
                                            <div v-on="on">
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
                                                        :half-icon="icons.mdiStarHalfFull"
                                                        class="mb-4"
                                                >
                                                    <template slot="item" slot-scope="item">
                                                        <v-icon :color="item.isHalfFilled || item.isFilled ? 'yellow darken-3' : 'grey'">
                                                            {{item.isHalfFilled
                                                            ? icons.mdiStarHalfFull
                                                            : item.isFilled
                                                            ? icons.mdiStar
                                                            : icons.mdiStarOutline}}
                                                        </v-icon>
                                                    </template>
                                                </v-rating>
                                            </div>
                                        </template>
                                        <span>{{$t('title.information.weighted_average_rating',[title.avgRating])}}</span>
                                    </v-tooltip>
                                    <v-row v-if="!title.finished" no-gutters style="flex-wrap: nowrap; width: 240px">
                                        <v-tooltip top :disabled="!$device.isDesktop">
                                            <template v-slot:activator="{ on }">
                                                <div
                                                        v-on="on"
                                                        style="min-width: 100px; max-width: 100%;"
                                                        class="flex-grow-1 flex-shrink-0"
                                                >
                                                    <v-btn
                                                            @click.native.stop="title && !marked ? titleToggle() : deletion = true"
                                                            :disabled="!authenticated"
                                                            :loading="button.loading"
                                                            :aria-label="title && !marked ? $t('buttons.add') : $t('buttons.remove')"
                                                            height="50"
                                                            block
                                                            depressed
                                                            :style="authenticated ? buttonStyle({color: title && !marked ? buttonColors.green : buttonColors.red}) : undefined"
                                                    >
                                                        {{title && !marked ? $t('buttons.add') : $t('buttons.remove')}}
                                                    </v-btn>
                                                </div>
                                            </template>
                                            <span>{{authenticated ? marked ? $t('tooltips.remove_from_my_calendar') : $t('tooltips.add_to_my_calendar') : $t('tooltips.you_must_be_logged_in')}}</span>
                                        </v-tooltip>
                                        <!--
                                        <v-tooltip top :disabled="!$device.isDesktop" v-if="favorite">
                                            <template v-slot:activator="{ on }">
                                                <div v-on="on">
                                                    <v-btn
                                                            :class="{
                                                                'ml-2': true,
                                                                'green&#45;&#45;text': title && !favorite,
                                                                'red&#45;&#45;text': title && favorite,
                                                                'darken-3': settings.dark,
                                                              }"
                                                            :disabled="!authenticated"
                                                            :loading="button.loading"
                                                            :aria-label="title && !favorite ? $t('buttons.add') : $t('buttons.remove')"
                                                            outlined
                                                            min-width="50"
                                                            max-width="50"
                                                            height="50"
                                                    >
                                                        <v-icon
                                                                size="32"
                                                                color="red darken-1"
                                                        >
                                                            {{icons.mdiHeart}}
                                                        </v-icon>
                                                    </v-btn>
                                                </div>
                                            </template>
                                            <span>{{authenticated ? marked ? $t('tooltips.remove_from_favorites') : $t('tooltips.add_to_favorites') : $t('tooltips.you_must_be_logged_in')}}</span>
                                        </v-tooltip>
                                        -->
                                    </v-row>
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-img>
                    <v-alert
                            tile
                            v-if="title.finished"
                            class="ma-0"
                            :value="true"
                            type="info"
                            :icon="icons.mdiAlertDecagram"
                    >
                        {{$t('title.information.outdated')}}
                    </v-alert>
                    <v-sheet
                            tile
                            class="py-10 px-4"
                            :light="settings.dark"
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
                                                    eager
                                                    :disabled="!$device.isDesktop"
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
                                                            {{translateGenre(genre)}}
                                                        </v-chip>
                                                    </v-hover>
                                                </template>
                                                <span>{{$t('tooltips.search_by_genre', [translateGenre(genre)])}}</span>
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
                                                :disabled="!$device.isDesktop"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <v-avatar
                                                        class="mr-5"
                                                        size="32"
                                                        v-on="on"
                                                        tile
                                                        @click.stop="openLink(link.link)"
                                                >
                                                    <img
                                                            :src="getImagePath({paths: link.image.paths, type: 'FULL'})"
                                                            :alt="link.name"
                                                    />
                                                </v-avatar>
                                            </template>
                                            <span>{{$t('tooltips.open_link_in_new_window', [link.name])}}</span>
                                        </v-tooltip>
                                    </div>
                                    <social
                                            :url="globalUrl"
                                            :title="globalTitle"
                                            :description="globalDescription"
                                    />
                                </v-card>
                            </v-flex>
                            <v-flex xs12 md6>
                                <v-img
                                        :src="titleImagePath"
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
                                        <v-progress-circular
                                                indeterminate
                                                color="grey lighten-5"
                                        />
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
                            :class="settings.dark ? 'grey darken-2' : 'grey lighten-3'"
                    >
                        <lazy-hydrate when-visible>
                            <line-chart :chartData="title.chartData"/>
                        </lazy-hydrate>
                    </v-sheet>
                    <lazy-hydrate when-visible>
                        <v-sheet tile>
                            <v-tabs
                                    centered
                                    v-model="broadcast.active"
                                    fixed-tabs
                                    background-color="transparent"
                                    :color="settings.dark ? 'white' : 'black'"
                            >
                                <v-tabs-slider/>
                                <v-tab
                                        v-for="i in broadcast.tabs"
                                        :key="i.name"
                                        :href="'#tab-' + i.name"
                                >
                                    {{$t(`title.schedule.tabs.${i.name}`)}}
                                </v-tab>
                            </v-tabs>
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
                                            :no-data-text="$t('title.schedule.no_data')"
                                    >
                                        <template
                                                slot="item"
                                                slot-scope="props"
                                        >
                                            <tr class="text-center">
                                                <td>{{ props.item.date }}</td>
                                                <td>{{ $dayjs(props.item.time, "HH:mm").format(settings.fullTimeFormat ?
                                                    'HH:mm' : 'LT') }}
                                                    <span
                                                            v-if="props.item.shift !== '0'"
                                                            :class="{
                                                                'red--text': true,
                                                                'text--lighten-3': settings.dark,
                                                                'text--darken-4' : !settings.dark,
                                                            }"
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
                                        <v-btn
                                                color="error"
                                                text
                                                @click.native="deletion = false"
                                                :aria-label="$t('buttons.disagree')"
                                        >
                                            {{$t('buttons.disagree')}}
                                        </v-btn>
                                        <v-btn
                                                color="success"
                                                text
                                                @click.native="titleToggle"
                                                :loading="button.loading"
                                                :aria-label="$t('buttons.agree')"
                                        >
                                            {{$t('buttons.agree')}}
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-sheet>
                    </lazy-hydrate>
                    <v-sheet
                            tile
                            class="pb-8"
                    >
                        <lazy-hydrate when-visible>
                            <v-card color="transparent" flat>
                                <v-container fluid class="pa-5">
                                    <v-row align="center" justify="center">
                                        <v-tooltip top :disabled="!$device.isDesktop">
                                            <template v-slot:activator="{ on }">
                                                <div v-on="on" class="d-inline-block">
                                                    <v-btn
                                                            @click.native.stop="$store.dispatch('openCommentDialog', {tid})"
                                                            :disabled="!authenticated"
                                                            :aria-label="$t('buttons.add_comment')"
                                                            depressed
                                                            :style="authenticated ? buttonStyle({color: buttonColors.green}) : undefined"
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
                                                xs12
                                                v-for="(comment, index) in comments.nodes"
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
                                        <v-tooltip top :disabled="!$device.isDesktop">
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                        v-on="on"
                                                        text
                                                        @click.native.stop="getComments({next: true})"
                                                        :loading="comments.loading"
                                                        color="primary"
                                                        :aria-label="$t('comments.show_more.2', [comments.more])"
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
    import {icons} from '~/mixins/icons'
    import {image} from '~/mixins/image'
    import {button} from '~/mixins/button'
    import {translate} from '~/mixins/translate'
    import {mapGetters} from 'vuex'

    export default {
        async asyncData({params, app, store: {getters: {settings: {timezone}, authenticated}}}) {
            const tid = Number(params.tid);
            const {
                title,
                marked,
                tabs,
                nodes,
                total,
                fromPath
            } = await app.$anime.getTitle({authenticated, tid, params: {timezone}});
            return {
                tid,
                title,
                marked,
                broadcast: {
                    tabs,
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
                    nodes,
                    total,
                    more: fromPath - nodes.length,
                    offset: 0,
                    loading: false
                }
            }
        },
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
            async titleToggle() {
                this.button.loading = true;
                await this.$anime.titleToggle({tid: this.tid})
                    .then(({code}) => {
                        this.$toast.showToast({code});
                        this.deletion = false;
                        this.marked = !this.marked;
                    })
                    .catch(({code}) => this.$toast.showToast({code}))
                    .finally(() => this.button.loading = false)
            },
            async getComments({next}) {
                if (next) this.comments.offset += 10;
                this.comments.loading = true;
                const params = {
                    tid: this.tid,
                    offset: this.comments.offset
                };

                await this.$anime.getComments(params)
                    .then(({nodes, fromPath}) => {
                        this.comments.nodes.length && next ? nodes.forEach(e => this.comments.nodes.push(e)) : this.comments.nodes = nodes;
                        this.comments.more = fromPath - this.comments.nodes.length;
                    })
                    .catch(({code}) => this.$toast.showToast({code}))
                    .finally(() => this.comments.loading = false)
            }
        },
        mixins: [
            icons,
            image,
            button,
            translate
        ],
        computed: {
            ...mapGetters([
                'settings',
                'authenticated',
                'comment'
            ]),
            globalTitle() {
                const {en, ja} = this.title;
                return en ? en : ja
            },
            globalUrl() {
                return `${process.env.BASE_URL}${this.$route.fullPath}`
            },
            globalDescription() {
                return this.$t("meta_info.title.meta.description", [this.globalTitle, this.title.firstYear])
            },
            globalImage() {
                return `${process.env.BASE_URL}${this.titleImagePath}`
            },
            tableHeaders() {
                return this.broadcast.headers.reduce((arr, header) => {
                    header.text = this.$t(`title.schedule.headers.${header.value}`);
                    arr.push(header);
                    return arr
                }, []);
            },
            titleImagePath() {
                return this.getImagePath({paths: this.title.image.paths, type: 'FULL'})
            },
            layoutStyle() {
                const hex = this.title.image.hex;
                const dark = this.settings.dark;
                const blackOpacity = 'rgba(0,0,0,0.5)';
                const whiteOpacity = 'rgba(255,255,255,0.5)';
                return `background:linear-gradient(to top, ${dark ? Object.keys(hex).length ? hex.dark : blackOpacity : Object.keys(hex).length ? hex.light : whiteOpacity}, ${dark ? blackOpacity : whiteOpacity})`
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

    >>> .v-tabs-items {
        background-color: transparent !important;
    }
</style>
