<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-card
            tile
            flat
            color="transparent"
            class="mt-2"
    >
        <v-list-item v-if="$device.isMobile">
            <v-list-item-avatar>
                <img :src="comment.user.avatar" :alt="comment.user.nickname">
            </v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-title>{{comment.user.nickname}}</v-list-item-title>
                <v-list-item-subtitle :class="{'grey--text': true, 'text--lighten-1': settings.dark}">
                    {{ getCommentTime({timestamp: comment.added}) }}
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-list-item v-else class="pr-0">
            <v-list-item-avatar>
                <img v-if="avatarPath !== null" :src="avatarPath" :alt="comment.user.nickname">
                <v-icon v-else class="grey">{{icons.mdiAccount}}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-title>{{comment.user.nickname}}</v-list-item-title>
                <v-list-item-subtitle :class="{'grey--text': true, 'text--lighten-1': settings.dark}">
                    {{ getCommentTime({timestamp: comment.added}) }}
                </v-list-item-subtitle>
            </v-list-item-content>
            <v-spacer/>
            <v-tooltip top :disabled="!$device.isDesktop">
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
                                icon
                                :aria-label="authenticated ? $t('tooltips.like') : $t('tooltips.you_must_be_logged_in')"
                        >
                            <v-icon small>{{icons.mdiThumbUp}}</v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>{{authenticated ?  $t('tooltips.like') : $t('tooltips.you_must_be_logged_in')}}</span>
            </v-tooltip>
            <div
                    v-if="!!scoreCount"
                    :class="{ 'mx-2': true, 'success--text': scoreCount > 0, 'error--text': scoreCount < 0}"
            >
                {{scoreCount}}
            </div>
            <v-tooltip top :disabled="!$device.isDesktop">
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
                                icon
                                :aria-label="authenticated ? $t('tooltips.dislike') : $t('tooltips.you_must_be_logged_in')"
                        >
                            <v-icon small>{{icons.mdiThumbDown}}</v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>{{authenticated ?  $t('tooltips.dislike') : $t('tooltips.you_must_be_logged_in')}}</span>
            </v-tooltip>
            <v-tooltip top :disabled="!$device.isDesktop">
                <template v-slot:activator="{ on }">
                    <div v-on="on" class="d-inline-block">
                        <v-btn
                                small
                                text
                                fab
                                icon
                                @click.native="$store.dispatch('openCommentDialog', {tid: comment.tid, id: comment.id})"
                                :disabled="!authenticated"
                                :aria-label="authenticated ? $t('buttons.reply') : $t('tooltips.you_must_be_logged_in')"
                        >
                            <v-icon small>{{icons.mdiReplay}}</v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>{{authenticated ?  $t('buttons.reply') : $t('tooltips.you_must_be_logged_in')}}</span>
            </v-tooltip>
            <v-tooltip top :disabled="!$device.isDesktop">
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
                                :aria-label="authenticated ? $t('tooltips.report_a_comment') : $t('tooltips.you_must_be_logged_in')"
                        >
                            <v-icon small>{{icons.mdiAlertOctagon}}</v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>{{authenticated ? $t('tooltips.report_a_comment') : $t('tooltips.you_must_be_logged_in')}}</span>
            </v-tooltip>
        </v-list-item>
        <div
                v-text="comment.text"
                :style="{'padding-left': '72px', 'white-space': 'pre-wrap'}"
        />
        <v-card-actions v-if="$device.isMobile" style="margin-left: 61px;" class="pa-0">
            <v-tooltip top :disabled="!$device.isDesktop">
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
                                icon
                                :aria-label="authenticated ? $t('tooltips.like') : $t('tooltips.you_must_be_logged_in')"
                        >
                            <v-icon small>{{icons.mdiThumbUp}}</v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>{{authenticated ? $t('tooltips.like') : $t('tooltips.you_must_be_logged_in')}}</span>
            </v-tooltip>
            <div
                    v-if="!!scoreCount"
                    :class="{'mx-2': true, 'success--text': scoreCount > 0, 'error--text': scoreCount < 0}"
            >
                {{scoreCount}}
            </div>
            <v-tooltip top :disabled="!$device.isDesktop">
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
                                icon
                                :aria-label="authenticated ? $t('tooltips.dislike') : $t('tooltips.you_must_be_logged_in')"
                        >
                            <v-icon small>{{icons.mdiThumbDown}}</v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>{{authenticated ? $t('tooltips.dislike') : $t('tooltips.you_must_be_logged_in')}}</span>
            </v-tooltip>
            <v-tooltip top :disabled="!$device.isDesktop">
                <template v-slot:activator="{ on }">
                    <div v-on="on" class="d-inline-block">
                        <v-btn
                                small
                                text
                                fab
                                icon
                                @click.native="$store.dispatch('openCommentDialog', {tid: comment.tid, id: comment.id})"
                                :disabled="!authenticated"
                                :aria-label="authenticated ? $t('buttons.reply') : $t('tooltips.you_must_be_logged_in')"
                        >
                            <v-icon small>{{icons.mdiReplay}}</v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>{{authenticated ? $t('buttons.reply') : $t('tooltips.you_must_be_logged_in')}}</span>
            </v-tooltip>
            <v-tooltip top :disabled="!$device.isDesktop">
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
                                :aria-label="authenticated ? $t('tooltips.report_a_comment') : $t('tooltips.you_must_be_logged_in')"
                        >
                            <v-icon small>{{icons.mdiAlertOctagon}}</v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>{{authenticated ? $t('tooltips.report_a_comment') : $t('tooltips.you_must_be_logged_in')}}</span>
            </v-tooltip>
        </v-card-actions>
        <v-expansion-panels
                v-model="expansion"
                v-if="comment.replies > 0"
                flat
                tile
        >
            <v-expansion-panel class="transparent">
                <v-expansion-panel-header
                        hide-actions
                        @click.native.once="getCommentsChilds({next: false})"
                        class="primary--text"
                >
                    {{$t(!!expansion || typeof expansion === 'undefined' ? 'comments.show_all.2' :
                    'comments.show_all.3', [comment.replies])}}
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
                            <v-flex xs12>
                                <comment
                                        v-for="(comment, index) in comments" :key="index"
                                        :comment="comment"
                                />
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <v-container
                            fluid
                            v-if="comment.replies > 10 && more > 0"
                    >
                        <v-row align="center" justify="center">
                            <v-tooltip top :disabled="!$device.isDesktop">
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                            v-on:on
                                            text
                                            @click.native="getCommentsChilds({next: true})"
                                            :loading="loadingChilds"
                                            :aria-label="$t('comments.show_more.2', [more])"
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
    import {icons} from '~/mixins/icons'
    import {image} from '~/mixins/image'
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            loadingReport: false,
            loadingLike: false,
            loadingDislike: false,
            loadingChilds: false,
            value: false,
            offset: 0,
            fromPath: 0,
            comments: [],
            expansion: []
        }),
        props: ['comment'],
        mixins: [
            icons,
            image
        ],
        methods: {
            async addLike() {
                this.loadingLike = true;
                await this.addCommentAction({action: 'like'});
                this.loadingLike = false
            },
            async addDislike() {
                this.loadingDislike = true;
                await this.addCommentAction({action: 'dislike'});
                this.loadingDislike = false
            },
            async addReport() {
                this.loadingReport = true;
                await this.addCommentAction({action: 'report'});
                this.loadingReport = false
            },
            async addCommentAction({action}) {
                const params = {
                    tid: this.comment.tid,
                    id: this.comment.id,
                    action
                };
                await this.$anime.addCommentAction(params)
                    .then(({code}) => this.$toast.showToast({code}))
                    .catch(({code}) => this.$toast.showToast({code}));
            },
            async getCommentsChilds({next}) {
                if (next) this.offset += 10;
                this.loadingChilds = true;
                const params = {
                    tid: this.comment.tid,
                    path: this.comment.path,
                    id: this.comment.id,
                    offset: this.offset
                };

                await this.$anime.getCommentsChilds(params)
                    .then(({nodes, fromPath}) => {
                        this.comments.length && next ? nodes.forEach(e => this.comments.push(e)) : this.comments = nodes;
                        this.fromPath = fromPath;
                    })
                    .catch(({code}) => this.$toast.showToast({code}))
                    .finally(() => this.loadingChilds = false)
            },
            getCommentTime({timestamp}) {
                return this.$dayjs.unix(timestamp).fromNow()
            }
        },
        computed: {
            ...mapGetters([
                'settings',
                'authenticated'
            ]),
            scoreCount() {
                return this.comment.likes - this.comment.dislikes
            },
            avatarPath() {
                return !!this.comment.user.avatar ? this.getAvatarPath({paths: this.comment.user.avatar.paths}) : null
            },
            more() {
                return this.fromPath - this.comments.length
            }
        }
    }
</script>
<style scoped>
    .white-border {
        border-left-style: solid;
        border-color: white;
    }

    .black-border {
        border-left-style: solid;
        border-color: black;
    }
</style>
