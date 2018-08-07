<template>
    <v-app
            :dark="dark"
            :light="!dark"
    >
        <v-navigation-drawer
                v-if="!$device.isDesktop"
                v-model="menu"
                temporary
                app
                floating
                fixed
                right
        >
            <v-list v-if="user.authenticated">
                <v-list-tile avatar>
                    <v-list-tile-avatar>
                        <img :src="user.avatar"/>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-sub-title>{{$t('menu.logged_as')}}</v-list-tile-sub-title>
                        <v-list-tile-title>{{user.email}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
            <v-divider/>
            <v-list>
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
                        v-if="user.authenticated"
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
                        v-if="!user.authenticated"
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
                        v-if="!user.authenticated"
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
                        v-if="user.authenticated"
                        @click.stop="logout()"
                >
                    <v-list-tile-action>
                        <v-icon>exit_to_app</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{$t('menu.exit')}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar
                fixed
                app
                :extended="searchListPanel || searchGlobalPanel"
                :dense="!$device.isDesktop"
                prominent
        >
            <div
                    @click.stop="$router.push('/')"
                    :style="`cursor: pointer;`"
                    class="headline font-weight-medium"
                    v-text="$device.isDesktop ? 'MyOngoingsCalendar' : 'MOC'"
            />
            <v-spacer/>
            <v-toolbar-items v-if="$device.isDesktop">
                <v-btn
                        flat
                        ripple
                        to="/"
                        nuxt
                >
                    {{$t('menu.home')}}
                </v-btn>
                <v-btn
                        flat
                        ripple
                        v-if="user.authenticated"
                        to="/my_calendar"
                        nuxt
                >
                    {{$t('menu.my_calendar')}}
                </v-btn>
                <v-btn
                        flat
                        ripple
                        to="/list"
                        nuxt
                >
                    {{$t('menu.ongoings_list')}}
                </v-btn>
                <v-btn
                        flat
                        ripple
                        v-if="!user.authenticated"
                        to="/login"
                        nuxt
                >
                    {{$t('menu.login')}}
                </v-btn>
                <v-btn
                        flat
                        ripple
                        v-if="!user.authenticated"
                        to="/registration"
                        nuxt
                >
                    {{$t('menu.registration')}}
                </v-btn>
                <v-btn
                        flat
                        ripple
                        to="/about"
                        nuxt
                >
                    {{$t('menu.about')}}
                </v-btn>
                <v-btn
                        flat
                        ripple
                        v-if="!user.authenticated"
                        to="/settings"
                        nuxt
                >
                    {{$t('menu.settings')}}
                </v-btn>
                <v-menu>
                    <v-btn
                            flat
                            ripple
                            slot="activator"
                    >
                        {{$t('menu.donate')}}
                        <v-icon dark>arrow_drop_down</v-icon>
                    </v-btn>
                    <v-list>
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
                    </v-list>
                </v-menu>
                <v-menu v-if="user.authenticated">
                    <v-btn
                            flat
                            ripple
                            slot="activator"
                    >
                        <v-avatar>
                            <img :src="user.avatar"/>
                            <v-icon dark>arrow_drop_down</v-icon>
                        </v-avatar>
                    </v-btn>
                    <v-navigation-drawer
                            floating
                            :width="null"
                            class="pa-0"
                    >
                        <v-list>
                            <v-list-tile avatar>
                                <v-list-tile-avatar>
                                    <img :src="user.avatar"/>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-sub-title>{{$t('menu.logged_as')}}</v-list-tile-sub-title>
                                    <v-list-tile-title>{{user.email}}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                        <v-divider/>
                        <v-list>
                            <v-list-tile
                                    v-if="user.authenticated && user.role === 'admin'"
                                    to="/admin"
                                    nuxt
                            >
                                <v-list-tile-action>
                                    <v-icon>edit</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>Admin</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile
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
                            <v-list-tile @click="logout()">
                                <v-list-tile-action>
                                    <v-icon>exit_to_app</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{$t('menu.exit')}}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-navigation-drawer>
                </v-menu>
            </v-toolbar-items>
            <v-spacer v-if="$device.isDesktop"/>
            <v-btn
                    icon
                    to="/search"
                    nuxt
                    :disabled="searchGlobalPanel"
            >
                <v-icon>search</v-icon>
            </v-btn>
            <v-toolbar-side-icon
                    @click.stop="menu = !menu"
                    v-if="!$device.isDesktop"
            />
            <v-layout
                    align-center
                    justify-center
                    text-xs-center
                    slot="extension"
                    v-if="searchListPanel || searchGlobalPanel"
            >
                <v-flex xs10 sm10 md8 lg6 xl6>
                    <v-text-field
                            v-if="searchListPanel"
                            v-model="searchListInput"
                            :label="$t('inputs.search.label.2')"
                            prepend-icon="filter_list"
                            hide-details
                            clearable
                            single-line
                    />
                    <v-text-field
                            v-else-if="searchGlobalPanel"
                            v-model="searchGlobalInput"
                            :label="$t('inputs.search.label.1')"
                            prepend-icon="search"
                            hide-details
                            clearable
                            single-line
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
        <v-footer height="auto">
            <v-layout row wrap justify-center>
                <v-btn
                        color="primary"
                        flat
                        v-for="link in footerLinks"
                        :key="link.name"
                        :to="link.link"
                        nuxt
                >
                    {{$tc(link.name + ".headline", 1)}}
                </v-btn>
                <v-flex xs12 py-3 text-xs-center>
                    &copy; {{year > 2017 ? '2017 - ' + year : year}} <strong>MyOngoingsCalendar.eu</strong>
                </v-flex>
            </v-layout>
        </v-footer>
    </v-app>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        data: () => ({
            menu: false,
            year: new Date().getFullYear(),
            footerLinks: [
                {
                    name: 'terms',
                    link: '/terms'
                }, {
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
            ...mapState({
                searchListPanel: state => state.search.list.panel,
                searchGlobalPanel: state => state.search.global.panel,
                dark: state => state.settings.dark,
                user: state => state.user,
                toast: state => state.toast,
                lang: state => state.settings.lang
            }),
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
