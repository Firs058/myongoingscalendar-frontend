<template>
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
        <client-only>
            <social-sharing
                    :url="url"
                    :title="description + ' schedule on MyOngoingsCalendar'"
                    :description="description + ' schedule on MyOngoingsCalendar'"
                    :quote="description + ' schedule on MyOngoingsCalendar'"
                    :hashtags="description + ', schedule, MyOngoingsCalendar'"
                    twitter-user="MyOngoingsCalendar"
                    inline-template
            >
                <div class="d-flex flex-wrap">
                    <div class="pa-2">
                        <network network="email">
                            <font-awesome-icon icon="envelope" size="lg"/>
                        </network>
                    </div>
                    <div class="pa-2">
                        <network network="facebook">
                            <font-awesome-icon :icon="['fab', 'facebook']" size="lg"/>
                        </network>
                    </div>
                    <div class="pa-2">
                        <network network="line">
                            <font-awesome-icon :icon="['fab', 'line']" size="lg"/>
                        </network>
                    </div>
                    <div class="pa-2">
                        <network network="linkedin">
                            <font-awesome-icon :icon="['fab', 'linkedin']" size="lg"/>
                        </network>
                    </div>
                    <div class="pa-2">
                        <network network="odnoklassniki">
                            <font-awesome-icon :icon="['fab', 'odnoklassniki']" size="lg"/>
                        </network>
                    </div>
                    <div class="pa-2">
                        <network network="pinterest">
                            <font-awesome-icon :icon="['fab', 'pinterest']" size="lg"/>
                        </network>
                    </div>
                    <div class="pa-2">
                        <network network="reddit">
                            <font-awesome-icon :icon="['fab', 'reddit']" size="lg"/>
                        </network>
                    </div>
                    <div class="pa-2">
                        <network network="skype">
                            <font-awesome-icon :icon="['fab', 'skype']" size="lg"/>
                        </network>
                    </div>
                    <div class="pa-2">
                        <network network="telegram">
                            <font-awesome-icon :icon="['fab', 'telegram']" size="lg"/>
                        </network>
                    </div>
                    <div class="pa-2">
                        <network network="twitter">
                            <font-awesome-icon :icon="['fab', 'twitter']" size="lg"/>
                        </network>
                    </div>
                    <div class="pa-2">
                        <network network="vk">
                            <font-awesome-icon :icon="['fab', 'vk']" size="lg"/>
                        </network>
                    </div>
                    <div class="pa-2">
                        <network network="weibo">
                            <font-awesome-icon :icon="['fab', 'weibo']" size="lg"/>
                        </network>
                    </div>
                </div>
            </social-sharing>
        </client-only>
    </v-layout>
</template>

<script>
    export default {
        props: ['url', 'description']
    }
</script>
<style scoped>
    >>> div.pa-2 > span:hover {
        cursor: pointer;
    }
</style>
