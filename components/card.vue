<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <lazy-hydrate when-visible>
    <v-hover v-slot:default="{ hover }">
      <v-card
          nuxt
          :to="`/title/${anime.tid}`"
          hover
          tile
          :ripple="$device.isDesktop"
          :elevation="hover ? 8 : 2"
      >
        <v-img
            v-if="$device.isDesktop"
            :src="getImagePath({paths: anime.image.paths, type: 'FULL'})"
            aspect-ratio="0.7"
            :gradient="`to bottom, transparent 0%, transparent 30%, ${getBackgroundColor({gradient: true})} 100%`"
            :alt="title"
        >
          <template v-slot:placeholder>
            <v-row
                class="fill-height ma-0"
                :style="`backgroundColor: ${getBackgroundColor({gradient: false})}`"
            />
          </template>
          <div class="d-flex flex-column justify-end fill-height ma-0">
            <div class="d-flex justify-start mb-auto" v-if="haveStatusOrIcons">
              <div class="d-flex justify-center align-center" v-if="anime.watchingStatus">
                <v-chip
                    :color="statusColor"
                    class="text-uppercase ma-4"
                    small
                >
                  {{ $t(`card.watching_status.${anime.watchingStatus}`) }}
                </v-chip>
              </div>
              <div class="d-flex ml-auto" v-if="haveStatusIcons">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon
                        v-if="anime.favorite"
                        v-on="on"
                        size="32"
                        color="red darken-1"
                        class="ml-4 mr-2 my-3"
                    >
                      {{ icons.mdiHeart }}
                    </v-icon>
                  </template>
                  <span class="text-uppercase">{{ $t('card.favorite') }}</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon
                        v-if="anime.recommended"
                        v-on="on"
                        size="32"
                        color="yellow darken-3"
                        class="mr-4 my-3"
                    >
                      {{ icons.mdiStar }}
                    </v-icon>
                  </template>
                  <span class="text-uppercase">{{ $t('card.recommended') }}</span>
                </v-tooltip>
              </div>
            </div>
            <v-card-title>{{ title }}</v-card-title>
            <v-card-subtitle v-if="showDateStart">{{ $t('card.start', [anime.dateStart]) }}</v-card-subtitle>
          </div>
        </v-img>
        <div v-else class="d-flex flex-no-wrap justify-space-between">
          <v-img
              max-width="150"
              min-width="150"
              aspect-ratio="0.7"
              :src="getImagePath({paths: anime.image.paths, type: 'FULL'})"
          >
            <template v-slot:placeholder>
              <v-row
                  class="fill-height ma-0"
                  :style="`backgroundColor: ${getBackgroundColor({gradient: false})}`"
              />
            </template>
          </v-img>
          <div class="d-flex flex-column flex-no-wrap justify-space-between flex-grow-1">
            <div>
              <v-card-title class="subtitle-1">{{ title }}</v-card-title>
              <v-card-subtitle v-if="showDateStart" class="caption">
                {{ $t('card.start', [anime.dateStart]) }}
              </v-card-subtitle>
            </div>
            <v-card-text
                v-if="haveStatusOrIcons"
                class="mt-auto d-flex flex-no-wrap justify-space-between"
            >
              <v-chip
                  v-if="anime.watchingStatus"
                  :color="statusColor"
                  class="text-uppercase"
                  small
              >
                {{ $t(`card.watching_status.${anime.watchingStatus}`) }}
              </v-chip>
              <v-spacer/>
              <v-icon
                  v-if="anime.favorite"
                  size="24"
                  color="red darken-1"
                  class="mr-2"
              >
                {{ icons.mdiHeart }}
              </v-icon>
              <v-icon
                  v-if="anime.recommended"
                  size="24"
                  color="yellow darken-3"
              >
                {{ icons.mdiStar }}
              </v-icon>
            </v-card-text>
          </div>
        </div>
      </v-card>
    </v-hover>
  </lazy-hydrate>
</template>

<script>
import { icons } from '~/mixins/icons';
import { image } from '~/mixins/image';
import { mapGetters } from 'vuex';

export default {
  props: {
    anime: Object,
    noStart: {
      type: Boolean,
      default: false
    }
  },
  mixins: [
    icons,
    image
  ],
  methods: {
    getColor({ status }) {
      const shade = this.settings.dark ? 'darken-3' : 'lighten-2';
      const colors = {
        NEW: `orange ${shade}`,
        WATCHING: `green ${shade}`,
        WATCHED: `blue ${shade}`,
        DROPPED: `red ${shade}`,
        PLANNED: `purple ${shade}`
      };
      return colors[status];
    },
    getBackgroundColor({ gradient }) {
      const hex = this.anime.image.hex;
      return !!hex && Object.keys(hex).length
          ? this.settings.dark
              ? hex.dark
              : hex.light
          : gradient
              ? 'rgba(0, 0, 0, 0.4)'
              : null;
    }
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    statusColor() {
      return this.getColor({ status: this.anime.watchingStatus });
    },
    title() {
      const { en, ja } = this.anime;
      return en ? en : ja;
    },
    haveStatusIcons() {
      const { favorite, recommended } = this.anime;
      return favorite || recommended;
    },
    haveStatusOrIcons() {
      return !!this.anime.watchingStatus || this.haveStatusIcons;
    },
    showDateStart() {
      return !!this.anime.dateStart && !this.noStart;
    }
  }
};
</script>

<style scoped>
>>> .v-chip:before {
  background-color: transparent !important;
}
</style>
