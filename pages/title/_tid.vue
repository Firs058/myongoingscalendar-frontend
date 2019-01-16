<template>
    <v-container fluid pa-0>
        <v-layout row wrap align-top justify-center text-xs-center class="d-flex">
            <v-img
                    :lazy-src="title.image.full"
                    aspect-ratio="1"
                    :height="$device.isDesktop ? '600px' : undefined"
                    width="100%"
            >
                <v-layout
                        align-center
                        justify-center
                        row
                        wrap
                        fill-height
                        :style="`background:linear-gradient(to top, ${dark ? title.image.hex ? title.image.hex.dark : 'rgba(0,0,0,0.5)' : title.image.hex ? title.image.hex.light : 'rgba(255,255,255,0.5)'}, ${dark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'});`"
                >
                    <v-flex order-xs2 xs12 order-sm1 sm6 md4 lg3>
                        <v-card color="transparent" flat>
                            <v-card-title primary-title>
                                <v-spacer/>
                                <div>
                                    <h1 class="text-xs-left display-1" v-text="globalTitle"/>
                                    <div v-if="title.title">{{title.title}}</div>
                                </div>
                                <v-spacer/>
                            </v-card-title>
                            <v-card-text v-if="title.episodes">
                                <v-icon small>tv</v-icon>
                                {{title.episodes + $t('title.information.episodes')}}
                            </v-card-text>
                            <v-card-actions v-if="rating">
                                <v-spacer/>
                                <v-tooltip top>
                                    <v-rating
                                            slot="activator"
                                            :value="rating"
                                            color="yellow darken-3"
                                            readonly
                                            half-increments
                                            length="10"
                                            dense
                                    />
                                    <div
                                            v-for="(rating, index) in title.ratings"
                                            :key="index"
                                    >
                                        <span class="grey--text text--lighten-2 caption mr-2">{{rating.dbname +': ' + rating.score + '/10'}}</span>
                                        <v-rating
                                                slot="activator"
                                                :value="rating.score"
                                                :color="numberToColorHsl(rating.score/10, 0.6, 0.85)"
                                                readonly
                                                half-increments
                                                length="10"
                                                small
                                                dense
                                        />
                                        <v-divider v-if="index + 1 < title.ratings.length"/>
                                    </div>
                                </v-tooltip>
                                <span class="yellow--text text--darken-3 mx-2 subheading">{{`${rating}/10`}}</span>
                                <v-spacer/>
                            </v-card-actions>
                            <v-card-actions>
                                <v-spacer/>
                                <v-tooltip top>
                                    <v-btn
                                            slot="activator"
                                            color="success"
                                            @click.native.stop="toggleTitle"
                                            :disabled="!authenticated"
                                            :loading="button.loading"
                                            v-if="title && !exists"
                                            class="ma-1"
                                    >
                                        {{$t('buttons.add')}}
                                    </v-btn>
                                    <v-btn
                                            slot="activator"
                                            color="error"
                                            @click.native.stop="deletion = true"
                                            :disabled="!authenticated"
                                            :loading="button.loading"
                                            class="ma-1"
                                            v-else
                                    >
                                        {{$t('buttons.remove')}}
                                    </v-btn>
                                    <span>{{authenticated ? exists ? $t('tooltips.remove_from_my_calendar') : $t('tooltips.add_to_my_calendar') : $t('tooltips.you_must_be_logged_in')}}</span>
                                </v-tooltip>
                                <social
                                        :url="globalUrl"
                                        :description="globalTitle"
                                />
                                <v-spacer/>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                    <v-flex order-xs1 xs12 order-sm2 sm4 md3 lg2>
                        <v-card :class="$device.isDesktop ? 'mx-4' : undefined" color="transparent" flat>
                            <v-img
                                    :src="title.image.full"
                                    aspect-ratio="0.7"
                                    :class="$device.isMobile ? undefined : 'elevation-10'"
                            >
                                <v-layout
                                        slot="placeholder"
                                        fill-height
                                        align-center
                                        justify-center
                                        ma-0
                                >
                                    <v-progress-circular indeterminate
                                                         color="grey lighten-5"></v-progress-circular>
                                </v-layout>
                            </v-img>
                        </v-card>
                    </v-flex>
                    <v-flex order-xs3 xs12 order-sm3 sm6 md4 lg3>
                        <v-card color="transparent" flat>
                            <v-card-text v-if="title.genres && title.genres.length">
                                <v-tooltip
                                        top
                                        v-for="(genre, index) in title.genres"
                                        :key="index"
                                >
                                    <v-hover slot="activator">
                                        <v-chip
                                                slot-scope="{ hover }"
                                                :class="`elevation-${hover ? 2 : 0}`"
                                                @click.native="$router.push({ name: 'search', query: { query: '', genres: [genre.id] }})"
                                        >
                                            <v-icon left>label</v-icon>
                                            {{genre.name}}
                                        </v-chip>
                                    </v-hover>
                                    <span>{{$t('tooltips.search_by_genre', [genre.name])}}</span>
                                </v-tooltip>
                            </v-card-text>
                            <v-card-text v-if="title.description !== 'Not have description'">
                                {{title.description}}
                            </v-card-text>
                            <v-card-actions v-if="title.links && title.links.length">
                                <v-spacer/>
                                <v-tooltip
                                        top
                                        v-for="(link, index) in title.links"
                                        :key="index"
                                >
                                    <v-btn
                                            outline
                                            ripple
                                            flat
                                            color="primary"
                                            @click.stop="openLink(link.link)"
                                            slot="activator"
                                            class="ma-1"
                                    >
                                        {{link.name}}
                                    </v-btn>
                                    <span>{{$t('tooltips.open_link_in_new_window')}}</span>
                                </v-tooltip>
                                <v-spacer/>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-img>
            <v-container
                    fluid
                    :class="$device.isDesktop ? 'grid-list-lg pa-3' : 'pa-0'"
            >
                <v-layout row wrap align-top justify-center text-xs-center>
                    <v-flex xs12 md8 lg6 xl5>
                        <v-container
                                fluid
                                :class="$device.isDesktop ? 'grid-list-lg pa-2' : 'pa-0'"
                        >
                            <v-layout column>
                                <v-flex xs12>
                                    <v-subheader>{{$t('title.schedule.subheader')}}
                                        <v-btn
                                                icon
                                                @click.native="info = true"
                                        >
                                            <v-icon>info</v-icon>
                                        </v-btn>
                                    </v-subheader>
                                    <v-card>
                                        <v-toolbar dense card tabs color="transparent">
                                            <v-tabs
                                                    centered
                                                    color="transparent"
                                                    v-model="broadcast.active"
                                                    fixed-tabs
                                            >
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
                                                        hide-actions
                                                >
                                                    <template
                                                            slot="items"
                                                            slot-scope="props"
                                                    >
                                                        <tr>
                                                            <td>{{ props.item.date }}</td>
                                                            <td>{{ [props.item.time, ["HH:mm"]] | moment(fullTimeFormat)
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
                                    </v-card>
                                </v-flex>
                                <v-flex xs12>
                                    <v-subheader>{{$t('comments.subheader', [comments.total])}}
                                    </v-subheader>
                                    <v-card>
                                        <v-container fluid>
                                            <v-tooltip top>
                                                <v-btn
                                                        slot="activator"
                                                        class="success"
                                                        @click.native.stop="openDialog"
                                                        :disabled="!authenticated"
                                                >
                                                    {{$t('buttons.add_comment')}}
                                                </v-btn>
                                                <span>{{authenticated ? $t('buttons.add_comment') : $t('tooltips.you_must_be_logged_in')}}</span>
                                            </v-tooltip>
                                        </v-container>
                                        <v-container
                                                v-if="!!comments.nodes && comments.nodes.length"
                                                fluid
                                                :class="!$device.isDesktop ? 'pa-0' : null"
                                        >
                                            <v-layout row wrap>
                                                <v-flex xs12 v-for="(comment, index) in comments.nodes" :key="index">
                                                    <comment :comment="comment"/>
                                                    <v-divider v-if="index + 1 < comments.nodes.length"/>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                        <v-container
                                                fluid
                                                :class="!$device.isDesktop ? 'pa-0' : null"
                                                v-if="comments.more > 0"
                                        >
                                            <v-layout row wrap align-center justify-center>
                                                <v-tooltip top>
                                                    <v-btn
                                                            slot="activator"
                                                            flat
                                                            @click.native.stop="downloadComments"
                                                            :loading="comments.loading"
                                                    >
                                                        <v-icon left>arrow_drop_down</v-icon>
                                                        {{ $t('comments.show_more.2', [comments.more])}}
                                                        <v-icon right>arrow_drop_down</v-icon>
                                                    </v-btn>
                                                    <span>{{$t('comments.show_more.1')}}</span>
                                                </v-tooltip>
                                            </v-layout>
                                        </v-container>
                                        <comment-dialog/>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-flex>
                </v-layout>
                <v-dialog
                        v-model="deletion"
                        max-width="300"
                >
                    <v-card>
                        <v-card-title class="headline">{{$t('title.dialogs.deletion.title')}}</v-card-title>
                        <v-card-text>{{globalTitle}}</v-card-text>
                        <v-card-actions>
                            <v-spacer/>
                            <v-btn color="error" flat @click.native="deletion = false">{{$t('buttons.disagree')}}
                            </v-btn>
                            <v-btn color="success" @click.native="toggleTitle">{{$t('buttons.agree')}}</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog
                        v-model="info"
                        max-width="500"
                >
                    <v-card>
                        <v-card-title class="headline">{{$t('title.dialogs.info.title')}}</v-card-title>
                        <v-card-text>{{$t('title.dialogs.info.text')}}</v-card-text>
                        <v-card-actions>
                            <v-spacer/>
                            <v-btn color="primary" flat @click.native="info = false">{{$t('buttons.got_it')}}</v-btn>
                            <v-spacer/>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-container>
        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            deletion: false,
            info: false,
            button: {
                loading: false
            }
        }),
        async asyncData({params, app, store}) {
            const data = await app.$axios.$post(`api/title/${params.tid}`, {timezone: store.state.settings.timezone});
            return {
                tid: params.tid,
                title: data.payload.title,
                exists: data.payload.exists,
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
                        content: this.globalTitle + ' schedule',
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
                        content: this.globalTitle + ' schedule',
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
                this.$anime.api(`api/title/${this.tid}/toggle`)
                    .then(result => {
                        this.exists = !this.exists;
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
                this.$anime.api(`api/comments/${this.tid}/root/${this.comments.offset}`)
                    .then(result => {
                        this.comments.nodes.length ? result.data.payload.nodes.forEach(e => this.comments.nodes.push(e)) : this.comments.nodes = result.data.payload.nodes;
                        this.comments.more = result.data.payload.fromPath - this.comments.nodes.length;
                    })
                    .catch(code => this.$toast.showToast(code))
                    .finally(() => this.comments.loading = false)
            },
            numberToColorHsl(i, min, max) {
                let ratio = i;
                if (min > 0 || max < 1) {
                    if (i < min) {
                        ratio = 0;
                    } else if (i > max) {
                        ratio = 1;
                    } else {
                        let range = max - min;
                        ratio = (i - min) / range;
                    }
                }
                let hue = ratio * 1.2 / 3.60;
                let rgb = this.hslToRgb(hue, 1, .5);
                return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
            },
            hslToRgb(h, s, l) {
                let r, g, b;
                if (s === 0) {
                    r = g = b = l;
                } else {
                    function hue2rgb(p, q, t) {
                        if (t < 0) t += 1;
                        if (t > 1) t -= 1;
                        if (t < 1 / 6) return p + (q - p) * 6 * t;
                        if (t < 1 / 2) return q;
                        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                        return p;
                    }

                    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    let p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1 / 3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1 / 3);
                }
                return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
            }
        },
        computed: {
            ...mapGetters([
                'dark',
                'authenticated',
                'fullTimeFormat',
                'timezone'
            ]),
            globalTitle() {
                return this.title.titleen ? this.title.titleen : this.title.title
            },
            globalUrl() {
                return `${process.env.baseUrl}${this.$route.fullPath}`
            },
            globalDescription() {
                return this.$t("meta_info.title.meta.description", [this.title.titleen ? this.title.titleen : this.title.title, this.title.firstyear])
            },
            globalImage() {
                return `${process.env.baseUrl}${this.title.image}`
            },
            tableHeaders() {
                let headers = this.broadcast.headers;
                headers.forEach(header => header.text = this.$t(`title.schedule.headers.${header.value}`));
                return headers;
            },
            rating() {
                if (this.title.ratings.length) {
                    const arr = this.title.ratings.map(e => e.score);
                    return Number((arr.reduce((a, b) => a + b) / arr.length).toFixed(2))
                }
            }
        },
        activated() {
            this.$vuetify.goTo(0);
        },
        deactivated() {
            this.$destroy()
        }
    }
</script>
<style scoped>
    .v-chip >>> .v-chip__content {
        cursor: pointer;
    }

    .v-responsive.v-image >>> .v-image__image.v-image__image--preload.v-image__image--cover {
        -webkit-filter: blur(10px);
        -ms-filter: blur(10px);
        filter: blur(10px);
        transform: scale(1.1);
    }
</style>
