<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container class="white">
    <v-row justify="center" no-gutters>
      <v-col cols="auto" xs="12" md="4" align-self="center">
        <span class="subheading">{{ $t('social.share') }}</span>
      </v-col>
      <v-col cols="auto" xs="12" md="8">
        <v-container>
          <v-row :justify="$device.isMobile ? 'center' : 'end'">
            <template v-for="network in networks">
              <v-tooltip
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
                    <v-btn icon>
                      <font-awesome-icon
                          v-on="on"
                          color="black"
                          :icon="network.icon"
                          size="lg"
                      />
                    </v-btn>
                  </ShareNetwork>
                </template>
                <span>{{ $t('tooltips.share', [network.name]) }}</span>
              </v-tooltip>
            </template>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    networks: [
      { name: 'Email', icon: 'envelope' },
      { name: 'Facebook', icon: { prefix: 'fab', iconName: 'facebook' } },
      { name: 'Line', icon: { prefix: 'fab', iconName: 'line' } },
      { name: 'Linkedin', icon: { prefix: 'fab', iconName: 'linkedin' } },
      { name: 'Pinterest', icon: { prefix: 'fab', iconName: 'pinterest' } },
      { name: 'Reddit', icon: { prefix: 'fab', iconName: 'reddit' } },
      { name: 'Skype', icon: { prefix: 'fab', iconName: 'skype' } },
      { name: 'Telegram', icon: { prefix: 'fab', iconName: 'telegram' } },
      { name: 'Twitter', icon: { prefix: 'fab', iconName: 'twitter' } },
      { name: 'Vk', icon: { prefix: 'fab', iconName: 'vk' } },
      { name: 'Weibo', icon: { prefix: 'fab', iconName: 'weibo' } },
    ]
  }),
  props: ['url', 'title', 'description']
};
</script>

<style scoped>
>>> div.pa-2 > span:hover {
  cursor: pointer;
}
</style>
