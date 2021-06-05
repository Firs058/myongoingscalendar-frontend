<template>
  <calendar :calendar="calendar"/>
</template>

<script>
import { deepFreeze } from '~/helpers/utils';

export default {
  async asyncData({ app, store: { getters: { settings: { timezone, hideRepeats } } } }) {
    const params = { timezone, hideRepeats };
    const { calendar } = await app.$anime.getCalendar({ personal: false, params });
    return {
      calendar: deepFreeze(calendar),
      year: new Date().getFullYear()
    };
  },
  head() {
    return {
      title: this.globalTitle,
      meta: [
        {
          name: 'description',
          content: this.globalDescription
        },
        {
          property: 'og:title',
          content: this.globalTitle
        },
        {
          property: 'og:description',
          content: this.globalDescription
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:url',
          content: this.globalUrl
        },
        {
          property: 'og:image',
          content: this.globalImage
        },
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:site',
          content: '@myongoingscale1'
        },
        {
          name: 'twitter:title',
          content: this.globalTitle
        },
        {
          name: 'twitter:description',
          content: this.globalDescription
        },
        {
          property: 'twitter:image',
          content: this.globalImage
        }
      ]
    };
  },
  computed: {
    globalUrl() {
      return `${process.env.BASE_URL}${this.$route.fullPath}`;
    },
    globalImage() {
      return `${process.env.BASE_URL}${this.$store.getters.webpIsSupported ? '/images/webp/empty.webp' : '/images/empty.png'}`;
    },
    globalDescription() {
      return this.$t('meta_info.home.meta.description', [this.year]);
    },
    globalTitle() {
      return this.$t('meta_info.home.title', ['| MyOngoingsCalendar']);
    }
  }
};
</script>
