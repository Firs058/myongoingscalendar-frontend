<template>
    <v-container article class="grid-list-lg pt-0">
        <calendar
                v-if="calendar.length"
                :calendar="calendar"
        />
        <v-layout v-else align-center justify-center text-xs-center>
            <v-flex xs12 class="mt-4">
                <v-alert type="info" :value="true">
                    {{$t("alerts.nothing_found")}}
                </v-alert>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        async asyncData({app, store}) {
            const data = await app.$axios.$post(
                store.getters.hideRepeats
                    ? 'api/user/my_calendar_min'
                    : 'api/user/my_calendar',
                {userTimezone: store.getters.timezone}
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
        computed:
            mapGetters([
                'authenticated',
                'hideRepeats',
                'timezone'
            ]),
        middleware: 'authenticated'
    }
</script>
