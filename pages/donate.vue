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
                                    <img :src="donate.img"/>
                                </v-avatar>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title v-text="donate.name"/>
                            </v-list-item-content>
                            <v-chip v-if="donate.prefer" color="primary" pill>{{$t('donate.prefer')}}</v-chip>
                            <v-list-item-action>
                                <v-btn icon>
                                    <v-icon>{{donate.icon}}</v-icon>
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
    import {
        mdiContentCopy,
        mdiArrowRight
    } from '@mdi/js';

    export default {
        data: () => ({
            donates: [
                {
                    name: 'Patreon',
                    address: ' https://www.patreon.com/bePatron?u=10947418',
                    img: '/images/patreon.png',
                    action: 'url',
                    prefer: true,
                    icon: mdiArrowRight
                },
                {
                    name: 'DonorBox',
                    address: 'https://donorbox.org/myongoingscalendar',
                    img: '/images/donorbox.png',
                    action: 'url',
                    prefer: true,
                    icon: mdiArrowRight
                },
                {
                    name: 'ZEC',
                    address: 't1UGGf7A4SmhwRKyv6G4m13FqXR9vQbHPW8',
                    img: '/images/zec.png',
                    action: 'copy',
                    prefer: false,
                    icon: mdiContentCopy
                },
                {
                    name: 'BTC',
                    address: '1Cg4285GruhnSo8ZJoL7ZKvF78uhfzZvNB',
                    img: '/images/btc.png',
                    action: 'copy',
                    prefer: false,
                    icon: mdiContentCopy
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
        methods: {
            openUrl: url => window.open(url),
            copyToClipboard(name, address) {
                this.$copyText(address)
                    .then(() => this.$toast.showToast({code: 11016}))
            }
        }
    }
</script>
