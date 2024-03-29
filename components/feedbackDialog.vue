<template>
  <v-dialog
      v-model="dialog"
      max-width="700"
  >
    <v-card>
      <v-card-title class="headline">{{ $t('feedback.headline') }}</v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="feedbackForm" lazy-validation>
          <v-textarea
              v-model="text"
              outline
              :rules="[v => !!v || $t('inputs.comment.rules.required')]"
              required
              autofocus
              :hint="$t(`feedback.${authenticated ? 'hint_for_authenticated' : 'hint_for_anonymous'}`, [adminEmail])"
          />
        </v-form>
        <v-container>
          <v-row justify="center">
            <v-col cols="12" align="center">
              <client-only>
                <vue-recaptcha
                    ref="feedbackInvisibleRecaptcha"
                    @verify="onVerify"
                    @expired="onExpired"
                    :sitekey="recaptchaSitekey"
                    :loadRecaptchaScript="true"
                    size="invisible"
                    badge="inline"
                />
              </client-only>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
            text
            @click.native="dialog = false"
            :aria-label="$t('buttons.cancel')"
        >
          {{ $t('buttons.cancel') }}
        </v-btn>
        <v-btn
            text
            color="success"
            :loading="loading"
            @click.native="submit"
            :disabled="!valid"
            :aria-label="$t('buttons.send')"
        >
          {{ $t('buttons.send') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { domain } from '@/mixins/domain';

export default {
  computed: {
    dialog: {
      get() {
        return this.$store.getters.feedback.dialog;
      },
      set(value) {
        this.$store.dispatch('setFeedback', { name: 'dialog', value });
      }
    },
    text: {
      get() {
        return this.$store.getters.feedback.text;
      },
      set(value) {
        this.$store.dispatch('setFeedback', { name: 'text', value });
      }
    },
    valid: {
      get() {
        return this.$store.getters.feedback.valid;
      },
      set(value) {
        this.$store.dispatch('setFeedback', { name: 'valid', value });
      }
    },
    loading: {
      get() {
        return this.$store.getters.feedback.loading;
      }
    },
    authenticated() {
      return this.$store.getters.authenticated;
    },
    recaptchaSitekey() {
      return process.env.RECAPTCHA_SITE_KEY;
    }
  },
  methods: {
    submit() {
      if (this.$refs.feedbackForm.validate()) this.$refs.feedbackInvisibleRecaptcha.execute();
    },
    onVerify(response) {
      this.$store.dispatch('addFeedback', response)
          .finally(() => this.$refs.feedbackInvisibleRecaptcha.reset());
    },
    onExpired() {
      this.$refs.feedbackInvisibleRecaptcha.reset();
    }
  },
  mixins: [domain]
};
</script>

<style scoped>
>>> .grecaptcha-badge {
  box-shadow: none !important;
}
</style>
