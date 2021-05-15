<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
            v-model="currentQuery"
            :label="$t('inputs.search.label.1')"
            :prepend-inner-icon="icons.mdiMagnify"
            hide-details
            solo
            flat
        >
          <template slot="append" v-if="notSelected">
            <v-menu offset-y>
              <template v-slot:activator="{ on: onMenu }">
                <v-tooltip
                    :bottom="!$device.isMobile"
                    :left="$device.isMobile"
                    :disabled="!$device.isDesktop"
                >
                  <template v-slot:activator="{ on: onTooltip }">
                    <v-icon v-on="{ ...onMenu, ...onTooltip }">
                      {{ icons.mdiFilterVariant }}
                    </v-icon>
                  </template>
                  <span>{{ $t('search.tooltips.add_filter') }}</span>
                </v-tooltip>
              </template>
              <v-list>
                <v-subheader>{{ $t('search.tooltips.add_filter') }}</v-subheader>
                <v-list-item
                    v-for="(filter, index) in filters"
                    v-if="!filter.added"
                    :key="index"
                    @click="dialog = {open: true, type: filter.name}"
                >
                  <v-list-item-title>{{ $t(`search.chips.${filter.name}`) }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" class="py-0">
            <v-chip-group
                v-if="shouldShow"
                multiple
                column
                :dark="settings.dark"
            >
              <v-chip
                  v-if="currentQuery"
                  :color="`teal ${settings.dark ? 'darken-3' : 'lighten-3'}`"
                  close
                  @click:close="currentQuery = ''"
              >
                {{ `${$t('search.chips.name')}: ${currentQuery}` }}
              </v-chip>
              <v-chip
                  v-for="filter in filters"
                  :key="filter.name"
                  v-if="filter.added"
                  :color="`${filter.color} ${settings.dark ? 'darken-3' : 'lighten-3'}`"
                  close
                  @click:close="filter.added = false, filter.selected ? filters.genres.selected = [] : null"
              >
                       <span v-if="filter.range">
                            {{
                           `${$t(`search.chips.${filter.name}`)}: ${$t('search.dialog.filters.from')} ${filter.range[0]} ${$t('search.dialog.filters.to')} ${filter.range[1]}`
                         }}
                       </span>
                <span v-else-if="filter.selected">
                            {{ `${$t(`search.chips.${filter.name}`)}: ${getGenresName}` }}
                       </span>
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="!!asyncCache && asyncCache.count > 0 && shouldShow">
      <v-col cols="12" class="py-0">
        <v-subheader>
          {{ $t('search.founded', [asyncCache.count]) }}
        </v-subheader>
      </v-col>
      <template v-for="anime in asyncCache.animes">
        <v-col
            :key="anime.tid"
            xs="12"
            sm="6"
            :md="$device.isDesktop ? 4 : undefined"
            lg="3"
            :xl="$device.isDesktop ? 2 : undefined"
        >
          <card :anime="anime"/>
        </v-col>
      </template>
      <v-container
          v-if="!!asyncCache && countPages > 1"
          fluid
      >
        <v-row>
          <v-col cols="12">
            <v-pagination
                :length="countPages"
                v-model="currentPage"
                :total-visible="!$device.isMobile ? 7 : 4"
                :color="settings.dark ? 'info' : undefined"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-row>
    <v-row v-if="!!asyncCache && asyncCache.count === 0">
      <v-col cols="12">
        <v-alert
            border="left"
            colored-border
            tile
            type="info"
            :icon="icons.mdiAlertDecagram"
        >
          {{ $t('alerts.nothing_found') }}
        </v-alert>
      </v-col>
    </v-row>
    <v-dialog
        v-model="dialog.open"
        max-width="500"
    >
      <v-card>
        <v-card-title class="headline">{{ $t('search.dialog.headline') }} {{
            !!dialog.type ?
                $t(`search.dialog.filters.${dialog.type}`) : ''
          }}
        </v-card-title>
        <v-card-text>
          <v-chip-group
              v-if="dialog.type === 'genres'"
              multiple
              column
              :dark="settings.dark"
              v-model="filters.genres.selected"
          >
            <v-chip
                v-for="(genre, i) in supply.genres"
                :key="i"
                :value="genre.id"
                filter
            >
              {{ translateGenre(genre) }}
            </v-chip>
          </v-chip-group>
          <v-range-slider
              v-else-if="dialog.type === 'scores'"
              v-model="filters.scores.range"
              :max="supply.scores[1]"
              :min="supply.scores[0]"
              step="0.1"
              hide-details
              class="align-center"
          >
            <template v-slot:prepend>
              <v-text-field
                  v-model="filters.scores.range[0]"
                  hide-details
                  single-line
                  type="number"
              />
            </template>
            <template v-slot:append>
              <v-text-field
                  v-model="filters.scores.range[1]"
                  hide-details
                  single-line
                  type="number"
              />
            </template>
          </v-range-slider>
          <v-range-slider
              v-else-if="dialog.type === 'years'"
              v-model="filters.years.range"
              :max="supply.years[1]"
              :min="supply.years[0]"
              step="1"
              hide-details
              class="align-center"
          >
            <template v-slot:prepend>
              <v-text-field
                  v-model="filters.years.range[0]"
                  hide-details
                  single-line
                  mask="####"
                  type="number"
                  label="Min"
              />
            </template>
            <template v-slot:append>
              <v-text-field
                  v-model="filters.years.range[1]"
                  hide-details
                  single-line
                  mask="####"
                  type="number"
              />
            </template>
          </v-range-slider>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
              text
              @click="dialog.open = false"
              :aria-label="$t('buttons.close')"
          >
            {{ $t('buttons.close') }}
          </v-btn>
          <v-btn
              color="success"
              text
              @click="dialog.open = false, filters[dialog.type].added=true"
              :aria-label="$t('buttons.add')"
              :disabled="dialog.type === 'genres' && !filters.genres.selected.length"
          >
            {{ $t('buttons.add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { icons } from '~/mixins/icons';
import { translate } from '~/mixins/translate';
import { mapGetters } from 'vuex';

export default {
  data: () => ({
    countPages: 1,
    expand: false,
    dialog: {
      open: false,
      type: ''
    }
  }),
  async asyncData({ query, app, store }) {
    if (store.getters.supplyListEmpty) {
      const { supply } = await app.$anime.getSearchSupply();
      store.dispatch('setSearchGlobalSupply', supply);
    }
    return {
      currentQuery: !!query.query ? String(query.query) : '',
      currentPage: parseInt(query.page >= 1 ? query.page : 1),
      filters: {
        genres: {
          name: 'genres',
          added: typeof query.genres !== 'undefined' && !!query.genres.length,
          selected: typeof query.genres === 'string' ? Array(query.genres) : query.genres || [],
          color: 'green'
        },
        scores: {
          name: 'scores',
          added: typeof query.scores !== 'undefined' && !!query.scores.length,
          range: query.scores || ['7', '9'],
          color: 'purple'
        },
        years: {
          name: 'years',
          added: typeof query.years !== 'undefined' && !!query.years.length,
          range: query.years || ['2010', '2025'],
          color: 'indigo'
        }
      }
    };
  },
  head() {
    return {
      title: this.currentQuery
          ? this.$t('meta_info.search.title.1', [this.currentQuery, '| MyOngoingsCalendar'])
          : this.$t('meta_info.search.title.2', ['| MyOngoingsCalendar']),
      meta: [
        {
          name: 'description',
          content: this.$t('meta_info.search.meta.description', [this.currentQuery])
        },
        {
          name: 'robots',
          content: 'noindex'
        }
      ]
    };
  },
  methods: {
    fillParams({ params }) {
      Object.values(this.filters).forEach(filter => {
        if (filter.added) params[filter.name] = !!filter.selected ? filter.selected : filter.range;
      });
    }
  },
  asyncComputed: {
    asyncCache: {
      lazy: true,
      get() {
        const authenticated = this.authenticated;
        let params = {
          query: this.currentQuery,
          page: this.currentPage
        };

        this.fillParams({ params });

        return this.$anime.searchAutocomplete({ authenticated, params })
            .then(({ countPages, animes }) => {
              this.countPages = countPages;
              return animes;
            })
            .then(cache => {
              if (this.countPages < this.currentPage) {
                this.currentPage = 1;
                return this.$anime.searchAutocomplete({ authenticated, params }).then(({ animes }) => animes);
              } else return cache;
            })
            .catch(({ code }) => this.$toast.showToast({ code }))
            .finally(() => {
              this.$router.replace({ query: params }).catch(err => {
              });
              this.$store.dispatch('setSearchGlobalLastQuery', params);
            });

      }
    }
  },
  mixins: [
    icons,
    translate
  ],
  computed: {
    ...mapGetters([
      'settings',
      'supply',
      'authenticated'
    ]),
    selected() {
      return Object.values(this.filters).some(v => v.added) || !!this.currentQuery.length;
    },
    notSelected() {
      return Object.values(this.filters).some(v => !v.added);
    },
    genresList() {
      return this.supply.genres.sort((a, b) => a.name.localeCompare(b.name));
    },
    getGenresName() {
      return this.filters.genres.selected.reduce((arr, id) => {
        arr.push(` ${this.translateGenre(this.genresList.find(item => item.id === parseInt(id)))}`);
        return arr;
      }, []);
    },
    shouldShow() {
      return !!this.currentQuery || this.filters.genres.added || this.filters.scores.added || this.filters.years.added;
    }
  }
};
</script>

<style scoped>
>>> .v-chip:before {
  background-color: transparent !important;
}
</style>
