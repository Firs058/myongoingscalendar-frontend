<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
            v-model="filterInput"
            :label="$t('inputs.search.label.2')"
            :prepend-inner-icon="icons.mdiFilterVariant"
            hide-details
            clearable
            solo
            flat
        />
      </v-col>
    </v-row>
    <template
        v-if="!ongoingsListIsEmpty"
        v-for="row in filteredOngoingsList.slice(0, showCount)"
    >
      <v-row :key="row.dateStart">
        <v-col cols="12" class="py-0">
          <v-subheader>{{ row.dateStart }}</v-subheader>
        </v-col>
        <template v-for="anime in row.animes">
          <v-col
              :key="anime.tid"
              xs="12"
              sm="6"
              :md="$device.isDesktop ? 4 : undefined"
              lg="3"
              :xl="$device.isDesktop ? 2 : undefined"
          >
            <card :anime="anime" no-start/>
          </v-col>
        </template>
      </v-row>
    </template>
    <v-row v-if="!Object.keys(filteredOngoingsList).length">
      <v-col cols="12">
        <v-alert
            border="left"
            colored-border
            tile
            type="info"
            :value="true"
        >
          {{ $t('alerts.nothing_found') }}
        </v-alert>
      </v-col>
    </v-row>
    <client-only>
      <infinite-loading
          v-if="!ongoingsListIsEmpty"
          @infinite="infiniteHandler"
          :distance="500"
      />
    </client-only>
  </v-container>
</template>

<script>
import { icons } from '~/mixins/icons';
import { deepFreeze } from '~/helpers/utils';

export default {
  data: () => ({
    showCount: 3,
    filterInput: ''
  }),
  async asyncData({ app, store: { getters: { authenticated } } }) {
    const { ongoingsList } = await app.$anime.getOngoingsList({ authenticated });
    return { ongoingsList: deepFreeze(ongoingsList) };
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
  methods: {
    infiniteHandler($state) {
      if (!this.ongoingsListIsEmpty && (this.filteredOngoingsList.slice(0, this.showCount).length < this.filteredOngoingsList.length)) {
        this.showCount++;
        $state.loaded();
      } else $state.complete();
    }
  },
  mixins: [
    icons
  ],
  computed: {
    ongoingsListIsEmpty() {
      return !!this.ongoingsList && !Object.keys(this.ongoingsList).length;
    },
    filteredOngoingsList() {
      let list = this.ongoingsList;
      let input = this.filterInput;
      if (input) {
        input = input.trim().toLowerCase();
        return list.reduce((filtered, item) => {
          let found = item.animes.filter(e => (e.en ? e.en : e.ja).toLowerCase().includes(input) || (e.ja ? e.ja : e.en).toLowerCase().includes(input));
          if (found.length) filtered.push({ dateStart: item.dateStart, animes: found });
          return filtered;
        }, []);
      }
      return list;
    },
    globalUrl() {
      return `${process.env.BASE_URL}${this.$route.fullPath}`;
    },
    globalImage() {
      return `${process.env.BASE_URL}${this.$store.getters.webpIsSupported ? '/images/webp/empty.webp' : '/images/empty.png'}`;
    },
    globalDescription() {
      return this.$t('meta_info.list.meta.description');
    },
    globalTitle() {
      return this.$t('meta_info.list.title', ['| MyOngoingsCalendar']);
    }
  }
};
</script>
