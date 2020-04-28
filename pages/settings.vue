<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container fill-height article :class="$device.isMobile ? 'pa-0' : 'grid-list-lg pt-0'">
        <v-layout align-center justify-center>
            <v-flex xs12 md10 lg8 xl6>
                <div v-if="!user.authenticated">
                    <v-alert
                            tile
                            type="info"
                            :value="true"
                    >{{$t('alerts.settings_note')}}
                    </v-alert>
                </div>
                <v-subheader v-if="user.authenticated">{{$t('settings.account.subheader')}}</v-subheader>
                <v-card v-if="user.authenticated" flat tile>
                    <v-list
                            two-line
                            subheader
                            class="pa-0"
                    >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{$t('settings.account.change_nickname.title')}}</v-list-item-title>
                                <v-list-item-subtitle>{{$t('settings.account.change_nickname.sub_title',
                                    [settings.nickname])}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-dialog
                                        v-model="nickname.dialog"
                                        persistent
                                        max-width="500px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                                v-on="on"
                                                right
                                                icon
                                                aria-label="Open In New"
                                        >
                                            <v-icon>{{icons.mdiOpenInNew}}</v-icon>
                                        </v-btn>
                                    </template>
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
                                                    text
                                                    @click.native="nickname.dialog = false"
                                                    :aria-label="$t('buttons.cancel')"
                                            >{{$t('buttons.cancel')}}
                                            </v-btn>
                                            <v-btn
                                                    text
                                                    color="success"
                                                    :disabled="!nickname.valid"
                                                    @click.native="submitNickname"
                                                    :aria-label="$t('buttons.save')"
                                            >{{$t('buttons.save')}}
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider/>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{$t('settings.account.change_avatar.title')}}</v-list-item-title>
                                <v-list-item-subtitle>{{$t('settings.account.change_avatar.sub_title')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn
                                        right
                                        icon
                                        @click.stop="openUrl('https://gravatar.com/')"
                                        aria-label="Arrow Right"
                                >
                                    <v-icon>{{icons.mdiArrowRight}}</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider v-if="!user.social"/>
                        <v-list-item v-if="!user.social">
                            <v-list-item-content>
                                <v-list-item-title>{{$t('settings.account.change_password.title')}}</v-list-item-title>
                                <v-list-item-subtitle>{{$t('settings.account.change_password.sub_title')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-dialog
                                        v-model="password.dialog"
                                        persistent
                                        max-width="500px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                                v-on="on"
                                                right
                                                icon
                                                aria-label="Open In New"
                                        >
                                            <v-icon>{{icons.mdiOpenInNew}}</v-icon>
                                        </v-btn>
                                    </template>
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
                                                        :append-icon="password.hidePass ? icons.mdiEye : icons.mdiEyeOff"
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
                                                    text
                                                    @click.native="password.dialog = false"
                                                    :aria-label="$t('buttons.cancel')"
                                            >{{$t('buttons.cancel')}}
                                            </v-btn>
                                            <v-btn
                                                    text
                                                    color="success"
                                                    :disabled="!password.valid"
                                                    @click.native="submitPassword"
                                                    :aria-label="$t('buttons.save')"
                                            >{{$t('buttons.save')}}
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
                <v-subheader>{{$t('settings.interface.subheader')}}</v-subheader>
                <v-card flat tile>
                    <v-list
                            two-line
                            subheader
                            class="pa-0"
                    >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{$t('settings.interface.dark.title')}}</v-list-item-title>
                                <v-list-item-subtitle>{{$t('settings.interface.dark.sub_title')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-switch
                                        v-model="dark"
                                        color="primary"
                                        hide-details
                                        class="ml-2"
                                />
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider/>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{$t('settings.interface.hide_repeats.title')}}</v-list-item-title>
                                <v-list-item-subtitle>{{$t('settings.interface.hide_repeats.sub_title')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-switch
                                        v-model="hideRepeats"
                                        color="primary"
                                        hide-details
                                        class="ml-2"
                                />
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider/>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{$t('settings.interface.language.title')}}</v-list-item-title>
                                <v-list-item-subtitle>{{$t('settings.interface.language.sub_title')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-menu>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                                right
                                                icon
                                                v-on="on"
                                                aria-label="lang"
                                        >
                                            <v-avatar size="32px">
                                                <img :src="webpIsSupported ? currentLang.img.webp : currentLang.img.png" :alt="currentLang.name">
                                            </v-avatar>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item
                                                v-for="lang in langs"
                                                :key="lang.code"
                                                @click="setLang(lang.code)"
                                        >
                                            <v-list-item-action>
                                                <v-avatar size="32px">
                                                    <img :src="webpIsSupported ? lang.img.webp : lang.img.png" :alt="lang.name"/>
                                                </v-avatar>
                                            </v-list-item-action>
                                            <v-list-item-content>
                                                <v-list-item-title v-text="lang.name"/>
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-divider/>
                                        <v-list-item
                                                @click.stop="openUrl('https://github.com/Firs058/myongoingscalendar-frontend/tree/master/locales')">
                                            <v-list-item-action>
                                                <v-avatar size="32px">
                                                    <font-awesome-icon :icon="['fab', 'github']" size="2x"
                                                                       class="icon alt"/>
                                                </v-avatar>
                                            </v-list-item-action>
                                            <v-list-item-content>
                                                <v-list-item-title>Need more?</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
                <v-subheader>{{$t('settings.time.subheader')}}</v-subheader>
                <v-card flat tile>
                    <v-list
                            two-line
                            subheader
                            class="pa-0"
                    >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{$t('settings.time.time_format.title')}}
                                </v-list-item-title>
                                <v-list-item-subtitle>{{$t('settings.time.time_format.sub_title')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action
                                    v-if="!$device.isMobile"
                                    style="min-width: 300px;"
                            >
                                <v-select
                                        :items="timeFormats"
                                        v-model="fullTimeFormat"
                                />
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item v-if="$device.isMobile">
                            <v-select
                                    :items="timeFormats"
                                    v-model="fullTimeFormat"
                            />
                        </v-list-item>
                        <v-divider/>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{$t('settings.time.timezone.title')}}
                                </v-list-item-title>
                                <v-list-item-subtitle>{{$t('settings.time.timezone.sub_title')}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action
                                    v-if="!$device.isMobile"
                                    style="min-width: 300px;"
                            >
                                <v-autocomplete
                                        :items="$store.getters.timezonesListEmpty ? [timezone] : timezones"
                                        @click.native="checkAndDownloadTimezones"
                                        v-model="timezone"
                                        :loading="timezonesLoading"
                                />
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item v-if="$device.isMobile">
                            <v-autocomplete
                                    :items="$store.getters.timezonesListEmpty ? [timezone] : timezones"
                                    @click.native="checkAndDownloadTimezones"
                                    v-model="timezone"
                                    :loading="timezonesLoading"
                            />
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {icons} from '../mixins/icons'

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
                    img: {
                        png: '/images/us.png',
                        webp: '/images/webp/us.webp',
                    }
                },
                {
                    name: 'Русский',
                    code: 'ru',
                    img: {
                        png: '/images/ru.png',
                        webp: '/images/webp/ru.webp',
                    }
                }
            ]
        }),
        mixins: [
            icons
        ],
        methods: {
            submitNickname() {
                if (this.user.authenticated && this.$refs.nicknameForm.validate()) {
                    this.nickname.dialog = false;
                    this.$auth.changeNickname({nickname: this.nickname.value})
                        .then(code => {
                            this.$store.dispatch('setSetting', {name: 'nickname', value: this.nickname.value});
                            this.$toast.showToast(code)
                        })
                        .catch(code => this.$toast.showToast(code))
                }
            },
            submitPassword() {
                if (this.user.authenticated && this.$refs.passwordForm.validate()) {
                    this.password.dialog = false;
                    this.$auth.changePass({password: this.password.value})
                        .then(code => this.$toast.showToast(code))
                        .catch(code => this.$toast.showToast(code))
                }
            },
            openUrl: url => window.open(url),
            saveSettings() {
                if (this.user.authenticated) this.$auth.saveSettings(this.$store.getters.settings)
            },
            setLang(value) {
                this.$store.dispatch('setSetting', {name: 'lang', value: value});
                this.$i18n.locale = value;
                this.$moment.locale(value);
                this.saveSettings()
            },
            checkAndDownloadTimezones() {
                if (this.$store.getters.timezonesListEmpty) {
                    this.timezonesLoading = true;
                    this.$axios.$post('api/public/timezones')
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
                    return this.$store.getters.settings
                }
            },
            timezones: {
                get() {
                    return this.$store.state.timezones
                }
            },
            dark: {
                get() {
                    return this.$store.getters.settings.dark
                },
                set(value) {
                    this.$store.dispatch('setSetting', {name: 'dark', value: value});
                    this.$vuetify.theme.dark = value;
                    this.saveSettings()
                }
            },
            hideRepeats: {
                get() {
                    return this.$store.getters.settings.hideRepeats
                },
                set(value) {
                    this.$store.dispatch('setCalendar', []);
                    this.$store.dispatch('setSetting', {name: 'hideRepeats', value: value});
                    this.saveSettings()
                }
            },
            timezone: {
                get() {
                    return this.$store.getters.settings.timezone
                },
                set(value) {
                    this.$store.dispatch('setSetting', {name: 'timezone', value: value});
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
                    return this.$store.getters.settings.fullTimeFormat
                        ? this.$t("settings.time.time_format.24hour")
                        : this.$t("settings.time.time_format.12hour")
                },
                set: function (value) {
                    this.$store.dispatch('setSetting', {
                        name: 'fullTimeFormat',
                        value: value === this.$t("settings.time.time_format.24hour")
                    });
                    this.saveSettings();
                }
            },
            currentLang() {
                return this.langs.filter(o => o.code === this.$store.getters.settings.lang)[0]
            },
            webpIsSupported: {
                get() {
                    return this.$store.getters.webpIsSupported
                }
            }
        },
        mounted() {
            this.$vuetify.goTo(0);
        }
    }
</script>
