<template>
    <v-container
            fluid
            fill-height
            :class="$device.isDesktop ? 'grid-list-lg' : 'pa-0'"
    >
        <v-layout align-center justify-center text-xs-center>
            <v-flex xs12 sm12 md8 lg6 xl6>
                <div v-if="!user.authenticated">
                    <v-alert
                            type="info"
                            :value="true"
                    >{{$t('alerts.settings_note')}}
                    </v-alert>
                </div>
                <v-subheader v-if="user.authenticated">{{$t('settings.account.subheader')}}</v-subheader>
                <v-card v-if="user.authenticated">
                    <v-list
                            two-line
                            subheader
                            class="pa-0"
                    >
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>{{$t('settings.account.change_nickname.title')}}</v-list-tile-title>
                                <v-list-tile-sub-title>{{$t('settings.account.change_nickname.sub_title',
                                    [settings.nickname])}}
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-dialog
                                        v-model="nickname.dialog"
                                        persistent
                                        max-width="500px"
                                >
                                    <v-btn
                                            right
                                            icon
                                            slot="activator"
                                    >
                                        <v-icon>open_in_new</v-icon>
                                    </v-btn>
                                    <v-card>
                                        <v-card-title>
                                            <span class="headline">{{$t('settings.account.change_nickname.dialog.headline')}}</span>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-form v-model="nickname.valid" ref="nicknameForm" lazy-validation>
                                                <v-text-field
                                                        :label="$t('inputs.nickname.label')"
                                                        v-model="nickname.value"
                                                        :rules="[
                                  v => !!v || $t('inputs.nickname.rules.required'),
                                  v => /^[a-zA-Z0-9]+$/.test(v) || $t('inputs.nickname.rules.valid'),
                                  v => v && v.length >= 4 || $t('inputs.nickname.rules.lengthMin'),
                                  v => v && v.length <= 20 || $t('inputs.nickname.rules.lengthMax')
                        ]"
                                                        required
                                                        autofocus
                                                />
                                            </v-form>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer/>
                                            <v-btn
                                                    flat
                                                    @click.native="nickname.dialog = false"
                                            >{{$t('buttons.cancel')}}
                                            </v-btn>
                                            <v-btn
                                                    color="success"
                                                    :disabled="!nickname.valid"
                                                    @click.native="submitNickname"
                                            >{{$t('buttons.save')}}
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider/>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>{{$t('settings.account.change_avatar.title')}}</v-list-tile-title>
                                <v-list-tile-sub-title>{{$t('settings.account.change_avatar.sub_title')}}
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn
                                        right
                                        icon
                                        @click.stop="openUrl('https://gravatar.com/')"
                                >
                                    <v-icon>chevron_right</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider/>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>{{$t('settings.account.change_password.title')}}</v-list-tile-title>
                                <v-list-tile-sub-title>{{$t('settings.account.change_password.sub_title')}}
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-dialog
                                        v-model="password.dialog"
                                        persistent
                                        max-width="500px"
                                >
                                    <v-btn
                                            right
                                            icon
                                            slot="activator"
                                    >
                                        <v-icon>open_in_new</v-icon>
                                    </v-btn>
                                    <v-card>
                                        <v-card-title>
                                            <span class="headline">{{$t('settings.account.change_password.dialog.headline')}}</span>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-form v-model="password.valid" ref="passwordForm" lazy-validation>
                                                <v-text-field
                                                        :label="$t('inputs.password.label')"
                                                        :hint="$t('inputs.password.hint')"
                                                        v-model="password.value"
                                                        :rules="[
                                  v => !!v || $t('inputs.password.rules.required'),
                                  v => (v !== user.email || v !== settings.nickname) || $t('inputs.password.rules.valid'),
                                  v => v && v.length >= 8 || $t('inputs.password.rules.length')
                        ]"
                                                        :append-icon="password.hidePass ? 'visibility' : 'visibility_off'"
                                                        @click:append="() => (password.hidePass = !password.hidePass)"
                                                        :type="password.hidePass ? 'password' : 'text'"
                                                        required
                                                        autofocus
                                                />
                                            </v-form>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer/>
                                            <v-btn
                                                    flat
                                                    @click.native="password.dialog = false"
                                            >{{$t('buttons.cancel')}}
                                            </v-btn>
                                            <v-btn
                                                    color="success"
                                                    :disabled="!password.valid"
                                                    @click.native="submitPassword"
                                            >{{$t('buttons.save')}}
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-card>
                <v-subheader>{{$t('settings.interface.subheader')}}</v-subheader>
                <v-card>
                    <v-list
                            two-line
                            subheader
                            class="pa-0"
                    >
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>{{$t('settings.interface.dark.title')}}</v-list-tile-title>
                                <v-list-tile-sub-title>{{$t('settings.interface.dark.sub_title')}}
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-switch
                                        v-model="dark"
                                        color="primary"
                                        hide-details
                                        class="ml-2"
                                />
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider/>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>{{$t('settings.interface.hide_repeats.title')}}</v-list-tile-title>
                                <v-list-tile-sub-title>{{$t('settings.interface.hide_repeats.sub_title')}}
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-switch
                                        v-model="hideRepeats"
                                        color="primary"
                                        hide-details
                                        class="ml-2"
                                />
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider/>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>{{$t('settings.interface.language.title')}}</v-list-tile-title>
                                <v-list-tile-sub-title>{{$t('settings.interface.language.sub_title')}}
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-menu>
                                    <v-btn
                                            right
                                            icon
                                            slot="activator"
                                    >
                                        <img :src="langImage">
                                    </v-btn>
                                    <v-list>
                                        <v-list-tile
                                                avatar
                                                v-for="lang in langs"
                                                :key="lang.code"
                                                @click="setLang(lang.code)"
                                        >
                                            <v-list-tile-action>
                                                <v-avatar
                                                        tile
                                                        size="36px"
                                                        slot="activator"
                                                >
                                                    <img :src="lang.img"/>
                                                </v-avatar>
                                            </v-list-tile-action>
                                            <v-list-tile-content>
                                                <v-list-tile-title v-text="lang.name"/>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                        <v-divider/>
                                        <v-list-tile avatar
                                                     @click.stop="openUrl('https://github.com/Firs058/myongoingscalendar-frontend/tree/master/locales')">
                                            <v-list-tile-action>
                                                <v-avatar
                                                        tile
                                                        size="36px"
                                                        slot="activator"
                                                >
                                                    <font-awesome-icon :icon="['fab', 'github']" size="2x"
                                                                       class="icon alt"/>
                                                </v-avatar>
                                            </v-list-tile-action>
                                            <v-list-tile-content>
                                                <v-list-tile-title>Need more?</v-list-tile-title>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-card>
                <v-subheader>{{$t('settings.time.subheader')}}</v-subheader>
                <v-card>
                    <v-list
                            two-line
                            subheader
                            class="pa-0"
                    >
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>{{$t('settings.time.time_format.title')}}
                                </v-list-tile-title>
                                <v-list-tile-sub-title>{{$t('settings.time.time_format.sub_title')}}
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-select
                                    :items="timeFormats"
                                    v-model="fullTimeFormat"
                                    :label="$t('selects.label')"
                            />
                        </v-list-tile>
                        <v-divider/>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>{{$t('settings.time.timezone.title')}}
                                </v-list-tile-title>
                                <v-list-tile-sub-title>{{$t('settings.time.timezone.sub_title')}}
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-autocomplete
                                    :items="$store.getters.timezonesListEmpty ? [timezone] : timezones"
                                    @click="checkAndDownloadTimezones"
                                    v-model="timezone"
                                    :label="$t('selects.label')"
                                    :loading="timezonesLoading"
                            />
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data: () => ({
            valid: false,
            menu: false,
            timezonesLoading: false,
            nickname: {
                dialog: false,
                valid: true,
                value: ''
            },
            password: {
                dialog: false,
                hidePass: true,
                valid: true,
                value: ''
            },
            langs: [
                {
                    name: 'English',
                    code: 'en',
                    img: 'https://countryflags.io/us/flat/24.png'
                },
                {
                    name: 'Русский',
                    code: 'ru',
                    img: 'https://countryflags.io/ru/flat/24.png'
                }
            ]
        }),
        methods: {
            submitNickname() {
                if (this.$refs.nicknameForm.validate()) {
                    this.nickname.dialog = false;
                    this.$auth.changeNickname({nickname: this.nickname.value})
                        .then(code => {
                            store.dispatch('setNickname', this.nickname.value);
                            this.$toast.showToast(code)
                        })
                        .catch(code => this.$toast.showToast(code))
                }
            },
            submitPassword() {
                if (this.$refs.passwordForm.validate()) {
                    this.password.dialog = false;
                    this.$auth.changePass({password: this.password.value})
                        .then(code => this.$toast.showToast(code))
                        .catch(code => this.$toast.showToast(code))
                }
            },
            openUrl: url => window.open(url),
            saveSettings() {
                if (this.user.authenticated) this.$auth.saveSettings(this.$store.state.settings)
            },
            setLang(code) {
                this.$store.dispatch('setLang', code);
                this.saveSettings()
            },
            checkAndDownloadTimezones() {
                if (this.$store.getters.timezonesListEmpty) {
                    this.timezonesLoading = true;
                    this.$axios.$post('api/user/settings/timezones')
                        .then(data => this.$store.dispatch('setTimezones', data.payload))
                        .finally(() => this.timezonesLoading = false)
                }
            }
        },
        head() {
            return {
                title: this.$t("meta_info.settings.title", ['| MyOngoingsCalendar']),
                meta: [
                    {
                        name: 'description',
                        content: this.$t("meta_info.settings.meta.description")
                    }
                ]
            }
        },
        computed: {
            user: {
                get() {
                    return this.$store.state.user
                }
            },
            settings: {
                get() {
                    return this.$store.state.settings
                }
            },
            timezones: {
                get() {
                    return this.$store.state.timezones
                }
            },
            dark: {
                get() {
                    return this.$store.state.settings.dark
                },
                set(value) {
                    this.$store.dispatch('setDark', value);
                    this.saveSettings()
                }
            },
            hideRepeats: {
                get() {
                    return this.$store.state.settings.hideRepeats
                },
                set(value) {
                    this.$store.dispatch('setCalendar', []);
                    this.$store.dispatch('setHideRepeats', value);
                    this.saveSettings()
                }
            },
            timezone: {
                get() {
                    return this.$store.state.settings.timezone
                },
                set(value) {
                    this.$store.dispatch('setTimezone', value);
                    this.saveSettings()
                }
            },
            timeFormats() {
                return [
                    this.$t("settings.time.time_format.24hour"),
                    this.$t("settings.time.time_format.12hour")
                ]
            },
            fullTimeFormat: {
                get: function () {
                    return this.$store.state.settings.fullTimeFormat
                        ? this.$t("settings.time.time_format.24hour")
                        : this.$t("settings.time.time_format.12hour")
                },
                set: function (value) {
                    this.saveSettings();
                    return this.$store.dispatch('serFullTimeFormat', value === this.$t("settings.time.time_format.24hour"))
                }
            },
            langImage() {
                return this.langs.filter(o => o.code === this.$store.state.settings.lang)[0].img
            }
        },
        activated() {
            this.$vuetify.goTo(0);
        }
    }
</script>
