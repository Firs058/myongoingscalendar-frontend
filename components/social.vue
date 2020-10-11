<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-layout
            align-center
            :justify-space-between="!$device.isMobile"
            :justify-center="$device.isMobile"
            row
            fill-height
            wrap
            white
            class="py-3 px-2 mb-4 mx-0"
    >
        <span class="pa-3 subheading">{{$t('social.share')}}</span>
        <div class="d-flex flex-wrap">
            <v-tooltip
                    v-for="network in networks"
                    :key="network.network"
                    top
                    :disabled="!$device.isDesktop"
            >
                <template v-slot:activator="{ on }">
                    <ShareNetwork
                            :network="network.name"
                            :url="url"
                            :title="title"
                            :description="description"
                            :hashtags="`${title},schedule,MyOngoingsCalendar`"
                            twitterUser="MyOngoingsCalendar"
                    >
                        <div class="pa-2">
                            <font-awesome-icon
                                    v-on="on"
                                    :color="network.color"
                                    :icon="network.icon"
                                    size="lg"
                            />
                        </div>
                    </ShareNetwork>
                </template>
                <span>{{$t('tooltips.share', [network.name])}}</span>
            </v-tooltip>
        </div>
    </v-layout>
</template>

<script>
    export default {
        data: () => ({
            networks: [
                {name: 'Email', color: 'black', icon: 'envelope'},
                {name: 'Facebook', color: '#3b5999', icon: {prefix: 'fab', iconName: 'facebook'}},
                {name: 'Line', color: '#00c300', icon: {prefix: 'fab', iconName: 'line'}},
                {name: 'Linkedin', color: '#0077B5', icon: {prefix: 'fab', iconName: 'linkedin'}},
                {name: 'Pinterest', color: '#bd081c', icon: {prefix: 'fab', iconName: 'pinterest'}},
                {name: 'Reddit', color: '#ff5700', icon: {prefix: 'fab', iconName: 'reddit'}},
                {name: 'Skype', color: '#00AFF0', icon: {prefix: 'fab', iconName: 'skype'}},
                {name: 'Telegram', color: '#0088cc', icon: {prefix: 'fab', iconName: 'telegram'}},
                {name: 'Twitter', color: '#55acee', icon: {prefix: 'fab', iconName: 'twitter'}},
                {name: 'Vk', color: '#4c75a3', icon: {prefix: 'fab', iconName: 'vk'}},
                {name: 'Weibo', color: '#df2029', icon: {prefix: 'fab', iconName: 'weibo'}},
            ]
        }),
        props: ['url', 'title', 'description']
    }
</script>

<style scoped>
    >>> div.pa-2 > span:hover {
        cursor: pointer;
    }
</style>
