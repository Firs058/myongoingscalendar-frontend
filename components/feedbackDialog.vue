<template>
    <v-dialog
            v-model="dialog"
            max-width="700"
    >
        <v-card>
            <v-card-title class="headline">{{$t('feedback.headline')}}</v-card-title>
            <v-card-text>
                <v-form v-model="valid" ref="feedbackForm" lazy-validation>
                    <v-textarea
                            v-model="text"
                            outline
                            :rules="[v => !!v || $t('inputs.comment.rules.required')]"
                            required
                            autofocus
                            :hint="$t(`feedback.${authenticated ? 'hint_for_authenticated' : 'hint_for_anonymous'}`)"
                    />
                </v-form>
                <v-layout
                        row
                        justify-center
                        class="mt-4"
                >
                    <client-only>
                        <vue-recaptcha
                                ref="feedbackInvisibleRecaptcha"
                                @verify="onVerify"
                                @expired="onExpired"
                                :sitekey="recaptchaSitekey"
                                :loadRecaptchaScript="true"
                                size="invisible"
                                badge="inline"
                        />
                    </client-only>
                </v-layout>
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
                        @click.native="submit"
                        :disabled="!valid"
                        :aria-label="$t('buttons.send')"
                >
                    {{$t('buttons.send')}}
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
                    return this.$store.getters.feedback.dialog
                },
                set(value) {
                    this.$store.dispatch('setFeedback', {name: 'dialog', value})
                }
            },
            text: {
                get() {
                    return this.$store.getters.feedback.text
                },
                set(value) {
                    this.$store.dispatch('setFeedback', {name: 'text', value})
                }
            },
            valid: {
                get() {
                    return this.$store.getters.feedback.valid
                },
                set(value) {
                    this.$store.dispatch('setFeedback', {name: 'valid', value})
                }
            },
            loading: {
                get() {
                    return this.$store.getters.feedback.loading
                }
            },
            authenticated() {
                return this.$store.getters.authenticated
            },
            recaptchaSitekey() {
                return process.env.recaptchaSitekey
            }
        },
        methods: {
            submit() {
                if (this.$refs.feedbackForm.validate()) this.$refs.feedbackInvisibleRecaptcha.execute()
            },
            onVerify(response) {
                this.$store.dispatch('addFeedback', response)
                    .catch(() => this.$refs.feedbackInvisibleRecaptcha.reset());
            },
            onExpired() {
                this.$refs.feedbackInvisibleRecaptcha.reset()
            }
        }
    }
</script>
<style scoped>
    >>> .grecaptcha-badge {
        box-shadow: none !important;
    }
</style>
