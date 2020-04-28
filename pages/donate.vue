<template>
    <v-container fill-height article :class="$device.isMobile ? 'pa-0' : 'grid-list-lg pt-0'">
        <v-layout align-center justify-center text-center>
            <v-flex xs12 sm10 md6 lg4 xl3>
                <h1>{{$t('donate.headline')}}</h1>
                <v-card color="transparent" flat>
                    <v-list color="transparent">
                        <v-list-item
                                v-for="donate in donates"
                                :key="donate.name"
                                @click="donate.action === 'url' ? openUrl(donate.address) : copyToClipboard(donate.name, donate.address)"
                        >
                            <v-list-item-action>
                                <v-avatar>
                                    <img :src="webpIsSupported ? donate.img.webp : donate.img.png" :alt="donate.name"/>
                                </v-avatar>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title v-text="donate.name"/>
                            </v-list-item-content>
                            <v-chip
                                    v-if="donate.prefer"
                                    pill
                                    :dark="settings.dark"
                            >
                                {{$t('donate.prefer')}}
                            </v-chip>
                            <v-list-item-action>
                                <v-btn icon aria-label="donate">
                                    <v-icon>{{icons[donate.icon]}}</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {icons} from '../mixins/icons'
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            donates: [
                {
                    name: 'Patreon',
                    address: ' https://www.patreon.com/bePatron?u=10947418',
                    img: {
                        png: '/images/patreon.png',
                        webp: '/images/webp/patreon.webp',
                    },
                    action: 'url',
                    prefer: true,
                    icon: 'mdiArrowRight'
                },
                {
                    name: 'DonorBox',
                    address: 'https://donorbox.org/myongoingscalendar',
                    img: {
                        png: '/images/donorbox.png',
                        webp: '/images/webp/donorbox.webp',
                    },
                    action: 'url',
                    prefer: true,
                    icon: 'mdiArrowRight'
                },
                {
                    name: 'ZEC',
                    address: 't1UGGf7A4SmhwRKyv6G4m13FqXR9vQbHPW8',
                    img: {
                        png: '/images/zec.png',
                        webp: '/images/webp/zec.webp',
                    },
                    action: 'copy',
                    prefer: false,
                    icon: 'mdiContentCopy'
                },
                {
                    name: 'BTC',
                    address: '1Cg4285GruhnSo8ZJoL7ZKvF78uhfzZvNB',
                    img: {
                        png: '/images/btc.png',
                        webp: '/images/webp/btc.webp',
                    },
                    action: 'copy',
                    prefer: false,
                    icon: 'mdiContentCopy'
                }
            ]
        }),
        head() {
            return {
                title: this.$t("meta_info.donate.title", ['| MyOngoingsCalendar']),
                meta: [
                    {
                        name: 'description',
                        content: this.$t("meta_info.donate.meta.description", ['MyOngoingsCalendar'])
                    }
                ]
            }
        },
        computed: {
            ...mapGetters([
                'settings',
                'webpIsSupported'
            ])
        },
        mixins: [
            icons
        ],
        methods: {
            openUrl: url => window.open(url),
            copyToClipboard(name, address) {
                this.$copyText(address)
                    .then(() => this.$toast.showToast({code: 11016}))
            }
        }
    }
</script>
