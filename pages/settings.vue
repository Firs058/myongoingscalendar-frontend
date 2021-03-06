<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fill-height>
    <v-row justify="center">
      <v-col
          :class="{ 'pa-0': $device.isMobile }"
          xs="12"
          sm="10"
          lg="5"
      >
        <div v-if="!user.authenticated">
          <v-alert
              border="left"
              colored-border
              tile
              type="info"
              :value="true"
          >
            {{ $t('alerts.settings_note_1') }}
            <a @click.stop="$router.push('/registration')">{{ $t('registration.headline') }}</a>
            {{ $t('alerts.settings_note_or') }}
            <a @click.stop="$router.push('/login')">{{ $t('login.headline') }}</a>
            {{ $t('alerts.settings_note_2') }}
          </v-alert>
        </div>
        <v-subheader v-if="user.authenticated">{{ $t('settings.account.subheader') }}</v-subheader>
        <v-card v-if="user.authenticated" flat tile>
          <v-list
              two-line
              subheader
              class="pa-0"
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('settings.account.change_nickname.title') }}</v-list-item-title>
                <v-list-item-subtitle>{{
                    $t('settings.account.change_nickname.sub_title',
                        [settings.nickname])
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-dialog
                    v-model="nickname.dialog"
                    persistent
                    max-width="500px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                        v-on="on"
                        right
                        icon
                        aria-label="Open In New"
                    >
                      <v-icon>{{ icons.mdiOpenInNew }}</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ $t('settings.account.change_nickname.dialog.headline') }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-form v-model="nickname.valid" ref="nicknameForm" lazy-validation>
                        <v-text-field
                            :label="$t('inputs.nickname.label')"
                            v-model="nickname.value"
                            :rules="[
                                  v => !!v || $t('inputs.nickname.rules.required'),
                                  v => /^[a-zA-Z0-9]+$/.test(v) || $t('inputs.nickname.rules.valid'),
                                  v => v && v.length >= 4 || $t('inputs.nickname.rules.lengthMin'),
                                  v => v && v.length <= 20 || $t('inputs.nickname.rules.lengthMax')
                        ]"
                            required
                            autofocus
                        />
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn
                          text
                          :disabled="nickname.loading"
                          @click.native="nickname.dialog = false"
                          :aria-label="$t('buttons.cancel')"
                      >{{ $t('buttons.cancel') }}
                      </v-btn>
                      <v-btn
                          text
                          color="success"
                          :disabled="!nickname.valid"
                          :loading="nickname.loading"
                          @click.native="submitNickname"
                          :aria-label="$t('buttons.save')"
                      >{{ $t('buttons.save') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item-action>
            </v-list-item>
            <v-divider v-if="!user.social"/>
            <v-list-item v-if="!user.social">
              <v-list-item-content>
                <v-list-item-title>{{ $t('settings.account.change_password.title') }}</v-list-item-title>
                <v-list-item-subtitle>{{ $t('settings.account.change_password.sub_title') }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-dialog
                    v-model="password.dialog"
                    persistent
                    max-width="500px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                        v-on="on"
                        right
                        icon
                        aria-label="Open In New"
                    >
                      <v-icon>{{ icons.mdiOpenInNew }}</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ $t('settings.account.change_password.dialog.headline') }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-form v-model="password.valid" ref="passwordForm" lazy-validation>
                        <v-text-field
                            :label="$t('inputs.password.label')"
                            :hint="$t('inputs.password.hint')"
                            v-model="password.value"
                            :rules="[
                                  v => !!v || $t('inputs.password.rules.required'),
                                  v => (v !== user.email || v !== settings.nickname) || $t('inputs.password.rules.valid'),
                                  v => v && v.length >= 8 || $t('inputs.password.rules.length')
                        ]"
                            :append-icon="password.hidePass ? icons.mdiEye : icons.mdiEyeOff"
                            @click:append="() => (password.hidePass = !password.hidePass)"
                            :type="password.hidePass ? 'password' : 'text'"
                            required
                        />
                        <v-text-field
                            :label="$t('inputs.confirm_password.label')"
                            :hint="$t('inputs.confirm_password.hint')"
                            v-model="password.confirmPassword"
                            :rules="[
                            v => !!v || $t('inputs.confirm_password.rules.required'),
                            v => v === password.value || $t('inputs.confirm_password.rules.valid'),
                            v => v && v.length >= 8 || $t('inputs.confirm_password.rules.length')
                  ]"
                            :append-icon="password.confirmHidePass ? icons.mdiEye : icons.mdiEyeOff"
                            @click:append="() => (password.confirmHidePass = !password.confirmHidePass)"
                            :type="password.confirmHidePass ? 'password' : 'text'"
                            required
                        />
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn
                          text
                          @click.native="password.dialog = false"
                          :disabled="password.loading"
                          :aria-label="$t('buttons.cancel')"
                      >{{ $t('buttons.cancel') }}
                      </v-btn>
                      <v-btn
                          text
                          color="success"
                          :disabled="!password.valid"
                          :loading="password.loading"
                          @click.native="submitPassword"
                          :aria-label="$t('buttons.save')"
                      >{{ $t('buttons.save') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item-action>
            </v-list-item>
            <v-divider/>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('settings.account.change_avatar.title') }}</v-list-item-title>
                <v-list-item-subtitle>{{ $t('settings.account.change_avatar.sub_title') }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-dialog
                    v-model="avatar.dialog"
                    persistent
                    max-width="500px"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                        v-on="on"
                        right
                        icon
                        aria-label="Open In New"
                        :class="{grey: !settings.avatar}"
                    >
                      <v-avatar v-if="avatarPath !== null" size="32px">
                        <img :src="avatarPath" alt="avatar">
                      </v-avatar>
                      <v-icon v-else large>{{ icons.mdiAccount }}</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ $t('settings.account.change_avatar.dialog.headline') }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-img
                          v-if="avatar.valid && avatar.preview"
                          aspect-ratio="1"
                          :max-width="avatar.rules.width"
                          :src="avatar.preview"
                          class="mx-auto mb-3"
                          alt="preview"
                      />
                      <v-file-input
                          :accept="acceptFormats"
                          :placeholder="$t('settings.account.change_avatar.dialog.input.placeholder', [avatar.rules.formats.join(', '), avatar.rules.width, avatar.rules.height, avatar.rules.size / 1000])"
                          show-size
                          :label="$t('settings.account.change_avatar.dialog.input.label')"
                          :error-messages="avatar.errors"
                          :prepend-icon="icons.mdiFileImage"
                          v-model="avatar.file"
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                          v-if="!!settings.avatar"
                          text
                          color="error"
                          :loading="avatar.remove.loading"
                          :disabled="avatar.loading"
                          @click.native="removeAvatar"
                          :aria-label="$t('buttons.remove')"
                      >
                        {{ $t('buttons.remove') }}
                      </v-btn>
                      <v-spacer/>
                      <v-btn
                          text
                          :disabled="avatar.loading || avatar.remove.loading"
                          @click.native="avatar.dialog = false"
                          :aria-label="$t('buttons.cancel')"
                      >{{ $t('buttons.cancel') }}
                      </v-btn>
                      <v-btn
                          text
                          color="success"
                          :loading="avatar.loading"
                          :disabled="!avatar.valid || avatar.remove.loading"
                          @click.native="submitAvatar"
                          :aria-label="$t('buttons.save')"
                      >{{ $t('buttons.save') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
        <v-subheader>{{ $t('settings.interface.subheader') }}</v-subheader>
        <v-card flat tile>
          <v-list
              two-line
              subheader
              class="pa-0"
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('settings.interface.dark.title') }}</v-list-item-title>
                <v-list-item-subtitle>{{ $t('settings.interface.dark.sub_title') }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-switch
                    v-model="dark"
                    color="primary"
                    hide-details
                    class="ml-2"
                />
              </v-list-item-action>
            </v-list-item>
            <v-divider/>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('settings.interface.hide_repeats.title') }}</v-list-item-title>
                <v-list-item-subtitle>{{ $t('settings.interface.hide_repeats.sub_title') }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-switch
                    v-model="hideRepeats"
                    color="primary"
                    hide-details
                    class="ml-2"
                />
              </v-list-item-action>
            </v-list-item>
            <v-divider/>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('settings.interface.language.title') }}</v-list-item-title>
                <v-list-item-subtitle>{{ $t('settings.interface.language.sub_title') }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-menu>
                  <template v-slot:activator="{ on }">
                    <v-btn
                        right
                        icon
                        v-on="on"
                        aria-label="lang"
                    >
                      <v-avatar size="32px">
                        <v-img
                            :src="currentLang.img"
                            :alt="currentLang.name"
                            height="32"
                        />
                      </v-avatar>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                        v-for="lang in langs"
                        :key="lang.code"
                        @click="setLang(lang.code)"
                    >
                      <v-list-item-action>
                        <v-avatar size="32px">
                          <v-img
                              :src=lang.img
                              :alt="lang.name"
                              height="32"
                          />
                        </v-avatar>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title v-text="lang.name"/>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider/>
                    <v-list-item
                        @click.stop="openUrl('https://github.com/Firs058/myongoingscalendar-frontend/tree/master/locales')">
                      <v-list-item-action>
                        <v-avatar size="32px">
                          <font-awesome-icon
                              :icon="['fab', 'github']"
                              size="2x"
                              class="icon alt"
                          />
                        </v-avatar>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Need more?</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
        <v-subheader>{{ $t('settings.time.subheader') }}</v-subheader>
        <v-card flat tile>
          <v-list
              two-line
              subheader
              class="pa-0"
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('settings.time.time_format.title') }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ $t('settings.time.time_format.sub_title') }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action
                  v-if="!$device.isMobile"
                  style="min-width: 300px;"
              >
                <v-select
                    :items="timeFormats"
                    v-model="fullTimeFormat"
                />
              </v-list-item-action>
            </v-list-item>
            <v-list-item v-if="$device.isMobile">
              <v-select
                  :items="timeFormats"
                  v-model="fullTimeFormat"
              />
            </v-list-item>
            <v-divider/>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('settings.time.timezone.title') }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ $t('settings.time.timezone.sub_title') }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action
                  v-if="!$device.isMobile"
                  style="min-width: 300px;"
              >
                <v-autocomplete
                    :items="$store.getters.timezonesListEmpty ? [timezone] : timezones"
                    @click.native="checkAndDownloadTimezones"
                    v-model="timezone"
                    :loading="timezonesLoading"
                />
              </v-list-item-action>
            </v-list-item>
            <v-list-item v-if="$device.isMobile">
              <v-autocomplete
                  :items="$store.getters.timezonesListEmpty ? [timezone] : timezones"
                  @click.native="checkAndDownloadTimezones"
                  v-model="timezone"
                  :loading="timezonesLoading"
              />
            </v-list-item>
          </v-list>
        </v-card>
        <v-subheader>{{ $t('settings.privacy.subheader') }}</v-subheader>
        <v-card flat tile>
          <v-list
              two-line
              subheader
              class="pa-0"
          >
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('settings.privacy.analytics.title') }}</v-list-item-title>
                <v-list-item-subtitle>{{ $t('settings.privacy.analytics.sub_title') }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-switch
                    v-model="agreeWithAnalysis"
                    color="primary"
                    hide-details
                    class="ml-2"
                />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { icons } from '~/mixins/icons';
import { image } from '~/mixins/image';
import ruSvg from 'svg-country-flags/svg/ru.svg';
import usSvg from 'svg-country-flags/svg/us.svg';
import { initGTM } from '~/plugins/gtm';
import { deepFreeze } from '~/helpers/utils';

export default {
  data: () => ({
    timezonesLoading: false,
    nickname: {
      dialog: false,
      loading: false,
      valid: true,
      value: ''
    },
    password: {
      dialog: false,
      loading: false,
      hidePass: true,
      confirmHidePass: true,
      valid: true,
      value: '',
      confirmPassword: ''
    },
    avatar: {
      dialog: false,
      loading: false,
      valid: true,
      errors: [],
      file: null,
      preview: '',
      rules: {
        width: 200,
        height: 200,
        size: 150000,
        formats: ['jpg', 'jpeg', 'png']
      },
      remove: {
        loading: false
      }
    },
    langs: [
      {
        name: 'English',
        code: 'en',
        img: usSvg
      },
      {
        name: 'Русский',
        code: 'ru',
        img: ruSvg
      }
    ]
  }),
  mixins: [
    icons,
    image
  ],
  watch: {
    'avatar.file'(v) {
      this.validateAvatar(v, this.avatar.rules);
    }
  },
  methods: {
    async submitNickname() {
      if (this.user.authenticated && this.$refs.nicknameForm.validate()) {
        this.nickname.loading = true;
        const nickname = this.nickname.value;
        await this.$settings.changeNickname({ params: { nickname } })
            .then(({ code }) => {
              this.$store.dispatch('setSetting', { name: 'nickname', value: nickname });
              this.$toast.showToast({ code });
              this.nickname.dialog = false;
            })
            .catch(({ code }) => this.$toast.showToast({ code }))
            .finally(() => this.nickname.loading = false);
      }
    },
    async submitPassword() {
      if (this.user.authenticated && this.$refs.passwordForm.validate()) {
        this.password.loading = true;
        const params = { password: this.password.value };
        await this.$settings.changePass({ params })
            .then(({ code }) => {
              this.$toast.showToast({ code });
              this.password.dialog = false;
            })
            .catch(({ code }) => this.$toast.showToast({ code }))
            .finally(() => this.password.loading = false);
      }
    },
    async submitAvatar() {
      await this.validateAvatar(this.avatar.file, this.avatar.rules);
      if (this.user.authenticated && this.avatar.valid) {
        this.avatar.loading = true;
        let formData = new FormData();
        formData.append('avatar', this.avatar.file);
        await this.$settings.changeAvatar({ formData })
            .then(({ avatar, code }) => {
              this.$store.dispatch('setSetting', { name: 'avatar', value: avatar });
              this.$toast.showToast({ code });
              this.avatar.dialog = false;
            })
            .catch(({ code }) => this.$toast.showToast({ code }))
            .finally(() => this.avatar.loading = false);
      }
    },
    async removeAvatar() {
      if (this.user.authenticated && !!this.settings.avatar) {
        this.avatar.remove.loading = true;
        await this.$settings.removeAvatar()
            .then(({ code }) => {
              this.$store.dispatch('setSetting', { name: 'avatar', value: null });
              this.$toast.showToast({ code });
              this.avatar.dialog = false;
            })
            .catch(({ code }) => this.$toast.showToast({ code }))
            .finally(() => this.avatar.remove.loading = false);
      }
    },
    openUrl: url => window.open(url),
    refreshPage: () => document.location.reload(),
    setLang(value) {
      this.$store.dispatch('setSetting', { name: 'lang', value: value });
      this.$i18n.locale = value;
      this.$dayjs.locale(value);
    },
    async checkAndDownloadTimezones() {
      if (this.$store.getters.timezonesListEmpty) {
        this.timezonesLoading = true;
        await this.$anime.getTimezones()
            .then(({ timezones }) => this.$store.dispatch('setTimezones', deepFreeze(timezones)))
            .finally(() => this.timezonesLoading = false);
      }
    },
    async validateAvatar(file, { width, height, size, formats }) {
      const { valid, errors } = await new Promise(resolve => {
        if (!file)
          resolve({
            valid: false,
            errors: this.$t('settings.account.change_avatar.dialog.rules.exists')
          });
        if (!this.acceptFormats.includes(file['type']))
          resolve({
            valid: false,
            errors: this.$t('settings.account.change_avatar.dialog.rules.type', [formats.join(', ')])
          });
        if (Number(file.size) >= Number(size))
          resolve({
            valid: false,
            errors: this.$t('settings.account.change_avatar.dialog.rules.size', [size / 1000])
          });
        const reader = new FileReader();
        reader.onload = () => {
          const image = new Image();
          image.onerror = () => resolve({
            valid: false,
            errors: this.$t('settings.account.change_avatar.dialog.rules.error')
          });
          image.onload = () => resolve({
            valid: image.width <= Number(width) && image.height <= Number(height),
            errors: this.$t('settings.account.change_avatar.dialog.rules.dimensions', [width, height])
          });
          image.src = reader.result;
          this.avatar.preview = reader.result;
        };
        reader.readAsDataURL(file);
      });

      this.avatar.valid = valid;
      this.avatar.errors = valid ? [] : [errors];
      if (!valid) this.avatar.preview = '';
    }
  },
  head() {
    return {
      title: this.$t('meta_info.settings.title', ['| MyOngoingsCalendar']),
      meta: [
        {
          name: 'description',
          content: this.$t('meta_info.settings.meta.description')
        }
      ]
    };
  },
  computed: {
    user: {
      get() {
        return this.$store.state.user;
      }
    },
    settings: {
      get() {
        return this.$store.getters.settings;
      }
    },
    timezones: {
      get() {
        return this.$store.state.timezones;
      }
    },
    dark: {
      get() {
        return this.$store.getters.settings.dark;
      },
      set(value) {
        this.$vuetify.theme.dark = value;
        this.$store.dispatch('setSetting', { name: 'dark', value: value })
            .then(() => this.refreshPage());
      }
    },
    hideRepeats: {
      get() {
        return this.$store.getters.settings.hideRepeats;
      },
      set(value) {
        this.$store.dispatch('setSetting', { name: 'hideRepeats', value: value });
      }
    },
    timezone: {
      get() {
        return this.$store.getters.settings.timezone;
      },
      set(value) {
        this.$store.dispatch('setSetting', { name: 'timezone', value: value });
      }
    },
    agreeWithAnalysis: {
      get() {
        return this.$store.getters.agreeWithAnalysis;
      },
      set(value) {
        this.$store.dispatch('setAgreeWithAnalysis', value)
            .then(() => value ? initGTM() : this.refreshPage());
      }
    },
    timeFormats() {
      return [
        this.$t('settings.time.time_format.24hour'),
        this.$t('settings.time.time_format.12hour')
      ];
    },
    fullTimeFormat: {
      get: function () {
        return this.$store.getters.settings.fullTimeFormat
            ? this.$t('settings.time.time_format.24hour')
            : this.$t('settings.time.time_format.12hour');
      },
      set: function (value) {
        this.$store.dispatch('setSetting', {
          name: 'fullTimeFormat',
          value: value === this.$t('settings.time.time_format.24hour')
        });
      }
    },
    currentLang() {
      return this.langs.filter(o => o.code === this.$store.getters.settings.lang)[0];
    },
    webpIsSupported: {
      get() {
        return this.$store.getters.webpIsSupported;
      }
    },
    acceptFormats() {
      return this.avatar.rules.formats.map(e => `image/${e}`).join(', ');
    },
    avatarPath() {
      return !!this.settings.avatar ? this.getAvatarPath({ paths: this.settings.avatar.paths }) : null;
    }
  },
  mounted() {
    this.$vuetify.goTo(0);
  }
};
</script>
