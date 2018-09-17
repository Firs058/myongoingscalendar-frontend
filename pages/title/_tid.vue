<template>
    <v-container
            fluid
            :class="$device.isDesktop ? 'grid-list-lg pa-3' : 'pa-0'"
    >
        <v-layout row wrap align-top justify-center text-xs-center>
            <v-flex xs12 md4 lg3 xl2>
                <v-container
                        fluid
                        :class="$device.isDesktop ? 'grid-list-lg pa-2' : 'pa-0'"
                >
                    <v-layout column>
                        <v-flex xs12>
                            <v-card color="transparent" flat>
                                <v-img
                                        :src="title.image"
                                        aspect-ratio="1"
                                        height="500px"
                                >
                                    <v-layout
                                            slot="placeholder"
                                            fill-height
                                            align-center
                                            justify-center
                                            ma-0
                                    >
                                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                    </v-layout>
                                </v-img>
                                <v-card-title primary-title>
                                    <v-layout text-xs-left>
                                        <v-flex>
                                            <h1 class="display-1" v-text="globalTitle"/>
                                        </v-flex>
                                    </v-layout>
                                </v-card-title>
                                <v-card-actions>
                                    <v-tooltip top>
                                        <v-btn
                                                slot="activator"
                                                color="success"
                                                @click.native.stop="toggleTitle"
                                                :disabled="!authenticated"
                                                :loading="button.loading"
                                                v-if="title && !exists"
                                                class="mr-2"
                                        >
                                            {{$t('buttons.add')}}
                                        </v-btn>
                                        <v-btn
                                                slot="activator"
                                                color="error"
                                                @click.native.stop="deletion = true"
                                                :disabled="!authenticated"
                                                :loading="button.loading"
                                                class="mr-2"
                                                v-else
                                        >
                                            {{$t('buttons.remove')}}
                                        </v-btn>
                                        <span>{{authenticated ? exists ? $t('tooltips.remove_from_my_calendar') : $t('tooltips.add_to_my_calendar') : $t('tooltips.you_must_be_logged_in')}}</span>
                                    </v-tooltip>
                                    <social
                                            :url="globalUrl"
                                            :description="globalTitle"
                                    >
                                    </social>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                        <v-flex xs12>
                            <v-subheader>{{$t('title.information.subheader')}}</v-subheader>
                            <v-card>
                                <v-card-text>
                                    <v-container fluid class="grid-list-lg pa-2">
                                        <v-layout
                                                class="py-1"
                                                row
                                                wrap
                                                align-center
                                                v-if="title.title"
                                        >
                                            <v-subheader>{{$t('title.information.japanese')}}</v-subheader>
                                            <div class="grey--text text-xs-left">{{title.title}}</div>
                                        </v-layout>
                                        <v-layout
                                                class="py-1"
                                                row
                                                wrap
                                                align-center
                                                v-if="title.ratings && title.ratings.length"
                                        >
                                            <v-subheader>{{$t('title.information.ratings')}}</v-subheader>
                                            <div class="text-xs-left">
                                                <v-chip
                                                        v-for="(rating, index) in title.ratings"
                                                        :key="index"
                                                        label
                                                        @click.native="$router.push({ name: 'search', query: { query: '', scores: [rating.score, 10] }})"
                                                        text-color="black"
                                                >{{`${rating.dbname} : ${rating.score}`}}
                                                </v-chip>
                                            </div>
                                        </v-layout>
                                        <v-layout
                                                class="py-1"
                                                row
                                                wrap
                                                align-center
                                                v-if="title.episodes"
                                        >
                                            <v-subheader>{{$t('title.information.episodes')}}</v-subheader>
                                            <div class="grey--text text-xs-left">{{title.episodes}}</div>
                                        </v-layout>
                                        <v-layout
                                                class="py-1"
                                                row
                                                wrap
                                                align-center
                                                v-if="title.genres && title.genres.length"
                                        >
                                            <v-subheader>{{$t('title.information.genres')}}</v-subheader>
                                            <div class="text-xs-left">
                                                <v-chip
                                                        v-for="(genre, index) in title.genres"
                                                        :key="index"
                                                        label
                                                        @click.native="$router.push({ name: 'search', query: { query: '', genres: [genre.id] }})"
                                                        text-color="black"
                                                >
                                                    <v-icon left>label</v-icon>
                                                    {{genre.name}}
                                                </v-chip>
                                            </div>
                                        </v-layout>
                                        <v-layout
                                                class="py-1"
                                                row
                                                wrap
                                                align-center
                                                v-if="title.description !== 'Not have description'"
                                        >
                                            <v-subheader>{{$t('title.information.description')}}</v-subheader>
                                            <div class="grey--text text-xs-left">{{title.description}}
                                            </div>
                                        </v-layout>
                                        <v-layout
                                                class="py-1"
                                                row
                                                wrap
                                                align-center
                                                v-if="title.links && title.links.length"
                                        >
                                            <v-subheader>{{$t('title.information.links')}}</v-subheader>
                                            <div class="text-xs-left">
                                                <v-tooltip
                                                        top
                                                        v-for="(link, index) in title.links"
                                                        :key="index"
                                                >
                                                    <v-btn
                                                            ripple
                                                            flat
                                                            color="primary"
                                                            @click.stop="openLink(link.link)"
                                                            slot="activator"
                                                    >{{link.name}}
                                                    </v-btn>
                                                    <span>{{$t('tooltips.open_link_in_new_window')}}</span>
                                                </v-tooltip>
                                            </div>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>
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
                                            :id="'tab-' + i.name"
                                    >
                                        <v-data-table
                                                :headers="tableHeaders"
                                                :items="i.items"
                                                class="elevation-1"
                                                hide-actions
                                        >
                                            <template
                                                    slot="items"
                                                    slot-scope="props"
                                            >
                                                <tr>
                                                    <td>{{ props.item.date }}</td>
                                                    <td>{{ [props.item.time, ["HH:mm"]] | moment(timeFormat) }}
                                                        <span
                                                                v-if="props.item.shift !== '0'"
                                                                class="error--text"
                                                        >{{'&nbsp' + props.item.shift}}</span>
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
                    <v-btn color="error" flat @click.native="deletion = false">{{$t('buttons.disagree')}}</v-btn>
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
</template>

<script>
    import {mapState} from 'vuex'

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
                    .then(() => this.button.loading = false)
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
                    .then(() => this.comments.loading = false)
            }
        },
        computed: {
            ...mapState({
                authenticated: state => state.user.authenticated,
                timeFormat: state => state.settings.fullTimeFormat ? 'HH:mm' : 'LT',
                timezone: state => state.settings.timezone
            }),
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
        cursor: pointer !important;
    }
</style>