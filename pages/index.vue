<template>
    <v-container article :class="$device.isMobile ? 'pa-0' : 'grid-list-lg pt-0'">
        <calendar :calendar="calendar"/>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        async asyncData({app, store}) {
            const data = await app.$axios.$post('api/public/calendar', {
                timezone: store.getters.settings.timezone,
                hideRepeats: store.getters.settings.hideRepeats
            });
            store.dispatch('setCalendar', data.payload)
        },
        data: () => ({
            year: new Date().getFullYear()
        }),
        head() {
            return {
                title: this.globalTitle,
                meta: [
                    {
                        name: 'description',
                        content: this.globalDescription
                    },
                    {
                        property: 'og:title',
                        content: this.globalTitle
                    },
                    {
                        property: 'og:description',
                        content: this.globalDescription
                    },
                    {
                        property: 'og:type',
                        content: 'website'
                    },
                    {
                        property: 'og:url',
                        content: this.globalUrl
                    },
                    {
                        property: 'og:image',
                        content: this.globalImage
                    },
                    {
                        name: 'twitter:card',
                        content: 'summary'
                    },
                    {
                        name: 'twitter:site',
                        content: '@myongoingscale1'
                    },
                    {
                        name: 'twitter:title',
                        content: this.globalTitle
                    },
                    {
                        name: 'twitter:description',
                        content: this.globalDescription
                    },
                    {
                        property: 'twitter:image',
                        content: this.globalImage
                    }
                ]
            }
        },
        computed: {
            ...mapGetters([
                'authenticated',
                'calendar'
            ]),
            globalUrl() {
                return `${process.env.baseUrl}${this.$route.fullPath}`
            },
            globalImage() {
                return `${process.env.baseUrl}/images/empty.png`
            },
            globalDescription() {
                return this.$t("meta_info.home.meta.description", [this.year])
            },
            globalTitle() {
                return this.$t("meta_info.home.title", ['| MyOngoingsCalendar'])
            }
        }
    }
</script>
