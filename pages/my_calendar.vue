<template>
    <v-container
            fluid
            :class="$device.isDesktop ? 'grid-list-lg pa-3' : 'pa-0'"
    >
        <calendar
                v-if="calendar.length"
                :calendar="calendar"
        />
        <v-alert
                v-else
                type="info"
                :value="true"
        >
            {{$t("alerts.nothing_found")}}
        </v-alert>
    </v-container>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        async asyncData({app, store}) {
            const data = await app.$axios.$post(
                store.state.settings.hideRepeats
                    ? 'api/my_anime_min'
                    : 'api/my_anime',
                {userTimezone: store.state.settings.timezone}
            );
            return {calendar: data.payload}
        },
        head() {
            return {
                title: this.$t("meta_info.my_calendar.title", ['| MyOngoingsCalendar']),
                meta: [
                    {
                        name: 'description',
                        content: this.$t("meta_info.my_calendar.meta.description")
                    }
                ]
            }
        },
        computed: mapState({
            authenticated: state => state.user.authenticated,
            hideRepeats: state => state.settings.hideRepeats,
            timezone: state => state.settings.timezone
        }),
        middleware: 'authenticated'
    }
</script>
