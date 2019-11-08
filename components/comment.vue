<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-card
            flat
            color="transparent"
            class="my-2"
    >
        <v-list-item>
            <v-list-item-avatar>
                <img :src="comment.user.avatar">
            </v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-title>{{comment.user.nickname}}</v-list-item-title>
                <v-list-item-subtitle class="grey--text">
                    {{ comment.added | moment('timezone', settings.timezone, 'from') }}
                </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <div v-on="on" class="d-inline-block">
                            <v-btn
                                    text
                                    @click.native="addReport"
                                    :loading="loadingReport"
                                    :disabled="!authenticated"
                                    fab
                                    small
                                    icon
                            >
                                <v-icon small>{{icons.mdiAlertOctagon}}</v-icon>
                            </v-btn>
                        </div>
                    </template>
                    <span>{{authenticated ? $t('tooltips.report_a_comment') : $t('tooltips.you_must_be_logged_in')}}</span>
                </v-tooltip>
            </v-list-item-action>
        </v-list-item>
        <v-textarea
                full-width
                v-model="comment.text"
                readonly
                auto-grow
                rows="1"
                hide-details
                style="margin-left: 67px;"
        />
        <v-card-actions style="margin-left: 68px;" class="pa-0">
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <div v-on="on" class="d-inline-block">
                        <v-btn
                                text
                                @click.native="addLike"
                                :disabled="!authenticated"
                                :loading="loadingLike"
                                :color="comment.liked ? 'primary' : null"
                                small
                                fab
                                :class="comment.liked ? null : 'mr-2'"
                                icon
                        >
                            <v-icon small>{{icons.mdiThumbUp}}</v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>{{authenticated ?  $t('tooltips.like') : $t('tooltips.you_must_be_logged_in')}}</span>
            </v-tooltip>
            <div v-if="comment.likes" class="mr-2">{{comment.likes}}</div>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <div v-on="on" class="d-inline-block">
                        <v-btn
                                text
                                @click.native="addDislike"
                                :disabled="!authenticated"
                                :loading="loadingDislike"
                                :color="comment.disliked ? 'primary' : null"
                                small
                                fab
                                :class="comment.disliked ? null : 'mr-2'"
                                icon
                        >
                            <v-icon small>{{icons.mdiThumbDown}}</v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>{{authenticated ?  $t('tooltips.dislike') : $t('tooltips.you_must_be_logged_in')}}</span>
            </v-tooltip>
            <div v-if="comment.dislikes" class="mr-2">{{comment.dislikes}}</div>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <div v-on="on" class="d-inline-block">
                        <v-btn
                                small
                                text
                                @click.native="openDialog()"
                                :disabled="!authenticated"
                        >
                            <v-icon left>{{icons.mdiReplay}}</v-icon>
                            {{$t('buttons.reply')}}
                        </v-btn>
                    </div>
                </template>
                <span>{{authenticated ?  $t('buttons.reply') : $t('tooltips.you_must_be_logged_in')}}</span>
            </v-tooltip>
        </v-card-actions>
        <v-expansion-panels
                v-if="comment.replies > 0"
                inset
        >
            <v-expansion-panel
                    v-model="expansion"
                    :class="settings.dark ? 'grey darken-3' : 'grey lighten-4'"
            >
                <v-expansion-panel-header
                        hide-actions
                        @click.native.once="downloadChilds(false)"
                >
                    {{$t('comments.show_all.2', [comment.replies])}}
                </v-expansion-panel-header>
                <v-expansion-panel-content
                        hide-default-footer
                        ripple
                        class="elevation-0"
                >
                    <v-container
                            :class="{ 'white-border': settings.dark, 'black-border': !settings.dark }"
                            fluid
                    >
                        <v-layout row wrap>
                            <v-flex xs12 v-for="(comment, index) in comments" :key="index">
                                <comment :comment="comment"/>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <v-container
                            fluid
                            v-if="comment.replies > 10 && more > 0"
                    >
                        <v-row align="center" justify="center">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                            v-on:on
                                            text
                                            @click.native="downloadChilds(true)"
                                            :loading="loadingChilds"
                                    >
                                        <v-icon left>{{icons.mdiArrowDown}}</v-icon>
                                        {{$t('comments.show_more.2', [more])}}
                                        <v-icon right>{{icons.mdiArrowDown}}</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{$t('comments.show_more.1')}}</span>
                            </v-tooltip>
                        </v-row>
                    </v-container>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>
</template>

<script>
    import {
        mdiThumbUp,
        mdiThumbDown,
        mdiReplay,
        mdiAlertOctagon,
        mdiArrowDown
    } from '@mdi/js';
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            loadingReport: false,
            loadingLike: false,
            loadingDislike: false,
            loadingChilds: false,
            value: false,
            offset: 0,
            more: 0,
            comments: [],
            expansion: [false],
            icons: {
                mdiThumbUp,
                mdiThumbDown,
                mdiReplay,
                mdiAlertOctagon,
                mdiArrowDown
            }
        }),
        props: ['comment'],
        methods: {
            addLike() {
                this.loadingLike = true;
                this.$anime.userApi(`title/${this.comment.tid}/comments/${this.comment.id}/like/add`)
                    .then(result => this.$toast.showToast({code: result.data.status.code}))
                    .catch(code => this.$toast.showToast(code))
                    .finally(() => this.loadingLike = false)
            },
            addDislike() {
                this.loadingDislike = true;
                this.$anime.userApi(`title/${this.comment.tid}/comments/${this.comment.id}/dislike/add`)
                    .then(result => this.$toast.showToast({code: result.data.status.code}))
                    .catch(code => this.$toast.showToast(code))
                    .finally(() => this.loadingDislike = false)
            },
            addReport() {
                this.loadingReport = true;
                this.$anime.userApi(`title/${this.comment.tid}/comments/${this.comment.id}/report`)
                    .then(result => this.$toast.showToast({code: result.data.status.code}))
                    .catch(code => this.$toast.showToast(code))
                    .finally(() => this.loadingReport = false)
            },
            openDialog() {
                this.$store.dispatch('setComment', {
                    dialog: true,
                    id: this.comment.id,
                    tid: this.comment.tid
                })
            },
            downloadChilds(next) {
                if (next) this.offset += 10;
                this.loadingChilds = true;

                this.authenticated
                    ? this.$anime.userApi(`title/${this.comment.tid}/comments/${this.comment.path}.${this.comment.id}/${this.offset}`)
                        .then(result => {
                            this.comments.length ? result.data.payload.nodes.forEach(e => this.comments.push(e)) : this.comments = result.data.payload.nodes;
                            this.more = result.data.payload.fromPath - this.comments.length;
                        })
                        .catch(code => this.$toast.showToast(code))
                        .finally(() => this.loadingChilds = false)
                    : this.$anime.api(`title/${this.comment.tid}/comments/${this.comment.path}.${this.comment.id}/${this.offset}`)
                        .then(result => {
                            this.comments.length ? result.data.payload.nodes.forEach(e => this.comments.push(e)) : this.comments = result.data.payload.nodes;
                            this.more = result.data.payload.fromPath - this.comments.length;
                        })
                        .catch(code => this.$toast.showToast(code))
                        .finally(() => this.loadingChilds = false)

            }
        },
        computed: mapGetters([
            'settings',
            'authenticated'
        ])
    }
</script>
<style scoped>
    >>> .v-expansion-panel::before {
        box-shadow: 0 0 0 0 !important;
    }

    .white-border {
        border-left-style: solid;
        border-color: white;
    }

    .black-border {
        border-left-style: solid;
        border-color: black;
    }
</style>
