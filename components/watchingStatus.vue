<template>
  <v-chip
      :color="statusColor"
      class="text-uppercase"
      :small="small"
      disabled
  >
    {{ $t(`watching_status.${status}`) }}
  </v-chip>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    status: String,
    small: {
      type: Boolean,
      default: true
    }
  },
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
    }
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    statusColor() {
      return this.getColor({ status: this.status });
    }
  }
};
</script>

<style scoped>
.v-chip--disabled {
  opacity: 1;
}
</style>
