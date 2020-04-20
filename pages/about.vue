<template>
  <v-container
    fluid
    fill-height
    :class="$device.isDesktop ? 'grid-list-lg' : 'pa-0'"
  >
    <v-layout align-center justify-center text-center>
      <v-flex xs12 sm12 md8 lg6 xl6>
        <v-card color="transparent" flat>
          <v-card-text>
            Hi. This application is free of charge, not for commercial profit, ad-free and by fan for fans. If you like
            it and want support development (domain, server and personal time suddenly monthly costs money), then donate
            button you can found in menu. Do not forget to recommend to friends!
          </v-card-text>
          <v-card-text>
            Have questions/suggestions? - myongoingscalendar@gmail.com or leave feedback
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    head() {
      return {
        title: this.$t("meta_info.about.title", ['| MyOngoingsCalendar']),
        meta: [
          {
            name: 'description',
            content: this.$t("meta_info.about.meta.description", ['MyOngoingsCalendar'])
          }
        ]
      }
    }
  }
</script>
