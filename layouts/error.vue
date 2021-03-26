<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-col xs="12" md="10" lg="6">
        <v-row
            justify="center"
            v-if="error.statusCode === 404"
        >
          <v-col cols="12">
            <h1 class="text-center">404</h1>
          </v-col>
          <v-col cols="12">
            <v-card
                hover
                ripple
                flat
            >
              <v-img
                  :src="webpIsSupported ? '/images/webp/oops.webp' : '/images/oops.png'"
                  aspect-ratio="1"
                  height="600px"
              />
            </v-card>
          </v-col>
          <v-col cols="12" align="center">
            <v-btn
                large
                @click.stop="$router.push('/')"
                text
                color="primary"
                aria-label="to home page"
            >
              to home page
            </v-btn>
          </v-col>
        </v-row>
        <v-row
            justify="center"
            v-else-if="error.statusCode === 500"
        >
          <v-col cols="12">
            <h1 class="text-center">Timeout exceeded</h1>
          </v-col>
          <v-col cols="12" align="center">
            <v-btn
                large
                @click.stop="$router.push('/')"
                text
                color="primary"
                aria-label="to home page"
            >
              to home page
            </v-btn>
          </v-col>
        </v-row>
        <v-row
            justify="center"
            v-else
        >
          <v-col cols="12">
            <h1 class="text-center">An error occurred</h1>
          </v-col>
          <v-col cols="12" align="center">
            <v-btn
                large
                @click.stop="$router.push('/')"
                text
                color="primary"
                aria-label="to home page"
            >
              to home page
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <toast/>
  </v-container>
</template>

<script>
export default {
  props: ['error'],
  head() {
    return {
      title: 'Error | MyOngoingsCalendar',
      meta: [
        {
          name: 'description',
          content: 'error'
        }
      ]
    };
  },
  computed: {
    webpIsSupported: {
      get() {
        return this.$store.getters.webpIsSupported;
      }
    }
  },
  mounted() {
    this.$toast.showToast({ code: this.error.code });
  }
};
</script>
