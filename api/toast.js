import { BREAKOUT_CODE } from './config.js';

export default store => () => ({
  showToast: ({ code }) => {
    if (process.client && !!code) {
      const dark = store.getters.settings.dark;
      const colors = {
        'green': code >= BREAKOUT_CODE,
        'red': code < BREAKOUT_CODE,
        'darken-3': dark
      };

      store.dispatch('setToast', {
        active: true,
        code,
        color: Object.entries(colors).filter(([key, value]) => !!value).map(([key]) => key).join(' '),
        class: {
          'white--text': dark,
          'black--text': !dark
        }
      });
    }
  }
})
