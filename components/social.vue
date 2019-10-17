<template>
    <v-layout align-center justify-space-between row fill-height wrap white class="py-3 px-2 mb-4 mx-0">
        <span class="pl-3 subheading">Share this on social media</span>
        <no-ssr>
            <social-sharing
                    :url="url"
                    :title="description + ' schedule on MyOngoingsCalendar'"
                    :description="description + ' schedule on MyOngoingsCalendar'"
                    :quote="description + ' schedule on MyOngoingsCalendar'"
                    :hashtags="description + ', schedule, MyOngoingsCalendar'"
                    twitter-user="MyOngoingsCalendar"
                    inline-template
            >
                <div class="social_flex">
                    <div :style="$device.isMobile ? 'padding: 3px' : 'padding: 10px'">
                        <network network="email">
                            <font-awesome-icon icon="envelope" size="lg"/>
                        </network>
                    </div>
                    <div :style="$device.isMobile ? 'padding: 3px' : 'padding: 10px'">
                        <network network="facebook">
                            <font-awesome-icon :icon="['fab', 'facebook']" size="lg"/>
                        </network>
                    </div>
                    <div :style="$device.isMobile ? 'padding: 3px' : 'padding: 10px'">
                        <network network="line">
                            <font-awesome-icon :icon="['fab', 'line']" size="lg"/>
                        </network>
                    </div>
                    <div :style="$device.isMobile ? 'padding: 3px' : 'padding: 10px'">
                        <network network="linkedin">
                            <font-awesome-icon :icon="['fab', 'linkedin']" size="lg"/>
                        </network>
                    </div>
                    <div :style="$device.isMobile ? 'padding: 3px' : 'padding: 10px'">
                        <network network="odnoklassniki">
                            <font-awesome-icon :icon="['fab', 'odnoklassniki']" size="lg"/>
                        </network>
                    </div>
                    <div :style="$device.isMobile ? 'padding: 3px' : 'padding: 10px'">
                        <network network="pinterest">
                            <font-awesome-icon :icon="['fab', 'pinterest']" size="lg"/>
                        </network>
                    </div>
                    <div :style="$device.isMobile ? 'padding: 3px' : 'padding: 10px'">
                        <network network="reddit">
                            <font-awesome-icon :icon="['fab', 'reddit']" size="lg"/>
                        </network>
                    </div>
                    <div :style="$device.isMobile ? 'padding: 3px' : 'padding: 10px'">
                        <network network="skype">
                            <font-awesome-icon :icon="['fab', 'skype']" size="lg"/>
                        </network>
                    </div>
                    <div :style="$device.isMobile ? 'padding: 3px' : 'padding: 10px'">
                        <network network="telegram">
                            <font-awesome-icon :icon="['fab', 'telegram']" size="lg"/>
                        </network>
                    </div>
                    <div :style="$device.isMobile ? 'padding: 3px' : 'padding: 10px'">
                        <network network="twitter">
                            <font-awesome-icon :icon="['fab', 'twitter']" size="lg"/>
                        </network>
                    </div>
                    <div :style="$device.isMobile ? 'padding: 3px' : 'padding: 10px'">
                        <network network="vk">
                            <font-awesome-icon :icon="['fab', 'vk']" size="lg"/>
                        </network>
                    </div>
                    <div :style="$device.isMobile ? 'padding: 3px' : 'padding: 10px'">
                        <network network="weibo">
                            <font-awesome-icon :icon="['fab', 'weibo']" size="lg"/>
                        </network>
                    </div>
                </div>
            </social-sharing>
        </no-ssr>
    </v-layout>
</template>

<script>
    export default {
        props: ['url', 'description']
    }
</script>
<style scoped>
    >>> .social_flex {
        cursor: pointer;
        display: flex;
        justify-content: flex-end;
    }

    >>> .social_item {
        padding: 10px;
    }
</style>
