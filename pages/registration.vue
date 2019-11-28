<template>
    <v-container fill-height article :class="$device.isMobile ? 'pa-0' : 'grid-list-lg pt-0'">
        <v-layout align-center justify-center text-center>
            <v-flex xs12 sm10 md6 lg4 xl3>
                <h1>{{$t('registration.headline')}}</h1>
                <v-card color="transparent" flat>
                    <v-form v-model="valid" ref="form" lazy-validation class="pa-3 pt-4">
                        <v-text-field
                                :label="$t('inputs.nickname.label')"
                                v-model="nickname"
                                :rules="[
                            v => !!v || $t('inputs.nickname.rules.required'),
                            v => /^[a-zA-Z0-9]+$/.test(v) || $t('inputs.nickname.rules.valid'),
                            v => v && v.length >= 4 || $t('inputs.nickname.rules.lengthMin'),
                            v => v && v.length <= 20 || $t('inputs.nickname.rules.lengthMax')
                  ]"
                                :hint="$t('inputs.nickname.hint')"
                                :prepend-icon="icons.mdiAccount"
                                required
                        />
                        <v-text-field
                                :label="$t('inputs.email.label')"
                                v-model="email"
                                :rules="[
                            v => !!v || $t('inputs.email.rules.required'),
                            v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || $t('inputs.email.rules.valid')
                  ]"
                                :hint="$t('inputs.email.hint.2')"
                                :prepend-icon="icons.mdiEmail"
                                required
                        />
                        <v-text-field
                                :label="$t('inputs.password.label')"
                                :hint="$t('inputs.password.hint')"
                                v-model="password"
                                :rules="[
                            v => !!v || $t('inputs.password.rules.required'),
                            v => (v !== email || v !== nickname) || $t('inputs.password.rules.valid'),
                            v => v && v.length >= 8 || $t('inputs.password.rules.length')
                  ]"
                                :append-icon="hidePass ? icons.mdiEye : icons.mdiEyeOff"
                                @click:append="() => (hidePass = !hidePass)"
                                :type="hidePass ? 'password' : 'text'"
                                :prepend-icon="icons.mdiLock"
                                required
                        />
                        <v-text-field
                                :label="$t('inputs.confirm_password.label')"
                                :hint="$t('inputs.confirm_password.hint')"
                                v-model="confirmPassword"
                                :rules="[
                            v => !!v || $t('inputs.confirm_password.rules.required'),
                            v => v === password || $t('inputs.confirm_password.rules.valid'),
                            v => v && v.length >= 8 || $t('inputs.confirm_password.rules.length')
                  ]"
                                :append-icon="confirmHidePass ? icons.mdiEye : icons.mdiEyeOff"
                                @click:append="() => (confirmHidePass = !confirmHidePass)"
                                :type="confirmHidePass ? 'password' : 'text'"
                                :prepend-icon="icons.mdiLock"
                                required
                        />
                        <v-checkbox
                                v-model="alright"
                                color="primary"
                                hide-details
                                :rules="[
                              v => !!v || $t('inputs.checkbox.rules.agree')
                      ]"
                                required
                                value
                                hint
                                class="shrink"
                        >
                            <template slot="label">
                                {{$t('inputs.checkbox.label')}}&nbsp;
                                <a @click.stop="$router.push('/terms')">{{$tc("terms.short", 2).toLowerCase()}}</a>
                                &nbsp;{{$t('inputs.checkbox.and')}}&nbsp;
                                <a @click.stop="$router.push('/privacy')">{{$tc("privacy.short", 2).toLowerCase()}}</a>
                            </template>
                        </v-checkbox>
                        <client-only>
                            <vue-recaptcha
                                    ref="invisibleRecaptcha"
                                    @verify="onVerify"
                                    @expired="onExpired"
                                    :sitekey="sitekey"
                                    size="invisible"
                            />
                        </client-only>
                    </v-form>
                    <v-card-actions class="pa-3">
                        <v-btn
                                @click="submit"
                                :disabled="!valid"
                                class="primary"
                                :loading="loading"
                                block
                        >{{$t('buttons.next')}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {icons} from '../mixins/icons'
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                sitekey: '6LdMemkUAAAAAEhtdLuLej6GkuS89V0smYUo3DjC',
                loading: false,
                valid: true,
                alright: false,
                nickname: '',
                password: '',
                email: '',
                hidePass: true,
                confirmPassword: '',
                confirmHidePass: true
            }
        },
        head() {
            return {
                title: this.$t("meta_info.registration.title", ['| MyOngoingsCalendar']),
                meta: [
                    {
                        name: 'description',
                        content: this.$t("meta_info.registration.meta.description", ['MyOngoingsCalendar'])
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
                let settings = this.settings;
                settings.nickname = this.nickname;

                this.$auth.registration({
                    email: this.email,
                    password: this.password,
                    recaptchaToken: response,
                    userSettings: settings
                })
                    .then(code => {
                        this.$toast.showToast(code);
                        this.$router.push('/');
                    })
                    .catch(code => {
                        this.$toast.showToast(code);
                        this.$refs.invisibleRecaptcha.reset()
                    })
                    .finally(() => this.loading = false)
            },
            onExpired() {
                this.$refs.invisibleRecaptcha.reset()
            }
        },
        computed: mapGetters([
            'settings'
        ]),
        mounted() {
            let recaptchaScript = document.createElement('script');
            recaptchaScript.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit');
            document.body.appendChild(recaptchaScript)
        },
        mixins: [
            icons
        ],
        middleware: ['guest']
    }
</script>
