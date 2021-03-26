<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-col xs="12" md="10" lg="6" align="center">
        <v-img
            :src="webpIsSupported ? '/images/webp/megumin.webp' : '/images/megumin.gif'"
            max-height="808"
            max-width="506"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    webpIsSupported: {
      get() {
        return this.$store.getters.webpIsSupported;
      }
    }
  }
};
</script>
