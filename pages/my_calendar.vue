<template>
    <v-container article :class="$device.isMobile ? 'py-0' : 'grid-list-lg pt-0'">
        <calendar
                v-if="calendar.length"
                :calendar="calendar"
                :showAll="true"
        />
        <v-layout v-else align-center justify-center text-center>
            <v-flex xs12 class="mt-4">
                <v-alert tile type="info" :value="true">
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
            const data = await app.$axios.$post('api/user/calendar', {
                timezone: store.getters.settings.timezone,
                hideRepeats: store.getters.settings.hideRepeats
            });
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
                'authenticated'
            ]),
        middleware: 'authenticated'
    }
</script>
