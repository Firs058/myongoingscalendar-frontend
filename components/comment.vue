<template>
    <v-card flat @mouseover="showReport = true" @mouseleave="showReport = false">
        <v-list-tile avatar>
            <v-list-tile-avatar>
                <img :src="comment.user.avatar">
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title>{{comment.user.nickname}}</v-list-tile-title>
                <v-list-tile-sub-title class="grey--text">{{ comment.added | moment('timezone', timezone, 'from') }}
                </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action v-show="showReport">
                <v-tooltip top>
                    <v-btn
                            flat
                            slot="activator"
                            @click.native="addReport"
                            :loading="loadingReport"
                            :disabled="!authenticated"
                            fab
                            small
                    >
                        <v-icon>report</v-icon>
                    </v-btn>
                    <span>{{authenticated ? $t('tooltips.report_a_comment') : $t('tooltips.you_must_be_logged_in')}}</span>
                </v-tooltip>
            </v-list-tile-action>
        </v-list-tile>
        <v-textarea
                full-width
                v-model="comment.text"
                readonly
                auto-grow
                rows="1"
                hide-details
        />
        <v-card-actions>
            <v-tooltip top>
                <v-btn
                        flat
                        slot="activator"
                        @click.native="addLike"
                        :disabled="!authenticated"
                        :loading="loadingLike"
                        :color="comment.liked ? 'primary' : null"
                        small
                        fab
                        :class="comment.liked ? null : 'mr-2'"
                >
                    <v-icon>thumb_up</v-icon>
                </v-btn>
                <span>{{authenticated ?  $t('tooltips.like') : $t('tooltips.you_must_be_logged_in')}}</span>
            </v-tooltip>
            <div v-if="comment.likes" class="mr-2">{{comment.likes}}</div>
            <v-tooltip top>
                <v-btn
                        flat
                        slot="activator"
                        @click.native="addDislike"
                        :disabled="!authenticated"
                        :loading="loadingDislike"
                        :color="comment.disliked ? 'primary' : null"
                        small
                        fab
                        :class="comment.disliked ? null : 'mr-2'"
                >
                    <v-icon>thumb_down</v-icon>
                </v-btn>
                <span>{{authenticated ?  $t('tooltips.dislike') : $t('tooltips.you_must_be_logged_in')}}</span>
            </v-tooltip>
            <div v-if="comment.dislikes" class="mr-2">{{comment.dislikes}}</div>
            <v-tooltip top>
                <v-btn
                        flat
                        slot="activator"
                        @click.native="openDialog()"
                        :disabled="!authenticated"
                >
                    <v-icon left>reply</v-icon>
                    {{$t('buttons.reply')}}
                </v-btn>
                <span>{{authenticated ?  $t('buttons.reply') : $t('tooltips.you_must_be_logged_in')}}</span>
            </v-tooltip>
        </v-card-actions>
        <v-expansion-panel
                v-if="comment.replies > 0"
                popout
                @click.native.once="downloadChilds(false)"
        >
            <v-expansion-panel-content hide-actions ripple>
                <div slot="header">
                    {{$t('comments.show_all.2', [comment.replies])}}
                    <v-icon right>arrow_drop_down</v-icon>
                </div>
                <v-card>
                    <v-container
                            fluid
                            :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : null"
                    >
                        <v-layout row wrap>
                            <v-flex xs12 v-for="(comment, index) in comments" :key="index">
                                <comment :comment="comment"/>
                                <v-divider v-if="index + 1 < comments.length"/>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <v-container
                            fluid
                            :class="$vuetify.breakpoint.xsOnly ? 'pa-0' : null"
                            v-if="comment.replies > 10 && more > 0"
                    >
                        <v-layout row wrap align-center justify-center>
                            <v-tooltip top>
                                <v-btn
                                        slot="activator"
                                        flat
                                        @click.native="downloadChilds(true)"
                                        :loading="loadingChilds"
                                >
                                    <v-icon left>arrow_drop_down</v-icon>
                                    {{$t('comments.show_more.2', [more])}}
                                    <v-icon right>arrow_drop_down</v-icon>
                                </v-btn>
                                <span>{{$t('comments.show_more.1')}}</span>
                            </v-tooltip>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-card>
</template>

<script>
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
            showReport: false
        }),
        props: ['comment'],
        methods: {
            addLike() {
                this.loadingLike = true;
                this.$anime.api(`api/comments/${this.comment.tid}/${this.comment.id}/like/add`)
                    .then(result => this.$toast.showToast({code: result.data.status.code}))
                    .catch(code => this.$toast.showToast(code))
                    .finally(() => this.loadingLike = false)
            },
            addDislike() {
                this.loadingDislike = true;
                this.$anime.api(`api/comments/${this.comment.tid}/${this.comment.id}/dislike/add`)
                    .then(result => this.$toast.showToast({code: result.data.status.code}))
                    .catch(code => this.$toast.showToast(code))
                    .finally(() => this.loadingDislike = false)
            },
            addReport() {
                this.loadingReport = true;
                this.$anime.api(`api/comments/${this.comment.tid}/${this.comment.id}/report`)
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
                this.$anime.api(`api/comments/${this.comment.tid}/${this.comment.path}.${this.comment.id}/${this.offset}`)
                    .then(result => {
                        this.comments.length ? result.data.payload.nodes.forEach(e => this.comments.push(e)) : this.comments = result.data.payload.nodes;
                        this.more = result.data.payload.fromPath - this.comments.length;
                    })
                    .catch(code => this.$toast.showToast(code))
                    .finally(() => this.loadingChilds = false)
            }
        },
        computed: mapGetters([
            'dark',
            'authenticated',
            'timezone'
        ])
    }
</script>
