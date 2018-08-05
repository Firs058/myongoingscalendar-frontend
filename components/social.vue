<template>
    <no-ssr>
        <v-menu>
            <v-tooltip
                    top
                    slot="activator"
            >
                <v-btn
                        outline
                        flat
                        slot="activator"
                >
                    {{$t('buttons.share')}}
                </v-btn>
                <span>{{$t('tooltips.share')}}</span>
            </v-tooltip>
            <social-sharing
                    :url="url"
                    :title="description + ' schedule on MyOngoingsCalendar'"
                    :description="description + ' schedule on MyOngoingsCalendar'"
                    :quote="description + ' schedule on MyOngoingsCalendar'"
                    :hashtags="description + ', schedule, MyOngoingsCalendar'"
                    twitter-user="MyOngoingsCalendar"
                    inline-template
            >
                <v-list>
                    <network network="email">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <font-awesome-icon icon="envelope" size="lg"/>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Email</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </network>
                    <network network="facebook">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <font-awesome-icon :icon="['fab', 'facebook']" size="lg"/>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Facebook</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </network>
                    <network network="googleplus">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <font-awesome-icon :icon="['fab', 'google']" size="lg"/>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Google +</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </network>
                    <network network="line">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <font-awesome-icon :icon="['fab', 'line']" size="lg"/>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Line</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </network>
                    <network network="linkedin">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <font-awesome-icon :icon="['fab', 'linkedin']" size="lg"/>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>LinkedIn</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </network>
                    <network network="odnoklassniki">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <font-awesome-icon :icon="['fab', 'odnoklassniki']" size="lg"/>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Odnoklassniki</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </network>
                    <network network="pinterest">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <font-awesome-icon :icon="['fab', 'pinterest']" size="lg"/>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Pinterest</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </network>
                    <network network="reddit">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <font-awesome-icon :icon="['fab', 'reddit']" size="lg"/>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Reddit</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </network>
                    <network network="skype">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <font-awesome-icon :icon="['fab', 'skype']" size="lg"/>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Skype</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </network>
                    <network network="telegram">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <font-awesome-icon :icon="['fab', 'telegram']" size="lg"/>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Telegram</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </network>
                    <network network="twitter">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <font-awesome-icon :icon="['fab', 'twitter']" size="lg"/>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Twitter</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </network>
                    <network network="vk">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <font-awesome-icon :icon="['fab', 'vk']" size="lg"/>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>VKontakte</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </network>
                    <network network="weibo">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <font-awesome-icon :icon="['fab', 'weibo']" size="lg"/>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Weibo</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </network>
                    <network network="whatsapp">
                        <v-list-tile @click="">
                            <v-list-tile-action>
                                <font-awesome-icon :icon="['fab', 'whatsapp']" size="lg"/>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Whatsapp</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </network>
                </v-list>
            </social-sharing>
        </v-menu>
    </no-ssr>
</template>

<script>
    export default {
        data: () => ({}),
        props: ['url', 'description']
    }
</script>
