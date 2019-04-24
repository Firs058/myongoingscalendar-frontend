<template>
    <v-container fill-height article :class="$device.isMobile ? 'pa-0' : 'grid-list-lg pt-0'">
        <v-layout align-center justify-center text-xs-center>
            <v-flex xs12 sm10 md6 lg4 xl3>
                <v-card color="transparent" flat>
                    <v-toolbar dense card tabs color="transparent">
                        <v-tabs
                                fixed
                                centered
                                color="transparent"
                        >
                            <v-tab nuxt to="/login">
                                <span class="headline">{{$t('login.headline')}}</span>
                            </v-tab>
                            <v-tab nuxt to="/registration">
                                <span class="headline">{{$t('registration.headline')}}</span>
                            </v-tab>
                        </v-tabs>
                    </v-toolbar>
                    <v-form v-model="valid" ref="form" lazy-validation class="pa-3 pt-4">
                        <v-text-field
                                :label="$t('inputs.email.label')"
                                v-model="email"
                                :rules="[
                             v => !!v || $t('inputs.email.rules.required'),
                             v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || $t('inputs.email.rules.valid')
                  ]"
                                :hint="$t('inputs.email.hint.1')"
                                prepend-icon="email"
                                required
                        />
                        <v-text-field
                                :label="$t('inputs.password.label')"
                                v-model="password"
                                :rules="[
                             v => !!v || $t('inputs.password.rules.required'),
                             v => v !== email || $t('inputs.password.rules.valid'),
                             v => v && v.length >= 8 || $t('inputs.password.rules.length'),
                  ]"
                                :hint="$t('inputs.password.hint')"
                                :append-icon="hidePass ? 'visibility' : 'visibility_off'"
                                @click:append="() => (hidePass = !hidePass)"
                                :type="hidePass ? 'password' : 'text'"
                                prepend-icon="lock"
                                required
                        />
                    </v-form>
                    <v-list class="transparent">
                        <v-list-tile>
                            <v-spacer/>
                            <v-list-tile-action>
                                <a @click.stop="$router.push('/recover')">{{$t('login.forgot_pass')}}</a>
                            </v-list-tile-action>
                            <v-spacer/>
                        </v-list-tile>
                    </v-list>
                    <v-card-actions class="pa-3">
                        <v-btn
                                @click="submit"
                                :disabled="!valid"
                                class="primary"
                                :loading="loadingBtn"
                                block
                        >{{$t('buttons.next')}}
                        </v-btn>
                    </v-card-actions>
                    <v-card-text>
                        <v-tooltip top>
                            <span slot="activator">{{$t('login.or_with')}}</span>
                            <span>{{$t('login.no_reg')}}</span>
                        </v-tooltip>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer/>
                        <v-tooltip
                                top
                                v-for="(i, index) in providers"
                                :key="i.name"
                        >
                            <v-btn
                                    @click.stop="confirmAuth(i.url, index)"
                                    fab
                                    flat
                                    :color=i.color
                                    :loading="i.loading"
                                    slot="activator"
                                    icon
                                    class="mx-2"
                            >
                                <font-awesome-icon :icon="i.icon" size="2x" class="icon alt"/>
                            </v-btn>
                            <span>{{$t('login.provider', [i.name])}}</span>
                        </v-tooltip>
                        <v-spacer/>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog
                v-model="dialog.visible"
                persistent
                max-width="500px"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">{{$t('login.dialog.headline', [dialog.selected.provider])}}</span>
                </v-card-title>
                <v-card-actions>
                    <v-spacer/>
                    <v-checkbox
                            v-model="dialog.alright"
                            color="primary"
                            hide-details
                            :rules="[
                              v => !!v || $t('inputs.checkbox.rules.agree')
                      ]"
                            required
                            value
                            hint
                    >
                        <template slot="label">
                            {{$t('inputs.checkbox.label')}}&nbsp;
                            <a @click.stop="$router.push('/terms')">{{$tc("terms.headline", 1)}}</a>
                            &nbsp;and&nbsp;
                            <a @click.stop="$router.push('/privacy')">{{$tc("privacy.headline", 1)}}</a>
                        </template>
                    </v-checkbox>
                    <v-spacer/>
                </v-card-actions>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn
                            flat
                            @click.native="dialog.visible = false"
                    >{{$t('buttons.decline')}}
                    </v-btn>
                    <v-btn
                            color="success"
                            :disabled="!dialog.alright"
                            @click.native="authViaProvider(dialog.selected)"
                    >{{$t('buttons.accept')}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    export default {
        data: () => ({
            loadingBtn: false,
            valid: true,
            password: '',
            email: '',
            hidePass: true,
            dialog: {
                visible: false,
                alright: false,
                selected: {}
            },
            providers: [
                {
                    name: 'Google',
                    url: 'google',
                    color: 'red',
                    icon: ['fab', 'google'],
                    loading: false
                },
                {
                    name: 'Twitter',
                    color: 'light-blue',
                    url: 'twitter',
                    icon: ['fab', 'twitter'],
                    loading: false
                },
                {
                    name: 'Github',
                    color: 'grey',
                    url: 'github',
                    icon: ['fab', 'github'],
                    loading: false
                }
            ]
        }),
        head() {
            return {
                title: this.$t("meta_info.login.title", ['| MyOngoingsCalendar']),
                meta: [
                    {
                        name: 'description',
                        content: this.$t("meta_info.login.meta.description", ['MyOngoingsCalendar'])
                    }
                ]
            }
        },
        methods: {
            submit() {
                if (this.$refs.form.validate()) {
                    this.loadingBtn = true;
                    this.$auth.login({email: this.email, password: this.password})
                        .then(code => {
                            this.$toast.showToast(code);
                            this.$router.push('/');
                        })
                        .catch(code => this.$toast.showToast(code))
                        .finally(() => this.loadingBtn = false)
                }
            },
            confirmAuth(provider, index) {
                this.dialog.selected = {provider, index};
                this.dialog.visible = true;
            },
            authViaProvider(selected) {
                this.dialog.visible = false;
                this.providers[selected.index].loading = true;
                this.$auth.getSocialAuthorizationUrl(selected.provider)
                    .then(url => window.location.href = url)
                    .catch(code => this.$toast.showToast(code))
                    .finally(() => this.providers[selected.index].loading = false)
            }
        },
        middleware: ['guest']
    }
</script>
