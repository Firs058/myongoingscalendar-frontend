<template>
    <v-dialog
            v-model="dialog"
            max-width="700"
    >
        <v-card v-if="authenticated">
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
                        text
                        @click.native="dialog = false"
                        :aria-label="$t('buttons.cancel')"
                >
                    {{$t('buttons.cancel')}}
                </v-btn>
                <v-btn
                        text
                        color="success"
                        :loading="loading"
                        @click.native="$store.dispatch('addComment')"
                        :disabled="!valid"
                        :aria-label="$t('buttons.add')"
                >
                    {{$t('buttons.add')}}
                </v-btn>
            </v-card-actions>
        </v-card>
        <v-card v-else>
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
                        :aria-label="$t('buttons.to_settings')"
                >
                    {{$t('buttons.to_settings')}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        computed: {
            dialog: {
                get() {
                    return this.$store.getters.comment.dialog
                },
                set(value) {
                    this.$store.dispatch('setComment', {name: 'dialog', value})
                }
            },
            text: {
                get() {
                    return this.$store.getters.comment.text
                },
                set(value) {
                    this.$store.dispatch('setComment', {name: 'text', value})
                }
            },
            valid: {
                get() {
                    return this.$store.getters.comment.valid
                },
                set(value) {
                    this.$store.dispatch('setComment', {name: 'valid', value})
                }
            },
            loading: {
                get() {
                    return this.$store.getters.comment.loading
                }
            },
            authenticated() {
                return this.$store.getters.authenticated
            }
        }
    }
</script>
