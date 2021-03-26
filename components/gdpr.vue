<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-snackbar
      v-model="showGDPR"
      bottom
      :timeout="timeout"
      :multi-line="multiLine"
      :vertical="$device.isMobile"
  >
    {{ $t('gdpr.headline') }}
    <a @click.stop="$router.push('/privacy')">{{ $t('gdpr.learn_more') }}</a>
    <template v-slot:action>
      <v-btn
          text
          color="error"
          :aria-label="$t('buttons.disagree')"
          @click="submit(false)"
          class="mr-2"
      >
        {{ $t('buttons.disagree') }}
      </v-btn>
      <v-btn
          text
          color="success"
          :aria-label="$t('buttons.agree')"
          @click="submit(true)"
      >
        {{ $t('buttons.agree') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data: () => ({
    multiLine: true,
    timeout: -1
  }),
  methods: {
    submit(value) {
      this.$store.dispatch('setAgreeWithAnalysis', value);
      this.$store.dispatch('setShowGDPR', false);
    }
  },
  computed: {
    ...mapGetters([
      'showGDPR'
    ])
  }
};
</script>
