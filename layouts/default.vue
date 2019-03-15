<template>
    <v-app
            :dark="dark"
            :light="!dark"
    >
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
            <v-list class="layout column fill-height">
                <div class="mb-4 mt-2"
                     :style="`cursor: pointer;`"
                     @click.stop="$router.push('/')"
                >
                    <div class="title text-xs-center mx-3">MyOngoingsCalendar</div>
                    <div class="grey--text text-xs-center mx-3">{{timezone}}</div>
                </div>
                <v-list-tile avatar v-if="authenticated">
                    <v-list-tile-avatar>
                        <img :src="settings.avatar"/>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-sub-title>{{$t('menu.logged_as')}}</v-list-tile-sub-title>
                        <v-list-tile-title>{{user.email}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                        ripple
                        to="/"
                        nuxt
                >
                    <v-list-tile-action>
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{$t('menu.home')}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                        ripple
                        v-if="authenticated"
                        to="/my_calendar"
                        nuxt
                >
                    <v-list-tile-action>
                        <v-icon>event_available</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{$t('menu.my_calendar')}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                        ripple
                        to="/list"
                        nuxt
                >
                    <v-list-tile-action>
                        <v-icon>list</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{$t('menu.ongoings_list')}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                        ripple
                        :to="{ name: 'search', query: lastQuery}"
                        :disabled="$route.name === 'search'"
                        nuxt
                >
                    <v-list-tile-action>
                        <v-icon>search</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{$t('menu.search')}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                        ripple
                        v-if="!authenticated"
                        to="/login"
                        nuxt
                >
                    <v-list-tile-action>
                        <v-icon>input</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{$t('menu.login')}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                        ripple
                        v-if="!authenticated"
                        to="/registration"
                        nuxt
                >
                    <v-list-tile-action>
                        <v-icon>add</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{$t('menu.registration')}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                        ripple
                        to="/about"
                        nuxt
                >
                    <v-list-tile-action>
                        <v-icon>info</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{$t('menu.about')}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                        ripple
                        to="/settings"
                        nuxt
                >
                    <v-list-tile-action>
                        <v-icon>settings</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{$t('menu.settings')}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-group
                        v-for="item in 1"
                        :value="item.active"
                        :key="item.name"
                        prepend-icon="attach_money"
                        no-action
                >
                    <v-list-tile
                            ripple
                            slot="activator"
                    >
                        <v-list-tile-content>
                            <v-list-tile-title>{{$t('menu.donate')}}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile
                            v-for="donate in donates"
                            :key="donate.name"
                            @click="donate.action === 'url' ? openUrl(donate.address) : copyToClipboard(donate.name, donate.address)"
                    >
                        <v-list-tile-action>
                            <v-avatar
                                    tile
                                    size="36px"
                                    slot="activator"
                            >
                                <img :src="donate.img"/>
                            </v-avatar>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title v-text="donate.name"/>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
                <v-list-tile
                        ripple
                        v-if="authenticated"
                        @click.stop="logout()"
                >
                    <v-list-tile-action>
                        <v-icon>exit_to_app</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{$t('menu.exit')}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <div class="my-auto"/>
                <div class="mb-2 mt-4">
                    <v-layout row wrap justify-center>
                        <v-btn
                                class="caption"
                                color="primary"
                                flat
                                v-for="link in footerLinks"
                                :key="link.name"
                                :to="link.link"
                                small
                                nuxt
                        >
                            {{$tc(link.name + ".headline", 1)}}
                        </v-btn>
                        <v-flex xs12 py-1 px-1 text-xs-center class="caption">
                            myongoingscalendar@gmail.com
                            <br>&copy; {{year > 2017 ? '2017 - ' + year : year}} <strong>MyOngoingsCalendar.eu</strong>
                        </v-flex>
                    </v-layout>
                </div>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar
                v-if="$device.isMobile"
                fixed
                app
                :extended="extended"
                dense
                prominent
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
                    :to="{ name: 'search', query: lastQuery}"
                    nuxt
                    :disabled="$route.name === 'search'"
            >
                <v-icon>search</v-icon>
            </v-btn>
            <v-toolbar-side-icon @click.stop="menu = !menu"/>
            <v-layout
                    align-center
                    justify-center
                    text-xs-center
                    slot="extension"
                    v-if="extended"
            >
                <v-flex xs10 sm10 md8 lg6 xl6>
                    <v-text-field
                            v-if="$route.name === 'list'"
                            v-model="searchListInput"
                            :label="$t('inputs.search.label.2')"
                            prepend-icon="filter_list"
                            hide-details
                            clearable
                            single-line
                            class="pa-0"
                    />
                    <v-text-field
                            v-else-if="$route.name === 'search'"
                            v-model="searchGlobalInput"
                            :label="$t('inputs.search.label.1')"
                            prepend-icon="search"
                            hide-details
                            append-icon="filter_list"
                            @click:append="()=> $store.dispatch('setSearchGlobalExtension', true)"
                            single-line
                            class="pa-0"
                    />
                </v-flex>
            </v-layout>
        </v-toolbar>
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
                    flat
                    icon
                    @click.native="$store.dispatch('setToastActive', false)"
            >
                <v-icon>close</v-icon>
            </v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
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
            ]
        }),
        head() {
            return {
                noscript: [
                    {innerHTML: 'This webapp requires JavaScript'}
                ],
                htmlAttrs: {
                    lang: this.lang
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
                'dark',
                'user',
                'settings',
                'toast',
                'lang',
                'extension',
                'lastQuery',
                'timezone',
                'admin',
                'authenticated'
            ]),
            extended() {
                return this.$route.name === 'list' || this.$route.name === 'search'
            },
            searchListInput: {
                get() {
                    return this.$store.state.search.list.input
                },
                set(value) {
                    return this.$store.dispatch('setSearchListInput', value)
                }
            },
            searchGlobalInput: {
                get() {
                    return this.$store.state.search.global.input
                },
                set(value) {
                    return this.$store.dispatch('setSearchGlobalInput', value)
                }
            }
        }
    }
</script>
