<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-app>
        <v-navigation-drawer
                :class="{transparent : !$device.isMobile}"
                :color="`grey ${settings.dark ? 'darken-4' : 'lighten-4'}`"
                v-model="menu"
                :permanent="!$device.isMobile"
                :right="$device.isMobile"
                app
                floating
                fixed
                width="250"
        >
            <template v-slot:prepend>
                <div class="ma-3 text-center" :style="`cursor: pointer;`">
                    <div
                            @click.stop="$router.push('/')"
                            class="title"
                    >
                        MyOngoingsCalendar
                    </div>
                    <div
                            @click.stop="$router.push('/settings')"
                            :class="`grey--text text--darken ${settings.timezone.length > 20 ? 'caption' : 'subtitle-1'}`"
                    >
                        {{settings.timezone}}
                    </div>
                </div>
            </template>
            <v-list dense nav>
                <v-list-item
                        ripple
                        to="/"
                        nuxt
                >
                    <v-list-item-icon>
                        <v-icon>{{icons.mdiHome}}</v-icon>
                    </v-list-item-icon>
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
                    <v-list-item-icon>
                        <v-icon>{{icons.mdiCalendarCheck}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{$t('menu.my_calendar')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                        ripple
                        to="/list"
                        nuxt
                >
                    <v-list-item-icon>
                        <v-icon>{{icons.mdiFormatListBulleted}}</v-icon>
                    </v-list-item-icon>
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
                    <v-list-item-icon>
                        <v-icon>{{icons.mdiMagnify}}</v-icon>
                    </v-list-item-icon>
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
                    <v-list-item-icon>
                        <v-icon>{{icons.mdiLogin}}</v-icon>
                    </v-list-item-icon>
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
                    <v-list-item-icon>
                        <v-icon>{{icons.mdiAccountPlus}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{$t('menu.registration')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                        ripple
                        to="/about"
                        nuxt
                >
                    <v-list-item-icon>
                        <v-icon>{{icons.mdiInformationVariant}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{$t('menu.about')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                        ripple
                        to="/settings"
                        nuxt
                >
                    <v-list-item-icon>
                        <v-icon>{{icons.mdiSettings}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{$t('menu.settings')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                        ripple
                        to="/donate"
                        nuxt
                >
                    <v-list-item-icon>
                        <v-icon>{{icons.mdiGiftOutline}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{$t('menu.donate')}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                        v-if="authenticated && admin"
                        to="/admin"
                        nuxt
                >
                    <v-list-item-icon>
                        <v-icon>{{icons.mdiPencil}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Admin</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider v-if="authenticated"/>
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
                :color="`grey ${settings.dark ? 'darken-4' : 'lighten-4'}`"
                fixed
                app
                dense
        >
            <span @click.stop="$router.push('/')" class="headline font-weight-medium">MOC</span>
            <v-spacer/>
            <v-btn
                    icon
                    :to="{ name: 'search', query: lastQuery }"
                    nuxt
                    exact-active-class="undefined"
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
<style scoped>
    .v-btn--active:before {
        opacity: 0 !important;
    }
</style>
