<template>
  <calendar :calendar="calendar" :showAll="true"/>
</template>

<script>
export default {
  async asyncData({ app, store: { getters: { settings: { timezone, hideRepeats } } } }) {
    const params = { timezone, hideRepeats };
    const { calendar } = await app.$anime.getCalendar({ personal: true, params });
    return { calendar };
  },
  head() {
    return {
      title: this.$t('meta_info.my_calendar.title', ['| MyOngoingsCalendar']),
      meta: [
        {
          name: 'description',
          content: this.$t('meta_info.my_calendar.meta.description')
        },
        {
          name: 'robots',
          content: 'noindex'
        }
      ]
    };
  },
  middleware: 'authenticated'
};
</script>
