<template>
    <v-container fill-height article :class="$device.isMobile ? 'pa-0' : 'grid-list-lg pt-0'">
        <v-layout align-center justify-center text-center>
            <v-flex xs12 sm10 md6 lg4 xl3>
                <h1>{{$t('recover.headline')}}</h1>
                <v-card color="transparent" flat>
                    <v-form v-model="valid" ref="form" lazy-validation class="pa-3 pt-4">
                        <v-text-field
                                :label="$t('inputs.email.label')"
                                v-model="email"
                                :rules="[
                            v => !!v || $t('inputs.email.rules.required'),
                            v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || $t('inputs.email.rules.valid')
                  ]"
                                :hint="$t('inputs.email.hint.3')"
                                :prepend-icon="icons.mdiEmail"
                                required
                        />
                        <vue-recaptcha
                                ref="invisibleRecaptcha"
                                @verify="onVerify"
                                @expired="onExpired"
                                :sitekey="recaptchaSitekey"
                                :loadRecaptchaScript="true"
                                size="invisible"
                        >
                        </vue-recaptcha>
                    </v-form>
                    <v-card-actions class="pa-3">
                        <v-btn
                                @click="submit"
                                :disabled="!valid"
                                :loading="loading"
                                block
                                :aria-label="$t('buttons.next')"
                                depressed
                                :style="buttonStyle({color: buttonColors.blue})"
                        >
                            {{$t('buttons.next')}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {icons} from '../mixins/icons'
    import {button} from '~/mixins/button'

    export default {
        data: () => ({
            loading: false,
            valid: true,
            email: ''
        }),
        head() {
            return {
                title: this.$t("meta_info.recover.title", ['| MyOngoingsCalendar']),
                meta: [
                    {
                        name: 'description',
                        content: this.$t("meta_info.recover.meta.description", ['MyOngoingsCalendar'])
                    }
                ]
            }
        },
        methods: {
            submit() {
                if (this.$refs.form.validate()) this.$refs.invisibleRecaptcha.execute()
            },
            onVerify(response) {
                this.loading = true;
                const params = {
                    email: this.email,
                    recaptchaToken: response
                };
                this.$auth.recover({params})
                    .then(({code}) => this.$toast.showToast({code}))
                    .catch(({code}) => {
                        this.$toast.showToast({code});
                        this.$refs.invisibleRecaptcha.reset()
                    })
                    .finally(() => this.loading = false)
            },
            onExpired() {
                this.$refs.invisibleRecaptcha.reset()
            }
        },
        computed: {
            recaptchaSitekey() {
                return process.env.RECAPTCHA_SITE_KEY
            }
        },
        mixins: [
            icons,
            button
        ],
        middleware: ['guest']
    }
</script>
