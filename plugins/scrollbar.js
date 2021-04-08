export default function ({ store }) {
  store.getters.settings.dark
    ? require('~/assets/scrollbar/dark.scss')
    : require('~/assets/scrollbar/light.scss');
}
