<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container fill-height article :class="$device.isMobile ? 'pa-0' : 'grid-list-lg pt-0'">
        <v-layout align-center justify-center text-center>
            <v-flex xs12 sm10 md6 lg4 xl3>
                <h1>{{$t('login.headline')}}</h1>
                <v-card color="transparent" flat>
                    <v-form v-model="valid" ref="form" lazy-validation class="pa-3 pt-4">
                        <v-text-field
                                :label="$t('inputs.email.label')"
                                v-model="email"
                                :rules="[
                             v => !!v || $t('inputs.email.rules.required'),
                             v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || $t('inputs.email.rules.valid')
                  ]"
                                :hint="$t('inputs.email.hint.1')"
                                :prepend-icon="icons.mdiEmail"
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
                                :append-icon="hidePass ? icons.mdiEye : icons.mdiEyeOff"
                                @click:append="() => (hidePass = !hidePass)"
                                :type="hidePass ? 'password' : 'text'"
                                :prepend-icon="icons.mdiLock"
                                required
                        />
                    </v-form>
                    <v-list class="transparent">
                        <v-list-item>
                            <v-spacer/>
                            <v-list-item-action>
                                <a @click.stop="$router.push('/registration')">{{$t('registration.headline')}}</a>
                            </v-list-item-action>
                            <v-spacer/>
                            <v-list-item-action>
                                <a @click.stop="$router.push('/recover')">{{$t('login.forgot_pass')}}</a>
                            </v-list-item-action>
                            <v-spacer/>
                        </v-list-item>
                    </v-list>
                    <v-card-actions class="pa-3">
                        <v-btn
                                @click="submit"
                                :disabled="!valid"
                                color="blue darken-3"
                                :loading="loadingBtn"
                                block
                                :aria-label="$t('buttons.next')"
                        >
                            {{$t('buttons.next')}}
                        </v-btn>
                    </v-card-actions>
                    <v-card-text>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">{{$t('login.or_with')}}</span>
                            </template>
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
                            <template v-slot:activator="{ on }">
                                <v-btn
                                        @click.stop="confirmAuth(i.url, index)"
                                        fab
                                        text
                                        :color=i.color
                                        :loading="i.loading"
                                        v-on="on"
                                        icon
                                        class="mx-2"
                                        :aria-label="$t('login.provider', [i.name])"
                                >
                                    <font-awesome-icon :icon="i.icon" size="2x" class="icon alt"/>
                                </v-btn>
                            </template>
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
                            :rules="[v => !!v || $t('inputs.checkbox.rules.agree')]"
                            required
                            value
                            hint
                    >
                        <template slot="label">
                            {{$t('inputs.checkbox.label')}}&nbsp;
                            <a @click.stop="$router.push('/terms')">{{$tc("terms.short", 2).toLowerCase()}}</a>
                            &nbsp;{{$t('inputs.checkbox.and')}}&nbsp;
                            <a @click.stop="$router.push('/privacy')">{{$tc("privacy.short", 2).toLowerCase()}}</a>
                        </template>
                    </v-checkbox>
                    <v-spacer/>
                </v-card-actions>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn
                            text
                            @click.native="dialog.visible = false"
                            :aria-label="$t('buttons.decline')"
                    >
                        {{$t('buttons.decline')}}
                    </v-btn>
                    <v-btn
                            text
                            color="success"
                            :disabled="!dialog.alright"
                            @click.native="authViaProvider(dialog.selected)"
                            :aria-label="$t('buttons.accept')"
                    >
                        {{$t('buttons.accept')}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import {icons} from '../mixins/icons'

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
        mixins: [
            icons
        ],
        middleware: ['guest']
    }
</script>
