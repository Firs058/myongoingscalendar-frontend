<template>
    <v-dialog
            v-model="comment.dialog"
            max-width="700"
    >
        <v-card v-if="nickname === 'Anonymous'">
            <v-card-title class="headline">{{$t('comments.dialog.error.headline')}}</v-card-title>
            <v-card-text>
                <div>
                    {{$t('comments.dialog.error.text')}}
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn
                        color="success"
                        @click.native="$router.push({ name: 'settings'})"
                >
                    {{$t('buttons.to_settings')}}
                </v-btn>
            </v-card-actions>
        </v-card>
        <v-card v-else>
            <v-card-title class="headline">{{$t('comments.dialog.success.headline')}}</v-card-title>
            <v-card-text>
                <v-form v-model="valid" ref="form" lazy-validation>
                    <v-textarea
                            v-model="text"
                            outline
                            :rules="[v => !!v || $t('inputs.comment.rules.required')]"
                            required
                            autofocus
                    />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn
                        color="error"
                        flat
                        @click.native="dialog = false"
                >
                    {{$t('buttons.cancel')}}
                </v-btn>
                <v-btn
                        color="success"
                        :loading="loading"
                        @click.native="addComment"
                        :disabled="!valid"
                >
                    {{$t('buttons.add')}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            valid: true,
            loading: false,
            text: ''
        }),
        methods: {
            addComment() {
                this.loading = true;
                this.$anime.api('api/comments/add', {id: this.comment.id, tid: this.comment.tid, text: this.text})
                    .then(result => {
                        this.loading = false;
                        this.dialog = false;
                        this.text = '';
                        this.$toast.showToast({code: result.data.status.code})
                    })
                    .catch(code =>  this.$toast.showToast(code))
            }
        },
        computed: {
            ...mapGetters([
                'comment',
                'nickname'
            ]),
            dialog: {
                get() {
                    return this.$store.state.comment.dialog
                },
                set(value) {
                    this.$store.dispatch('setCommentDialog', value)
                }
            }
        }
    }
</script>
