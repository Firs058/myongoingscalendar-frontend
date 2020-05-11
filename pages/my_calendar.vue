<template>
    <v-container
            article
            :class="{'grid-list-lg pt-0': !$device.isMobile, 'py-0': $device.isMobile}"
    >
        <calendar :calendar="calendar" :showAll="true"/>
        <v-layout v-if="!calendar.length" align-center justify-center text-center>
            <v-flex xs12 class="mt-4">
                <v-alert
                        tile
                        type="info"
                        :value="true"
                        class="mt-4"
                >
                    {{$t("alerts.nothing_found")}}
                </v-alert>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        async asyncData({app, store}) {
            const params = {
                timezone: store.getters.settings.timezone,
                hideRepeats: store.getters.settings.hideRepeats
            };
            const {data} = await app.$anime.userApi('calendar', params);
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
        middleware: 'authenticated'
    }
</script>
