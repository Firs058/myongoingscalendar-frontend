<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container :class="{ 'px-6': $device.isDesktop }">
    <v-row>
      <v-col cols="12" class="pa-0">
        <v-card color="transparent" flat tile>
          <v-img
              :lazy-src="titleImagePath"
              aspect-ratio="1"
              :height="$device.isDesktop ? '50vh' : undefined"
              width="100%"
              :alt="globalTitle"
          >
            <v-container :style="titleStyle" class="grow d-flex flex-column flex-nowrap">
              <v-row class="grow" justify="center" :style="added ? 'padding-top: 74px' : undefined">
                <v-col cols="10" align-self="center">
                  <v-row justify="center">
                    <v-col cols="auto" class="py-0 ma-5" align-self="center">
                      <h1
                          :class="`text-center font-weight-bold ${$device.isMobile ? 'headline' : 'display-1'}`"
                          v-text="globalTitle"
                      />
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col cols="auto" class="py-0">
                      <v-tooltip top :disabled="!$device.isDesktop">
                        <template v-slot:activator="{ on }">
                          <div v-on="on" @click="added ? score.dialog = true : undefined">
                            <v-rating
                                v-if="title.avgRating"
                                :value="title.avgRating"
                                color="yellow darken-3"
                                background-color="grey"
                                dense
                                readonly
                                half-increments
                                length="10"
                                :empty-icon="icons.mdiStarOutline"
                                :full-icon="icons.mdiStar"
                                :half-icon="icons.mdiStarHalfFull"
                                :class="{'selectable': added, 'mb-4': true}"
                            >
                              <template slot="item" slot-scope="item">
                                <v-icon :color="item.isHalfFilled || item.isFilled ? 'yellow darken-3' : 'grey'">
                                  {{
                                    item.isHalfFilled
                                        ? icons.mdiStarHalfFull
                                        : item.isFilled
                                        ? icons.mdiStar
                                        : icons.mdiStarOutline
                                  }}
                                </v-icon>
                              </template>
                            </v-rating>
                            <v-rating
                                v-else
                                color="yellow darken-3"
                                background-color="grey"
                                dense
                                readonly
                                half-increments
                                length="10"
                                :empty-icon="icons.mdiStarOutline"
                                :full-icon="icons.mdiStar"
                                :half-icon="icons.mdiStarHalfFull"
                                :class="{'selectable': added, 'mb-4': true}"
                            />
                          </div>
                        </template>
                        <div class="text-center">
                          <div v-if="title.avgRating">
                            <span>
                              {{ $t('title.information.weighted_average_rating', [title.avgRating]) }}
                            </span>
                          </div>
                          <div>
                            <span v-if="!added && !score.value && !title.finished">
                              {{ $t('title.information.add_first') }}
                            </span>
                            <span v-else-if="added && !score.value">
                              {{ $t('title.information.click_to_rate') }}
                            </span>
                            <span v-else-if="!!score.value">
                              {{ $t('title.information.your_score', [score.value]) }}
                            </span>
                          </div>
                        </div>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <v-row v-if="!title.finished" justify="center">
                    <v-col cols="auto" class="py-0">
                      <v-tooltip top :disabled="!$device.isDesktop">
                        <template v-slot:activator="{ on }">
                          <div
                              v-on="on"
                              style="min-width: 240px; max-width: 100%;"
                          >
                            <v-btn
                                @click.native.stop="!added ? toggleTitle() : deletion.dialog = true"
                                :disabled="!authenticated"
                                :loading="mainButtonLoading"
                                :aria-label="!added ? $t('buttons.add') : $t('buttons.remove')"
                                height="50"
                                block
                                depressed
                                :style="authenticated ? buttonStyle({color: !added ? buttonColors.green : buttonColors.red}) : undefined"
                            >
                              {{ !added ? $t('buttons.add') : $t('buttons.remove') }}
                            </v-btn>
                          </div>
                        </template>
                        <span>{{
                            authenticated
                                ? added
                                ? $t('tooltips.remove_from_my_calendar')
                                : $t('tooltips.add_to_my_calendar')
                                : $t('tooltips.you_must_be_logged_in')
                          }}</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row class="shrink" v-if="added">
                <v-col cols="12">
                  <v-tooltip right :disabled="!$device.isDesktop">
                    <template v-slot:activator="{ on }">
                      <v-btn
                          v-on="on"
                          @click="toggleTitleFavorite"
                          :class="{
                                            'grey--text': !favorite.value,
                                            'red--text': favorite.value,
                                            'darken-3': settings.dark,
                                          }"
                          :disabled="!authenticated"
                          :loading="favorite.loading"
                          :aria-label="favorite.value ? $t('buttons.add') : $t('buttons.remove')"
                          icon
                          min-width="50"
                          max-width="50"
                          height="50"
                      >
                        <v-icon
                            size="32"
                            :color="`${favorite.value ? 'red' : 'grey'} darken-1`"
                        >
                          {{ icons.mdiHeart }}
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>{{
                        authenticated ? favorite.value ? $t('tooltips.remove_from_favorites') : $t('tooltips.add_to_favorites') : $t('tooltips.you_must_be_logged_in')
                      }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-container>
          </v-img>
          <v-alert
              border="left"
              colored-border
              tile
              v-if="title.finished"
              class="ma-0"
              :value="true"
              type="info"
              :icon="icons.mdiAlertDecagram"
          >
            {{ $t('title.information.outdated') }}
          </v-alert>
          <v-sheet
              tile
              class="py-10 px-4"
              :light="settings.dark"
              color="grey lighten-2"
          >
            <v-row>
              <v-col cols="auto" xs="12" md="6">
                <v-card color="transparent" flat tile>
                  <h1
                      class="text-left mb-4"
                      :class="$device.isMobile ? 'headline font-weight-bold' : 'display-1 font-weight-bold'"
                      v-text="title.ja"
                  />
                  <div class="mb-4" v-if="title.genres && title.genres.length">
                    <v-chip-group
                        multiple
                        column
                        :dark="settings.dark"
                    >
                      <v-tooltip
                          top
                          v-for="(genre, index) in title.genres"
                          :key="index"
                          eager
                          :disabled="!$device.isDesktop"
                      >
                        <template v-slot:activator="{ on }">
                          <v-hover v-slot:default="{ hover }">
                            <v-chip
                                v-on="on"
                                link
                                nuxt
                                :class="`elevation-${hover ? 2 : 0} grey ${settings.dark ? 'darken-1' : 'lighten-1'}`"
                                :to="{name: 'search', query: { genres: [genre.id] }}"
                            >
                              {{ translateGenre(genre) }}
                            </v-chip>
                          </v-hover>
                        </template>
                        <span>{{ $t('tooltips.search_by_genre', [translateGenre(genre)]) }}</span>
                      </v-tooltip>
                    </v-chip-group>
                  </div>
                  <div class="text-left mb-4" v-if="title.episodes">
                    <v-icon small>{{ icons.mdiTelevision }}</v-icon>
                    {{ title.episodes + $t('title.information.episodes') }}
                  </div>
                  <div class="text-left mb-4 text-justify"
                       v-if="title.description !== 'Not have description'">
                    {{ title.description }}
                  </div>
                  <v-col cols="12" v-if="title.links && title.links.length" class="pa-0 mb-4">
                    <v-tooltip
                        top
                        v-for="(link, index) in title.links"
                        :key="index"
                        :disabled="!$device.isDesktop"
                    >
                      <template v-slot:activator="{ on }">
                        <v-avatar
                            class="mr-5"
                            size="32"
                            v-on="on"
                            tile
                            @click.stop="openLink(link.link)"
                        >
                          <img
                              :src="getImagePath({paths: link.image.paths, type: 'FULL'})"
                              :alt="link.name"
                          />
                        </v-avatar>
                      </template>
                      <span>{{ $t('tooltips.open_link_in_new_window', [link.name]) }}</span>
                    </v-tooltip>
                  </v-col>
                  <social
                      v-if="!!globalTitle"
                      :url="globalUrl"
                      :title="globalTitle"
                      :description="globalDescription"
                  />
                </v-card>
              </v-col>
              <v-col xs="12" md="6">
                <v-img
                    :src="titleImagePath"
                    aspect-ratio="0.7"
                    :class="$device.isMobile ? undefined : 'elevation-20'"
                    max-width="350px"
                    class="mx-auto"
                    :alt="globalTitle"
                >
                  <template v-slot:placeholder>
                    <v-row
                        class="fill-height ma-0"
                        :style="`backgroundColor: ${title.image.hex}`"
                    />
                  </template>
                </v-img>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="title.trailer" class="mt-4">
                <iframe
                    :src="title.trailer"
                    frameborder="0"
                    width="100%"
                    height="500px"
                    allowfullscreen
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    title="Trailer or PV"
                />
              </v-col>
            </v-row>
          </v-sheet>
          <v-sheet
              tile
              v-if="showChart && title.chartData.datasets.length"
              class="pa-4"
              :class="settings.dark ? 'grey darken-2' : 'grey lighten-3'"
          >
            <lazy-hydrate when-visible>
              <line-chart :chartData="title.chartData"/>
            </lazy-hydrate>
          </v-sheet>
          <v-sheet tile>
            <v-tabs
                centered
                v-model="broadcast.active"
                fixed-tabs
                background-color="transparent"
                :color="settings.dark ? 'white' : 'black'"
            >
              <v-tabs-slider/>
              <v-tab
                  v-for="i in broadcast.tabs"
                  :key="i.name"
                  :href="'#tab-' + i.name"
              >
                {{ $t(`title.schedule.tabs.${i.name}`) }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="broadcast.active">
              <v-tab-item
                  v-for="i in broadcast.tabs"
                  :key="i.name"
                  :value="'tab-' + i.name"
              >
                <v-data-table
                    :headers="tableHeaders"
                    :items="i.items"
                    :items-per-page.sync="i.items.length"
                    hide-default-footer
                    :hide-default-header="$device.isMobile"
                    :no-data-text="$t('title.schedule.no_data')"
                >
                  <template
                      slot="item"
                      slot-scope="props"
                  >
                    <tr class="text-center">
                      <td>{{ props.item.date }}</td>
                      <td>{{
                          $dayjs(props.item.time, 'HH:mm').format(settings.fullTimeFormat ?
                              'HH:mm' : 'LT')
                        }}
                        <span
                            v-if="props.item.shift !== '0'"
                            :class="{
                                                                'red--text': true,
                                                                'text--lighten-3': settings.dark,
                                                                'text--darken-4' : !settings.dark,
                                                            }"
                        >
                                                        {{ '&nbsp' + props.item.shift }}
                                                    </span>
                      </td>
                      <td>{{ props.item.channel }}</td>
                      <td>{{ props.item.episode }}</td>
                      <td>{{ props.item.episodename }}</td>
                    </tr>
                  </template>
                </v-data-table>
              </v-tab-item>
            </v-tabs-items>
            <v-dialog
                v-model="deletion.dialog"
                max-width="300"
            >
              <v-card>
                <v-card-title class="headline">{{ $t('title.dialogs.deletion.title') }}</v-card-title>
                <v-card-text>{{ globalTitle }}</v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn
                      text
                      @click.native="deletion.dialog = false"
                      :aria-label="$t('buttons.disagree')"
                  >
                    {{ $t('buttons.disagree') }}
                  </v-btn>
                  <v-btn
                      color="success"
                      text
                      @click.native="toggleTitle"
                      :loading="deletion.loading"
                      :aria-label="$t('buttons.agree')"
                  >
                    {{ $t('buttons.agree') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
                v-model="score.dialog"
                max-width="320"
            >
              <v-card>
                <v-card-title class="headline">{{ $t('title.dialogs.scoreDialog.title') }}</v-card-title>
                <v-card-text>{{ globalTitle }}</v-card-text>
                <v-card-text>
                  <v-rating
                      v-model="score.value"
                      color="yellow darken-3"
                      background-color="grey"
                      dense
                      half-increments
                      length="10"
                      :empty-icon="icons.mdiStarOutline"
                      :full-icon="icons.mdiStar"
                      :half-icon="icons.mdiStarHalfFull"
                      class="mb-4"
                  >
                  </v-rating>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                      v-if="score.remove.exists"
                      text
                      color="error"
                      :loading="score.remove.loading"
                      :disabled="score.loading"
                      @click.native="removeUserTitleScore"
                      :aria-label="$t('buttons.remove')"
                  >
                    {{ $t('buttons.remove') }}
                  </v-btn>
                  <v-spacer/>
                  <v-btn
                      text
                      @click.native="score.dialog = false"
                      :aria-label="$t('buttons.close')"
                      :disabled="score.remove.loading || score.loading"
                  >
                    {{ $t('buttons.close') }}
                  </v-btn>
                  <v-btn
                      color="success"
                      text
                      @click.native="setUserTitleScore"
                      :loading="score.loading"
                      :aria-label="$t('buttons.accept')"
                      :disabled="!score || score.remove.loading"
                  >
                    {{ $t('buttons.accept') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-sheet>
          <v-sheet
              tile
              class="py-8"
          >
            <lazy-hydrate when-visible>
              <v-card color="transparent" flat>
                <v-container fluid class="pa-5">
                  <v-row align="center" justify="center">
                    <v-tooltip top :disabled="!$device.isDesktop">
                      <template v-slot:activator="{ on }">
                        <div v-on="on" class="d-inline-block">
                          <v-btn
                              @click.native.stop="$store.dispatch('openCommentDialog', {tid})"
                              :disabled="!authenticated"
                              :aria-label="$t('buttons.add_comment')"
                              depressed
                              :style="authenticated ? buttonStyle({color: buttonColors.green}) : undefined"
                          >
                            {{ $t('buttons.add_comment') }}
                          </v-btn>
                        </div>
                      </template>
                      <span>{{
                          authenticated ? $t('buttons.add_comment') : $t('tooltips.you_must_be_logged_in')
                        }}</span>
                    </v-tooltip>
                  </v-row>
                </v-container>
                <v-container
                    v-if="!!comments.nodes && comments.nodes.length"
                    fluid
                    :class="!$device.isDesktop ? 'pa-0' : null"
                >
                  <div class="d-flex flex-column">
                    <comment
                        xs12
                        v-for="(comment, index) in comments.nodes"
                        :key="index"
                        :comment="comment"
                    />
                  </div>
                </v-container>
                <v-container
                    fluid
                    v-if="comments.more > 0"
                >

                  <v-row align="center" justify="center">
                    <v-tooltip top :disabled="!$device.isDesktop">
                      <template v-slot:activator="{ on }">
                        <v-btn
                            v-on="on"
                            text
                            @click.native.stop="getComments({next: true})"
                            :loading="comments.loading"
                            color="primary"
                            :aria-label="$t('comments.show_more.2', [comments.more])"
                        >
                          <v-icon left>{{ icons.mdiArrowDown }}</v-icon>
                          {{ $t('comments.show_more.2', [comments.more]) }}
                          <v-icon right>{{ icons.mdiArrowDown }}</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('comments.show_more.1') }}</span>
                    </v-tooltip>
                  </v-row>
                </v-container>
                <comment-dialog/>
              </v-card>
            </lazy-hydrate>
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { icons } from '~/mixins/icons';
import { image } from '~/mixins/image';
import { button } from '~/mixins/button';
import { translate } from '~/mixins/translate';
import { mapGetters } from 'vuex';

export default {
  async asyncData({ params, app, store: { getters: { settings: { timezone }, authenticated } }, redirect }) {
    const tid = Number(params.tid);
    const {
      title,
      added,
      score,
      favorite,
      tabs,
      nodes,
      total,
      fromPath
    } = await app.$anime.getTitle({ authenticated, tid, params: { timezone } });
    if (!title.tid) return redirect('/404');
    return {
      tid,
      title,
      added,
      favorite: {
        dialog: false,
        loading: false,
        value: favorite
      },
      score: {
        dialog: false,
        loading: false,
        value: score,
        remove: {
          exists: !!score,
          loading: false
        }
      },
      broadcast: {
        tabs,
        active: 'tab-next',
        headers: [
          { sortable: false, value: 'date', align: 'center' },
          { sortable: false, value: 'time', align: 'center' },
          { sortable: false, value: 'channel', align: 'center' },
          { sortable: false, value: 'episode', align: 'center' },
          { sortable: false, value: 'episodename', align: 'center' }
        ]
      },
      comments: {
        nodes,
        total,
        more: fromPath - nodes.length,
        offset: 0,
        loading: false
      }
    };
  },
  data: () => ({
    deletion: {
      dialog: false,
      loading: false
    },
    mainButtonLoading: false,
    showChart: false
  }),
  validate({ params }) {
    return /^\d+$/.test(params.tid);
  },
  head() {
    return {
      title: this.globalTitle,
      titleTemplate: '%s | MyOngoingsCalendar',
      meta: [
        {
          name: 'description',
          content: this.globalDescription
        },
        {
          property: 'og:title',
          content: this.globalTitle,
          template: '%s | MyOngoingsCalendar'
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
          content: this.globalTitle,
          template: '%s | MyOngoingsCalendar'
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
    openLink: url => window.open(url),
    async toggleTitle() {
      this.mainButtonLoading = true;
      await this.$anime.toggleTitle({ tid: this.tid })
          .then(({ code }) => {
            this.$toast.showToast({ code });
            this.deletion.dialog = false;
            this.added = !this.added;
            if (!this.added) {
              this.score.value = null;
              this.favorite.value = false;
            }
          })
          .catch(({ code }) => this.$toast.showToast({ code }))
          .finally(() => this.mainButtonLoading = false);
    },
    async toggleTitleFavorite() {
      this.favorite.loading = true;
      await this.$anime.toggleTitleFavorite({ tid: this.tid })
          .then(({ code }) => {
            this.$toast.showToast({ code });
            this.favorite.dialog = false;
            this.favorite.value = !this.favorite.value;
          })
          .catch(({ code }) => this.$toast.showToast({ code }))
          .finally(() => this.favorite.loading = false);
    },
    async getComments({ next }) {
      if (next) this.comments.offset += 10;
      this.comments.loading = true;
      await this.$anime.getComments({ tid: this.tid, offset: this.comments.offset })
          .then(({ nodes, fromPath }) => {
            this.comments.nodes.length && next ? nodes.forEach(e => this.comments.nodes.push(e)) : this.comments.nodes = nodes;
            this.comments.more = fromPath - this.comments.nodes.length;
          })
          .catch(({ code }) => this.$toast.showToast({ code }))
          .finally(() => this.comments.loading = false);
    },
    async setUserTitleScore() {
      if (this.score.value >= 1 && this.score.value <= 10) {
        this.score.loading = true;
        await this.$anime.setUserTitleScore({ tid: this.tid, params: { score: this.score.value } })
            .then(({ code }) => {
              this.$toast.showToast({ code });
              this.score.remove.exists = true;
              this.score.dialog = false;
            })
            .catch(({ code }) => this.$toast.showToast({ code }))
            .finally(() => this.score.loading = false);
      } else this.$toast.showToast({ code: 10038 });
    },
    async removeUserTitleScore() {
      this.score.remove.loading = true;
      await this.$anime.removeUserTitleScore({ tid: this.tid })
          .then(({ code }) => {
            this.$toast.showToast({ code });
            this.score.remove.exists = false;
            this.score.dialog = false;
          })
          .catch(({ code }) => this.$toast.showToast({ code }))
          .finally(() => this.score.remove.loading = false);
    }
  },
  mixins: [
    icons,
    image,
    button,
    translate
  ],
  computed: {
    ...mapGetters([
      'settings',
      'authenticated',
      'comment'
    ]),
    globalTitle() {
      const { en, ja } = this.title;
      return en ? en : ja;
    },
    globalUrl() {
      return `${process.env.BASE_URL}${this.$route.fullPath}`;
    },
    globalDescription() {
      return this.$t('meta_info.title.meta.description', [this.globalTitle, this.title.firstYear]);
    },
    globalImage() {
      return `${process.env.BASE_URL}${this.titleImagePath}`;
    },
    tableHeaders() {
      return this.broadcast.headers.reduce((arr, header) => {
        header.text = this.$t(`title.schedule.headers.${header.value}`);
        arr.push(header);
        return arr;
      }, []);
    },
    titleImagePath() {
      return this.getImagePath({ paths: this.title.image.paths, type: 'FULL' });
    },
    titleStyle() {
      const hex = this.title.image.hex;
      const dark = this.settings.dark;
      const blackOpacity = 'rgba(0,0,0,0.5)';
      const whiteOpacity = 'rgba(255,255,255,0.5)';
      return `background:linear-gradient(to top, ${dark ? Object.keys(hex).length ? hex.dark : blackOpacity : Object.keys(hex).length ? hex.light : whiteOpacity}, ${dark ? blackOpacity : whiteOpacity}); height: 100%`;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.comment.dialog) this.$store.dispatch('resetCommentDialog');
    next();
  },
  mounted() {
    this.$vuetify.goTo(0);
    this.showChart = true;
  }
};
</script>

<style scoped>
.v-btn.extended {
  min-width: 225px;
  height: 50px;
}

.v-avatar,
.v-rating.selectable {
  cursor: pointer;
}

.v-responsive.v-image >>> .v-image__image.v-image__image--preload.v-image__image--cover {
  -webkit-filter: blur(10px);
  -ms-filter: blur(10px);
  filter: blur(10px);
  transform: scale(1.1);
}

>>> .v-tabs-items {
  background-color: transparent !important;
}
</style>
