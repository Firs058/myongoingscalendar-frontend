<template>
    <v-container
            fluid
            :class="$device.isDesktop ? 'grid-list-lg pa-3' : 'pa-0'"
    >
        <calendar :calendar="calendar"/>
    </v-container>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        async asyncData({app, store}) {
            const data = await app.$axios.$post(
                store.state.settings.hideRepeats
                    ? 'api/anime_min'
                    : 'api/anime',
                {userTimezone: store.state.settings.timezone}
            );
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
            ...mapState({
                authenticated: state => state.user.authenticated,
                hideRepeats: state => state.settings.hideRepeats,
                timezone: state => state.settings.timezone,
                calendar: state => state.calendar
            }),
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
