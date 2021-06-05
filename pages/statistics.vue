<template>
  <v-container v-if="haveSomeStatistics" class="pt-8">
    <v-row>
      <v-col cols="12">
        <h1 class="display-2">
          {{ $t('statistics.h1') }}
        </h1>
      </v-col>
    </v-row>
    <v-row v-if="!!scoresSection.avgScore">
      <v-col cols="12">
        <h2 class="display-1">
          {{ $t('statistics.scoresSection.h2', [scoresSection.avgScore]) }}
        </h2>
      </v-col>
    </v-row>
    <v-row v-if="!!genresSection.genres && !!genresSection.genres.length">
      <v-col cols="12">
        <h2 class="display-1">{{ $t(`statistics.genresSection.h2`) }}</h2>
        <v-chip-group
            v-model="selectedGenres"
            multiple
            column
            :dark="settings.dark"
            active-class="primary--text"
        >
          <v-chip
              v-for="genre in genresSection.genres"
              :key="genre.name"
          >
            <span>{{ translateGenre(genre) }}</span>
            <span class="grey darken-3 chip_numbers">{{ genre.count }}</span>
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h2 class="display-1">{{ $t(`statistics.animeSection.h2`) }}</h2>
        <v-chip-group
            v-model="selectedStatus"
            mandatory
            column
            :dark="settings.dark"
            active-class="primary--text"
        >
          <v-chip
              v-for="status in animeSection.statuses"
              :key="status.name"
          >
            <span class="text-uppercase">{{ $t(`watching_status.${status.name}`) }}</span>
            <span class="grey darken-3 chip_numbers">{{ status.count }}</span>
          </v-chip>
        </v-chip-group>
      </v-col>
      <v-col cols="12">
        <v-data-table
            :headers="tableHeaders"
            :items="filteredAnime"
            :search="search"
            sort-by="en"
            :noDataText="$t('statistics.animeSection.table.nothing_found')"
            :footer-props="{itemsPerPageText: $t('statistics.animeSection.table.itemsPerPageText')}"
        >
          <template v-slot:top>
            <v-text-field
                v-model="search"
                :label="$t('statistics.animeSection.table.search_in', [$t(`watching_status.${animeSection.statuses[selectedStatus].name}`)])"
                class="mx-4 pt-4 text-uppercase"
            ></v-text-field>
          </template>
          <template
              slot="item"
              slot-scope="props"
          >
            <tr @click="navigateToAnime(props.item.tid)">
              <td>
                <v-avatar size="32">
                  <img
                      :src="getImagePath({paths: props.item.image.paths, type: 'THUMBNAIL'})"
                  />
                </v-avatar>
              </td>
              <td>{{ props.item.en }}</td>
              <td>{{ props.item.ja }}</td>
              <td>
                <watching-status
                    :status="props.item.watchingStatus"
                    :small="false"
                />
              </td>
              <td>
                <v-icon
                    v-if="props.item.favorite"
                    size="32"
                    color="red darken-1"
                >
                  {{ icons.mdiHeart }}
                </v-icon>
              </td>
              <td>{{ props.item.score }}</td>
              <td>
                <v-chip-group :dark="settings.dark" column>
                  <v-chip
                      v-for="genre in props.item.genres"
                      :key="genre.name"
                      class="chip_unselectable mr-2 my-1"
                      :ripple="false"
                  >
                    <span>{{ translateGenre(genre) }}</span>
                  </v-chip>
                </v-chip-group>
              </td>
            </tr>
          </template>
          <template slot="no-results">
            <span>{{ $t('statistics.animeSection.table.nothing_found') }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h2 class="display-1">
          {{ $t('statistics.commentsSection.h2', [commentsSection.count]) }}
        </h2>
        <template v-for="(item, i) in commentsSection.entries">
          <lazy-hydrate when-visible :key="i">
            <v-timeline
                dense
                :dark="settings.dark"
            >
              <v-timeline-item class="mb-12">
                <template v-slot:icon>
                  <v-avatar @click="navigateToAnime(item.anime.tid)">
                    <img
                        :src="getImagePath({paths: item.anime.image.paths, type: 'THUMBNAIL'})"
                    />
                  </v-avatar>
                </template>
                <div class="py-4" @click="navigateToAnime(item.anime.tid)">
                  <h2>{{ !!item.anime.en ? item.anime.en : item.anime.ja }}</h2>
                </div>
              </v-timeline-item>
              <v-timeline-item
                  v-for="(comment, ci) in item.comments"
                  :key="ci"
                  class="mb-4"
                  :color="comment.karma !== 0 ? comment.karma > 0 ? 'success' : 'error' : 'grey'"
                  small
                  right
                  fill-dot
              >
                <template v-slot:icon>
                  <v-tooltip top :disabled="!$device.isDesktop || comment.karma === 0">
                    <template v-slot:activator="{ on }">
                      <v-avatar v-on="on"/>
                    </template>
                    <div>{{ $t('statistics.commentsSection.karma', [comment.karma]) }}</div>
                    <div>{{ $t('statistics.commentsSection.likes', [comment.likes]) }}</div>
                    <div>{{ $t('statistics.commentsSection.dislikes', [comment.dislikes]) }}</div>
                  </v-tooltip>
                </template>
                <v-row justify="space-between">
                  <v-col
                      cols="7"
                      v-text="comment.text"
                      class="d-inline-block text-truncate"
                  >
                  </v-col>
                  <v-col
                      class="text-right"
                      cols="5"
                      v-text="$dayjs.unix(comment.added).fromNow()"
                  ></v-col>
                </v-row>
              </v-timeline-item>
            </v-timeline>
          </lazy-hydrate>
        </template>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col cols="12" class="mt-2">
        <v-alert
            border="left"
            colored-border
            tile
            type="info"
            :value="true"
            class="mt-4"
        >
          {{ $t('alerts.nothing_found') }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { icons } from '~/mixins/icons';
import { image } from '~/mixins/image';
import { translate } from '~/mixins/translate';
import { mapGetters } from 'vuex';
import { deepFreeze } from '~/helpers/utils';

export default {
  data: () => ({
    search: '',
    selectedStatus: 1,
    selectedGenres: [],
    headers: [
      {
        text: '',
        align: 'start',
        sortable: false,
        value: 'image',
        width: 32
      },
      {
        text: 'Name',
        align: 'start',
        sortable: true,
        value: 'en'
      },
      {
        text: 'Original name',
        align: 'start',
        sortable: true,
        value: 'ja'
      },
      {
        text: 'Status',
        align: 'start',
        sortable: true,
        value: 'watchingStatus',
      },
      {
        text: 'Favorite',
        align: 'start',
        sortable: true,
        value: 'favorite'
      },
      {
        text: 'Score',
        align: 'start',
        sortable: true,
        value: 'score'
      },
      {
        text: 'Genres',
        align: 'start',
        sortable: true,
        value: 'genres',
      },
    ]
  }),
  async asyncData({ app }) {
    const { scoresSection, genresSection, animeSection, commentsSection } = await app.$user.getUserStatistics();
    return {
      scoresSection: deepFreeze(scoresSection),
      genresSection: deepFreeze(genresSection),
      animeSection: deepFreeze(animeSection),
      commentsSection: deepFreeze(commentsSection)
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
  methods: {
    filterByGenres(arr) {
      if (!!this.selectedGenresIds.length) {
        return arr.reduce((arr, anime) => {
          if (!!anime.genres && anime.genres.some(e => this.selectedGenresIds.includes(e.id))) arr.push(anime);
          return arr;
        }, []);
      } else
        return arr;
    },
    allAnime() {
      return Object.values(this.animeSection.animes).reduce((arr, list) => {
        arr.push(...list);
        return arr;
      }, []);
    },
    animeByStatus(status) {
      const { animes } = this.animeSection;
      return animes[status];
    },
    navigateToAnime(tid) {
      this.$router.push(`/title/${tid}`);
    }
  },
  mixins: [
    icons,
    image,
    translate
  ],
  computed: {
    ...mapGetters([
      'settings',
      'authenticated'
    ]),
    tableHeaders() {
      return this.headers.reduce((arr, header) => {
        header.text = this.$t(`statistics.animeSection.table.headers.${header.value}`);
        arr.push(header);
        return arr;
      }, []);
    },
    haveSomeStatistics() {
      return this.animeSection.statuses.find(s => s.name === 'ALL').count > 0;
    },
    selectedGenresIds() {
      return this.selectedGenres.reduce((a, b) => {
        a.push(this.genresSection.genres[b].id);
        return a;
      }, []);
    },
    globalUrl() {
      return `${process.env.BASE_URL}${this.$route.fullPath}`;
    },
    globalImage() {
      return `${process.env.BASE_URL}${this.$store.getters.webpIsSupported ? '/images/webp/empty.webp' : '/images/empty.png'}`;
    },
    globalDescription() {
      return this.$t('meta_info.statistics.meta.description');
    },
    globalTitle() {
      return this.$t('meta_info.statistics.title', ['| MyOngoingsCalendar']);
    },
    filteredAnime() {
      const status = this.animeSection.statuses[this.selectedStatus].name;
      switch (status) {
        case 'ALL':
          return this.filterByGenres(this.allAnime());
        case 'WATCHING':
        case 'WATCHED':
        case 'PLANNED':
        case 'DROPPED':
          return this.filterByGenres(this.animeByStatus(status));
        case 'FAVORITES':
          return this.filterByGenres(this.allAnime().filter(e => e.favorite === true));
      }
    }
  },
  middleware: ['authenticated']
};
</script>

<style scoped>
.chip_numbers {
  border-radius: 90px;
  height: 20px;
  font-weight: bold;
  min-width: 20px;
  color: white;
  margin-left: 8px;
  padding: 1px 3px 1px 3px;
  text-align: center;
  vertical-align: middle;
}

.v-data-table__wrapper > table > tbody > tr :hover,
.v-timeline-item__inner-dot.primary > .v-avatar,
.py-4 > h2 {
  cursor: pointer;
}

.chip_unselectable:before {
  background-color: transparent !important;
}
</style>
