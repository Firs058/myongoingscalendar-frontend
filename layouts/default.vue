<template>
  <v-app>
    <v-navigation-drawer
        :color="`grey ${settings.dark ? 'darken-4' : 'lighten-4'}`"
        v-model="menu"
        :permanent="!$device.isMobile"
        :right="$device.isMobile"
        app
        floating
        fixed
        width="250"
    >
      <template v-slot:prepend>
        <div class="ma-3 text-center" :style="`cursor: pointer;`">
          <div
              @click.stop="$router.push('/')"
              class="title"
          >
            MyOngoingsCalendar
          </div>
          <div
              @click.stop="$router.push('/settings')"
              :class="timezoneClass"
          >
            {{ settings.timezone }}
          </div>
        </div>
      </template>
      <v-list dense nav>
        <v-list-item
            ripple
            to="/"
            nuxt
        >
          <v-list-item-icon>
            <v-icon>{{ icons.mdiHome }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('menu.home') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
            ripple
            v-if="authenticated"
            to="/my_calendar"
            nuxt
        >
          <v-list-item-icon>
            <v-icon>{{ icons.mdiCalendarCheck }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('menu.my_calendar') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
            ripple
            to="/list"
            nuxt
        >
          <v-list-item-icon>
            <v-icon>{{ icons.mdiFormatListBulleted }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('menu.ongoings_list') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
            ripple
            v-if="authenticated"
            to="/statistics"
            nuxt
        >
          <v-list-item-icon>
            <v-icon>{{ icons.mdiPoll }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('menu.statistics') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
            ripple
            :to="{ name: 'search', query: lastQuery }"
            nuxt
        >
          <v-list-item-icon>
            <v-icon>{{ icons.mdiMagnify }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('menu.search') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
            ripple
            v-if="!authenticated"
            to="/login"
            nuxt
        >
          <v-list-item-icon>
            <v-icon>{{ icons.mdiLogin }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('menu.login') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
            ripple
            v-if="!authenticated"
            to="/registration"
            nuxt
        >
          <v-list-item-icon>
            <v-icon>{{ icons.mdiAccountPlus }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('menu.registration') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
            ripple
            to="/about"
            nuxt
        >
          <v-list-item-icon>
            <v-icon>{{ icons.mdiInformationVariant }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('menu.about') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
            ripple
            to="/settings"
            nuxt
        >
          <v-list-item-icon>
            <v-icon>{{ icons.mdiAccountCog }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('menu.settings') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
            ripple
            to="/donate"
            nuxt
        >
          <v-list-item-icon>
            <v-icon>{{ icons.mdiGiftOutline }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('menu.donate') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
            ripple
            @click="$store.dispatch('setFeedback', {name: 'dialog', value: true})"
        >
          <v-list-item-icon>
            <v-icon>{{ icons.mdiMessageAlert }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('menu.feedback') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
            v-if="authenticated && admin"
            to="/admin"
            nuxt
        >
          <v-list-item-icon>
            <v-icon>{{ icons.mdiPencil }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Admin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="authenticated"/>
        <v-list-item v-if="authenticated">
          <v-list-item-avatar>
            <img v-if="avatarPath !== null" :src="avatarPath" alt="user"/>
            <v-icon v-else>{{ icons.mdiAccount }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-subtitle>{{ $t('menu.logged_as') }}</v-list-item-subtitle>
            <v-list-item-title>{{ user.email }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-tooltip top :disabled="!$device.isDesktop">
              <template v-slot:activator="{ on }">
                <v-btn
                    v-on="on"
                    icon
                    @click.stop="logout()"
                    :aria-label="$t('menu.exit')"
                >
                  <v-icon>{{ icons.mdiExitToApp }}</v-icon>
                </v-btn>
              </template>
              {{ $t('menu.exit') }}
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-container class="pa-0">
          <v-row justify="center" class="pb-2" no-gutters>
            <v-col cols="12" align="center">
              <v-btn
                  class="caption"
                  text
                  v-for="link in footerLinks"
                  :key="link.name"
                  :to="link.link"
                  small
                  nuxt
                  :aria-label="$tc(`${link.name}.headline`, 1)"
                  max-width="250"
              >
                {{ $tc(`${link.name}.headline`, 1) }}
              </v-btn>
            </v-col>
            <v-col cols="12" py-1 px-1 text-center class="caption text-center">
              {{ year > 2017 ? '2017 - ' + year : year }}
              <br><strong>&copy; MyOngoingsCalendar</strong>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-navigation-drawer>
    <v-app-bar
        v-if="$device.isMobile"
        :color="`grey ${settings.dark ? 'darken-4' : 'lighten-4'}`"
        fixed
        app
        dense
    >
      <span @click.stop="$router.push('/')" class="headline font-weight-medium">MOC</span>
      <v-spacer/>
      <v-btn
          icon
          :to="{ name: 'search', query: lastQuery }"
          nuxt
          exact-active-class="undefined"
          :aria-label="$t('menu.search')"
      >
        <v-icon>{{ icons.mdiMagnify }}</v-icon>
      </v-btn>
      <v-app-bar-nav-icon @click.stop="menu = !menu"/>
    </v-app-bar>
    <feedback-dialog/>
    <v-main>
      <nuxt/>
    </v-main>
    <toast/>
    <gdpr/>
  </v-app>
</template>

<script>
import { icons } from '~/mixins/icons';
import { image } from '~/mixins/image';
import { mapGetters } from 'vuex';
import colors from 'vuetify/lib/util/colors';

export default {
  data: () => ({
    menu: false,
    year: new Date().getFullYear(),
    footerLinks: [
      {
        name: 'terms',
        link: '/terms'
      },
      {
        name: 'privacy',
        link: '/privacy'
      }
    ]
  }),
  head() {
    return {
      noscript: [
        { innerHTML: 'This webapp requires JavaScript' }
      ],
      htmlAttrs: {
        lang: this.settings.lang
      }
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
          .then(() => this.$vuetify.theme.dark = this.settings.dark);
      this.$router.push('/');
      this.$toast.showToast({ code: 11015 });
    }
  },
  mixins: [
    icons,
    image
  ],
  computed: {
    ...mapGetters([
      'user',
      'settings',
      'toast',
      'lastQuery',
      'admin',
      'authenticated'
    ]),
    avatarPath() {
      return !!this.settings.avatar ? this.getAvatarPath({ paths: this.settings.avatar.paths }) : null;
    },
    textDarken() {
      return this.settings.dark ? 'text--darken' : 'text--darken-2';
    },
    timezoneClass() {
      return `grey--text ${this.textDarken} ${this.settings.timezone.length > 20 ? 'caption' : 'subtitle-1'}`;
    }
  },
  created() {
    this.$vuetify.theme.dark = this.settings.dark;
    this.$vuetify.theme.themes.dark = {
      primary: { base: colors.blue.lighten3 },
      error: { base: colors.red.lighten3 },
      success: { base: colors.green.lighten3 },
      info: { base: colors.blue.darken3 }
    };
    this.$vuetify.theme.applyVueMeta23();
  },
  mounted() {
    this.$meta().refresh();
  }
};
</script>

<style scoped>
.v-btn--active:before {
  opacity: 0 !important;
}
</style>
