import colors from 'vuetify/lib/util/colors';
import { mapGetters } from 'vuex';

const { red, green, blue } = colors;

export const button = {
  data: () => ({
    dark: {
      green: [green.darken1, green.darken3],
      red: [red.darken1, red.darken3],
      blue: [blue.darken1, blue.darken3],
    },
    light: {
      green: [green.lighten2, green.base],
      red: [red.lighten2, red.base],
      blue: [blue.lighten2, blue.base],
    }
  }),
  methods: {
    buttonStyle({ color }) {
      return `background:linear-gradient(to right, ${color[0]} 0%, ${color[1]} 100%)`;
    }
  },
  computed: {
    ...mapGetters([
      'settings'
    ]),
    buttonColors() {
      return this.settings.dark ? this.dark : this.light;
    }
  }
};
