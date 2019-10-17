<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-app>
        <v-navigation-drawer
                :class="{transparent : !$device.isMobile}"
                v-model="menu"
                :permanent="!$device.isMobile"
                :right="$device.isMobile"
                app
                floating
                fixed
                width="240"
        >
            <div
                    class="mb-4 mt-2 text-center"
                    :style="`cursor: pointer;`"
                    @click.stop="$router.push('/')"
            >
                <div class="title mx-3">MyOngoingsCalendar</div>
                <div class="grey--text mx-3">{{settings.timezone}}</div>
            </div>
            <v-list dense flat>
                <v-list-item
                        ripple
                        to="/"
                        nuxt
                >
                    <v-list-item-action>
                        <v-icon>{{icons.mdiHome}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{$t('menu.home')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                        ripple
                        v-if="authenticated"
                        to="/my_calendar"
                        nuxt
                >
                    <v-list-item-action>
                        <v-icon>{{icons.mdiCalendarCheck}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{$t('menu.my_calendar')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                        ripple
                        to="/list"
                        nuxt
                >
                    <v-list-item-action>
                        <v-icon>{{icons.mdiFormatListBulleted}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{$t('menu.ongoings_list')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                        ripple
                        :to="{ name: 'search', query: lastQuery}"
                        :disabled="$route.name === 'search'"
                        nuxt
                >
                    <v-list-item-action>
                        <v-icon>{{icons.mdiMagnify}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{$t('menu.search')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                        ripple
                        v-if="!authenticated"
                        to="/login"
                        nuxt
                >
                    <v-list-item-action>
                        <v-icon>{{icons.mdiLogin}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{$t('menu.login')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                        ripple
                        v-if="!authenticated"
                        to="/registration"
                        nuxt
                >
                    <v-list-item-action>
                        <v-icon>{{icons.mdiAccountPlus}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{$t('menu.registration')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                        ripple
                        to="/about"
                        nuxt
                >
                    <v-list-item-action>
                        <v-icon>{{icons.mdiInformationVariant}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{$t('menu.about')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                        ripple
                        to="/settings"
                        nuxt
                >
                    <v-list-item-action>
                        <v-icon>{{icons.mdiSettings}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{$t('menu.settings')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-group
                        v-for="item in 1"
                        :value="item.active"
                        :key="item.name"
                        :prepend-icon="icons.mdiGiftOutline"
                        no-action
                >
                    <template v-slot:activator>
                        <v-list-item-title dense>{{$t('menu.donate')}}</v-list-item-title>
                    </template>
                    <v-list-item
                            v-for="donate in donates"
                            :key="donate.name"
                            @click="donate.action === 'url' ? openUrl(donate.address) : copyToClipboard(donate.name, donate.address)"
                    >
                        <v-list-item-action>
                            <v-avatar
                                    tile
                                    size="16px"
                                    slot="activator"
                            >
                                <img :src="donate.img"/>
                            </v-avatar>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title v-text="donate.name"/>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                <v-list-item
                        v-if="authenticated && admin"
                        to="/admin"
                        nuxt
                >
                    <v-list-item-action>
                        <v-icon>{{icons.mdiPencil}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Admin</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="authenticated">
                    <v-list-item-avatar>
                        <img :src="settings.avatar"/>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-subtitle>{{$t('menu.logged_as')}}</v-list-item-subtitle>
                        <v-list-item-title>{{user.email}}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                        v-on="on"
                                        icon
                                        @click.stop="logout()"
                                >
                                    <v-icon>{{icons.mdiExitToApp}}</v-icon>
                                </v-btn>
                            </template>
                            {{$t('menu.exit')}}
                        </v-tooltip>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
            <template v-slot:append>
                <div class="mb-2 mt-4">
                    <v-layout row wrap justify-center>
                        <v-btn
                                class="caption"
                                color="primary"
                                text
                                v-for="link in footerLinks"
                                :key="link.name"
                                :to="link.link"
                                small
                                nuxt
                        >
                            {{$tc(link.name + ".headline", 1)}}
                        </v-btn>
                        <v-flex xs12 py-1 px-1 text-center class="caption">
                            myongoingscalendar@gmail.com
                            <br>&copy; {{year > 2017 ? '2017 - ' + year : year}} <strong>MyOngoingsCalendar.eu</strong>
                        </v-flex>
                    </v-layout>
                </div>
            </template>
        </v-navigation-drawer>
        <v-app-bar
                v-if="$device.isMobile"
                fixed
                app
                dense
        >
                <span
                        @click.stop="$router.push('/')"
                        class="headline font-weight-medium"
                >
                    MOC
                </span>
            <v-spacer/>
            <v-btn
                    icon
                    :to="{ name: 'search', query: lastQuery }"
                    nuxt
            >
                <v-icon>{{icons.mdiMagnify}}</v-icon>
            </v-btn>
            <v-app-bar-nav-icon @click.stop="menu = !menu"/>
        </v-app-bar>
        <v-content>
            <nuxt keep-alive/>
        </v-content>
        <v-snackbar
                left
                :timeout="toast.timeout"
                :color="toast.color"
                v-model="toast.active"
        >
            {{$t("status." + toast.code)}}
            <v-btn
                    text
                    icon
                    @click.native="$store.dispatch('setToastActive', false)"
            >
                <v-icon>{{icons.mdiClose}}</v-icon>
            </v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
    import {
        mdiSettings,
        mdiInformationVariant,
        mdiAccountPlus,
        mdiLogin,
        mdiMagnify,
        mdiFormatListBulleted,
        mdiCalendarCheck,
        mdiHome,
        mdiPencil,
        mdiExitToApp,
        mdiClose,
        mdiGiftOutline
    } from '@mdi/js';
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            menu: false,
            year: new Date().getFullYear(),
            footerLinks: [
                {
                    name: 'terms',
                    link: '/terms'
                },
                {
                    name: 'privacy',
                    link: '/privacy'
                }
            ],
            donates: [
                {
                    name: 'BTC',
                    address: '1Cg4285GruhnSo8ZJoL7ZKvF78uhfzZvNB',
                    img: '/images/btc.png',
                    action: 'copy'
                },
                {
                    name: 'ZEC',
                    address: 't1UGGf7A4SmhwRKyv6G4m13FqXR9vQbHPW8',
                    img: '/images/zec.png',
                    action: 'copy'
                },
                {
                    name: 'DonorBox',
                    address: 'https://donorbox.org/myongoingscalendar',
                    img: '/images/donorbox.png',
                    action: 'url'
                },
                {
                    name: 'Patreon',
                    address: ' https://www.patreon.com/bePatron?u=10947418',
                    img: '/images/patreon.png',
                    action: 'url'
                },
            ],
            icons: {
                mdiSettings,
                mdiInformationVariant,
                mdiAccountPlus,
                mdiLogin,
                mdiMagnify,
                mdiFormatListBulleted,
                mdiCalendarCheck,
                mdiHome,
                mdiPencil,
                mdiExitToApp,
                mdiClose,
                mdiGiftOutline
            }
        }),
        head() {
            return {
                noscript: [
                    {innerHTML: 'This webapp requires JavaScript'}
                ],
                htmlAttrs: {
                    lang: this.settings.lang
                }
            }
        },
        methods: {
            logout() {
                this.$auth.logout()
                    .then(() => this.$toast.showToast({code: 11015}))
            },
            openUrl: url => window.open(url),
            copyToClipboard(name, address) {
                this.$copyText(address)
                    .then(() => this.$toast.showToast({code: 11016}))
            }
        },
        computed: {
            ...mapGetters([
                'user',
                'settings',
                'toast',
                'lastQuery',
                'admin',
                'authenticated'
            ])
        },
        created() {
            this.$vuetify.theme.dark = this.settings.dark
        }
    }
</script>
