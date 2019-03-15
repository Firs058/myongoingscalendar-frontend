<template>
    <v-layout align-center justify-space-between white wrap class="py-3 px-2 mb-4">
            <span class="pl-3 subheading">
            Share this on social media
          </span>
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
                <div class="d-flex">
                    <network network="email">
                        <v-avatar size="36px">
                            <font-awesome-icon icon="envelope" size="lg"/>
                        </v-avatar>
                    </network>
                    <network network="facebook">
                        <v-avatar size="36px">
                            <font-awesome-icon :icon="['fab', 'facebook']" size="lg"/>
                        </v-avatar>
                    </network>
                    <network network="line">
                        <v-avatar size="36px">
                            <font-awesome-icon :icon="['fab', 'line']" size="lg"/>
                        </v-avatar>
                    </network>
                    <network network="linkedin">
                        <v-avatar size="36px">
                            <font-awesome-icon :icon="['fab', 'linkedin']" size="lg"/>
                        </v-avatar>
                    </network>
                    <network network="odnoklassniki">
                        <v-avatar size="36px">
                            <font-awesome-icon :icon="['fab', 'odnoklassniki']" size="lg"/>
                        </v-avatar>
                    </network>
                    <network network="pinterest">
                        <v-avatar size="36px">
                            <font-awesome-icon :icon="['fab', 'pinterest']" size="lg"/>
                        </v-avatar>
                    </network>
                    <network network="reddit">
                        <v-avatar size="36px">
                            <font-awesome-icon :icon="['fab', 'reddit']" size="lg"/>
                        </v-avatar>
                    </network>
                    <network network="skype">
                        <v-avatar size="36px">
                            <font-awesome-icon :icon="['fab', 'skype']" size="lg"/>
                        </v-avatar>
                    </network>
                    <network network="telegram">
                        <v-avatar size="36px">
                            <font-awesome-icon :icon="['fab', 'telegram']" size="lg"/>
                        </v-avatar>
                    </network>
                    <network network="twitter">
                        <v-avatar size="36px">
                            <font-awesome-icon :icon="['fab', 'twitter']" size="lg"/>
                        </v-avatar>
                    </network>
                    <network network="vk">
                        <v-avatar size="36px">
                            <font-awesome-icon :icon="['fab', 'vk']" size="lg"/>
                        </v-avatar>
                    </network>
                    <network network="weibo">
                        <v-avatar size="36px">
                            <font-awesome-icon :icon="['fab', 'weibo']" size="lg"/>
                        </v-avatar>
                    </network>
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
    >>> .v-avatar {
        cursor: pointer;
    }
</style>
